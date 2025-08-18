import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { scheduleService } from '../services/scheduleService'
import { scheduleKeys } from './queryKeys'
import type { ScheduleListResponse, CreateScheduleRequest, EditScheduleRequest } from '../services/scheduleService'

// 로컬 시간 형식으로 변환하는 유틸리티 함수
const formatLocalDateTime = (date: Date) => {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')
  const seconds = String(date.getSeconds()).padStart(2, '0')

  return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`
}

// 월별 필터링 및 그룹핑 유틸리티 함수
const filterByMonth = (schedules: ScheduleListResponse[], year: number, month: number) => {
  return schedules.filter(schedule => {
    const scheduleDate = new Date(schedule.startDatetime)
    return scheduleDate.getFullYear() === year && scheduleDate.getMonth() === month - 1
  })
}

// 스터디별 스케줄 조회 (월별 필터링)
export const useStudySchedules = (studyId: number, year: number, month: number) => {
  // 해당 월의 시작과 끝 날짜 계산 (더 넓은 범위로 조회)
  const from = formatLocalDateTime(new Date(year, month - 1, 1, 0, 0, 0))
  const to = formatLocalDateTime(new Date(year, month, 0, 23, 59, 59))

  // console.log('useStudySchedules 호출:', { studyId, year, month, from, to })

  return useQuery({
    queryKey: scheduleKeys.byStudyMonth(studyId, year, month),
    queryFn: () => scheduleService.getStudySchedules(studyId, from, to),
    select: (data) => {
      console.log('조회된 원본 데이터:', data)
      const filtered = filterByMonth(data, year, month)
      console.log('필터링된 데이터:', filtered)
      return filtered
    },
    staleTime: 60 * 1000, // 60초
    gcTime: 5 * 60 * 1000, // 5분
    enabled: studyId > 0, // studyId가 유효할 때만 실행
  })
}

// 내 스케줄 조회 (월별 필터링)
export const useMySchedules = (year: number, month: number, userId: number) => {
  // 해당 월의 시작과 끝 날짜 계산 (더 넓은 범위로 조회)
  const from = formatLocalDateTime(new Date(year, month - 1, 1, 0, 0, 0))
  const to = formatLocalDateTime(new Date(year, month, 0, 23, 59, 59))

  return useQuery({
    queryKey: scheduleKeys.myMonthly(userId, year, month),
    queryFn: () => scheduleService.getMySchedules(from, to),
    select: (data) => filterByMonth(data, year, month),
    staleTime: 60 * 1000, // 60초
    gcTime: 5 * 60 * 1000, // 5분
    enabled: userId > 0, // userId가 유효할 때만 실행
  })
}

// 일정 생성
export const useCreateSchedule = (studyId: number, year: number, month: number) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (request: CreateScheduleRequest) => scheduleService.createSchedule(request),
    onSuccess: () => {
      // 해당 월의 스케줄만 invalidate하여 목록 새로고침
      queryClient.invalidateQueries({
        queryKey: scheduleKeys.byStudyMonth(studyId, year, month)
      })
    }
  })
}

// 일정 수정
export const useEditSchedule = (studyId: number, year: number, month: number) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ scheduleId, request }: { scheduleId: number; request: EditScheduleRequest }) =>
      scheduleService.editSchedule(scheduleId, request),
    onSuccess: () => {
      // 해당 월의 스케줄만 invalidate하여 목록 새로고침
      queryClient.invalidateQueries({
        queryKey: scheduleKeys.byStudyMonth(studyId, year, month)
      })
    }
  })
}

// 일정 삭제
export const useDeleteSchedule = (studyId: number, year: number, month: number) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (scheduleId: number) => scheduleService.deleteSchedule(scheduleId),
    onSuccess: () => {
      // 해당 월의 스케줄만 invalidate하여 목록 새로고침
      queryClient.invalidateQueries({
        queryKey: scheduleKeys.byStudyMonth(studyId, year, month)
      })
    }
  })
}
