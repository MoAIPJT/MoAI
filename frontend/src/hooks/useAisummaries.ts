import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { aiKeys } from './queryKeys'
import * as aiSummaryService from '@/services/aiSummaryService'
import type {
  AiSummaryEditReq
} from '@/types/aiSummary'

// Query hooks
export const useAiList = (userId: number) => {
  return useQuery({
    queryKey: aiKeys.list(userId),
    queryFn: aiSummaryService.getMySummaries,
    staleTime: 60 * 1000, // 60 seconds
    gcTime: 5 * 60 * 1000, // 5 minutes
    enabled: !!userId,
  })
}

export const useAiSidebarList = (userId: number) => {
  return useQuery({
    queryKey: aiKeys.sidebar(userId),
    queryFn: aiSummaryService.getSidebarSummaries,
    staleTime: 60 * 1000, // 60 seconds
    gcTime: 5 * 60 * 1000, // 5 minutes
    enabled: !!userId,
  })
}

// 대시보드용 AI 요약본 목록 조회 훅 추가
export const useAiDashboardList = () => {
  return useQuery({
    queryKey: aiKeys.dashboard(),
    queryFn: aiSummaryService.getDashboardSummaries,
    staleTime: 60 * 1000, // 60 seconds
    gcTime: 5 * 60 * 1000, // 5 minutes
  })
}

// Mutation hooks
export const useCreateAiSummary = (userId: number) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: aiSummaryService.createAiSummary,
    onSuccess: () => {
      // list와 sidebar 모두 무효화하여 UI 갱신
      queryClient.invalidateQueries({ queryKey: aiKeys.list(userId) })
      queryClient.invalidateQueries({ queryKey: aiKeys.sidebar(userId) })
    }
  })
}

export const useEditAiSummary = (userId: number, summaryId: number) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: AiSummaryEditReq) => aiSummaryService.editAiSummary(summaryId, data),
    onSuccess: () => {
      // list와 sidebar 모두 무효화하여 UI 갱신
      queryClient.invalidateQueries({ queryKey: aiKeys.list(userId) })
      queryClient.invalidateQueries({ queryKey: aiKeys.sidebar(userId) })
      queryClient.invalidateQueries({ queryKey: aiKeys.detail(summaryId) })
    }
  })
}

export const useDeleteAiSummary = (userId: number, summaryId: number) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: () => aiSummaryService.deleteAiSummary(summaryId),
    onSuccess: () => {
      // list와 sidebar 모두 무효화하여 UI 갱신
      queryClient.invalidateQueries({ queryKey: aiKeys.list(userId) })
      queryClient.invalidateQueries({ queryKey: aiKeys.sidebar(userId) })
      queryClient.invalidateQueries({ queryKey: aiKeys.detail(summaryId) })
    }
  })
}

export const useCreateAISummary = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: aiSummaryService.createAISummary,
    onSuccess: () => {
      // 성공 시 AI 요약본 목록을 다시 불러옴
      queryClient.invalidateQueries({ queryKey: ['aiSummaries'] })
    },
    onError: (error) => {
      console.error('AI 요약본 생성 실패:', error)
    }
  })
}
