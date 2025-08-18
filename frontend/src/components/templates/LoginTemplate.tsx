import React from 'react'
import LoginIllustration from '@/components/organisms/LoginIllustration'
import LoginForm from '@/components/organisms/LoginForm'
import type { LoginFormData } from '@/components/organisms/LoginForm/types'

interface LoginTemplateProps {
  onLogin: (data: LoginFormData) => void
  onKakaoLogin: () => void
  onGoogleLogin: () => void
  loading: boolean
  error: string | null
}

const LoginTemplate: React.FC<LoginTemplateProps> = ({
  onLogin,
  onKakaoLogin,
  onGoogleLogin,
  loading,
  error
}) => {
  return (
    <div className="flex min-h-screen bg-[#f9f9f9]">
      {/* 왼쪽 일러스트 */}
      <div className="w-1/2 h-screen">
        <LoginIllustration />
      </div>
      {/* 오른쪽 로그인 폼 */}
      <div className="w-1/2 flex justify-center items-center h-screen">
        <div className="bg-white rounded-2xl shadow-xl p-12 w-full max-w-md">
          <LoginForm
            onLogin={onLogin}
            onKakaoLogin={onKakaoLogin}
            onGoogleLogin={onGoogleLogin}
            loading={loading}
            error={error}
          />
        </div>
      </div>
    </div>
  )
}

export default LoginTemplate
