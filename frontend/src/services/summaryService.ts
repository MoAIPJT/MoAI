import apiClient from './api'

export interface SummaryItem {
  summary_id: string
  title: string
  description: string
  model_type: string
  prompt_type: string
}

export interface SummaryListResponse {
  summaries: SummaryItem[]
}

export interface SummaryListRequest {
  id: string // 유저 아이디
}

// AI 요약본 목록 조회 API
export const fetchSummaryList = async (userId: string): Promise<SummaryListResponse> => {
  const response = await apiClient.patch('/list', {
    id: userId
  })
  return response.data
} 