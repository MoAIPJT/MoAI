import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import ResetPasswordTemplate from '@/components/templates/ResetPasswordTemplate'
import { useResetPasswordRequest } from '@/hooks/useUsers'

const ResetPasswordPage: React.FC = () => {
  const [error, setError] = useState<string | null>(null)
  const navigate = useNavigate()
  const resetPasswordMutation = useResetPasswordRequest()

  const handleResetPassword = async (email: string) => {
    setError(null)

    try {
      await resetPasswordMutation.mutateAsync(email)

      // 성공 시 password-sent 페이지로 이동
      navigate('/password-sent', {
        state: {
          message: '비밀번호 재설정 메일이 전송되었습니다.',
          email: email
        }
      })
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message)
      } else {
        setError('비밀번호 재설정 요청에 실패했습니다.')
      }
    }
  }

  return (
    <ResetPasswordTemplate
      onResetPassword={handleResetPassword}
      loading={resetPasswordMutation.isPending}
      error={error}
    />
  )
}

export default ResetPasswordPage
