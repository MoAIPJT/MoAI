export interface StudyItem {
  id: string
  name: string
  description: string
  image: string
  image_url?: string
  icon?: string
  memberCount?: number
  isActive?: boolean
}

export interface DashboardSidebarProps {
  activeItem?: string // 현재 활성화된 네비게이션 아이템 ID
  expandedStudy?: boolean // 스터디 섹션이 펼쳐져 있는지 여부
  studies?: StudyItem[] // 스터디 목록
  activeStudyId?: string | null // 현재 선택된 스터디 ID
  onItemClick: (itemId: string) => void // 네비게이션 아이템 클릭 핸들러
  onStudyClick?: (studyId: string) => void // 스터디 클릭 핸들러
  onLogout?: () => void // 로그아웃 핸들러
  onSettingsClick?: () => void // 설정 클릭 핸들러
  onLogoClick?: () => void // 로고 클릭 핸들러
}
