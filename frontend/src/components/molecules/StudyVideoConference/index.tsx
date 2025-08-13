import React, { useRef, useState, useEffect } from 'react'
import type { StudyVideoConferenceProps } from './types'

// TODO: OpenVidu 관련 import 추가 예정
// import { OpenVidu } from 'openvidu-browser'
// import { useOpenViduSession } from '@/hooks/useOpenVidu'

const StudyVideoConference: React.FC<StudyVideoConferenceProps> = ({
  hasActiveMeeting = false,
  onCreateRoom,
  participants = [],
  currentUserRole,
}) => {
  const hasParticipants = participants.length > 0
  const scrollRef = useRef<HTMLDivElement>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [startX, setStartX] = useState(0)
  const [scrollLeft, setScrollLeft] = useState(0)

  // TODO: OpenVidu 관련 상태 추가 예정
  // const [session, setSession] = useState<Session | null>(null)
  // const [publisher, setPublisher] = useState<Publisher | null>(null)
  // const [subscribers, setSubscribers] = useState<Subscriber[]>([])
  // const [isConnecting, setIsConnecting] = useState(false)
  // const [isConnected, setIsConnected] = useState(false)

  // 관리자 또는 대리자만 방 생성/입장 가능
  const canManageMeeting = currentUserRole === 'ADMIN' || currentUserRole === 'DELEGATE'

  // TODO: OpenVidu 세션 초기화 함수
  // const initializeSession = async () => {
  //   try {
  //     setIsConnecting(true)
  //     // 백엔드에서 세션 토큰 요청
  //     const response = await fetch('/api/openvidu/sessions/create', {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json',
  //         'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
  //       },
  //       body: JSON.stringify({
  //         studyId: studyId,
  //         sessionName: `study-${studyId}-${Date.now()}`
  //       })
  //     })
  //     
  //     if (!response.ok) throw new Error('세션 생성 실패')
  //     
  //     const { token } = await response.json()
  //     
  //     // OpenVidu 세션 연결
  //     const ov = new OpenVidu()
  //     const session = ov.initSession()
  //     
  //     session.on('streamCreated', (event) => {
  //       setSubscribers(prev => [...prev, event.stream])
  //     })
  //     
  //     session.on('streamDestroyed', (event) => {
  //       setSubscribers(prev => prev.filter(sub => sub !== event.stream))
  //     })
  //     
  //     await session.connect(token)
  //     setSession(session)
  //     setIsConnected(true)
  //     
  //     // 퍼블리셔 생성
  //     const publisher = ov.initPublisher(undefined, {
  //       audioSource: undefined,
  //       videoSource: undefined,
  //       publishAudio: true,
  //       publishVideo: true,
  //       resolution: '640x480',
  //       frameRate: 30,
  //       insertMode: 'APPEND',
  //       mirror: false
  //     })
  //     
  //     session.publish(publisher)
  //     setPublisher(publisher)
  //     
  //   } catch (error) {
  //     console.error('OpenVidu 세션 초기화 실패:', error)
  //   } finally {
  //     setIsConnecting(false)
  //   }
  // }

  // TODO: 온라인 스터디 참여자 목록 실시간 업데이트
  // useEffect(() => {
  //   if (!isConnected || !session) return
  //   
  //   // 참여자 목록 실시간 업데이트를 위한 WebSocket 연결
  //   const ws = new WebSocket(`ws://localhost:8080/ws/study/${studyId}/participants`)
  //   
  //   ws.onmessage = (event) => {
  //     const data = JSON.parse(event.data)
  //     if (data.type === 'PARTICIPANT_JOINED') {
  //       // 새로운 참여자 추가
  //       setParticipants(prev => [...prev, data.participant])
  //     } else if (data.type === 'PARTICIPANT_LEFT') {
  //       // 참여자 제거
  //       setParticipants(prev => prev.filter(p => p.id !== data.participantId))
  //     }
  //   }
  //   
  //   return () => ws.close()
  // }, [isConnected, session, studyId])

  // TODO: 온라인 스터디 상태 확인
  // useEffect(() => {
  //   const checkOnlineStudyStatus = async () => {
  //     try {
  //       const response = await fetch(`/api/study/${studyId}/online-status`, {
  //         headers: {
  //           'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
  //         }
  //       })
  //       
  //       if (response.ok) {
  //         const { isActive, participants: onlineParticipants } = await response.json()
  //         setHasActiveMeeting(isActive)
  //         setParticipants(onlineParticipants)
  //       }
  //     } catch (error) {
  //       console.error('온라인 스터디 상태 확인 실패:', error)
  //     }
  //   }
  //   
  //   // 주기적으로 상태 확인 (30초마다)
  //   const interval = setInterval(checkOnlineStudyStatus, 30000)
  //   checkOnlineStudyStatus() // 초기 확인
  //   
  //   return () => clearInterval(interval)
  // }, [studyId])

  // TODO: 방 생성/입장 핸들러
  // const handleCreateRoom = async () => {
  //   if (!canManageMeeting) return
  //   
  //   try {
  //     // 백엔드에 온라인 스터디 세션 생성 요청
  //     const response = await fetch('/api/study/online-session/create', {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json',
  //         'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
  //       },
  //       body: JSON.stringify({
  //         studyId: studyId,
  //         sessionName: `study-${studyId}`,
  //         maxParticipants: 20
  //       })
  //     })
  //     
  //     if (!response.ok) throw new Error('온라인 스터디 세션 생성 실패')
  //     
  //     const { sessionId } = await response.json()
  //     
  //     // OpenVidu 세션 초기화
  //     await initializeSession()
  //     
  //     // 참여자 목록 업데이트
  //     setHasActiveMeeting(true)
  //     
  //   } catch (error) {
  //     console.error('방 생성 실패:', error)
  //   }
  // }

  // TODO: 방 입장 핸들러
  // const handleJoinRoom = async () => {
  //   try {
  //     // 기존 세션에 참여
  //     const response = await fetch(`/api/study/${studyId}/online-session/join`, {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json',
  //         'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
  //       }
  //     })
  //     
  //     if (!response.ok) throw new Error('방 입장 실패')
  //     
  //     const { token } = await response.json()
  //     
  //     // OpenVidu 세션에 참여
  //     await initializeSession()
  //     
  //   } catch (error) {
  //     console.error('방 입장 실패:', error)
  //   }
  // }

  // TODO: 온라인 스터디 종료
  // const handleEndSession = async () => {
  //   if (!canManageMeeting || !session) return
  //   
  //   try {
  //     // 백엔드에 세션 종료 요청
  //     await fetch(`/api/study/${studyId}/online-session/end`, {
  //       method: 'DELETE',
  //       headers: {
  //         'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
  //       }
  //     })
  //     
  //     // OpenVidu 세션 종료
  //     session.disconnect()
  //     setSession(null)
  //     setPublisher(null)
  //     setSubscribers([])
  //     setIsConnected(false)
  //     setHasActiveMeeting(false)
  //     setParticipants([])
  //     
  //   } catch (error) {
  //     console.error('세션 종료 실패:', error)
  //   }
  // }

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
              <div className="flex items-center gap-2">
                <span className="text-lg font-medium text-gray-700">현재 참여중인 인원:</span>
                <span className="text-lg font-medium text-gray-800">{participants.length}명</span>
              </div>
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
                className="bg-purple-500 text-white px-6 py-2 rounded-lg hover:bg-[#553C9A] transition-colors font-medium shadow-md hover:shadow-lg"
              >
                온라인 스터디 참여
              </button>
            </div>
          </>
        ) : (
          <div className="text-center flex-1 flex flex-col justify-center">
            <p className="text-gray-600 mb-6 text-lg">
              현재 진행 중인 온라인 스터디가 없어요.
            </p>
            
            {/* 관리자/대리자만 방 생성 가능 */}
            {canManageMeeting && (
              <div className="flex justify-center">
                <button
                  onClick={onCreateRoom}
                  className="bg-purple-500 text-white px-6 py-2 rounded-lg hover:bg-[#553C9A] transition-colors font-medium shadow-md hover:shadow-lg"
                >
                  온라인 스터디 시작
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
