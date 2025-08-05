import React, { useState } from 'react'
import CircleButton from '@/components/atoms/CircleButton'

const TestPage: React.FC = () => {
  const [isMicMuted, setIsMicMuted] = useState(false)
  const [isVideoStopped, setIsVideoStopped] = useState(false)
  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">CircleButton 테스트 페이지</h1>

        {/* 이미지와 동일한 디자인 */}
        <div className="bg-gray-700 rounded-xl p-6">
          <div className="flex items-center justify-center gap-4 bg-gray-600 rounded-lg p-4">
                         <CircleButton variant="lightPurple" size="md" onClick={() => setIsMicMuted(!isMicMuted)}>
                               {isMicMuted ? (
                  <div className="relative">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z"/>
                      <path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z"/>
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-14 h-0.5 bg-red-500 transform rotate-45"></div>
                    </div>
                  </div>
               ) : (
                 <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                   <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z"/>
                   <path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z"/>
                 </svg>
               )}
             </CircleButton>
                         <CircleButton variant="lightPurple" size="md" onClick={() => setIsVideoStopped(!isVideoStopped)}>
               {isVideoStopped ? (
                 <div className="relative">
                   <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                     <path d="M17 10.5V7c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-3.5l4 4v-11l-4 4z"/>
                   </svg>
                   <div className="absolute inset-0 flex items-center justify-center">
                     <div className="w-14 h-0.5 bg-red-500 transform rotate-45"></div>
                   </div>
                 </div>
               ) : (
                 <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                   <path d="M17 10.5V7c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-3.5l4 4v-11l-4 4z"/>
                 </svg>
               )}
             </CircleButton>
             <CircleButton variant="purple" size="md" onClick={() => console.log('문서')}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"/>
              </svg>
            </CircleButton>
            <CircleButton variant="red" size="md" onClick={() => console.log('닫기')}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
              </svg>
            </CircleButton>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TestPage