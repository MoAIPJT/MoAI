import type { SummaryData } from '../../../types/summary'

export interface SummaryViewerProps {
  summaryData: SummaryData | null
  onViewOriginal: () => void
} 