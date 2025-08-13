export interface StudyHeaderProps {
  studyName?: string
  studyDescription?: string
  studyImageUrl?: string
  loading?: boolean
  userCount?: number
  currentUserRole?: string
  onSettingsClick?: () => void
  onUserCountClick?: () => void
  onLeaveStudy?: () => void
}
