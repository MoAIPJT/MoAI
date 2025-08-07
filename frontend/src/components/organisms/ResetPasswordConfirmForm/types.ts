export interface ResetPasswordConfirmFormProps {
  onResetPassword?: (data: ResetPasswordConfirmData) => void
  loading?: boolean
  error?: string | null
}

export interface ResetPasswordConfirmData {
  password: string
  passwordConfirm: string
} 