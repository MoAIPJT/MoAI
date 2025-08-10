import React from 'react'
import bgImage from '@/assets/background.png'

const LoginIllustration: React.FC = () => {
  return (
    <div className="w-full h-full flex items-center justify-center bg-[#f9eab0]">
      <img src={bgImage} alt="Moai illustration" className="object-cover w-full h-full" />

    </div>
  )
}

export default LoginIllustration
