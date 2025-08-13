import type { ContentItem } from '@/types/content'

export interface ContentListProps {
  contents: ContentItem[]
  onContentSelect: (contentId: string) => void
  onContentPreview: (contentId: string) => void
  onContentEdit: (contentId: string) => void
  onContentDelete: (contentId: string) => void
  onContentDownload: (contentId: string) => void
}
