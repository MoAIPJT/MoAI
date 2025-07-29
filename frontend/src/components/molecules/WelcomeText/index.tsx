import React from 'react'

const WelcomeText: React.FC = () => {
  return (
    <div className="text-center mb-8">
      <h1 className="text-xl font-bold text-gray-900 mb-2">환영합니다!</h1>
      <p className="text-gray-600 text-xl">
        <span className="text-purple-600 font-semibold text-3xl">MoAI</span> 에 로그인하세요.
      </p>
    </div>
  )
}

export default WelcomeText
