import React from 'react'
import type { SidebarItemProps } from './types'

const SidebarItem: React.FC<SidebarItemProps> = ({
  id,
  label,
  icon,
  isActive = false,
  isExpanded = false,
  hasSubItems = false,
  onClick,
}) => {
  return (
    <button
      onClick={() => onClick(id)}
      className={`
        w-full flex items-center justify-between px-4 py-3 rounded-lg transition-colors duration-200
        ${isActive
          ? 'bg-purple-100 text-purple-700'
          : 'text-gray-700 hover:bg-gray-50'
        }
      `}
    >
      <div className="flex items-center gap-3">
        <span className="text-lg">{icon}</span>
        <span className="font-medium">{label}</span>
      </div>
      {hasSubItems && (
        <span className={`text-xs transition-transform duration-200 ${
          isExpanded ? 'rotate-180' : ''
        }`}>
          ⌄
        </span>
      )}
    </button>
  )
}

export default SidebarItem
