export interface SidebarProps {
  activeItem?: string // 현재 활성화된 네비게이션 아이템 ID
  expandedStudies: string[] // 펼쳐진 스터디 ID 목록
  onItemClick: (itemId: string) => void // 네비게이션 아이템 클릭 핸들러
  onStudyToggle: (studyId: string) => void // 스터디 토글 핸들러
}

// TODO: 백엔드 API 연결 시 사용할 타입들
/*
import type { Study, Summary } from '../../../types/api'

export interface SidebarProps {
  activeItem?: string
  expandedStudies: string[]
  studies?: Study[]
  summaries?: Summary[]
  isLoading?: boolean
  onItemClick: (itemId: string) => void
  onStudyToggle: (studyId: string) => void
}
*/ 