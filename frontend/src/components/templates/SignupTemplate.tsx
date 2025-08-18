import React from 'react'
import LoginIllustration from '@/components/organisms/LoginIllustration'
import SignupForm from '@/components/organisms/SignupForm'
import type { SignupFormData } from '@/components/organisms/SignupForm/types'

interface SignupTemplateProps {
  onSignup: (data: SignupFormData) => void
  onKakaoSignup: () => void
  onGoogleSignup: () => void
  loading: boolean
  error: string | null
  socialButtonsDisabled?: boolean
}

const SignupTemplate: React.FC<SignupTemplateProps> = ({
  onSignup,
  onKakaoSignup,
  onGoogleSignup,
  loading,
  error,
  socialButtonsDisabled = false
}) => {
  return (
    <div className="flex min-h-screen bg-[#f9f9f9]">
      <div className="w-1/2 h-screen">
        <LoginIllustration />
      </div>
      <div className="w-1/2 flex justify-center items-center h-screen">
        <div className="bg-white rounded-2xl shadow-xl p-12 w-full max-w-md">
          <SignupForm
            onSignup={onSignup}
            onKakaoSignup={onKakaoSignup}
            onGoogleSignup={onGoogleSignup}
            loading={loading}
            error={error}
            socialButtonsDisabled={socialButtonsDisabled}
          />
        </div>
      </div>
    </div>
  )
}

export default SignupTemplate
