import React from 'react'
import SidebarItem from '../../atoms/SidebarItem'
import type { SidebarUserActionsProps } from './types'

const SidebarUserActions: React.FC<SidebarUserActionsProps> = ({
  items,
  onItemClick,
}) => {
  return (
    <div className="p-4 border-t border-gray-100 space-y-2">
      {items.map((item) => (
        <SidebarItem
          key={item.id}
          id={item.id}
          label={item.label}
          icon={item.icon}
          onClick={onItemClick}
        />
      ))}
    </div>
  )
}

export default SidebarUserActions
