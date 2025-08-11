import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import LoginTemplate from '@/components/templates/LoginTemplate'
import type { LoginFormData } from '@/components/organisms/LoginForm/types'
import { useLogin } from '@/hooks/useUsers'
import { useAppStore } from '@/store/appStore'

const LoginPage: React.FC = () => {
<<<<<<< HEAD
  const [error, setError] = useState<string | null>(null)
  const navigate = useNavigate()
  const setAuth = useAppStore((state) => state.auth.setAuth)

  const loginMutation = useLogin()

  const handleLogin = async (data: LoginFormData) => {
    setError(null)

    try {
      const response = await loginMutation.mutateAsync({
        email: data.email,
        password: data.password,
      })

      // Zustand store에 토큰 저장
      setAuth({
        accessToken: response.accessToken,
        refreshToken: response.refreshToken,
      })

      // 이메일 기억하기 옵션
      if (data.rememberEmail) {
        localStorage.setItem('rememberedEmail', data.email)
      } else {
        localStorage.removeItem('rememberedEmail')
      }

      // 로그인 성공 후 리다이렉트
      navigate('/dashboard')
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message)
      } else {
        setError('로그인에 실패했습니다.')
      }
=======
  const { login, loading, error } = useAuth(); const handleLogin = async (data: LoginFormData) => {
    try { await login(data); } catch {
      // 에러는 useAuth 훅에서 처리됨
>>>>>>> 961674954876c6d3312259409f061f635ee4abc7
    }
  }

  const handleKakaoLogin = () => {
    const backendUrl = import.meta.env.VITE_BACKEND_URL
    window.location.href = `${backendUrl}/oauth2/authorization/kakao`
  }

  const handleGoogleLogin = () => {
    const googleClientId = import.meta.env.VITE_GOOGLE_OAUTH_CLIENT_ID;
    const redirectUri = `http://localhost:5173/auth/google/callback`;
    const scope = `https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile openid`;
    const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${googleClientId}&redirect_uri=${redirectUri}&scope=${scope}&response_type=code`;
    window.location.href = googleAuthUrl;
  }

  return (
    <LoginTemplate
      onLogin={handleLogin}
      onKakaoLogin={handleKakaoLogin}
      onGoogleLogin={handleGoogleLogin}
      loading={loginMutation.isPending}
      error={error}
    />
  )
}

export default LoginPage
