import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { orgService } from '../services/orgService'
import { orgKeys, studyKeys } from './queryKeys'

export const useOrg = () => {
  const queryClient = useQueryClient()

  // 가입 요청 및 멤버 목록 조회
  const useJoinRequests = (studyId: number) => {
    return useQuery({
      queryKey: orgKeys.requests(studyId),
      queryFn: () => orgService.getJoinRequests(studyId),
      enabled: !!studyId
    })
  }

  // 가입 요청 승인
  const useAcceptJoin = () => {
    return useMutation({
      mutationFn: orgService.acceptJoin,
      onSuccess: (_, variables) => {
        // 관련 쿼리 무효화
        queryClient.invalidateQueries({ queryKey: orgKeys.requests(variables.studyId) })
        queryClient.invalidateQueries({ queryKey: studyKeys.members(String(variables.studyId)) })
        // 선택적으로 사이드바도 무효화
        queryClient.invalidateQueries({ queryKey: studyKeys.sidebar(variables.userId) })
      }
    })
  }

  // 가입 요청 거절
  const useRejectJoin = () => {
    return useMutation({
      mutationFn: orgService.rejectJoin,
      onSuccess: (_, variables) => {
        queryClient.invalidateQueries({ queryKey: orgKeys.requests(variables.studyId) })
        queryClient.invalidateQueries({ queryKey: studyKeys.members(String(variables.studyId)) })
        queryClient.invalidateQueries({ queryKey: studyKeys.sidebar(variables.userId) })
      }
    })
  }

  // 멤버 역할 지정
  const useDesignateRole = () => {
    return useMutation({
      mutationFn: orgService.designateRole,
      onSuccess: (_, variables) => {
        queryClient.invalidateQueries({ queryKey: orgKeys.requests(variables.studyId) })
        queryClient.invalidateQueries({ queryKey: studyKeys.members(String(variables.studyId)) })
        queryClient.invalidateQueries({ queryKey: studyKeys.sidebar(variables.userId) })
      }
    })
  }

  // 멤버 삭제
  const useDeleteMember = () => {
    return useMutation({
      mutationFn: orgService.deleteMember,
      onSuccess: (_, variables) => {
        queryClient.invalidateQueries({ queryKey: orgKeys.requests(variables.studyId) })
        queryClient.invalidateQueries({ queryKey: studyKeys.members(String(variables.studyId)) })
        queryClient.invalidateQueries({ queryKey: studyKeys.sidebar(variables.userId) })
      }
    })
  }

  return {
    useJoinRequests,
    useAcceptJoin,
    useRejectJoin,
    useDesignateRole,
    useDeleteMember
  }
}
