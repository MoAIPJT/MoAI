import type { Member } from '../../../types/study'

export interface StudyManagementModalProps {
  isOpen: boolean
  onClose: () => void
  studyName: string
  studyDescription: string
  studyImage?: string
  maxMembers?: number
  members: Member[]
  categories: Array<{
    id: string
    name: string
  }>
  currentUserRole?: string
  onStudyNameChange: (name: string) => void
  onStudyDescriptionChange: (description: string) => void
  onStudyImageChange: (image: File | null) => void
  onMaxMembersChange: (maxMembers: number) => void
  onCategoryRemove?: (categoryId: string) => void
  onCategoryAdd?: (category: string) => void
  onMemberRemove?: (userId: number) => void
  onStudyUpdate?: (data: {
    name: string
    description: string
    image?: File
    maxCapacity: number
  }) => void
  onSave: () => void
}
