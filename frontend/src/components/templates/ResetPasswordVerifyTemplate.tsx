import React from 'react'
import LoginIllustration from '@/components/organisms/LoginIllustration'
import ResetPasswordVerifyBox from '@/components/organisms/ResetPasswordVerifyBox'

interface ResetPasswordVerifyTemplateProps {
  status: 'loading' | 'success' | 'error'
  errorMessage: string
  onPasswordReset: (newPassword: string) => void
}

const ResetPasswordVerifyTemplate: React.FC<ResetPasswordVerifyTemplateProps> = ({
  status,
  errorMessage,
  onPasswordReset
}) => {
  return (
    <div className="flex min-h-screen bg-[#f9f9f9]">
      <div className="w-1/2 h-screen">
        <LoginIllustration />
      </div>
      <div className="w-1/2 flex justify-center items-center h-screen">
        <ResetPasswordVerifyBox
          status={status}
          errorMessage={errorMessage}
          onPasswordReset={onPasswordReset}
        />
      </div>
    </div>
  )
}

export default ResetPasswordVerifyTemplate
