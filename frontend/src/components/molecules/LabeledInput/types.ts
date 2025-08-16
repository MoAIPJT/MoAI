import type { InputVariant, InputSize } from '../../atoms/InputText/types'

export interface LabeledInputProps {
  id: string
  label: string
  type?: string
  value: string
  placeholder?: string
  variant?: InputVariant
  size?: InputSize
  fullWidth?: boolean
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void
}
