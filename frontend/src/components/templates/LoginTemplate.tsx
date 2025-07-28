import React from 'react'
import LoginIllustration from '@/components/organisms/LoginIllustration'
import LoginForm from '@/components/organisms/LoginForm'
import type { LoginFormData } from '@/components/organisms/LoginForm/types'


const LoginTemplate: React.FC = () => {
  const handleLogin = (data: LoginFormData) => {
    console.log('로그인 시도:', data)
  }
  const handleKakaoLogin = () => { console.log('카카오톡 로그인') }
  const handleGoogleLogin = () => { console.log('구글 로그인') }

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
            onLogin={handleLogin}
            onKakaoLogin={handleKakaoLogin}
            onGoogleLogin={handleGoogleLogin}
          />
        </div>
      </div>
    </div>
  )
}

export default LoginTemplate
