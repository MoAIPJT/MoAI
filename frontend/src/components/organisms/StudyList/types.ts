export interface Study {
  id: number
  name: string
  description?: string
  imageUrl?: string
  createdBy: number
  createdAt?: string
  inviteUrl?: string
}

export interface StudyListProps {
  studies?: Study[]
  isLoading?: boolean
  onCreateStudy?: () => void
  onStudyClick?: (studyId: number) => void
} 