export interface UserActionItem {
  id: string
  label: string
  icon: React.ReactNode
}

export interface SidebarUserActionsProps {
  items: UserActionItem[]
  onItemClick: (id: string) => void
}
