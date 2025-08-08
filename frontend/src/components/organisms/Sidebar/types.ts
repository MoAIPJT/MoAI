import type { StudyWithSummaries } from '../../../services/summaryService'

export interface SidebarProps {
  activeItem?: string // 현재 활성화된 네비게이션 아이템 ID
  expandedStudies: string[] // 펼쳐진 스터디 ID 목록
  studiesWithSummaries?: StudyWithSummaries[] // 스터디별 AI 요약본 목록
  isLoading?: boolean // 로딩 상태
  onItemClick: (itemId: string) => void // 네비게이션 아이템 클릭 핸들러
  onStudyToggle: (studyId: string) => void // 스터디 토글 핸들러
  onSettingsClick?: () => void // 설정 클릭 핸들러
  onLogout?: () => void // 로그아웃 핸들러
}
