export interface AISummary {
  id: number
  title: string
  description: string
  createdAt: string
  pdfUrl?: string
}

export interface AISummaryCardProps {
  summary: AISummary
  onClick?: (summaryId: number) => void
} 