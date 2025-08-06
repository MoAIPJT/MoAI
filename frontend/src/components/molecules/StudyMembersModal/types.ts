import type { StudyParticipant } from '../../../types/study'

export interface StudyMembersModalProps {
  isOpen: boolean
  onClose: () => void
  members: StudyParticipant[]
  studyName: string
} 