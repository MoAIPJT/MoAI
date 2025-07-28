import React from 'react'
import type { ButtonProps } from './types'
import { variantClasses, sizeClasses } from './variants'

const Button:React.FC<ButtonProps> = ({ children, variant = 'primary', size = 'md', fullWidth=false, onClick, type = 'button', ...rest}) => {
  const className = `
    ${variantClasses[variant]}
    ${sizeClasses[size]}
    ${fullWidth ? 'w-full' : ''}
  `
  return <button className={className} onClick={onClick} type={type} {...rest}>
    {children}
    </button>
}

export default Button
