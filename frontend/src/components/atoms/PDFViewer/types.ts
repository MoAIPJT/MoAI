export interface PDFViewerProps {
  pdfUrl: string // PDF 파일 URL
  title?: string // PDF 제목
  onLoad?: () => void // PDF 로딩 완료 시 호출
  onError?: (error: Error) => void // 에러 발생 시 호출
}

export interface PDFPageInfo {
  pageNumber: number
  totalPages: number
  scale: number
}
