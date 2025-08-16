import React, { useState } from 'react'
import { useLocation } from 'react-router-dom'
import LoginIllustration from '@/components/organisms/LoginIllustration'
import PasswordSentBox from '@/components/organisms/PasswordSentBox'
import { useResetPasswordRequest } from '@/hooks/useUsers'

const PasswordSentTemplate: React.FC = () => {
  const location = useLocation()
  const { message, email } = location.state || {}
  const [isResending, setIsResending] = useState(false)
  const [resendMessage, setResendMessage] = useState<string | null>(null)
  const resetPasswordMutation = useResetPasswordRequest()

  const handleResendEmail = async () => {
    if (!email) {
      setResendMessage('이메일 주소가 없습니다.')
      return
    }

    setIsResending(true)
    setResendMessage(null)

    try {
      await resetPasswordMutation.mutateAsync({ email })
      setResendMessage('비밀번호 재설정 메일을 다시 전송했습니다.')
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : '메일 전송에 실패했습니다.'
      setResendMessage(errorMessage)
    } finally {
      setIsResending(false)
    }
  }

  return (
    <div className="flex min-h-screen bg-[#f9f9f9]">
      <div className="w-1/2 h-screen">
        <LoginIllustration />
      </div>
      <div className="w-1/2 flex justify-center items-center h-screen">
        <PasswordSentBox
          message={message}
          email={email}
          onResendEmail={handleResendEmail}
          isResending={isResending}
          resendMessage={resendMessage}
        />
      </div>
    </div>
  )
}

export default PasswordSentTemplate
