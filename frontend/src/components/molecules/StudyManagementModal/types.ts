import type { Member } from '../../../types/study'
import type { Category } from '../../../types/content'

export interface StudyManagementModalProps {
  isOpen: boolean
  onClose: () => void
  studyName: string
  studyDescription: string
  studyImage?: string
  maxMembers?: number
  members: Member[]
  categories: Category[]
  currentUserRole?: string
  currentUserName?: string
  onStudyNameChange: (name: string) => void
  onStudyDescriptionChange: (description: string) => void
  onStudyImageChange: (image: File | null) => void
  onMaxMembersChange: (maxMembers: number) => void
  onCategoryRemove?: (categoryId: number) => void
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
