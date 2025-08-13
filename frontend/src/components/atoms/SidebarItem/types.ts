import React from 'react'

export interface SidebarItemProps {
  id: string
  label: string
  icon: React.ReactElement
  isActive?: boolean
  isExpanded?: boolean
  hasSubItems?: boolean
  onClick: (id: string) => void
}
