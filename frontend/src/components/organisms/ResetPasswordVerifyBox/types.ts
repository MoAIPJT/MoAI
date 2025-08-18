export interface ResetPasswordVerifyBoxProps {
  status: 'loading' | 'success' | 'error'
  errorMessage: string
  onPasswordReset: (newPassword: string) => void
}
