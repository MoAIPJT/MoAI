import React, { useEffect, useState } from 'react'
import { useParams, useLocation, useNavigate } from 'react-router-dom'
import { Room, RoomEvent, RemoteParticipant, LocalParticipant, Track } from 'livekit-client'
import CircleButton from '../components/atoms/CircleButton'
import VideoConferenceHeader from '../components/organisms/VideoConferenceHeader'
import VideoConferenceMainContent from '../components/organisms/VideoConferenceMainContent'
import VideoConferenceSidebar from '../components/organisms/VideoConferenceSidebar'
import videoConferenceService from '../services/videoConferenceService'


interface VideoConferencePageProps {
  studyId?: number
  studyName?: string
}

interface ChatMessage {
  id: string
  sender: string
  message: string
  timestamp: Date
}

const VideoConferencePage: React.FC<VideoConferencePageProps> = ({
  studyId: propStudyId,
  studyName = '스터디'
}: VideoConferencePageProps) => {
  const { studyId: urlStudyId } = useParams<{ studyId: string }>()
  const location = useLocation()
  const navigate = useNavigate()
  const studyId = propStudyId || (urlStudyId ? parseInt(urlStudyId) : undefined)
  
  // StudyDetailPage에서 전달된 세션 정보
  const sessionInfo = location.state as {
    wsUrl: string
    token: string
    roomName: string
    sessionId: string
  } | null

  // ===== 로딩 및 에러 상태 =====
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // ===== LiveKit 화상회의 관련 상태 =====
  const [room, setRoom] = useState<Room | null>(null)
  const [localParticipant, setLocalParticipant] = useState<LocalParticipant | null>(null)
  const [remoteParticipants, setRemoteParticipants] = useState<Map<string, RemoteParticipant>>(new Map())
  const [remoteParticipantStates, setRemoteParticipantStates] = useState<Map<string, {audio: boolean, video: boolean}>>(new Map())
  const [isConnected, setIsConnected] = useState(false)

  // ===== 화면 공유 관련 상태 =====
  const [isScreenSharing, setIsScreenSharing] = useState(false)
  const [screenShareStream, setScreenShareStream] = useState<MediaStream | null>(null)
  const [screenShareParticipant, setScreenShareParticipant] = useState<string>('')

  // ===== 오디오/비디오 상태 관리 =====
  const [isAudioEnabled, setIsAudioEnabled] = useState(true)
  const [isVideoEnabled, setIsVideoEnabled] = useState(true)

  // ===== 사이드바 상태 관리 =====
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [activeSidebarTab, setActiveSidebarTab] = useState<'participants' | 'chat' | null>(null)
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([])
  const [newChatMessage, setNewChatMessage] = useState('')







  const studyNameDisplay = studyName !== '스터디' ? studyName : studyId ? `스터디 ${studyId}` : '스터디'



  // ===== LiveKit 세션 초기화 =====
  const initializeLiveKitSession = async (wsUrl: string, token: string) => {
    try {
      const newRoom = new Room({
        adaptiveStream: true,
        dynacast: true,
      })

      // 방 이벤트 리스너 설정
      newRoom.on(RoomEvent.ParticipantConnected, (participant: RemoteParticipant) => {
        setRemoteParticipants((prev: Map<string, RemoteParticipant>) => new Map(prev.set(participant.identity, participant)))
        setRemoteParticipantStates((prev: Map<string, {audio: boolean, video: boolean}>) => new Map(prev.set(participant.identity, {audio: true, video: true})))
      })

      newRoom.on(RoomEvent.ParticipantDisconnected, (participant: RemoteParticipant) => {
        setRemoteParticipants((prev: Map<string, RemoteParticipant>) => {
          const newMap = new Map(prev)
          newMap.delete(participant.identity)
          return newMap
        })
        setRemoteParticipantStates((prev: Map<string, {audio: boolean, video: boolean}>) => {
          const newMap = new Map(prev)
          newMap.delete(participant.identity)
          return newMap
        })
      })

      newRoom.on(RoomEvent.TrackSubscribed, (track: any, publication: any, participant: any) => {
        // 원격 참가자의 트랙 구독
        if (track.kind === 'video') {
          // 비디오 트랙 처리
        } else if (track.kind === 'audio') {
          // 오디오 트랙 처리
        }
      })

      newRoom.on(RoomEvent.TrackUnsubscribed, (track: any, publication: any, participant: any) => {
        // 트랙 구독 해제 처리
      })

      // 방에 연결
      await newRoom.connect(wsUrl, token, {
        autoSubscribe: true,
      })

      setRoom(newRoom)
      setLocalParticipant(newRoom.localParticipant)
      setIsConnected(true)

      // 로컬 비디오/오디오 활성화
      await newRoom.localParticipant.enableCameraAndMicrophone()

    } catch (error) {
      console.error('LiveKit 세션 연결 실패:', error)
      setError('화상회의에 연결할 수 없습니다.')
    }
  }



  // ===== 컴포넌트 마운트 시 초기화 =====
  useEffect(() => {
    // URL 파라미터에서 세션 정보 추출
    const urlParams = new URLSearchParams(window.location.search)
    const wsUrl = urlParams.get('wsUrl')
    const token = urlParams.get('token')
    const roomName = urlParams.get('roomName')
    const sessionId = urlParams.get('sessionId')

    // URL 파라미터로 전달된 세션 정보가 있으면 LiveKit에 연결
    if (wsUrl && token) {
      console.log('URL 파라미터에서 세션 정보 수신:', { wsUrl, token, roomName, sessionId })
      setIsLoading(true)
      initializeLiveKitSession(wsUrl, token)
        .then(() => {
          setIsLoading(false)
        })
        .catch((error) => {
          console.error('LiveKit 연결 실패:', error)
          setError('화상회의에 연결할 수 없습니다.')
          setIsLoading(false)
        })
    }
    // StudyDetailPage에서 전달된 세션 정보가 있으면 LiveKit에 연결
    else if (sessionInfo) {
      setIsLoading(true)
      initializeLiveKitSession(sessionInfo.wsUrl, sessionInfo.token)
        .then(() => {
          setIsLoading(false)
        })
        .catch((error) => {
          console.error('LiveKit 연결 실패:', error)
          setError('화상회의에 연결할 수 없습니다.')
          setIsLoading(false)
        })
    } else {
      // 세션 정보가 없으면 에러 메시지 표시
      setError('화상회의 세션 정보가 없습니다. 스터디 상세 페이지에서 화상회의를 시작해주세요.')
    }
  }, [sessionInfo])

  // ===== 컴포넌트 언마운트 시 정리 =====
  useEffect(() => {
    return () => {
      if (room) {
        room.disconnect()
      }
      if (screenShareStream) {
        screenShareStream.getTracks().forEach((track: any) => track.stop())
      }
    }
  }, [room, screenShareStream])

  // ===== LiveKit 방 연결 해제 =====
  const leaveSession = () => {
    if (room) {
      room.disconnect()
    }
    if (isScreenSharing) {
      stopScreenShare()
    }
    setRoom(null)
    setLocalParticipant(null)
    setRemoteParticipants(new Map())
    setRemoteParticipantStates(new Map())
    setIsConnected(false)
    // 오디오/비디오 상태 초기화
    setIsAudioEnabled(true)
    setIsVideoEnabled(true)
  }

  // ===== 세션 종료 (백엔드에 세션 종료 요청) =====
  const closeSession = async () => {
    // URL 파라미터에서 hashId 추출
    const urlParams = new URLSearchParams(window.location.search)
    let hashId: string | undefined = urlParams.get('sessionId') || undefined
    
    // URL 파라미터에 없으면 다른 방법으로 시도
    if (!hashId) {
      if (sessionInfo?.sessionId) {
        hashId = sessionInfo.sessionId
      } else if (location.state?.sessionId) {
        hashId = location.state.sessionId
      }
    }

    if (!hashId) {
      console.error('세션 ID를 찾을 수 없습니다.')
      return
    }

    if (!confirm('정말로 온라인 스터디를 종료하시겠습니까?')) {
      return
    }

    try {
      setIsLoading(true)
      
      // 백엔드에 세션 종료 요청
      await videoConferenceService.closeSession(hashId)
      console.log('세션 종료 성공')
      
      // 성공 메시지
      alert('온라인 스터디가 종료되었습니다.')
      
      // 화상회의 페이지 닫기
      window.close()
      
    } catch (error) {
      console.error('세션 종료 실패:', error)
      alert('세션 종료에 실패했습니다. 다시 시도해주세요.')
    } finally {
      setIsLoading(false)
    }
  }

  // ===== LiveKit 오디오/비디오 토글 =====
  const toggleAudio = async () => {
    if (localParticipant) {
      try {
        if (isAudioEnabled) {
          await localParticipant.setMicrophoneEnabled(false)
        } else {
          await localParticipant.setMicrophoneEnabled(true)
        }
        setIsAudioEnabled(!isAudioEnabled)
      } catch (error) {
        console.error('마이크 토글 실패:', error)
      }
    }
  }

  const toggleVideo = async () => {
    if (localParticipant) {
      try {
        if (isVideoEnabled) {
          await localParticipant.setCameraEnabled(false)
        } else {
          await localParticipant.setCameraEnabled(true)
        }
        setIsVideoEnabled(!isVideoEnabled)
      } catch (error) {
        console.error('카메라 토글 실패:', error)
      }
    }
  }

  // ===== 화면 공유 토글 =====
  const toggleScreenShare = async () => {
    if (isScreenSharing) {
      await stopScreenShare()
    } else {
      await startScreenShare()
    }
  }

  // ===== 화면 공유 시작 =====
  const startScreenShare = async () => {
    try {
      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
        audio: false
      })

      setScreenShareStream(stream)
      setIsScreenSharing(true)
      setScreenShareParticipant('나')

      stream.getVideoTracks()[0].onended = () => {
        stopScreenShare()
      }

    } catch {
      setError('화면 공유를 시작할 수 없습니다.')
    }
  }

  // ===== 화면 공유 중지 =====
  const stopScreenShare = async () => {
    if (screenShareStream) {
      screenShareStream.getTracks().forEach((track: any) => track.stop())
      setScreenShareStream(null)
    }
    setIsScreenSharing(false)
    setScreenShareParticipant('')
  }

  // ===== 사이드바 관련 함수들 =====
  const toggleSidebar = (tab: 'participants' | 'chat') => {
    if (sidebarOpen && activeSidebarTab === tab) {
      setSidebarOpen(false)
      setActiveSidebarTab(null)
    } else {
      setSidebarOpen(true)
      setActiveSidebarTab(tab)
    }
  }

  const closeSidebar = () => {
    setSidebarOpen(false)
    setActiveSidebarTab(null)
  }

  const handleTabChange = (tab: 'participants' | 'chat') => {
    setActiveSidebarTab(tab)
  }

  // ===== 채팅 관련 함수들 =====
  const sendChatMessage = () => {
    if (newChatMessage.trim()) {
      const message: ChatMessage = {
        id: Date.now().toString(),
        sender: '나',
        message: newChatMessage.trim(),
        timestamp: new Date()
      }
      setChatMessages((prev: ChatMessage[]) => [...prev, message])
      setNewChatMessage('')
    }
  }

  const handleNewChatMessageChange = (message: string) => {
    setNewChatMessage(message)
  }







  // ===== 그리드 계산 =====
  const calculateGrid = () => {
    const totalParticipants = remoteParticipants.size + 1 // 원격 참가자 + 나
    
    if (totalParticipants <= 4) return { cols: 2, rows: 2 }
    if (totalParticipants <= 9) return { cols: 3, rows: 3 }
    if (totalParticipants <= 16) return { cols: 4, rows: 4 }
    return { cols: 5, rows: 4 }
  }

  const { cols, rows } = calculateGrid()

  return (
    <div className="h-screen bg-gray-900 flex overflow-hidden">
      {/* 메인 비디오 영역 */}
      <div className={`flex flex-col ${sidebarOpen ? 'w-3/4' : 'w-full'} transition-all duration-300`}>
        {/* 헤더 영역 */}
        <VideoConferenceHeader
          studyNameDisplay={studyNameDisplay}
          isDemoMode={false}
          isScreenSharing={isScreenSharing}
          screenShareParticipant={screenShareParticipant}
          isConnected={isConnected}
          onInitializeDemoMode={() => {}}
        />

        {/* 메인 콘텐츠 영역 */}
        <VideoConferenceMainContent
          isConnected={isConnected}
          isDemoMode={false}
          isScreenSharing={isScreenSharing}
          screenShareParticipant={screenShareParticipant}
          screenShareStream={screenShareStream}
          demoParticipants={[]}
          remoteParticipants={remoteParticipants}
          localVideoTrack={localParticipant?.getTrackPublication(Track.Source.Camera)?.track || null}
          isVideoEnabled={isVideoEnabled}
          participantName="나"
          remoteParticipantStates={remoteParticipantStates}
          cols={cols}
          rows={rows}
        />

        {/* 컨트롤 바 영역 */}
        <div className="bg-gray-800 border-t border-gray-700 p-3 flex-shrink-0">
          <div className="flex justify-center items-center gap-3">
            {/* 마이크 토글 버튼 */}
            <CircleButton
              variant={isAudioEnabled ? 'lightPurple' : 'red'}
              size="sm"
              onClick={toggleAudio}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z"/>
                <path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z"/>
              </svg>
            </CircleButton>

            {/* 카메라 토글 버튼 */}
            <CircleButton
              variant={isVideoEnabled ? 'lightPurple' : 'red'}
              size="sm"
              onClick={toggleVideo}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17 10.5V7c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-3.5l4 4v-11l-4 4z"/>
              </svg>
            </CircleButton>

            {/* 화면 공유 토글 버튼 */}
            <CircleButton
              variant={isScreenSharing ? 'red' : 'purple'}
              size="sm"
              onClick={toggleScreenShare}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92s2.92-1.31 2.92-2.92-1.31-2.92-2.92-2.92z"/>
              </svg>
            </CircleButton>

            {/* 사이드바 토글 버튼 */}
            <CircleButton
              variant="gray"
              size="sm"
              onClick={() => toggleSidebar('chat')}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"/>
              </svg>
            </CircleButton>

            {/* 회의 종료 버튼 */}
            <CircleButton
              variant="red"
              size="sm"
              onClick={leaveSession}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
              </svg>
            </CircleButton>

            {/* 세션 종료 버튼 */}
            <CircleButton
              variant="red"
              size="sm"
              onClick={closeSession}
              disabled={isLoading}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
              </svg>
            </CircleButton>
          </div>
        </div>
      </div>

      {/* 사이드바 */}
      <VideoConferenceSidebar
        sidebarOpen={sidebarOpen}
        activeSidebarTab={activeSidebarTab}
        isDemoMode={false}
        demoParticipants={[]}
        remoteParticipants={remoteParticipants}
        remoteParticipantStates={remoteParticipantStates}
        participantName="나"
        isAudioEnabled={isAudioEnabled}
        isVideoEnabled={isVideoEnabled}
        chatMessages={chatMessages}
        newChatMessage={newChatMessage}
        onCloseSidebar={closeSidebar}
        onTabChange={handleTabChange}
        onToggleAudio={toggleAudio}
        onToggleVideo={toggleVideo}
        onToggleDemoParticipantAudio={() => {}}
        onToggleDemoParticipantVideo={() => {}}
        onNewChatMessageChange={handleNewChatMessageChange}
        onSendChatMessage={sendChatMessage}
      />

      {/* 에러 메시지 표시 */}
      {error && (
        <div className="fixed top-4 right-4 bg-red-600 text-white px-4 py-3 rounded-lg shadow-lg z-50 max-w-md">
          <div className="whitespace-pre-line text-sm">{error}</div>
          <button
            onClick={() => setError(null)}
            className="absolute top-2 right-2 text-white hover:text-gray-300"
          >
            ✕
          </button>
        </div>
      )}

      {/* 로딩 스피너 */}
      {isLoading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 p-6 rounded-lg">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
            <p className="mt-2 text-center text-white">연결 중...</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default VideoConferencePage

