import React from 'react'
import Label from '@/components/atoms/Label'
import InputText from '@/components/atoms/InputText'
import type { LabeledInputProps } from './types'

const LabeledInput: React.FC<LabeledInputProps> = ({
  id,
  label,
  type = 'text',
  value,
  placeholder,
  variant = 'default',
  size = 'md',
  fullWidth = false,
  onChange,
}) => {
  return (
    <div className="flex flex-col gap-1">
      <Label htmlFor={id}>{label}</Label>
      <InputText
        id={id}
        type={type}
        value={value}
        placeholder={placeholder}
        variant={variant}
        size={size}
        fullWidth={fullWidth}
        onChange={onChange}
      />
    </div>
  )
}

export default LabeledInput
