import React from 'react'
import ResetPasswordTemplate from '@/components/templates/ResetPasswordTemplate'
import { useResetPasswordRequest } from '@/hooks/useUsers'

const ResetPasswordPage: React.FC = () => {
  const resetPasswordMutation = useResetPasswordRequest()

  const handleResetPassword = (email: string) => {
    resetPasswordMutation.mutate(email)
  }

  return (
    <ResetPasswordTemplate
      onResetPassword={handleResetPassword}
      loading={resetPasswordMutation.isPending}
      error={resetPasswordMutation.error ? '비밀번호 재설정 요청에 실패했습니다.' : null}
    />
  )
}

export default ResetPasswordPage
