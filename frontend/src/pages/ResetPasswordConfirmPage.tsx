import React from 'react'
import ResetPasswordConfirmTemplate from '@/components/templates/ResetPasswordConfirmTemplate'
import { useChangePassword } from '@/hooks/useUsers'

const ResetPasswordConfirmPage: React.FC = () => {
  const changePasswordMutation = useChangePassword()

  return (
    <ResetPasswordConfirmTemplate
      onChangePassword={changePasswordMutation.mutate}
      loading={changePasswordMutation.isPending}
      error={changePasswordMutation.error ? '비밀번호 변경에 실패했습니다.' : null}
    />
  )
}

export default ResetPasswordConfirmPage
