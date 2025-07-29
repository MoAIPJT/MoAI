import React from 'react'
import type { LabelProps } from './types'
import { variantClasses } from './variants'

const Label: React.FC<LabelProps> = ({
  htmlFor,
  children,
  variant = 'default',
  ...rest
}) => {
  const className = `
    ${variantClasses[variant]}
  `.trim()

  return (
    <label htmlFor={htmlFor} className={className} {...rest}>
      {children}
    </label>
  )
}

export default Label
