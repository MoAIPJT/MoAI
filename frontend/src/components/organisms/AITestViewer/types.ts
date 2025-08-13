export interface PDFItem {
  id: string
  url: string
  title?: string
}

export interface SummaryItem {
  docsId: number
  pageNumber: number
  originalQuote: string
  summarySentence: string
}

export interface AITestViewerProps {
  pdfList: PDFItem[]
  summaryList: SummaryItem[]
  selectedPdf?: PDFItem | null
  onPdfChange?: (pdf: PDFItem) => void
  onSummaryClick?: (item: SummaryItem) => void
}
