import React from 'react'
import ResetPasswordTemplate from '@/components/templates/ResetPasswordTemplate'
import { useAuth } from '@/hooks/useAuth'

const ResetPasswordPage: React.FC = () => {
  const { requestResetPassword, loading, error } = useAuth();

  const handleResetPassword = async (email: string) => {
    try {
      await requestResetPassword(email)
    } catch {
      // 에러는 useAuth 훅에서 처리됨
    }
  }

  return (
    <ResetPasswordTemplate
      onResetPassword={handleResetPassword}
      loading={loading}
      error={error}
    />
  )
}

export default ResetPasswordPage
