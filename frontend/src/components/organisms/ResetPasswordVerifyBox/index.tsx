import React, { useState } from 'react'
import WelcomeText from '@/components/molecules/WelcomeText'
import LinkText from '@/components/atoms/LinkText'
import type { ResetPasswordVerifyBoxProps } from './types'

const ResetPasswordVerifyBox: React.FC<ResetPasswordVerifyBoxProps> = ({
  status,
  errorMessage,
  onPasswordReset
}) => {
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [passwordError, setPasswordError] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setPasswordError('')

    if (newPassword.length < 8) {
      setPasswordError('비밀번호는 8자 이상이어야 합니다.')
      return
    }

    if (newPassword !== confirmPassword) {
      setPasswordError('비밀번호가 일치하지 않습니다.')
      return
    }

    onPasswordReset(newPassword)
  }

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
                인증을 확인하고 있습니다...
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
                인증이 완료되었습니다!
              </p>
            </div>
            <p className="text-gray-800 text-center mb-6">
              새로운 비밀번호를 입력해주세요.
            </p>

            <form onSubmit={handleSubmit} className="w-full space-y-4">
              <div>
                <input
                  type="password"
                  placeholder="새 비밀번호"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <input
                  type="password"
                  placeholder="새 비밀번호 확인"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  required
                />
              </div>
              {passwordError && (
                <p className="text-red-500 text-sm text-center">{passwordError}</p>
              )}
              <button
                type="submit"
                className="w-full bg-purple-600 text-white py-3 px-4 rounded-lg hover:bg-purple-700 transition-colors font-semibold"
              >
                비밀번호 변경
              </button>
            </form>
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
                인증에 실패했습니다
              </p>
            </div>
            <p className="text-gray-800 text-center mb-4">
              {errorMessage}
            </p>
            <div className="text-center mt-6">
              <LinkText href="/reset-password" variant="underline">비밀번호 재설정 다시 시도</LinkText>
            </div>
          </>
        )

      default:
        return null
    }
  }

  return (
    <div className="bg-white rounded-2xl shadow-xl p-12 w-full max-w-md flex flex-col items-center">
      <WelcomeText actionText="비밀번호 재설정" />
      {renderContent()}
    </div>
  )
}

export default ResetPasswordVerifyBox
