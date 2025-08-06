export interface SelectedContent {
  id: string
  title: string
  description: string
  tags: string[]
}

export interface FloatingAISummaryProps {
  title: string
  description: string
  selectedModel: string
  prompt: string
  isSelectAll: boolean
  isVisible: boolean
  selectedContents: SelectedContent[]
  onTitleChange: (title: string) => void
  onDescriptionChange: (description: string) => void
  onModelChange: (model: string) => void
  onPromptChange: (prompt: string) => void
  onSelectAllChange: (isSelectAll: boolean) => void
  onContentRemove: (contentId: string) => void
  onSubmit: () => Promise<void>
  onClose: () => void
}
