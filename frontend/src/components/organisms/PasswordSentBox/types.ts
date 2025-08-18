export interface PasswordSentBoxProps {
  message?: string
  email?: string
  onResendEmail?: () => Promise<void>
  isResending?: boolean
  resendMessage?: string | null
}
