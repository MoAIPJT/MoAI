import React from 'react'
import type { LoadingToastProps } from './types'

const LoadingToast: React.FC<LoadingToastProps> = ({ 
  isVisible, 
  message = "스터디 시작하는 중..." 
}) => {
  if (!isVisible) return null

  return (
    <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-50">
      <div className="bg-[#F6EEFF] border border-[#E8D9FF] rounded-full px-6 py-4 shadow-lg flex items-center gap-3">
        {/* 회전하는 로딩 아이콘 */}
        <div className="animate-spin rounded-full h-5 w-5 border-2 border-[#8B5CF6] border-t-transparent"></div>
        
        {/* 메시지 */}
        <span className="text-[#8B5CF6] font-medium text-sm whitespace-nowrap">
          {message}
        </span>
      </div>
    </div>
  )
}

export default LoadingToast
