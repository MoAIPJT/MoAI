export interface LoginFormProps {
  onLogin?: (data: LoginFormData) => void
  onKakaoLogin?: () => void
  onGoogleLogin?: () => void
}

export interface LoginFormData {
  email: string
  password: string
  rememberEmail: boolean
} 