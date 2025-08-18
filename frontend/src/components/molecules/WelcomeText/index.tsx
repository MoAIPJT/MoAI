import React from 'react'
import logo from '../../../assets/(S-l)logo.png'


interface WelcomeTextProps {
  actionText?: string
}

const WelcomeText: React.FC<WelcomeTextProps> = ({ actionText = "로그인하세요." }) => {
  return (
    <div className="text-center mb-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-2">환영합니다!</h1>
      <p className="text-gray-600 text-2xl flex items-center justify-center gap-2">
        <img 
          src={logo}
          alt="MoAI Logo" 
          className="h-12 w-auto"
        />
        {actionText}
      </p>
    </div>
  )
}

export default WelcomeText
