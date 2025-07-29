import React from 'react'
import { useNavigate } from 'react-router-dom'
import type { LogoProps, LogoVariant } from './types'

const Logo: React.FC<LogoProps> = ({
  variant = 'default',
  onClick,
}) => {
  const navigate = useNavigate()

  const handleClick = () => {
    if (onClick) {
      onClick()
    } else {
      navigate('/') // 기본적으로 홈으로 이동
    }
  }

  const baseClasses = 'flex items-center gap-3 cursor-pointer transition-opacity hover:opacity-80'
  const variantClasses: Record<LogoVariant, string> = {
    default: 'p-6 border-b border-gray-200',
    compact: 'p-4',
    minimal: 'p-2',
  }

  return (
    <div className={`${baseClasses} ${variantClasses[variant]}`} onClick={handleClick}>
      <img 
        src="/src/assets/(M)logo.png" 
        alt="MoAI Logo" 
        className="w-full h-full object-contain"
      />
    </div>
  )
}

export default Logo 