import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import SignupTemplate from '@/components/templates/SignupTemplate'
import { useSignup } from '@/hooks/useUsers'
import type { SignupFormData } from '@/components/organisms/SignupForm/types'

const SignupPage: React.FC = () => {
  const [error, setError] = useState<string | null>(null)
  const navigate = useNavigate()
  const signupMutation = useSignup()

  const handleSignup = async (data: SignupFormData) => {
    setError(null)

    try {
      await signupMutation.mutateAsync({
        email: data.email,
        password: data.password,
        name: data.name
      })

      // 회원가입 성공 후 이메일 인증 페이지로 이동
      navigate('/email-sent', {
        state: {
          message: '회원가입이 완료되었습니다. 이메일을 확인하여 인증을 완료해주세요.',
          email: data.email
        }
      })
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message)
      } else {
        setError('회원가입에 실패했습니다.')
      }
    }
  }

  const handleKakaoSignup = () => {
    const backendUrl = import.meta.env.VITE_BACKEND_URL
    window.location.href = `${backendUrl}/oauth2/authorization/kakao`
  }

  const handleGoogleSignup = () => {
    const backendUrl = import.meta.env.VITE_BACKEND_URL
    window.location.href = `${backendUrl}/oauth2/authorization/google`
  }

  return (
    <SignupTemplate
      onSignup={handleSignup}
      onKakaoSignup={handleKakaoSignup}
      onGoogleSignup={handleGoogleSignup}
      loading={signupMutation.isPending}
      error={error}
    />
  )
}

export default SignupPage
