export interface LoginFormProps {
  onLogin?: (data: LoginFormData) => void
  onKakaoLogin?: () => void
  onGoogleLogin?: () => void
  loading?: boolean
  error?: string | null
}

export interface LoginFormData {
  email: string
  password: string
  rememberEmail: boolean
} 