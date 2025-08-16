import React, { useEffect, useRef, useState } from 'react'
import { useParams, useLocation } from 'react-router-dom'
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

interface StudyMaterial {
  id: string
  name: string
  type: string
  url: string
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
  const [activeSidebarTab, setActiveSidebarTab] = useState<'participants' | 'chat' | 'materials' | null>(null)
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([])
  const [newChatMessage, setNewChatMessage] = useState('')
  const [studyMaterials] = useState<StudyMaterial[]>([])
  const [hasUnreadChatMessages] = useState(false)

  // ===== PDF 뷰어 모드 상태 =====
  const [isPdfViewerMode, setIsPdfViewerMode] = useState(false)
  const [currentPdfName, setCurrentPdfName] = useState<string>('')
  const [currentPdfUrl, setCurrentPdfUrl] = useState<string>('')



  // ===== refs =====
  const pdfViewerRef = useRef<HTMLIFrameElement>(null)

  const studyNameDisplay = studyName !== '스터디' ? studyName : studyId ? `스터디 ${studyId}` : '스터디'



  // ===== LiveKit 세션 초기화 =====
  const initializeLiveKitSession = async (wsUrl: string, token: string) => {
    try {
      setIsLoading(true)
      setError(null)

      console.log('🔗 LiveKit 연결 시도:')
      console.log('  - wsUrl:', wsUrl)
      console.log('  - token:', token.substring(0, 20) + '...')

      // LiveKit 서버 상태 확인
      await testLiveKitServer(wsUrl)

      const newRoom = new Room()

      // 연결 상태 이벤트 추가
      newRoom.on(RoomEvent.Connected, () => {
        console.log('✅ LiveKit 방에 성공적으로 연결됨')
        setIsConnected(true)
        setIsLoading(false)
      })

      newRoom.on(RoomEvent.Disconnected, (reason?: any) => {
        console.log('❌ LiveKit 방에서 연결 해제됨:', reason)
        setIsConnected(false)
        setRoom(null)
        setLocalParticipant(null)
        setRemoteParticipants(new Map())
      })

      newRoom.on(RoomEvent.Reconnecting, () => {
        console.log('🔄 LiveKit 재연결 중...')
        setIsLoading(true)
      })

      newRoom.on(RoomEvent.Reconnected, () => {
        console.log('✅ LiveKit 재연결 성공')
        setIsLoading(false)
      })

      // 방 이벤트 리스너 설정
      newRoom.on(RoomEvent.ParticipantConnected, (participant: RemoteParticipant) => {
        console.log('👤 참가자 연결됨:', participant.identity)
        setRemoteParticipants((prev: Map<string, RemoteParticipant>) => new Map(prev.set(participant.identity, participant)))
        setRemoteParticipantStates((prev: Map<string, {audio: boolean, video: boolean}>) => new Map(prev.set(participant.identity, {audio: true, video: true})))
      })

      newRoom.on(RoomEvent.ParticipantDisconnected, (participant: RemoteParticipant) => {
        console.log('👤 참가자 연결 해제됨:', participant.identity)
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

      newRoom.on(RoomEvent.TrackSubscribed, (track: any, _publication: any, participant: any) => {
        console.log('📹 트랙 구독됨:', track.kind, participant.identity)
        // 원격 참가자의 트랙 구독
        if (track.kind === 'video') {
          // 비디오 트랙 처리
        } else if (track.kind === 'audio') {
          // 오디오 트랙 처리
        }
      })

      newRoom.on(RoomEvent.TrackUnsubscribed, (track: any, _publication: any, participant: any) => {
        console.log('📹 트랙 구독 해제됨:', track.kind, participant.identity)
        // 트랙 구독 해제 처리
      })

      // 연결 에러 핸들링
      newRoom.on(RoomEvent.ConnectionQualityChanged, (quality: any, participant?: any) => {
        console.log('📊 연결 품질 변경:', quality, participant?.identity)
      })

      // WebSocket URL 검증 및 변환
      let validatedWsUrl = wsUrl
      if (!wsUrl.startsWith('ws://') && !wsUrl.startsWith('wss://')) {
        // HTTP/HTTPS URL을 WebSocket URL로 변환
        if (wsUrl.startsWith('https://')) {
          validatedWsUrl = wsUrl.replace('https://', 'wss://')
        } else if (wsUrl.startsWith('http://')) {
          validatedWsUrl = wsUrl.replace('http://', 'ws://')
        } else {
          // 프로토콜이 없으면 기본값으로 wss 사용
          validatedWsUrl = `wss://${wsUrl}`
        }
      }

      console.log('🔗 최종 WebSocket URL:', validatedWsUrl)

      // 방에 연결 (타임아웃 설정 추가)
      const connectPromise = newRoom.connect(validatedWsUrl, token, {
        autoSubscribe: true,
      })

      // 타임아웃 설정 (30초)
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Connection timeout')), 30000)
      })

      await Promise.race([connectPromise, timeoutPromise])

      setRoom(newRoom)
      setLocalParticipant(newRoom.localParticipant)

      // 로컬 비디오/오디오 활성화 (에러 처리 추가)
      try {
        // 단계별로 미디어 활성화
        console.log('🎥 미디어 장치 활성화 시작...')
        
        // 먼저 오디오만 활성화
        await newRoom.localParticipant.setMicrophoneEnabled(true)
        console.log('✅ 마이크 활성화 성공')
        
        // 그 다음 비디오 활성화
        await newRoom.localParticipant.setCameraEnabled(true)
        console.log('✅ 카메라 활성화 성공')
        
        console.log('✅ 모든 미디어 장치가 성공적으로 활성화됨')
      } catch (mediaError) {
        console.warn('⚠️ 미디어 장치 활성화 실패:', mediaError)
        
        // 개별 장치별로 재시도
        try {
          await newRoom.localParticipant.setMicrophoneEnabled(true)
          console.log('✅ 마이크만 활성화 성공')
        } catch (micError) {
          console.warn('⚠️ 마이크 활성화 실패:', micError)
        }
        
        try {
          await newRoom.localParticipant.setCameraEnabled(true)
          console.log('✅ 카메라만 활성화 성공')
        } catch (camError) {
          console.warn('⚠️ 카메라 활성화 실패:', camError)
        }
        
        // 미디어 권한이 없어도 화상회의 참여는 가능하도록 함
      }

    } catch (error) {
      console.error('❌ LiveKit 세션 연결 실패:', error)
      setIsLoading(false)
      
      // 구체적인 에러 메시지 제공
      let errorMessage = '화상회의에 연결할 수 없습니다.'
      
      if (error instanceof Error) {
        if (error.message.includes('Connection timeout')) {
          errorMessage = '연결 시간이 초과되었습니다. LiveKit 서버 상태를 확인해주세요.'
        } else if (error.message.includes('could not establish pc connection')) {
          errorMessage = 'LiveKit 서버에 연결할 수 없습니다.\n\n가능한 원인:\n• LiveKit 서버가 실행되지 않음\n• 네트워크 방화벽 차단\n• 잘못된 서버 URL\n• TURN 서버 설정 필요'
        } else if (error.message.includes('Unauthorized')) {
          errorMessage = '인증에 실패했습니다. 토큰을 확인해주세요.'
        } else if (error.message.includes('Room not found')) {
          errorMessage = '화상회의 방을 찾을 수 없습니다.'
        } else if (error.message.includes('Server unreachable')) {
          errorMessage = 'LiveKit 서버에 접근할 수 없습니다. 서버 주소와 포트를 확인해주세요.'
        } else {
          errorMessage = `연결 실패: ${error.message}`
        }
      }
      
      setError(errorMessage)
    }
  }

  // ===== LiveKit 서버 연결 테스트 =====
  const testLiveKitServer = async (wsUrl: string) => {
    console.log('🔍 LiveKit 서버 연결 테스트 시작...')
    
    // HTTP URL로 변환하여 서버 상태 확인
    let httpUrl = wsUrl
    if (wsUrl.startsWith('wss://')) {
      httpUrl = wsUrl.replace('wss://', 'https://')
    } else if (wsUrl.startsWith('ws://')) {
      httpUrl = wsUrl.replace('ws://', 'http://')
    }
    
    try {
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 5000)
      
      const response = await fetch(httpUrl, { 
        method: 'GET',
        signal: controller.signal
      })
      
      clearTimeout(timeoutId)
      console.log('🔗 LiveKit 서버 응답:', response.status)
    } catch (fetchError) {
      console.warn('⚠️ LiveKit 서버 연결 테스트 실패:', fetchError)
    }
  }



  // ===== 컴포넌트 마운트 시 초기화 =====
  useEffect(() => {
    // 개발 환경에서 연결 진단 실행
    if (import.meta.env.DEV) {
      diagnoseConnection()
    }

    // URL 파라미터에서 세션 정보 추출
    const urlParams = new URLSearchParams(window.location.search)
    const wsUrl = urlParams.get('wsUrl')
    const token = urlParams.get('token')
    const roomName = urlParams.get('roomName')
    const sessionId = urlParams.get('sessionId')

    // URL 파라미터로 전달된 세션 정보가 있으면 LiveKit에 연결
    if (wsUrl && token) {
      console.log('🔗 URL 파라미터에서 세션 정보 수신:')
      console.log('  - wsUrl:', wsUrl)
      console.log('  - token:', token.substring(0, 20) + '...')
      console.log('  - roomName:', roomName)
      console.log('  - sessionId:', sessionId)
      initializeLiveKitSession(wsUrl, token)
    }
    // StudyDetailPage에서 전달된 세션 정보가 있으면 LiveKit에 연결
    else if (sessionInfo) {
      console.log('🔗 state에서 세션 정보 수신:')
      console.log('  - wsUrl:', sessionInfo.wsUrl)
      console.log('  - token:', sessionInfo.token.substring(0, 20) + '...')
      console.log('  - roomName:', sessionInfo.roomName)
      console.log('  - sessionId:', sessionInfo.sessionId)
      initializeLiveKitSession(sessionInfo.wsUrl, sessionInfo.token)
    } else {
      // 세션 정보가 없으면 에러 메시지 표시
      setError('화상회의 세션 정보가 없습니다. 스터디 상세 페이지에서 화상회의를 시작해주세요.')
    }
  }, [sessionInfo])

  // ===== 네트워크 진단 함수 =====
  const diagnoseConnection = async () => {
    console.log('=== 연결 진단 시작 ===')
    
    // 1. 브라우저 WebRTC 지원 확인
    if (!window.RTCPeerConnection) {
      console.error('❌ WebRTC가 지원되지 않습니다.')
      return
    }
    console.log('✅ WebRTC 지원됨')

    // 2. 미디어 장치 권한 확인
    try {
      const devices = await navigator.mediaDevices.enumerateDevices()
      console.log('📹 미디어 장치:', devices.length, '개')
      
      // getUserMedia 테스트
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true })
      console.log('✅ 카메라/마이크 접근 가능')
      stream.getTracks().forEach(track => track.stop())
    } catch (mediaError) {
      console.warn('⚠️ 미디어 장치 접근 실패:', mediaError)
    }

    // 3. 네트워크 연결 확인
    console.log('🌐 네트워크 상태:', navigator.onLine ? '온라인' : '오프라인')
    
    // 4. 백엔드 서버 연결 확인
    try {
      const response = await fetch('/api/health', { method: 'GET' })
      console.log('🔗 백엔드 서버 상태:', response.status === 200 ? '정상' : '오류')
    } catch (backendError) {
      console.warn('⚠️ 백엔드 서버 연결 실패:', backendError)
    }
    
    // 5. STUN 서버 연결 테스트
    try {
      const pc = new RTCPeerConnection({
        iceServers: [
          { urls: 'stun:stun.l.google.com:19302' },
          { urls: 'stun:stun1.l.google.com:19302' }
        ]
      })
      
      const offer = await pc.createOffer()
      await pc.setLocalDescription(offer)
      
      // ICE 후보 수집 대기
      await new Promise((resolve) => {
        pc.onicecandidate = (event) => {
          if (event.candidate) {
            console.log('✅ ICE 후보 수집:', event.candidate.type)
          } else {
            console.log('✅ ICE 후보 수집 완료')
            resolve(true)
          }
        }
        
        // 5초 타임아웃
        setTimeout(() => {
          console.log('⚠️ ICE 후보 수집 타임아웃')
          resolve(true)
        }, 5000)
      })
      
      pc.close()
    } catch (stunError) {
      console.error('❌ STUN 서버 연결 실패:', stunError)
    }
    
    console.log('=== 연결 진단 완료 ===')
  }

  // ===== 연결 재시도 함수 =====
  const retryConnection = async () => {
    setError(null)
    await diagnoseConnection()
    
    const urlParams = new URLSearchParams(window.location.search)
    const wsUrl = urlParams.get('wsUrl')
    const token = urlParams.get('token')

    if (wsUrl && token) {
      await initializeLiveKitSession(wsUrl, token)
    } else if (sessionInfo) {
      await initializeLiveKitSession(sessionInfo.wsUrl, sessionInfo.token)
    }
  }

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
  const toggleSidebar = (tab: 'participants' | 'chat' | 'materials') => {
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

  const handleTabChange = (tab: 'participants' | 'chat' | 'materials') => {
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

  // ===== 공부자료 관련 함수들 =====
  const handleMaterialClick = (material: StudyMaterial) => {
    if (material.type === 'pdf') {
      setIsPdfViewerMode(true)
      setCurrentPdfName(material.name)
      setCurrentPdfUrl(material.url)
      setSidebarOpen(false)
      setActiveSidebarTab(null)
    } else {
      alert(`${material.name}은 PDF 파일이 아닙니다.`)
    }
  }

  const exitPdfViewerMode = () => {
    setIsPdfViewerMode(false)
    setCurrentPdfName('')
    setCurrentPdfUrl('')
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
          isPdfViewerMode={isPdfViewerMode}
          isScreenSharing={isScreenSharing}
          screenShareParticipant={screenShareParticipant}
          currentPdfName={currentPdfName}
          isConnected={isConnected}
          onInitializeDemoMode={() => {}}
          onExitPdfViewerMode={exitPdfViewerMode}
        />

        {/* 메인 콘텐츠 영역 */}
        <VideoConferenceMainContent
          isConnected={isConnected}
          isDemoMode={false}
          isPdfViewerMode={isPdfViewerMode}
          isScreenSharing={isScreenSharing}
          screenShareParticipant={screenShareParticipant}
          screenShareStream={screenShareStream}
          demoParticipants={[]}
          remoteParticipants={remoteParticipants}
          localVideoTrack={localParticipant?.getTrackPublication(Track.Source.Camera)?.track || null}
          isVideoEnabled={isVideoEnabled}
          participantName="나"
          remoteParticipantStates={remoteParticipantStates}
          currentPdfUrl={currentPdfUrl}
          currentPdfName={currentPdfName}
          cols={cols}
          rows={rows}
          pdfViewerRef={pdfViewerRef}
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
              onClick={() => toggleSidebar('participants')}
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
        studyMaterials={studyMaterials}
        hasUnreadChatMessages={hasUnreadChatMessages}
        onCloseSidebar={closeSidebar}
        onTabChange={handleTabChange}
        onToggleAudio={toggleAudio}
        onToggleVideo={toggleVideo}
        onToggleDemoParticipantAudio={() => {}}
        onToggleDemoParticipantVideo={() => {}}
        onNewChatMessageChange={handleNewChatMessageChange}
        onSendChatMessage={sendChatMessage}
        onMaterialClick={handleMaterialClick}
      />

      {/* 에러 메시지 표시 */}
      {error && (
        <div className="fixed top-4 right-4 bg-red-600 text-white px-4 py-3 rounded-lg shadow-lg z-50 max-w-md">
          <div className="whitespace-pre-line text-sm mb-3">{error}</div>
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={retryConnection}
              className="bg-red-700 hover:bg-red-800 text-white px-3 py-1 rounded text-sm transition-colors"
            >
              다시 시도
            </button>
            <button
              onClick={diagnoseConnection}
              className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm transition-colors"
            >
              연결 진단
            </button>
            <button
              onClick={() => setError(null)}
              className="bg-gray-600 hover:bg-gray-700 text-white px-3 py-1 rounded text-sm transition-colors"
            >
              닫기
            </button>
          </div>
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

