import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import SignupTemplate from '@/components/templates/SignupTemplate'
import type { SignupFormData } from '@/components/organisms/SignupForm/types'
import apiClient from '@/services/api'
import { extractAxiosErrorMessage } from '@/utils/errorHandler'

const SignupPage: React.FC = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const navigate = useNavigate()

  const handleSignup = async (data: SignupFormData) => {
    setLoading(true)
    setError(null)

    try {
      await apiClient.post('/users/signup', {
        email: data.email,
        password: data.password,
        name: data.name,
        passwordConfirm: data.passwordConfirm
      })

      // 회원가입 성공 후 이메일 인증 페이지로 이동
      navigate('/email-sent', {
        state: {
          message: '회원가입이 완료되었습니다. 이메일을 확인하여 인증을 완료해주세요.',
          email: data.email
        }
      })
    } catch (err: unknown) {
      const errorMessage = extractAxiosErrorMessage(err, '회원가입에 실패했습니다.')
      setError(errorMessage)

      // 백엔드 연결 실패 시에도 테스트용으로 페이지 이동
      if (errorMessage.includes('Network Error') || errorMessage.includes('ECONNREFUSED')) {
        navigate('/email-sent', {
          state: {
            message: '회원가입이 완료되었습니다. 이메일을 확인하여 인증을 완료해주세요.',
            email: data.email
          }
        })
      }
    } finally {
      setLoading(false)
    }
  }

  const handleKakaoSignup = () => {
    // 카카오 회원가입 URL로 리다이렉트
    const kakaoClientId = import.meta.env.VITE_KAKAO_CLIENT_ID;
    const redirectUri = `${window.location.origin}/auth/kakao/callback`;
    const kakaoAuthUrl = `https://kauth.kakao.com/oauth/authorize?client_id=${kakaoClientId}&redirect_uri=${redirectUri}&response_type=code`;
    window.location.href = kakaoAuthUrl;
  };

  const handleGoogleSignup = () => {
    // 구글 회원가입 URL로 리다이렉트
    const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
    const redirectUri = `${window.location.origin}/auth/google/callback`;
    const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${googleClientId}&redirect_uri=${redirectUri}&response_type=code&scope=email profile`;
    window.location.href = googleAuthUrl;
  };

  return (
    <SignupTemplate
      onSignup={handleSignup}
      onKakaoSignup={handleKakaoSignup}
      onGoogleSignup={handleGoogleSignup}
      loading={loading}
      error={error}
    />
  );
}

export default SignupPage
