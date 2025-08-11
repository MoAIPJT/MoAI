import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import LoginTemplate from '@/components/templates/LoginTemplate'
import { useLogin, useSocialLogin } from '@/hooks/useUsers'
import { useNavigate } from 'react-router-dom'
import type { LoginFormData } from '@/components/organisms/LoginForm/types'
import apiClient from '@/services/api'
import { extractAxiosErrorMessage } from '@/utils/errorHandler'

const LoginPage: React.FC = () => {
  const navigate = useNavigate()
  const loginMutation = useLogin()
  const socialLoginMutation = useSocialLogin()

  const handleLogin = (data: LoginFormData) => {
    loginMutation.mutate(data)
  }

  const handleKakaoLogin = () => {
    // 카카오 로그인 URL로 리다이렉트
    const kakaoClientId = import.meta.env.VITE_KAKAO_CLIENT_ID
    const redirectUri = `${window.location.origin}/auth/kakao/callback`
    const kakaoAuthUrl = `https://kauth.kakao.com/oauth/authorize?client_id=${kakaoClientId}&redirect_uri=${redirectUri}&response_type=code`
    window.location.href = kakaoAuthUrl
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
      loading={loginMutation.isPending}
      error={loginMutation.error ? '로그인에 실패했습니다.' : null}
    />
  )
}

export default LoginPage
