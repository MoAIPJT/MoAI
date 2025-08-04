export interface DashboardSidebarProps {
  activeItem?: string // 현재 활성화된 네비게이션 아이템 ID
  onItemClick: (itemId: string) => void // 네비게이션 아이템 클릭 핸들러
  onLogout?: () => void // 로그아웃 핸들러
}
