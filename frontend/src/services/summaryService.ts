import apiClient from './api'

export interface SummaryItem {
  summaryId: string  // ai_summaries 테이블의 id 컬럼 (실제 API 응답에서는 summaryId)
  title: string
  description: string
  modelType: string  // model_type 대신 modelType
  promptType: string  // prompt_type 대신 promptType
  createdAt?: string  // 생성일
}

export interface SummaryListResponse {
  summaries: SummaryItem[]
  studies?: StudyWithSummaries[]
}

export interface StudyWithSummaries {
  studyId: string
  name: string
  studyImg?: string
  summaries: SummaryItem[]
}

export interface SummaryListRequest {
  id: string // 유저 아이디
}

// PDF 관련 타입
export interface PDFItem {
  id: string
  url: string
  title?: string
}

export interface PDFListResponse {
  pdfs: PDFItem[]
}

// AI 요약본 상세 조회 관련 타입
export interface SummaryDetailResponse {
  summaryJson: string
  docses: Array<{
    docsId: number
    url: string
  }>
}

// AI 요약본 목록 조회 API
export const fetchSummaryList = async (userId: string): Promise<SummaryListResponse> => {
  const response = await apiClient.get(`/ai/sidebar?id=${userId}`)
  return response.data
}

// PDF 목록 조회 API
export const fetchPdfList = async (userId: string): Promise<PDFListResponse> => {
  const response = await apiClient.get(`/pdfs?userId=${userId}`)
  return response.data
}

export const fetchSummaryDetail = async (summaryId: string) => {
  try {
    console.log('🚀 요약본 상세 조회 요청:', {
      endpoint: `GET /ai/detail/${summaryId}`,
      summaryId,
      timestamp: new Date().toISOString()
    })

    const response = await apiClient.get(`/ai/detail/${summaryId}`)

    console.log('✅ 요약본 상세 조회 응답:', {
      status: response.status,
      responseData: response.data,
      timestamp: new Date().toISOString()
    })

    return response.data
  } catch (error) {
    console.error('❌ 요약본 상세 조회 실패:', error)
    throw error
  }
}
