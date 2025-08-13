export interface SidebarItemProps {
  id: string
  label: string
  icon: React.ReactNode
  isActive?: boolean
  isExpanded?: boolean
  hasSubItems?: boolean
  onClick: (id: string) => void
}
