export interface NavigationItem {
  id: string
  label: string
  icon: React.ReactNode
}

export interface SidebarNavigationProps {
  items: NavigationItem[]
  activeItem?: string
  onItemClick: (id: string) => void
}
