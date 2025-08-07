import React from 'react'
import type { ButtonProps } from './types'
import { variantClasses, sizeClasses } from './variants'

const Button:React.FC<ButtonProps> = ({ children, variant = 'primary', size = 'md', fullWidth=false, onClick, type = 'button', disabled = false, className = '', ...rest}) => {
  const baseClassName = `
    ${variantClasses[variant]}
    ${sizeClasses[size]}
    ${fullWidth ? 'w-full' : ''}
    ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
  `
  const finalClassName = `${baseClassName} ${className}`.trim()
  return <button className={finalClassName} onClick={onClick} type={type} disabled={disabled} {...rest}>
    {children}
    </button>
}

export default Button
