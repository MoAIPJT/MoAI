import React from 'react'
import type { NavItemProps } from './types'
import { variantClasses } from './variants'

const NavItem: React.FC<NavItemProps> = ({
  children,
  icon,
  variant = 'default',
  isActive = false,
  isExpanded = false,
  isStudy = false,
  onClick,
}) => {
  const className = `
    ${variantClasses[variant]}
    ${isActive ? 'bg-purple-100 text-purple-700' : ''}
    flex items-center gap-3 px-4 py-3 rounded-lg transition-colors duration-200 cursor-pointer
    ${isStudy ? 'justify-between' : ''}
  `

  return (
    <div className={className} onClick={onClick}>
      <div className="flex items-center gap-3">
        {icon && <span className="text-lg">{icon}</span>}
        <span className="font-medium">{children}</span>
      </div>
      {isStudy && (
        <span className="text-gray-400 transition-transform duration-200">
          {isExpanded ? '▼' : '▶'}
        </span>
      )}
    </div>
  )
}

export default NavItem 