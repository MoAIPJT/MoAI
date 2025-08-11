import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { scheduleService } from '../services/scheduleService'
import { scheduleKeys } from './queryKeys'
import { CreateScheduleReq, EditScheduleReq, DeleteScheduleReq } from '../types/schedule'

// 월별 필터링 및 그룹핑 유틸리티 함수
const filterByMonth = (schedules: any[], year: number, month: number) => {
  return schedules.filter(schedule => {
    const scheduleDate = new Date(schedule.startDatetime)
    return scheduleDate.getFullYear() === year && scheduleDate.getMonth() === month - 1
  })
}

// 스터디별 스케줄 조회 (월별 필터링)
export const useStudySchedules = (studyId: number, year: number, month: number, userId: number) => {
  return useQuery({
    queryKey: scheduleKeys.byStudyMonth(studyId, year, month),
    queryFn: () => scheduleService.getStudySchedules(studyId, userId),
    select: (data) => filterByMonth(data, year, month),
    staleTime: 60 * 1000, // 60초
    gcTime: 5 * 60 * 1000, // 5분
  })
}

// 내 스케줄 조회 (월별 필터링)
export const useMySchedules = (year: number, month: number, userId: number) => {
  return useQuery({
    queryKey: scheduleKeys.myMonthly(userId, year, month),
    queryFn: () => scheduleService.getMySchedules(userId),
    select: (data) => filterByMonth(data, year, month),
    staleTime: 60 * 1000, // 60초
    gcTime: 5 * 60 * 1000, // 5분
  })
}

// 스케줄 생성
export const useCreateSchedule = (studyId: number, year: number, month: number, userId: number) => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (req: CreateScheduleReq) => scheduleService.createSchedule(req),
    onSuccess: () => {
      // 해당 월의 스케줄만 invalidate
      queryClient.invalidateQueries({
        queryKey: scheduleKeys.byStudyMonth(studyId, year, month)
      })
      queryClient.invalidateQueries({
        queryKey: scheduleKeys.myMonthly(userId, year, month)
      })
    }
  })
}

// 스케줄 수정
export const useEditSchedule = (studyId: number, year: number, month: number, userId: number, id: number) => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (req: EditScheduleReq) => scheduleService.editSchedule(id, req),
    onSuccess: () => {
      // 해당 월의 스케줄만 invalidate
      queryClient.invalidateQueries({
        queryKey: scheduleKeys.byStudyMonth(studyId, year, month)
      })
      queryClient.invalidateQueries({
        queryKey: scheduleKeys.myMonthly(userId, year, month)
      })
    }
  })
}

// 스케줄 삭제
export const useDeleteSchedule = (studyId: number, year: number, month: number, userId: number, id: number) => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (reqUser: DeleteScheduleReq) => scheduleService.deleteSchedule(id, reqUser),
    onSuccess: () => {
      // 해당 월의 스케줄만 invalidate
      queryClient.invalidateQueries({
        queryKey: scheduleKeys.byStudyMonth(studyId, year, month)
      })
      queryClient.invalidateQueries({
        queryKey: scheduleKeys.myMonthly(userId, year, month)
      })
    }
  })
}
