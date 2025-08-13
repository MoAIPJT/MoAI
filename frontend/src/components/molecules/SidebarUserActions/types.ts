import React from 'react'

export interface UserActionItem {
  id: string
  label: string
  icon: React.ReactElement
}

export interface SidebarUserActionsProps {
  items: UserActionItem[]
  onItemClick: (id: string) => void
}
