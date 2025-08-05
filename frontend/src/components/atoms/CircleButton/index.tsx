import React from 'react'
import type { CircleButtonProps } from './types'
import { variantClasses, sizeClasses } from './variants'

const CircleButton: React.FC<CircleButtonProps> = ({ 
  children, 
  variant = 'purple', 
  size = 'md', 
  onClick, 
  disabled = false, 
  className = '',
  ...rest 
}) => {
  const baseClasses = 'rounded-full flex items-center justify-center transition-colors duration-200 focus:outline-none'
  
  const className_ = `
    ${baseClasses}
    ${variantClasses[variant]}
    ${sizeClasses[size]}
    ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
    ${className}
  `.trim()

  return (
    <button 
      className={className_} 
      onClick={onClick} 
      disabled={disabled} 
      {...rest}
    >
      {children}
    </button>
  )
}

export default CircleButton 