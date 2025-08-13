import React from 'react'
import LoginTemplate from '@/components/templates/LoginTemplate'
import type { LoginFormData } from '@/components/organisms/LoginForm/types'
import { useAuth } from '@/hooks/useAuth'

const LoginPage: React.FC = () => {
  const { login, loading, error } = useAuth()

  const handleLogin = async (data: LoginFormData) => {
    await login(data)
  }

  const handleKakaoLogin = () => {
    const backendUrl = import.meta.env.VITE_BACKEND_URL
    window.location.href = `${backendUrl}/oauth2/authorization/kakao`
  }

  const handleGoogleLogin = () => {
    const googleClientId = import.meta.env.VITE_GOOGLE_OAUTH_CLIENT_ID
    const redirectUri = `http://localhost:5173/auth/google/callback`
    const scope = `https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile openid`
    const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${googleClientId}&redirect_uri=${redirectUri}&scope=${scope}&response_type=code`
    window.location.href = googleAuthUrl
  }

  return (
    <LoginTemplate
      onLogin={handleLogin}
      onKakaoLogin={handleKakaoLogin}
      onGoogleLogin={handleGoogleLogin}
      loading={loading}
      error={error}
    />
  )
}

export default LoginPage
