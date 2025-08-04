import React from 'react'
import type { TopBarProps } from './types'

const TopBar: React.FC<TopBarProps> = ({ userName = '안덕현' }) => {
  return (
    <div className="flex items-center justify-between w-full h-28 px-6 bg-white border-b border-gray-200">
      
      {/* 오른쪽: 인사말 배너 */}
      <div className="flex items-center bg-purple-100 px-4 py-2 rounded-lg">
        {/* 스피커 아이콘 */}
        <svg 
          className="w-5 h-5 text-purple-600 mr-2" 
          fill="currentColor" 
          viewBox="0 0 20 20"
        >
          <path 
            fillRule="evenodd" 
            d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.617.794L4.383 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.383l4.617-3.794a1 1 0 011.383.07z" 
            clipRule="evenodd" 
          />
        </svg>
        
        {/* 인사말 텍스트 */}
        <span className="text-purple-800 font-medium">
          안녕하세요. {userName}님!
        </span>
      </div>
    </div>
  )
}

export default TopBar 