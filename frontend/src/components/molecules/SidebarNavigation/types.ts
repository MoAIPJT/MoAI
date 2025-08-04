export interface NavigationItem {
  id: string
  label: string
  icon: string
}

export interface SidebarNavigationProps {
  items: NavigationItem[]
  activeItem?: string
  onItemClick: (id: string) => void
}
