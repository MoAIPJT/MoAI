import type { Study } from '../../organisms/StudyList/types'

export interface StudyCardProps {
  study: Study
  onClick?: (studyId: number) => void
} 