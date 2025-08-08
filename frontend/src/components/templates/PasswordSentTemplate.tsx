import React from 'react'
import { useLocation } from 'react-router-dom'
import LoginIllustration from '@/components/organisms/LoginIllustration'
import PasswordSentBox from '@/components/organisms/PasswordSentBox'

const PasswordSentTemplate: React.FC = () => {
  const location = useLocation()
  const { message, email } = location.state || {}

  return (
    <div className="flex min-h-screen bg-[#f9f9f9]">
      <div className="w-1/2 h-screen">
        <LoginIllustration />
      </div>
      <div className="w-1/2 flex justify-center items-center h-screen">
        <PasswordSentBox message={message} email={email} />
          </div>
  </div>
  )
}

export default PasswordSentTemplate
