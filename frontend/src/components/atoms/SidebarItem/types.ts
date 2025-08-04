export interface SidebarItemProps {
  id: string
  label: string
  icon: string
  isActive?: boolean
  onClick: (id: string) => void
}
