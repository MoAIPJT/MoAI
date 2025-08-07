export interface SidebarItemProps {
  id: string
  label: string
  icon: string
  isActive?: boolean
  isExpanded?: boolean
  hasSubItems?: boolean
  onClick: (id: string) => void
}
