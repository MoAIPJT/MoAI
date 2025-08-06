export interface StudyHeaderProps {
  studyName?: string
  studyDescription?: string
  studyImageUrl?: string
  loading?: boolean
  userCount?: number
  onSettingsClick?: () => void
}
