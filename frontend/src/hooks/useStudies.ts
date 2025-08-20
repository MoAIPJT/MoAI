import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { studyKeys } from './queryKeys'
import * as studyService from '@/services/studyService'
import { useAppStore } from '@/store/appStore'
import type {
  Member,
  CreateStudyRes,
  StudyAllItem,
  StudyListItem
} from '@/types/study'

// Query hooks
export const useStudySidebar = (userId: number) => {
  return useQuery({
    queryKey: studyKeys.sidebar(userId),
    queryFn: studyService.getSidebarStudies,
    staleTime: 60 * 1000, // 60 seconds
    gcTime: 5 * 60 * 1000, // 5 minutes
    enabled: !!userId, // userId가 있을 때만 실행
  })
}

export const useMyStudies = () => {
  return useQuery({
    queryKey: studyKeys.allMine(),
    queryFn: () => {
      return studyService.getAllStudies()
    },
    staleTime: 60 * 1000, // 60 seconds
    gcTime: 5 * 60 * 1000, // 5 minutes
  })
}

export const useStudyDetail = (hashId: string) => {
  return useQuery({
    queryKey: studyKeys.detail(hashId),
    queryFn: () => studyService.getStudyDetail(hashId),
    staleTime: 60 * 1000, // 60 seconds
    gcTime: 5 * 60 * 1000, // 5 minutes
    enabled: !!hashId, // hashId가 있을 때만 실행
  })
}

// ✅ 수정: studyId가 숫자인지 확인하고 문자열로 변환하여 전달
export const useStudyMembers = (studyId: number) => {
  return useQuery({
    queryKey: studyKeys.members(String(studyId)),
    queryFn: () => {
      if (!studyId || studyId <= 0) {
        console.warn('유효하지 않은 studyId:', studyId)
        return Promise.resolve([]) // 빈 배열 반환
      }
      return studyService.getStudyMembers(String(studyId))
    },
    staleTime: 60 * 1000,
    gcTime: 5 * 60 * 1000,
    enabled: studyId > 0, // 숫자 유효성 검사
  })
}

// Mutation hooks
export const useCreateStudy = (userId: number, options?: {
  onSuccess?: (data: CreateStudyRes) => void
}) => {
  const queryClient = useQueryClient()
  const setCurrentStudy = useAppStore((state) => state.study.setCurrentStudy)

  return useMutation({
    mutationFn: studyService.createStudy,
    // Optimistic Update 부분분
    onMutate: async (newStudy) => {
      // 진행 중인 쿼리들을 취소하여 충돌 방지
      await queryClient.cancelQueries({ queryKey: studyKeys.allMine() })
      await queryClient.cancelQueries({ queryKey: studyKeys.sidebar(userId) })

      // 이전 데이터 백업
      const previousAllStudies = queryClient.getQueryData<StudyAllItem[]>(studyKeys.allMine())
      const previousSidebarStudies = queryClient.getQueryData<StudyListItem[]>(studyKeys.sidebar(userId))

      // Optimistic Update: 새 스터디를 즉시 목록에 추가
      if (previousAllStudies) {
        const optimisticStudy: StudyAllItem = {
          studyId: Date.now(), // 임시 ID (실제 응답에서 덮어씀)
          hashId: 'temp-hash',
          name: newStudy.name,
          description: newStudy.description || '',
          imageUrl: newStudy.image ? URL.createObjectURL(newStudy.image) : '',
          creatorName: 'You', // 임시값
          status: 'APPROVED',
          role: 'ADMIN'
        }

        queryClient.setQueryData<StudyAllItem[]>(
          studyKeys.allMine(),
          [...previousAllStudies, optimisticStudy]
        )
      }

      return { previousAllStudies, previousSidebarStudies }
    },
    onError: (_, __, context) => {
      // 에러 발생 시 이전 데이터로 롤백
      if (context?.previousAllStudies) {
        queryClient.setQueryData(studyKeys.allMine(), context.previousAllStudies)
      }
      if (context?.previousSidebarStudies) {
        queryClient.setQueryData(studyKeys.sidebar(userId), context.previousSidebarStudies)
      }
    },
    // ----
    onSuccess: (data: CreateStudyRes) => {
      // 성공 시 실제 데이터로 무효화하여 최신 상태 보장
      queryClient.invalidateQueries({ queryKey: studyKeys.sidebar(userId) }) // 사이드바용
      queryClient.invalidateQueries({ queryKey: studyKeys.allMine() }) // 대시보드용



      // 새 스터디 생성 후 전역 컨텍스트 갱신
      setCurrentStudy({
        studyId: data.id,
        hashId: data.hashId,
        myRole: 'ADMIN', // 스터디 생성자는 ADMIN 역할
        myStatus: 'APPROVED'
      })

      // 사용자 정의 onSuccess 콜백 실행
      options?.onSuccess?.(data)
    }
  })
}

export const useLeaveStudy = (userId: number, studyId: number, hashId?: string) => {
  const queryClient = useQueryClient()
  const clearCurrentStudy = useAppStore((state) => state.study.clearCurrentStudy)
  const currentStudy = useAppStore((state) => state.study)

  return useMutation({
    mutationFn: studyService.leaveStudy,
    onMutate: async () => {
      // Optimistic Update: 멤버 목록에서 현재 사용자 제거
      if (studyId) {
        await queryClient.cancelQueries({ queryKey: studyKeys.members(String(studyId)) })

        const previousMembers = queryClient.getQueryData<Member[]>(studyKeys.members(String(studyId)))

        // 현재 사용자를 멤버 목록에서 제거하는 로직
        // 실제로는 현재 사용자 정보가 필요하지만, 여기서는 간단히 처리
        if (previousMembers) {
          queryClient.setQueryData(studyKeys.members(String(studyId)),
            previousMembers.filter(member => member.role !== 'ADMIN') // 임시로 ADMIN만 제거
          )
        }

        return { previousMembers }
      }
      return { previousMembers: undefined }
    },
    onError: (_, __, context) => {
      // 에러 발생 시 이전 데이터로 롤백
      if (studyId && context?.previousMembers) {
        queryClient.setQueryData(studyKeys.members(String(studyId)), context.previousMembers)
      }
    },
    onSettled: () => {
      // 성공/실패 관계없이 실행
      if (studyId) {
        // 멤버 목록 쿼리 무효화하여 최신 데이터 가져오기
        queryClient.invalidateQueries({ queryKey: studyKeys.members(String(studyId)) })
      }
    },
    onSuccess: () => {
      // Invalidate multiple queries
      queryClient.invalidateQueries({ queryKey: studyKeys.sidebar(userId) })
      if (hashId) {
        queryClient.invalidateQueries({ queryKey: studyKeys.detail(hashId) })
      }

      // 현재 선택된 스터디를 탈퇴하는 경우 전역 컨텍스트 클리어
      if (currentStudy.studyId === studyId) {
        clearCurrentStudy()
      }
    }
  })
}

// 새로운 스터디 관리 훅들
export const useDeleteStudyMember = (studyId: number) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: studyService.deleteStudyMember,
    onSuccess: () => {
      // 멤버 목록과 스터디 상세 정보 갱신
      queryClient.invalidateQueries({ queryKey: studyKeys.members(String(studyId)) })
      queryClient.invalidateQueries({ queryKey: studyKeys.detail(studyId.toString()) })

      // 추방 완료 알림
      alert('추방이 완료되었습니다.')
    }
  })
}

export const useChangeMemberRole = (studyId: number) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: studyService.changeMemberRole,
    onSuccess: () => {
      // 멤버 목록 갱신
      queryClient.invalidateQueries({ queryKey: studyKeys.members(String(studyId)) })
    }
  })
}

// 가입 요청 목록 조회 훅 추가
export const useJoinRequests = (studyId: number) => {
  return useQuery({
    queryKey: studyKeys.joinRequests(studyId),
    queryFn: () => studyService.getJoinRequests(studyId),
    staleTime: 30 * 1000, // 30초
    gcTime: 2 * 60 * 1000, // 2분
    enabled: !!studyId && studyId > 0,
  })
}

export const useAcceptJoinRequest = (studyId: number) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: studyService.acceptJoinRequest,
    onSuccess: () => {
      // 멤버 목록, 스터디 상세 정보, 가입 요청 목록 갱신
      queryClient.invalidateQueries({ queryKey: studyKeys.members(String(studyId)) })
      queryClient.invalidateQueries({ queryKey: studyKeys.detail(studyId.toString()) })
      queryClient.invalidateQueries({ queryKey: studyKeys.joinRequests(studyId) })
    }
  })
}

export const useRejectJoinRequest = (studyId: number) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: studyService.rejectJoinRequest,
    onSuccess: () => {
      // 가입 요청 목록 갱신 (필요시)
      queryClient.invalidateQueries({ queryKey: studyKeys.joinRequests(studyId) })
    }
  })
}

export const useUpdateStudyNotice = (studyId: number) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: studyService.updateStudyNotice,
    onSuccess: () => {
      // 스터디 상세 정보 갱신
      queryClient.invalidateQueries({ queryKey: studyKeys.detail(studyId.toString()) })
    }
  })
}

// 스터디 수정 훅 추가
export const useUpdateStudy = (studyId: number) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: { name: string; description: string; image?: File; maxCapacity: number }) =>
      studyService.updateStudy(studyId, data),
    onSuccess: () => {
      // 스터디 상세 정보, 멤버 목록, 사이드바 갱신
      queryClient.invalidateQueries({ queryKey: studyKeys.detail(studyId.toString()) })
      queryClient.invalidateQueries({ queryKey: studyKeys.members(String(studyId)) })
      queryClient.invalidateQueries({ queryKey: studyKeys.allMine() })
    }
  })
}
