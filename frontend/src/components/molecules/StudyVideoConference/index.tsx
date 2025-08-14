import React, { useRef, useState, useEffect } from 'react'
import type { StudyVideoConferenceProps } from './types'

const StudyVideoConference: React.FC<StudyVideoConferenceProps> = ({
  hasActiveMeeting = false,
  onCreateRoom,
  participants = [],
  currentUserRole,
  // 🆕 API 연결 완료 - 새로운 props들
  onlineParticipants = [],
  meetingSessionId,
  // 🆕 추가 props
  isLoading = false,
  canManageSession = false,
  onCloseSession,
}) => {
  const hasParticipants = participants.length > 0
  const scrollRef = useRef<HTMLDivElement>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [startX, setStartX] = useState(0)
  const [scrollLeft, setScrollLeft] = useState(0)

  // 관리자 또는 대리자만 방 생성/입장/종료 가능
  const canManageMeeting = currentUserRole === 'ADMIN' || currentUserRole === 'DELEGATE'

  // 🆕 LiveKit 화상회의 연결은 VideoConferencePage에서 처리
  // 이 컴포넌트는 세션 상태 표시와 방 생성/참가 버튼만 담당

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true)
    setStartX(e.pageX - (scrollRef.current?.offsetLeft || 0))
    setScrollLeft(scrollRef.current?.scrollLeft || 0)
  }

  const handleMouseLeave = () => {
    setIsDragging(false)
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return
    e.preventDefault()
    const x = e.pageX - (scrollRef.current?.offsetLeft || 0)
    const walk = (x - startX) * 1.5
    if (scrollRef.current) {
      scrollRef.current.scrollLeft = scrollLeft - walk
    }
  }

  return (
    <div className="bg-white rounded-lg p-4 border border-gray-200 h-full flex flex-col">
      {/* 카드 상단 헤더 */}
      <div className="flex items-center">
        <div className="w-2 h-8 bg-purple-500 rounded-full mr-3"></div>
        <h2 className="text-2xl font-bold text-gray-900">스터디 목록</h2>
      </div>

      <div className="flex-1 flex flex-col">
        {hasActiveMeeting ? (
          <>
            {/* 참여자 정보 */}
            <div className="mb-4 p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-lg font-medium text-gray-700">현재 참여중인 인원:</span>
                  <span className="text-lg font-medium text-gray-800">{participants.length}명</span>
                </div>
                {canManageSession && onCloseSession && (
                  <button
                    onClick={onCloseSession}
                    className="px-3 py-1 bg-red-500 text-white text-sm rounded hover:bg-red-600 transition-colors"
                  >
                    세션 종료
                  </button>
                )}
              </div>
              {meetingSessionId && (
                <div className="text-sm text-gray-500 mt-1">
                  세션 ID: {meetingSessionId}
                </div>
              )}
            </div>
              
            {/* 참여자 목록 - 개선된 UI */}
            <div className="flex-1 flex items-center justify-center pb-6">
              <div 
                ref={scrollRef}
                className={`overflow-x-auto w-full cursor-${isDragging ? 'grabbing' : 'grab'} select-none`}
                onMouseDown={handleMouseDown}
                onMouseLeave={handleMouseLeave}
                onMouseUp={handleMouseUp}
                onMouseMove={handleMouseMove}
                style={{ 
                  whiteSpace: 'nowrap',
                  scrollbarWidth: 'none',
                  msOverflowStyle: 'none'
                }}
              >
                <div className="flex gap-6 min-w-max pl-4 pr-4">
                  {participants.map((participant) => (
                    <div key={participant.id} className="flex flex-col items-center gap-3 group">
                      {/* 프로필 사진 - 더 세련된 디자인 */}
                      <div className="relative">
                        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-100 to-blue-100 flex items-center justify-center text-2xl shadow-lg group-hover:shadow-xl transition-all duration-200">
                          {participant.avatar}
                        </div>
                        {/* 온라인 상태 표시 */}
                        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
                      </div>
                      {/* 이름 */}
                      <span className="text-sm text-gray-700 font-medium text-center max-w-[80px] truncate">
                        {participant.name}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* 모든 사용자에게 보이는 참여 버튼 */}
            <div className="flex justify-center mt-auto">
              <button
                onClick={onCreateRoom}
                disabled={isLoading}
                className="bg-purple-500 text-white px-6 py-2 rounded-lg hover:bg-[#553C9A] transition-colors font-medium shadow-md hover:shadow-lg disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {isLoading ? '연결 중...' : '온라인 스터디 참여'}
              </button>
            </div>
          </>
        ) : (
          <div className="text-center flex-1 flex flex-col justify-center">
            <p className="text-gray-600 mb-6 text-lg">
              현재 진행 중인 온라인 스터디가 없어요.
            </p>
            
            {/* 관리자/대리자만 방 생성 가능 */}
            {canManageSession && (
              <div className="flex justify-center">
                <button
                  onClick={onCreateRoom}
                  disabled={isLoading}
                  className="bg-purple-500 text-white px-6 py-2 rounded-lg hover:bg-[#553C9A] transition-colors font-medium shadow-md hover:shadow-lg disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  {isLoading ? '생성 중...' : '온라인 스터디 시작'}
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default StudyVideoConference
