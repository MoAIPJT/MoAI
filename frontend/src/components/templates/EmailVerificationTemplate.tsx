import React from 'react'
import LoginIllustration from '@/components/organisms/LoginIllustration'
import EmailVerificationBox from '@/components/organisms/EmailVerificationBox'

interface EmailVerificationTemplateProps {
  status: 'loading' | 'success' | 'error'
  errorMessage: string
}

const EmailVerificationTemplate: React.FC<EmailVerificationTemplateProps> = ({
  status,
  errorMessage
}) => {
  return (
    <div className="flex min-h-screen bg-[#f9f9f9]">
      <div className="w-1/2 h-screen">
        <LoginIllustration />
      </div>
      <div className="w-1/2 flex justify-center items-center h-screen">
        <EmailVerificationBox status={status} errorMessage={errorMessage} />
      </div>
    </div>
  )
}

export default EmailVerificationTemplate
