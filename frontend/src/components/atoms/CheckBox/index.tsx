import React from 'react'
import type { CheckboxProps } from './types'
import { sizeClasses } from './variants'

const Checkbox: React.FC<CheckboxProps> = ({
  id,
  label,
  checked,
  onChange,
  size = 'md',
  disabled = false,
}) => {
  const checkboxId = id || `checkbox-${Math.random().toString(36).slice(2, 9)}`
  const className = `${sizeClasses[size]} text-purple-600 rounded border-gray-300 focus:ring-2`

  return (
    <div className="flex items-center gap-2">
      <input
        id={checkboxId}
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className={className}
        disabled={disabled}
      />
      {label && (
        <label htmlFor={checkboxId} className="text-sm text-gray-700">
          {label}
        </label>
      )}
    </div>
  )
}

export default Checkbox
