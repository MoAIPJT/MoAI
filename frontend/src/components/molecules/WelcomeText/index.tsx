import React from 'react'

const WelcomeText: React.FC = () => {
  return (
    <div className="text-center mb-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-2">환영합니다!</h1>
      <p className="text-gray-600 text-2xl flex items-center justify-center gap-2">
        <img 
          src="/src/assets/(S-l)logo.png" 
          alt="MoAI Logo" 
          className="h-12 w-auto"
        />
        로그인하세요
      </p>
    </div>
  )
}

export default WelcomeText
