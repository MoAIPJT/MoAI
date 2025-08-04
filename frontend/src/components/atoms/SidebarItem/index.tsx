import React from 'react'
import type { SidebarItemProps } from './types'

const SidebarItem: React.FC<SidebarItemProps> = ({
  id,
  label,
  icon,
  isActive = false,
  onClick,
}) => {
  return (
    <button
      onClick={() => onClick(id)}
      className={`
        w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors duration-200
        ${isActive
          ? 'bg-purple-100 text-purple-700'
          : 'text-gray-700 hover:bg-gray-50'
        }
      `}
    >
      <span className="text-lg">{icon}</span>
      <span className="font-medium">{label}</span>
    </button>
  )
}

export default SidebarItem
