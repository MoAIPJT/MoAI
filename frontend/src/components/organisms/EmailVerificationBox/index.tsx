import React from 'react'
import WelcomeText from '@/components/molecules/WelcomeText'
import LinkText from '@/components/atoms/LinkText'
import type { EmailVerificationBoxProps } from './types'

const EmailVerificationBox: React.FC<EmailVerificationBoxProps> = ({
  status,
  errorMessage
}) => {
  const renderContent = () => {
    switch (status) {
      case 'loading':
        return (
          <>
            <div className="my-8 w-64 h-64 flex items-center justify-center">
              <div className="animate-spin rounded-full h-32 w-32 border-b-4 border-purple-600"></div>
            </div>
            <div className="text-center mb-6">
              <p className="text-purple-500 font-semibold text-lg">
                이메일을 인증하고 있습니다...
              </p>
            </div>
          </>
        )

      case 'success':
        return (
          <>
            <div className="my-8 w-64 h-64 flex items-center justify-center">
              <div className="w-32 h-32 bg-green-100 rounded-full flex items-center justify-center">
                <svg className="w-20 h-20 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>
            <div className="text-center mb-6">
              <p className="text-green-600 font-semibold text-lg">
                이메일 인증이 완료되었습니다!
              </p>
            </div>
            <p className="text-gray-800 text-center mb-4">
              잠시 후 로그인 페이지로 이동합니다.
            </p>
          </>
        )

      case 'error':
        return (
          <>
            <div className="my-8 w-64 h-64 flex items-center justify-center">
              <div className="w-32 h-32 bg-red-100 rounded-full flex items-center justify-center">
                <svg className="w-20 h-20 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
            </div>
            <div className="text-center mb-6">
              <p className="text-red-600 font-semibold text-lg">
                이메일 인증에 실패했습니다
              </p>
            </div>
            <p className="text-gray-800 text-center mb-4">
              {errorMessage}
            </p>
            <div className="text-center mt-6">
              <LinkText href="/login" variant="underline">로그인으로 돌아가기</LinkText>
            </div>
          </>
        )

      default:
        return null
    }
  }

  return (
    <div className="bg-white rounded-2xl shadow-xl p-12 w-full max-w-md flex flex-col items-center">
      <WelcomeText actionText="이메일 인증" />
      {renderContent()}
    </div>
  )
}

export default EmailVerificationBox
