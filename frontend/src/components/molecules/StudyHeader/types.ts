export interface StudyHeaderProps {
  studyName?: string
  studyDescription?: string
  studyImageUrl?: string
  loading?: boolean
  currentUserRole?: string
  onSettingsClick?: () => void
  onUserCountClick?: () => void
}
