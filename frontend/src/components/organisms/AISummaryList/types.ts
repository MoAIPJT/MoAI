import type { AISummary } from '../../molecules/AISummaryCard/types'

export interface AISummaryListProps {
  summaries: AISummary[]
  isLoading?: boolean
  onSummaryClick?: (summaryId: number) => void
}
