import React, { useRef, useState } from 'react'
import type { StudyVideoConferenceProps } from './types'

const StudyVideoConference: React.FC<StudyVideoConferenceProps> = ({
  hasActiveMeeting = false,
  onCreateRoom,
  participants = [],
  hashId
}) => {
  const hasParticipants = participants.length > 0
  const scrollRef = useRef<HTMLDivElement>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [startX, setStartX] = useState(0)
  const [scrollLeft, setScrollLeft] = useState(0)

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
      <div className="flex-1 flex flex-col">
        {hasParticipants ? (
          <>
            {/* 참여자 정보 */}
            <div className="mb-4 p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-2">
                <span className="text-gray-600">👥</span>
                <span className="text-lg font-medium text-gray-700">현재 참여중인 인원</span>
                <span className="text-lg font-medium text-gray-800">{participants.length}</span>
              </div>
            </div>

            {/* 참여자 목록 */}
            <div className="flex-1 flex items-end justify-center pb-8">
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
                <div className="flex gap-8 min-w-max pl-8">
                  {participants.map((participant) => (
                    <div key={participant.id} className="flex flex-col items-center gap-3">
                      <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center text-3xl">
                        {participant.avatar}
                      </div>
                      <span className="text-base text-gray-600 font-medium">{participant.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="text-center flex-1 flex flex-col justify-center">
            <p className="text-gray-600 mb-4">
              {hasActiveMeeting
                ? "현재 진행중인 화상회의가 있습니다"
                : "현재 진행중인 화상회의가 없어욤"
              }
            </p>
          </div>
        )}

        <div className="flex justify-end mt-auto">
          <button
            onClick={() => {
              // hashId를 사용하여 방 생성/입장 (향후 구현 예정)
              console.log('Video conference room:', hashId)
              onCreateRoom?.()
            }}
            className="bg-[#F6EEFF] text-gray-700 px-4 py-2 rounded-lg hover:bg-[#E8D9FF] transition-colors"
          >
            <span>{hasParticipants ? "방 입장" : "방 생성"}</span>
          </button>
        </div>
      </div>
    </div>
  )
}

export default StudyVideoConference
