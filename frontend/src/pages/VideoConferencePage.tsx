import React, { useEffect, useRef, useState } from 'react'
import { useParams, useSearchParams } from 'react-router-dom'
import { Room, RoomEvent, RemoteParticipant, LocalParticipant, connect } from 'livekit-client'
import CircleButton from '../components/atoms/CircleButton'

interface VideoConferencePageProps {
  studyId?: number
  studyName?: string
}

const VideoConferencePage: React.FC<VideoConferencePageProps> = ({
  studyId: propStudyId,
  studyName = '스터디'
}) => {
  const { studyId: urlStudyId } = useParams<{ studyId: string }>()
  const [searchParams] = useSearchParams()
  const studyId = propStudyId || (urlStudyId ? parseInt(urlStudyId) : undefined)

  // 🆕 LiveKit 관련 상태
  const [room, setRoom] = useState<Room | null>(null)
  const [localParticipant, setLocalParticipant] = useState<LocalParticipant | null>(null)
  const [remoteParticipants, setRemoteParticipants] = useState<RemoteParticipant[]>([])
  const [isConnected, setIsConnected] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isScreenSharing, setIsScreenSharing] = useState(false)
  const [screenShareStream, setScreenShareStream] = useState<MediaStream | null>(null)

  // 오디오/비디오 상태 관리
  const [isAudioEnabled, setIsAudioEnabled] = useState(true)
  const [isVideoEnabled, setIsVideoEnabled] = useState(true)

  // 사이드바 상태 관리
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [activeSidebarTab, setActiveSidebarTab] = useState<'participants' | 'chat' | 'materials' | null>(null)
  const [chatMessages, setChatMessages] = useState<Array<{id: string, sender: string, message: string, timestamp: Date}>>([])
  const [newChatMessage, setNewChatMessage] = useState('')
  const [studyMaterials, setStudyMaterials] = useState<Array<{id: string, name: string, type: string, url: string}>>([])

  // PDF 뷰어 모드 상태
  const [isPdfViewerMode, setIsPdfViewerMode] = useState(false)
  const [currentPdfUrl, setCurrentPdfUrl] = useState<string>('')
  const [currentPdfName, setCurrentPdfName] = useState<string>('')

  const videoRef = useRef<HTMLVideoElement>(null)
  const subscribersRef = useRef<HTMLDivElement>(null)
  const screenShareVideoRef = useRef<HTMLVideoElement>(null)
  const chatInputRef = useRef<HTMLInputElement>(null)
  const pdfViewerRef = useRef<HTMLIFrameElement>(null)

  // 🆕 URL 파라미터에서 LiveKit 정보 추출
  const token = searchParams.get('token')
  const wsUrl = searchParams.get('wsUrl')
  const roomName = searchParams.get('roomName')
  const displayName = searchParams.get('displayName')
  
  const studyNameDisplay = studyName !== '스터디' ? studyName : studyId ? `스터디 ${studyId}` : '스터디'

  // 사이드바 토글 함수
  const toggleSidebar = (tab: 'participants' | 'chat' | 'materials') => {
    if (sidebarOpen) {
      // 사이드바가 열려있으면 닫기
      setSidebarOpen(false)
      setActiveSidebarTab(null)
    } else {
      // 사이드바가 닫혀있으면 열기 (기본값: participants)
      setSidebarOpen(true)
      setActiveSidebarTab(tab || 'participants')
    }
  }

  // 채팅 메시지 전송
  const sendChatMessage = () => {
    if (newChatMessage.trim()) {
      const message = {
        id: Date.now().toString(),
        sender: '나',
        message: newChatMessage.trim(),
        timestamp: new Date()
      };
      setChatMessages(prev => [...prev, message])
      setNewChatMessage('')
    }
  }

  // 채팅 입력 키 이벤트 처리
  const handleChatKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      sendChatMessage();
    }
  };

  // 공부자료 목록 (실제 API에서 가져올 예정)
  useEffect(() => {
    setStudyMaterials([
      { id: '1', name: 'React 기초 강의.pdf', type: 'pdf', url: '/src/assets/pdfs/cats-and-dogs.pdf' },
      { id: '2', name: 'TypeScript 핵심 개념.pptx', type: 'ppt', url: '#' },
      { id: '3', name: '프로젝트 기획서.docx', type: 'doc', url: '#' },
      { id: '4', name: '코딩 테스트 문제집.pdf', type: 'pdf', url: '/src/assets/pdfs/hamburger.pdf' },
    ]);
  }, []);

  // 공부자료 클릭 핸들러
  const handleMaterialClick = (material: {id: string, name: string, type: string, url: string}) => {
    if (material.type === 'pdf') {
      setIsPdfViewerMode(true);
      // 실제 PDF URL 설정
      let pdfUrl = material.url;
      if (material.url === '/src/assets/pdfs/cats-and-dogs.pdf') {
        pdfUrl = '/src/assets/pdfs/cats-and-dogs.pdf';
      } else if (material.url === '/src/assets/pdfs/hamburger.pdf') {
        pdfUrl = '/src/assets/pdfs/hamburger.pdf';
      } else {
        // 기본 PDF URL (실제 프로젝트에서는 서버에서 가져와야 함)
        pdfUrl = material.url || `https://example.com/pdfs/${material.name}`;
      }
      setCurrentPdfUrl(pdfUrl);
      setCurrentPdfName(material.name);

      // 다른 참가자들에게 PDF 뷰어 모드 공유
      // if (session) {
      //   session.signal({
      //     data: JSON.stringify({
      //       type: 'pdf-viewer-mode',
      //       action: 'enter',
      //       pdfUrl: pdfUrl,
      //       pdfName: material.name
      //     })
      //   });
      // }

      // 사이드바 닫기
      setSidebarOpen(false);
      setActiveSidebarTab(null);
    } else {
      // PDF가 아닌 경우 알림
      alert(`${material.name}은 PDF 파일이 아닙니다.`);
    }
  };

  // PDF 뷰어 모드 종료
  const exitPdfViewerMode = () => {
    setIsPdfViewerMode(false);
    setCurrentPdfUrl('');
    setCurrentPdfName('');

    // 라이브 세션에서 PDF 뷰어 모드 종료 신호 전송
    // if (session) {
    //   session.signal({
    //     data: JSON.stringify({
    //       type: 'pdf-viewer-mode',
    //       action: 'exit'
    //     })
    //   });
    // }
  };

  // PDF 뷰어 상태 동기화 체크 (실제 세션에서 사용)
  useEffect(() => {
    if (room) {
      // 실제 OpenVidu 세션에서 PDF 뷰어 상태 동기화
      // TODO: 백엔드 API 연동 후 구현
    }
  }, [room]);

  const getGridLayout = (totalParticipants: number) => {
    if (totalParticipants <= 1) return { cols: 1, rows: 1 };
    if (totalParticipants === 2) return { cols: 2, rows: 1 };
    if (totalParticipants === 3) return { cols: 3, rows: 1 };
    if (totalParticipants === 4) return { cols: 2, rows: 2 };
    if (totalParticipants <= 6) return { cols: 3, rows: 2 };
    if (totalParticipants <= 8) return { cols: 4, rows: 2 };
    return { cols: 4, rows: Math.ceil(totalParticipants / 4) };
  };

  const initializeSession = async () => {
    if (!token || !wsUrl || !roomName) {
      setError('화상회의 연결 정보가 없습니다.')
      return
    }

    try {
      setIsLoading(true)
      setError(null)

      // LiveKit 방에 연결
      const newRoom = new Room({
        adaptiveStream: true,
        dynacast: true,
      })

      // 방 이벤트 리스너 설정
      newRoom.on(RoomEvent.ParticipantConnected, (participant: RemoteParticipant) => {
        setRemoteParticipants(prev => [...prev, participant])
      })

      newRoom.on(RoomEvent.ParticipantDisconnected, (participant: RemoteParticipant) => {
        setRemoteParticipants(prev => prev.filter(p => p !== participant))
      })

      newRoom.on(RoomEvent.TrackSubscribed, (track, publication, participant) => {
        // 원격 참가자의 트랙 구독
        if (track.kind === 'video') {
          // 비디오 트랙 처리
        } else if (track.kind === 'audio') {
          // 오디오 트랙 처리
        }
      })

      newRoom.on(RoomEvent.TrackUnsubscribed, (track, publication, participant) => {
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
    } finally {
      setIsLoading(false)
    }
  }

  // 🆕 LiveKit 방 연결 (컴포넌트 마운트 시)
  useEffect(() => {
    if (token && wsUrl && roomName) {
      initializeSession()
    } else {
      setError('화상회의 연결 정보가 부족합니다.')
    }

    return () => {
      if (room) {
        room.disconnect()
      }
      if (screenShareStream) {
        screenShareStream.getTracks().forEach(track => track.stop())
      }
    }
  }, [token, wsUrl, roomName])

  // 🆕 로컬 참가자 비디오 트랙 연결
  useEffect(() => {
    if (localParticipant && videoRef.current) {
      localParticipant.videoTrack?.addSink(videoRef.current)
    }
  }, [localParticipant])

  // 🆕 원격 참가자 비디오 트랙 연결
  useEffect(() => {
    if (subscribersRef.current && remoteParticipants.length > 0) {
      const videoElements = subscribersRef.current.querySelectorAll('video')
      remoteParticipants.forEach((participant, index) => {
        const videoElement = videoElements[index] as HTMLVideoElement
        if (videoElement && participant) {
          participant.videoTrack?.addSink(videoElement)
        }
      })
    }
  }, [remoteParticipants])

  // 🆕 LiveKit 방 연결 해제
  const leaveSession = () => {
    if (room) {
      room.disconnect()
    }
    if (isScreenSharing) {
      stopScreenShare()
    }
    setRoom(null)
    setLocalParticipant(null)
    setRemoteParticipants([])
    setIsConnected(false)
    // 오디오/비디오 상태 초기화
    setIsAudioEnabled(true)
    setIsVideoEnabled(true)
  }

  // 🆕 LiveKit 오디오/비디오 토글
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

  const toggleScreenShare = async () => {
    if (isScreenSharing) {
      await stopScreenShare()
    } else {
      await startScreenShare()
    }
  }

  const startScreenShare = async () => {
    try {
      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
        audio: false
      })

      setScreenShareStream(stream)
      setIsScreenSharing(true)

      if (screenShareVideoRef.current) {
        screenShareVideoRef.current.srcObject = stream
      }

      stream.getVideoTracks()[0].onended = () => {
        stopScreenShare()
      }

    } catch {
      setError('화면 공유를 시작할 수 없습니다.')
    }
  }

  const stopScreenShare = async () => {
    if (screenShareStream) {
      screenShareStream.getTracks().forEach(track => track.stop())
      setScreenShareStream(null)
    }
    setIsScreenSharing(false)

    if (screenShareVideoRef.current) {
      screenShareVideoRef.current.srcObject = null
    }
  }

  // 🆕 LiveKit 참가자 목록 (로컬 + 원격)
  const allParticipants = localParticipant ? [localParticipant, ...remoteParticipants] : remoteParticipants
  const { cols, rows } = getGridLayout(allParticipants.length)

  // 사이드바 렌더링
  const renderSidebar = () => {
    if (!sidebarOpen || !activeSidebarTab) return null;

    return (
      <div className="w-1/4 bg-gray-800 border-l border-gray-700 flex flex-col">
        {/* 사이드바 헤더 */}
        <div className="p-3 border-b border-gray-700 flex justify-between items-center">
          <h3 className="text-white font-semibold">
            {activeSidebarTab === 'participants' && '참가자 목록'}
            {activeSidebarTab === 'chat' && '채팅'}
            {activeSidebarTab === 'materials' && '공부자료'}
          </h3>
          <button
            onClick={() => {
              setSidebarOpen(false);
              setActiveSidebarTab(null);
            }}
            className="text-gray-400 hover:text-white"
          >
            ✕
          </button>
        </div>

        {/* 탭 네비게이션 */}
        <div className="flex border-b border-gray-700 bg-gray-800">
          <button
            onClick={() => setActiveSidebarTab('participants')}
            className={`flex-1 py-3 px-3 text-sm font-medium transition-all duration-200 ${
              activeSidebarTab === 'participants'
                ? 'text-blue-400 border-b-2 border-blue-400 bg-gray-700 shadow-inner'
                : 'text-gray-400 hover:text-white hover:bg-gray-700'
            }`}
          >
            <div className="flex items-center justify-center gap-2">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M16 4c0-1.11.89-2 2-2s2 .89 2 2-.89 2-2 2-2-.89-2-2zm4 18v-6h2.5l-2.54-7.63A1.5 1.5 0 0 0 18.54 8H17c-.8 0-1.54.37-2.01 1l-1.7 2.26V16h-1.5v6h5z"/>
                <path d="M12.5 11.5c.83 0 1.5-.67 1.5-1.5s-.67-1.5-1.5-1.5S11 9.17 11 10s.67 1.5 1.5 1.5zM5.5 6c1.11 0 2-.89 2-2s-.89-2-2-2-2 .89-2 2 .89 2 2 2zm2 16v-7H9V9c0-1.1-.9-2-2-2H4c-1.1 0-2 .9-2 2v6h1.5v7h4z"/>
              </svg>
              참가자
            </div>
          </button>
          <button
            onClick={() => setActiveSidebarTab('chat')}
            className={`flex-1 py-3 px-3 text-sm font-medium transition-all duration-200 ${
              activeSidebarTab === 'chat'
                ? 'text-blue-400 border-b-2 border-blue-400 bg-gray-700 shadow-inner'
                : 'text-gray-400 hover:text-white hover:bg-gray-700'
            }`}
          >
            <div className="flex items-center justify-center gap-2">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM6 9h12v2H6V9zm8 5H6v-2h8v2zm4-6H6V6h12v2z"/>
              </svg>
              채팅
            </div>
          </button>
          <button
            onClick={() => setActiveSidebarTab('materials')}
            className={`flex-1 py-3 px-3 text-sm font-medium transition-all duration-200 ${
              activeSidebarTab === 'materials'
                ? 'text-blue-400 border-b-2 border-blue-400 bg-gray-700 shadow-inner'
                : 'text-gray-400 hover:text-white hover:bg-gray-700'
            }`}
          >
            <div className="flex items-center justify-center gap-2">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6zM6 20V4h7v5h5v11H6z"/>
              </svg>
              자료
            </div>
          </button>
        </div>

        {/* 사이드바 내용 */}
        <div className="flex-1 overflow-hidden">
          {activeSidebarTab === 'participants' && (
            <div className="p-3">
              <div className="space-y-2">
                {/* 내 정보 */}
                <div className="flex items-center space-x-2 p-2 bg-gray-700 rounded">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-white text-sm">나 ({displayName || '나'})</span>
                </div>

                {/* 원격 참가자들 */}
                {remoteParticipants.map((participant, index) => (
                  <div key={participant.identity} className="flex items-center space-x-2 p-2 bg-gray-700 rounded">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-white text-sm">{participant.identity || `참가자 ${index + 1}`}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeSidebarTab === 'chat' && (
            <div className="flex flex-col h-full">
              {/* 채팅 메시지 영역 */}
              <div className="flex-1 p-3 overflow-y-auto space-y-2">
                {chatMessages.map((msg) => (
                  <div key={msg.id} className="bg-gray-700 p-2 rounded">
                    <div className="flex justify-between items-start">
                      <span className="text-blue-400 text-xs font-medium">{msg.sender}</span>
                      <span className="text-gray-400 text-xs">
                        {msg.timestamp.toLocaleTimeString()}
                      </span>
                    </div>
                    <p className="text-white text-sm mt-1">{msg.message}</p>
                  </div>
                ))}
              </div>

              {/* 채팅 입력 영역 */}
              <div className="p-3 border-t border-gray-700">
                <div className="flex space-x-2">
                  <input
                    ref={chatInputRef}
                    type="text"
                    value={newChatMessage}
                    onChange={(e) => setNewChatMessage(e.target.value)}
                    onKeyPress={handleChatKeyPress}
                    placeholder="메시지를 입력하세요..."
                    className="flex-1 bg-gray-700 text-white px-3 py-2 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    onClick={sendChatMessage}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded text-sm"
                  >
                    전송
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeSidebarTab === 'materials' && (
            <div className="p-3">
              <div className="space-y-2">
                {studyMaterials.map((material) => (
                  <div
                    key={material.id}
                    className="flex items-center space-x-2 p-2 bg-gray-700 rounded hover:bg-gray-600 cursor-pointer"
                    onClick={() => handleMaterialClick(material)}
                  >
                    <span className="text-blue-400">
                      {material.type === 'pdf' && '📄'}
                      {material.type === 'ppt' && '📊'}
                      {material.type === 'doc' && '📝'}
                    </span>
                    <span className="text-white text-sm">{material.name}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="h-screen bg-gray-900 flex overflow-hidden">
      {/* 메인 비디오 영역 */}
      <div className={`flex flex-col ${sidebarOpen ? 'w-3/4' : 'w-full'} transition-all duration-300`}>
        <div className="bg-gray-800 text-white p-3 border-b border-gray-700 flex-shrink-0">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-lg font-bold">
                {studyNameDisplay}
                {isPdfViewerMode && <span className="ml-2 text-blue-400 text-sm">(PDF 뷰어 모드)</span>}
              </h1>
              {isPdfViewerMode && (
                <p className="text-sm text-gray-400">
                  현재 보고 있는 자료: {currentPdfName}
                </p>
              )}
            </div>
            {isPdfViewerMode && (
              <button
                onClick={exitPdfViewerMode}
                className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-xs"
              >
                PDF 뷰어 종료
              </button>
            )}
          </div>
        </div>

        <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
          {isScreenSharing && (
            <div className="absolute inset-0 bg-black z-10 flex items-center justify-center">
              <div className="relative w-full h-full">
                <video
                  ref={screenShareVideoRef}
                  autoPlay
                  playsInline
                  className="w-full h-full object-contain"
                />
                <button
                  onClick={stopScreenShare}
                  className="absolute top-4 right-4 bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm"
                >
                  화면 공유 중지
                </button>
              </div>
            </div>
          )}

          {/* {isConnected && (allParticipants.length > 0) && ( */}
          {/* TODO: 백엔드 API 연동 후 실제 연결 상태 확인 */}
          <div className="flex-1 flex items-center justify-center p-2 min-h-0 overflow-hidden">
            <div className="text-center text-white">
              <div className="text-6xl mb-4">📹</div>
              <h3 className="text-lg font-semibold mb-2">화상회의 준비 중</h3>
              <p className="text-gray-400">
                백엔드 API 연동 후 화상회의 기능을 사용할 수 있습니다.
              </p>
            </div>
          </div>
          {/* )} */}
        </div>

        {/* {isConnected && ( */}
        {/* TODO: 백엔드 API 연동 후 실제 연결 상태 확인 */}
        <div className="bg-gray-800 border-t border-gray-700 p-3 flex-shrink-0">
          <div className="flex justify-center items-center gap-3">
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

            <CircleButton
              variant={isVideoEnabled ? 'lightPurple' : 'red'}
              size="sm"
              onClick={toggleVideo}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17 10.5V7c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-3.5l4 4v-11l-4 4z"/>
              </svg>
            </CircleButton>

            <CircleButton
              variant={isScreenSharing ? 'red' : 'purple'}
              size="sm"
              onClick={toggleScreenShare}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92s2.92-1.31 2.92-2.92-1.31-2.92-2.92-2.92z"/>
              </svg>
            </CircleButton>

            <CircleButton
              variant="gray"
              size="sm"
              onClick={() => toggleSidebar('participants')}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"/>
              </svg>
            </CircleButton>

            <CircleButton
              variant="red"
              size="sm"
              onClick={leaveSession}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
              </svg>
            </CircleButton>
          </div>
        </div>
        {/* )} */}
      </div>

      {/* 사이드바 */}
      {renderSidebar()}

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
