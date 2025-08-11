import React from 'react'
import SocialSignupTemplate from '@/components/templates/SocialSignupTemplate'
import { useSocialSignup } from '@/hooks/useUsers'

const SocialSignupPage: React.FC = () => {
  const socialSignupMutation = useSocialSignup()

  return (
    <SocialSignupTemplate
      onSocialSignup={socialSignupMutation.mutate}
      loading={socialSignupMutation.isPending}
      error={socialSignupMutation.error ? '소셜 회원가입에 실패했습니다.' : null}
    />
  )
}

export default SocialSignupPage
