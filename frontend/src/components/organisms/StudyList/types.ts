export interface Study {
  id: number
  name: string
  description?: string
  imageUrl?: string
  createdBy: number
  createdAt?: string
  inviteUrl?: string
  status?: string // 가입상태 (active, pending 등)
}

import type { CreateStudyData } from '../CreateStudyModal/types'

export interface StudyListProps {
  studies?: Study[]
  isLoading?: boolean
  onCreateStudy?: (data: CreateStudyData) => void
  onStudyClick?: (studyId: number) => void
} 