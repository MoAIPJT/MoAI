import React from 'react'
import { Link } from 'react-router-dom'
import type { LinkTextProps } from './types'
import { variantClasses } from './variants'

const LinkText: React.FC<LinkTextProps> = ({
  href,
  children,
  variant = 'default',
  onClick,
}) => {
  const isExternal = href.startsWith('http')
  const className = variantClasses[variant]

  return isExternal ? (
    <a href={href} onClick={onClick} className={className} target="_blank" rel="noopener noreferrer">
      {children}
    </a>
  ) : (
    <Link to={href} onClick={onClick} className={className}>
      {children}
    </Link>
  )
}

export default LinkText
