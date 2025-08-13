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
          message: '회원가입이 완료되었습니다.',
          email: data.email
        }
      })
    } catch (err: unknown) {
      if (err instanceof Error) {
        // 백엔드에서 오는 에러 메시지를 사용자 친화적으로 변환
        let userFriendlyMessage = err.message
        
        if (err.message.includes('이미 존재하는 이메일')) {
          userFriendlyMessage = '이미 가입된 이메일입니다.'
        } else if (err.message.includes('비밀번호는 최소 8자')) {
          userFriendlyMessage = '비밀번호는 8자 이상이어야 합니다.'
        } else if (err.message.includes('올바른 이메일 형식')) {
          userFriendlyMessage = '올바른 이메일 형식이 아닙니다.'
        } else if (err.message.includes('이름은 2자 이상 20자 이하')) {
          userFriendlyMessage = '이름은 2자 이상 20자 이하여야 합니다.'
        }
        
        setError(userFriendlyMessage)
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
      socialButtonsDisabled={true}
    />
  )
}

export default SignupPage
