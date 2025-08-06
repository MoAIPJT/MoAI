import type { StudyParticipant } from '../../../types/study'

export interface StudyManagementModalProps {
  isOpen: boolean
  onClose: () => void
  studyName: string
  studyDescription: string
  studyImage?: string
  maxMembers?: number
  members: StudyParticipant[]
  categories: string[]
  onStudyNameChange: (name: string) => void
  onStudyDescriptionChange: (description: string) => void
  onStudyImageChange: (image: File | null) => void
  onMaxMembersChange: (maxMembers: number) => void
  onCategoryRemove: (category: string) => void
  onCategoryAdd: (category: string) => void
  onMemberRemove: (memberId: string) => void
  onSave: () => void
} 