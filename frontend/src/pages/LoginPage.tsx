import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import LoginTemplate from '@/components/templates/LoginTemplate'
import type { LoginFormData } from '@/components/organisms/LoginForm/types'
import apiClient from '@/services/api'
import { extractAxiosErrorMessage } from '@/utils/errorHandler'

const LoginPage: React.FC = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const navigate = useNavigate()

  const handleLogin = async (data: LoginFormData) => {
    setLoading(true)
    setError(null)

    try {
      const response = await apiClient.post('/users/login', {
        email: data.email,
        password: data.password,
      })

      // 토큰 저장
      localStorage.setItem('accessToken', response.data.accessToken)
      localStorage.setItem('refreshToken', response.data.refreshToken)

      // 이메일 기억하기 옵션
      if (data.rememberEmail) {
        localStorage.setItem('rememberedEmail', data.email)
      } else {
        localStorage.removeItem('rememberedEmail')
      }

      // 로그인 성공 후 리다이렉트
      navigate('/dashboard')
    } catch (err: unknown) {
      const errorMessage = extractAxiosErrorMessage(err, '로그인에 실패했습니다.')
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const handleKakaoLogin = () => {
    const backendUrl = import.meta.env.VITE_BACKEND_URL
    window.location.href = `${backendUrl}/oauth2/authorization/kakao`
  }

  const handleGoogleLogin = () => {
    const backendUrl = import.meta.env.VITE_BACKEND_URL
    window.location.href = `${backendUrl}/oauth2/authorization/google`
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
