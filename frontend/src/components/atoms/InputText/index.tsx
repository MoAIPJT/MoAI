import React from 'react'
import type { InputTextProps } from './types'
import { variantClasses, sizeClasses } from './variants'

const InputText: React.FC<InputTextProps> = ({
  type = 'text',
  value,
  placeholder = '',
  variant = 'default',
  size = 'md',
  fullWidth = false,
  onChange,
  ...rest
}) => {
  const className = `
    ${variantClasses[variant]}
    ${sizeClasses[size]}
    ${fullWidth ? 'w-full' : ''}
  `.trim()

  return (
    <input
      type={type}
      value={value}
      placeholder={placeholder}
      onChange={onChange}
      className={className}
      {...rest}
    />
  )
}

export default InputText
