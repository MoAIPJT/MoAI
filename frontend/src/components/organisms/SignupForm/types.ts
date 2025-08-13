export interface SignupFormProps {
  onSignup?: (data: SignupFormData) => void
  onKakaoSignup?: () => void
  onGoogleSignup?: () => void
  loading?: boolean
  error?: string | null
  socialButtonsDisabled?: boolean
}

export interface SignupFormData {
  email: string
  name: string
  password: string
  passwordConfirm: string
} 