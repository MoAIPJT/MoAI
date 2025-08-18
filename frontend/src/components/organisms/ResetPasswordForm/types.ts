export interface ResetPasswordFormProps {
  onResetPassword?: (email: string) => void
  loading?: boolean
  error?: string | null
} 