import React from 'react'
import LoginIllustration from '@/components/organisms/LoginIllustration'
import SocialSignupForm from '@/components/organisms/SocialSignupForm'

const SocialSignupTemplate: React.FC = () => (
  <div className="flex min-h-screen bg-[#f9f9f9]">
    <div className="w-1/2 h-screen">
      <LoginIllustration />
    </div>
    <div className="w-1/2 flex justify-center items-center h-screen">
      <SocialSignupForm email="dksejrgus2@gmail.com" provider="google" />
    </div>
  </div>
)

export default SocialSignupTemplate
