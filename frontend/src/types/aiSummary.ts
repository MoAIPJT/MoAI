export type ModelType = "gpt" | "claude" | "gemini" | (string & {})

export interface AiSummary {
  id: number
  userId: number
  title: string
  content: string
  modelType: ModelType
  createdAt: string
  updatedAt: string
}

export interface AiSummaryCreateReq {
  title: string
  content: string
  modelType: ModelType
}

export interface AiSummaryCreateRes {
  id: number
  message: string
}

export interface AiSummaryListRes {
  summaries: AiSummary[]
}

export interface AiSummarySidebarListRes {
  summaries: AiSummary[]
}

export interface AiSummaryEditReq {
  title?: string
  description?: string

}

export interface AiSummaryEditRes {
  message: string
}

export interface AiSummaryDeleteReq {
  id: number
}

export interface AiSummaryDeleteRes {
  message: string
}
