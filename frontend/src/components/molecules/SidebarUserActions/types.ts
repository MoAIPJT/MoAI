export interface UserActionItem {
  id: string
  label: string
  icon: string
}

export interface SidebarUserActionsProps {
  items: UserActionItem[]
  onItemClick: (id: string) => void
}
