import React from 'react'

export interface NavigationItem {
  id: string
  label: string
  icon: React.ReactElement
}

export interface SidebarNavigationProps {
  items: NavigationItem[]
  activeItem?: string
  onItemClick: (id: string) => void
}
