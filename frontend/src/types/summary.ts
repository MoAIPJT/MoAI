// 요약본 섹션 타입
export interface SummarySection {
  title: string
  content: string
}

// 요약본 데이터 타입
export interface SummaryData {
  id: string
  title: string
  sections: SummarySection[]
  originalPdfPath?: string
  summaryDetail?: any // API에서 받아온 상세 정보
}
