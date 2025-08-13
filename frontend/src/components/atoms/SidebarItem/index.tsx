import React from 'react'
import { ChevronDown } from 'lucide-react'
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
        ${id === 'study' && isExpanded && isActive
          ? 'bg-purple-500 text-white'
          : id === 'study'
            ? 'text-gray-700 hover:bg-purple-500 hover:text-white'
            : isActive
              ? 'bg-purple-500 text-white'
              : 'text-gray-700 hover:bg-gray-50'
        }
      `}
    >
      <div className="flex items-center gap-3">
        <span className="text-lg">{icon}</span>
        <span className="font-medium">{label}</span>
      </div>
      {hasSubItems && (
        <ChevronDown 
          className={`w-4 h-4 transition-transform duration-200 ${
            isExpanded ? 'rotate-180' : ''
          }`}
        />
      )}
    </button>
  )
}

export default SidebarItem
