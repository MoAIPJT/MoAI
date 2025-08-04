import React from 'react'
import SidebarItem from '../../atoms/SidebarItem'
import type { SidebarNavigationProps } from './types'

const SidebarNavigation: React.FC<SidebarNavigationProps> = ({
  items,
  activeItem,
  onItemClick,
}) => {
  return (
    <nav className="flex-1 p-4 space-y-2">
      {items.map((item) => (
        <SidebarItem
          key={item.id}
          id={item.id}
          label={item.label}
          icon={item.icon}
          isActive={activeItem === item.id}
          onClick={onItemClick}
        />
      ))}
    </nav>
  )
}

export default SidebarNavigation
