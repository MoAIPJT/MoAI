import React, { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { OpenVidu, Session, Publisher, Subscriber } from 'openvidu-browser';
import axios from 'axios';
import CircleButton from '../components/atoms/CircleButton';

interface VideoConferencePageProps {
  studyId?: number;
  studyName?: string;
}

const VideoConferencePage: React.FC<VideoConferencePageProps> = ({ 
  studyId: propStudyId, 
  studyName = '스터디' 
}) => {
  const { studyId: urlStudyId } = useParams<{ studyId: string }>();
  const studyId = propStudyId || (urlStudyId ? parseInt(urlStudyId) : undefined);
  
  const [session, setSession] = useState<Session | null>(null);
  const [publisher, setPublisher] = useState<Publisher | null>(null);
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [screenShareStream, setScreenShareStream] = useState<MediaStream | null>(null);
  const [isDemoMode, setIsDemoMode] = useState(false);
  const [demoParticipants, setDemoParticipants] = useState<Array<{id: string, name: string, hasAudio: boolean, hasVideo: boolean}>>([]);
  
  // 오디오/비디오 상태 관리
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  
  // 사이드바 상태 관리
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeSidebarTab, setActiveSidebarTab] = useState<'participants' | 'chat' | 'materials' | null>(null);
  const [chatMessages, setChatMessages] = useState<Array<{id: string, sender: string, message: string, timestamp: Date}>>([]);
  const [newChatMessage, setNewChatMessage] = useState('');
  const [studyMaterials, setStudyMaterials] = useState<Array<{id: string, name: string, type: string, url: string}>>([]);
  
  // PDF 뷰어 모드 상태
  const [isPdfViewerMode, setIsPdfViewerMode] = useState(false);
  const [currentPdfUrl, setCurrentPdfUrl] = useState<string>('');
  const [currentPdfName, setCurrentPdfName] = useState<string>('');
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const subscribersRef = useRef<HTMLDivElement>(null);
  const screenShareVideoRef = useRef<HTMLVideoElement>(null);
  const demoVideoRefs = useRef<{ [key: string]: HTMLVideoElement | null }>({});
  const chatInputRef = useRef<HTMLInputElement>(null);
  const pdfViewerRef = useRef<HTMLIFrameElement>(null);

  // OpenVidu 서버 설정 (3.x 버전 - LiveKit 기반)
  const OPENVIDU_SERVER_URL = "/api"; // Vite proxy를 통해 접근
  const OPENVIDU_API_KEY = "devkey"; // OpenVidu 3.x 기본 API 키
  const OPENVIDU_API_SECRET = "secret"; // OpenVidu 3.x 기본 API 시크릿
  const sessionId = studyId ? `study-${studyId}` : `session-${Date.now()}`;
  const studyNameDisplay = studyName !== '스터디' ? studyName : studyId ? `스터디 ${studyId}` : '스터디';

  // 사이드바 토글 함수
  const toggleSidebar = (tab: 'participants' | 'chat' | 'materials') => {
    if (sidebarOpen) {
      // 사이드바가 열려있으면 닫기
      setSidebarOpen(false);
      setActiveSidebarTab(null);
    } else {
      // 사이드바가 닫혀있으면 열기 (기본값: participants)
      setSidebarOpen(true);
      setActiveSidebarTab(tab || 'participants');
    }
  };

  // 채팅 메시지 전송
  const sendChatMessage = () => {
    if (newChatMessage.trim()) {
      const message = {
        id: Date.now().toString(),
        sender: '나',
        message: newChatMessage.trim(),
        timestamp: new Date()
      };
      setChatMessages(prev => [...prev, message]);
      setNewChatMessage('');
      
      // 데모 모드에서는 자동 응답
      if (isDemoMode) {
        setTimeout(() => {
          const responses = [
            '네, 알겠습니다!',
            '좋은 아이디어네요!',
            '그 부분 다시 설명해주세요.',
            '잘 이해했습니다.'
          ];
          const demoResponse = {
            id: (Date.now() + 1).toString(),
            sender: '김철수',
            message: responses[Math.floor(Math.random() * responses.length)],
            timestamp: new Date()
          };
          setChatMessages(prev => [...prev, demoResponse]);
        }, 1000);
      }
    }
  };

  // 채팅 엔터키 처리
  const handleChatKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      sendChatMessage();
    }
  };

  // 데모용 공부자료 목록
  useEffect(() => {
    if (isDemoMode) {
      setStudyMaterials([
        { id: '1', name: 'React 기초 강의.pdf', type: 'pdf', url: '/src/assets/pdfs/cats-and-dogs.pdf' },
        { id: '2', name: 'TypeScript 핵심 개념.pptx', type: 'ppt', url: '#' },
        { id: '3', name: '프로젝트 기획서.docx', type: 'doc', url: '#' },
        { id: '4', name: '코딩 테스트 문제집.pdf', type: 'pdf', url: '/src/assets/pdfs/hamburger.pdf' },
      ]);
    }
  }, [isDemoMode]);

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
      if (session && !isDemoMode) {
        session.signal({
          data: JSON.stringify({
            type: 'pdf-viewer-mode',
            action: 'enter',
            pdfUrl: pdfUrl,
            pdfName: material.name
          })
        });
      } else if (isDemoMode) {
        // 데모 모드에서는 로컬 스토리지를 통해 시뮬레이션
        localStorage.setItem('demo-pdf-viewer', JSON.stringify({
          pdfUrl: pdfUrl,
          pdfName: material.name,
          timestamp: Date.now()
        }));
      }
      
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
    if (session && !isDemoMode) {
      session.signal({
        data: JSON.stringify({
          type: 'pdf-viewer-mode',
          action: 'exit'
        })
      });
    } else if (isDemoMode) {
      // 데모 모드에서는 localStorage에서 제거
      localStorage.removeItem('demo-pdf-viewer');
    }
  };

  // 데모 모드에서 PDF 뷰어 상태 동기화 체크
  useEffect(() => {
    if (isDemoMode) {
      const checkDemoPdfViewer = () => {
        const demoPdfViewer = localStorage.getItem('demo-pdf-viewer');
        if (demoPdfViewer) {
          try {
            const data = JSON.parse(demoPdfViewer);
            setIsPdfViewerMode(true);
            setCurrentPdfUrl(data.pdfUrl);
            setCurrentPdfName(data.pdfName);
          } catch (error) {
            console.error('데모 PDF 뷰어 데이터 파싱 실패:', error);
          }
        } else {
          setIsPdfViewerMode(false);
          setCurrentPdfUrl('');
          setCurrentPdfName('');
        }
      };

      const interval = setInterval(checkDemoPdfViewer, 1000);
      return () => clearInterval(interval);
    }
  }, [isDemoMode]);

  const getGridLayout = (totalParticipants: number) => {
    if (totalParticipants <= 1) return { cols: 1, rows: 1 };
    if (totalParticipants === 2) return { cols: 2, rows: 1 };
    if (totalParticipants === 3) return { cols: 3, rows: 1 };
    if (totalParticipants === 4) return { cols: 2, rows: 2 };
    if (totalParticipants <= 6) return { cols: 3, rows: 2 };
    if (totalParticipants <= 8) return { cols: 4, rows: 2 };
    return { cols: 4, rows: Math.ceil(totalParticipants / 4) };
  };

  // 데모 모드 초기화
  const initializeDemoMode = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // 가상 참가자 생성
      const demoUsers = [
        { id: 'demo-1', name: '김철수', hasAudio: true, hasVideo: true },
        { id: 'demo-2', name: '이영희', hasAudio: false, hasVideo: true },
        { id: 'demo-3', name: '박민수', hasAudio: true, hasVideo: false },
      ];
      setDemoParticipants(demoUsers);

      // 데모 비디오 스트림 생성 (색상 패턴)
      const createDemoVideo = (canvas: HTMLCanvasElement, color: string) => {
        const ctx = canvas.getContext('2d')!;
        canvas.width = 640;
        canvas.height = 480;
        
        let frame = 0;
        const animate = () => {
          ctx.fillStyle = color;
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          
          // 움직이는 패턴 추가
          ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
          ctx.fillRect(
            (frame * 2) % canvas.width, 
            (frame * 1.5) % canvas.height, 
            100, 
            100
          );
          
          frame++;
          requestAnimationFrame(animate);
        };
        animate();
        
        return canvas.captureStream(30);
      };

      // 각 데모 참가자에 대한 비디오 스트림 생성
      setTimeout(() => {
        demoUsers.forEach((user, index) => {
          const canvas = document.createElement('canvas');
          const colors = ['#4F46E5', '#7C3AED', '#059669'];
          const stream = createDemoVideo(canvas, colors[index % colors.length]);
          
          const videoElement = demoVideoRefs.current[user.id];
          if (videoElement) {
            videoElement.srcObject = stream;
          }
        });
      }, 1000);

      setIsConnected(true);
      setIsDemoMode(true);
      console.log('✅ 데모 모드 시작');

    } catch (err) {
      console.error('데모 모드 초기화 오류:', err);
      setError('데모 모드를 초기화할 수 없습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // URL 파라미터로 데모 모드 확인
    const urlParams = new URLSearchParams(window.location.search);
    const demo = urlParams.get('demo');
    
    if (demo === 'true') {
      initializeDemoMode();
    } else {
      initializeSession();
    }

    return () => {
      if (session) session.disconnect();
      if (screenShareStream) {
        screenShareStream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  useEffect(() => {
    if (publisher && videoRef.current) {
      publisher.addVideoElement(videoRef.current);
    }
  }, [publisher]);

  useEffect(() => {
    if (subscribersRef.current && subscribers.length > 0) {
      const videoElements = subscribersRef.current.querySelectorAll('video');
      subscribers.forEach((subscriber, index) => {
        const videoElement = videoElements[index + (publisher ? 1 : 0)] as HTMLVideoElement;
        if (videoElement && subscriber) {
          subscriber.addVideoElement(videoElement);
        }
      });
    }
  }, [subscribers, publisher]);

  const initializeSession = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const OV = new OpenVidu();
      const newSession = OV.initSession();
      setSession(newSession);

      // 다른 참가자 구독 (제공된 예시와 일치)
      newSession.on('streamCreated', (event: any) => {
        const subscriber = newSession.subscribe(event.stream);
        setSubscribers((prev) => [...prev, subscriber]);
      });

      newSession.on('streamDestroyed', (event: any) => {
        setSubscribers((prev) => 
          prev.filter((sub) => sub.stream.streamId !== event.stream.streamId)
        );
      });

      // PDF 뷰어 모드 시그널 처리
      newSession.on('signal', (event: any) => {
        try {
          const signalData = JSON.parse(event.data);
          if (signalData.type === 'pdf-viewer-mode') {
            if (signalData.action === 'enter') {
              setIsPdfViewerMode(true);
              setCurrentPdfUrl(signalData.pdfUrl);
              setCurrentPdfName(signalData.pdfName);
              setSidebarOpen(false);
              setActiveSidebarTab(null);
            } else if (signalData.action === 'exit') {
              setIsPdfViewerMode(false);
              setCurrentPdfUrl('');
              setCurrentPdfName('');
            }
          }
        } catch (error) {
          console.error('시그널 데이터 파싱 오류:', error);
        }
      });

      newSession.on('exception', (exception: any) => {
        console.error('OpenVidu 예외:', exception);
        setError('세션 연결 중 오류가 발생했습니다.');
      });

    } catch (err) {
      console.error('세션 초기화 오류:', err);
      setError('세션을 초기화할 수 없습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  // OpenVidu REST API를 통해 세션 생성 (axios 사용)
  const createSession = async (sessionId: string) => {
    try {
      console.log('세션 생성 요청:', `${OPENVIDU_SERVER_URL}/sessions`, { customSessionId: sessionId });
      
      const response = await axios.post(
        `${OPENVIDU_SERVER_URL}/sessions`,
        { customSessionId: sessionId },
        {
          headers: {
            Authorization: "Basic " + btoa(`OPENVIDUAPP:${OPENVIDU_API_SECRET}`),
            "Content-Type": "application/json",
          },
        }
      );

      console.log('세션 생성 성공:', response.data);
      return response.data;
    } catch (err: any) {
      console.error('세션 생성 오류:', err);
      console.error('응답 데이터:', err.response?.data);
      throw err;
    }
  };

  // OpenVidu REST API를 통해 토큰 생성 (axios 사용)
  const createToken = async (sessionId: string) => {
    try {
      console.log('토큰 생성 요청:', `${OPENVIDU_SERVER_URL}/sessions/${sessionId}/connections`);
      
      const response = await axios.post(
        `${OPENVIDU_SERVER_URL}/sessions/${sessionId}/connections`,
        {},
        {
          headers: {
            Authorization: "Basic " + btoa(`OPENVIDUAPP:${OPENVIDU_API_SECRET}`),
            "Content-Type": "application/json",
          },
        }
      );

      console.log('토큰 생성 성공:', response.data);
      return response.data;
    } catch (err: any) {
      console.error('토큰 생성 오류:', err);
      console.error('응답 데이터:', err.response?.data);
      throw err;
    }
  };

  const joinSession = async () => {
    if (!session) return;

    try {
      setIsLoading(true);
      setError(null);

      console.log('세션 참가 시작:', sessionId);

      // 1. 세션 생성 (없으면 새로 생성)
      try {
        await createSession(sessionId);
        console.log('세션 생성 완료 또는 이미 존재');
      } catch (err: any) {
        // 세션이 이미 존재하는 경우는 무시
        if (err.response?.status === 409) {
          console.log('세션이 이미 존재함');
        } else {
          throw err;
        }
      }

      // 2. 토큰 생성
      const tokenData = await createToken(sessionId);
      console.log('토큰 생성 완료:', tokenData);

      // 3. 세션 연결 (제공된 예시와 일치)
      await session.connect(tokenData.token);
      console.log('세션 연결 완료');

      // 4. 퍼블리셔 생성
      await createPublisher();
      console.log('퍼블리셔 생성 완료');

      setIsConnected(true);
      console.log('✅ OpenVidu 세션 연결 성공');

    } catch (err: any) {
      console.error('❌ OpenVidu 연결 실패:', err);
      
      // OpenVidu 서버가 실행되지 않았을 때의 안내 메시지
      if (err.code === 'ERR_NETWORK' || err.message?.includes('fetch')) {
        setError(`OpenVidu 서버에 연결할 수 없습니다. 
        
OpenVidu 서버가 실행 중인지 확인해주세요.

서버 실행 방법:
1. Docker Compose: docker-compose -f docker-compose.openvidu.yml up -d
2. 또는 OpenVidu 3.x 공식 문서를 참조하여 서버를 설정해주세요.

서버 주소: ${OPENVIDU_SERVER_URL}
API 키: ${OPENVIDU_API_KEY}
API 시크릿: ${OPENVIDU_API_SECRET}

브라우저에서 https://localhost:7443로 접속하여 "고급" → "안전하지 않음" → 계속 진행하세요.

또는 데모 모드로 UI를 확인해보세요: ?demo=true`);
      } else {
        const errorMessage = err.response?.data?.message || err.message || '알 수 없는 오류';
        setError(`세션에 참가할 수 없습니다: ${errorMessage}`);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const createPublisher = async () => {
    if (!session) return;

    try {
      const OV = new OpenVidu();
      // 제공된 예시와 일치하는 퍼블리셔 설정
      const newPublisher = await OV.initPublisherAsync(undefined, {
        audioSource: undefined,
        videoSource: undefined,
        publishAudio: true,
        publishVideo: true,
        resolution: "640x480",
        frameRate: 30,
      });

      setPublisher(newPublisher);
      // 오디오/비디오 상태 초기화
      setIsAudioEnabled(true);
      setIsVideoEnabled(true);
      session.publish(newPublisher);
      console.log('퍼블리셔 생성 및 발행 완료');
    } catch (err) {
      console.error('퍼블리셔 생성 오류:', err);
      setError('카메라/마이크에 접근할 수 없습니다. 브라우저 권한을 확인해주세요.');
    }
  };

  const leaveSession = () => {
    if (session) {
      session.disconnect();
    }
    if (isScreenSharing) {
      stopScreenShare();
    }
    setSession(null);
    setPublisher(null);
    setSubscribers([]);
    setIsConnected(false);
    setIsDemoMode(false);
    setDemoParticipants([]);
    // 오디오/비디오 상태 초기화
    setIsAudioEnabled(true);
    setIsVideoEnabled(true);
    console.log('세션에서 나감');
  };

  const toggleAudio = () => {
    if (publisher) {
      const newAudioState = !isAudioEnabled;
      setIsAudioEnabled(newAudioState);
      publisher.publishAudio(newAudioState);
      console.log('오디오 토글:', newAudioState);
    }
  };

  const toggleVideo = () => {
    if (publisher) {
      const newVideoState = !isVideoEnabled;
      setIsVideoEnabled(newVideoState);
      publisher.publishVideo(newVideoState);
      console.log('비디오 토글:', newVideoState);
    }
  };

  const toggleScreenShare = async () => {
    if (isScreenSharing) {
      await stopScreenShare();
    } else {
      await startScreenShare();
    }
  };

  const startScreenShare = async () => {
    try {
      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
        audio: false
      });

      setScreenShareStream(stream);
      setIsScreenSharing(true);

      if (screenShareVideoRef.current) {
        screenShareVideoRef.current.srcObject = stream;
      }

      stream.getVideoTracks()[0].onended = () => {
        stopScreenShare();
      };

      console.log('화면 공유 시작');
    } catch (err) {
      console.error('화면 공유 시작 실패:', err);
      setError('화면 공유를 시작할 수 없습니다.');
    }
  };

  const stopScreenShare = async () => {
    if (screenShareStream) {
      screenShareStream.getTracks().forEach(track => track.stop());
      setScreenShareStream(null);
    }
    setIsScreenSharing(false);

    if (screenShareVideoRef.current) {
      screenShareVideoRef.current.srcObject = null;
    }
    console.log('화면 공유 중지');
  };

  // 데모 모드에서 참가자 토글
  // const toggleDemoParticipantAudio = (participantId: string) => {
  //   setDemoParticipants(prev => 
  //     prev.map(p => 
  //       p.id === participantId ? { ...p, hasAudio: !p.hasAudio } : p
  //     )
  //   );
  // };

  // const toggleDemoParticipantVideo = (participantId: string) => {
  //   setDemoParticipants(prev => 
  //     prev.map(p => 
  //       p.id === participantId ? { ...p, hasVideo: !p.hasVideo } : p
  //     )
  //   );
  // };

  const allParticipants = publisher ? [publisher, ...subscribers] : subscribers;
  const { cols, rows } = getGridLayout(isDemoMode ? demoParticipants.length + 1 : allParticipants.length);

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
                  <span className="text-white text-sm">나 (나)</span>
                </div>
                
                {/* 데모 참가자들 */}
                {isDemoMode && demoParticipants.map((participant) => (
                  <div key={participant.id} className="flex items-center space-x-2 p-2 bg-gray-700 rounded">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-white text-sm">{participant.name}</span>
                    {!participant.hasAudio && <span className="text-red-400 text-xs">🔇</span>}
                    {!participant.hasVideo && <span className="text-red-400 text-xs">📹</span>}
                  </div>
                ))}
                
                {/* 실제 참가자들 */}
                {!isDemoMode && subscribers.map((_, index) => (
                  <div key={index} className="flex items-center space-x-2 p-2 bg-gray-700 rounded">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-white text-sm">참가자 {index + 1}</span>
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
                {isDemoMode && <span className="ml-2 text-yellow-400 text-sm">(데모 모드)</span>}
                {isPdfViewerMode && <span className="ml-2 text-blue-400 text-sm">(PDF 뷰어 모드)</span>}
              </h1>
              {isPdfViewerMode && (
                <p className="text-sm text-gray-400">
                  현재 보고 있는 자료: {currentPdfName}
                </p>
              )}
            </div>
            {!isConnected && !isDemoMode && (
              <button
                onClick={initializeDemoMode}
                className="bg-yellow-600 hover:bg-yellow-700 text-white px-3 py-1 rounded text-xs"
              >
                데모 모드로 보기
              </button>
            )}
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
          {!isConnected && !isDemoMode && (
            <div className="bg-gray-800 m-4 rounded-lg p-4 flex-shrink-0">
              <h3 className="text-base font-semibold mb-3 text-white">화상회의 참가</h3>
              <div className="flex gap-3 items-center">
                <div className="flex-1">
                  <p className="text-sm text-gray-300 mb-1">
                    {studyId ? `${studyNameDisplay}의 화상회의 방에 참가합니다.` : '새로운 화상회의 세션을 시작합니다.'}
                  </p>
                  <p className="text-xs text-gray-500">
                    세션 ID: {sessionId}
                  </p>
                  <p className="text-xs text-gray-500">
                    OpenVidu 서버: {OPENVIDU_SERVER_URL}
                  </p>
                </div>
                <button
                  onClick={joinSession}
                  disabled={isLoading}
                  className="bg-blue-500 hover:bg-blue-600 disabled:bg-gray-600 text-white px-4 py-2 rounded-lg font-medium text-sm"
                >
                  {isLoading ? '연결 중...' : '참가하기'}
                </button>
              </div>
            </div>
          )}

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

          {isConnected && (isDemoMode ? demoParticipants.length > 0 : allParticipants.length > 0) && (
            <div className="flex-1 flex items-center justify-center p-2 min-h-0 overflow-hidden">
              {isPdfViewerMode ? (
                // PDF 뷰어 모드 레이아웃
                <div className="flex w-full h-full gap-4">
                  {/* 좌측: 사용자 화면들 (1/4 크기, 1열 4행) */}
                  <div className="w-1/4 flex flex-col gap-2">
                    <div className="text-center text-white text-xs mb-2">
                      <span className="bg-gray-700 px-2 py-1 rounded">참가자 화면</span>
                    </div>
                    <div 
                      ref={subscribersRef}
                      className="flex flex-col gap-2 h-full overflow-y-auto relative"
                    >
                      {isDemoMode ? (
                        <>
                          {/* 내 비디오 (데모) */}
                          <div className="relative bg-gray-800 rounded-lg overflow-hidden flex-1 min-h-[120px]">
                            <video
                              ref={videoRef}
                              autoPlay
                              playsInline
                              muted
                              className="w-full h-full object-cover"
                            />
                            <div className="absolute bottom-2 left-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-xs">
                              나 (데모)
                            </div>
                          </div>
                          
                          {/* 데모 참가자들 */}
                          {demoParticipants.map((participant) => (
                            <div key={participant.id} className="relative bg-gray-800 rounded-lg overflow-hidden flex-1 min-h-[120px]">
                              <video
                                ref={(el) => { demoVideoRefs.current[participant.id] = el; }}
                                autoPlay
                                playsInline
                                muted
                                className="w-full h-full object-cover"
                              />
                              <div className="absolute bottom-2 left-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-xs">
                                {participant.name}
                              </div>
                            </div>
                          ))}
                        </>
                      ) : (
                        allParticipants.map((_, index) => (
                          <div key={index} className="relative bg-gray-800 rounded-lg overflow-hidden flex-1 min-h-[120px]">
                            <video
                              ref={index === 0 ? videoRef : undefined}
                              autoPlay
                              playsInline
                              muted={index === 0}
                              className="w-full h-full object-cover"
                            />
                            <div className="absolute bottom-2 left-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-xs">
                              {index === 0 ? '나' : `참가자 ${index}`}
                            </div>
                          </div>
                        ))
                      )}
                      
                      {/* 스크롤 안내 */}
                      {(isDemoMode ? demoParticipants.length > 3 : allParticipants.length > 4) && (
                        <div className="text-center text-gray-400 text-xs py-2">
                          <div className="animate-bounce">⬇️</div>
                          <span>더 많은 참가자 보기</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* 중앙: PDF 뷰어 */}
                  <div className="flex-1 bg-white rounded-lg overflow-hidden">
                    {currentPdfUrl ? (
                      <iframe
                        ref={pdfViewerRef}
                        src={currentPdfUrl}
                        className="w-full h-full"
                        title={currentPdfName}
                        onError={() => {
                          console.error('PDF 로드 실패:', currentPdfUrl);
                        }}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gray-100">
                        <div className="text-center">
                          <div className="text-6xl mb-4">📄</div>
                          <h3 className="text-lg font-semibold text-gray-700 mb-2">
                            {currentPdfName}
                          </h3>
                          <p className="text-gray-500">
                            PDF 파일을 불러오는 중입니다...
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                // 일반 모드 레이아웃
                <div 
                  ref={subscribersRef}
                  className="w-full h-full max-w-6xl"
                  style={{
                    display: 'grid',
                    gridTemplateColumns: `repeat(${cols}, 1fr)`,
                    gridTemplateRows: `repeat(${rows}, 1fr)`,
                    gap: '0.5rem',
                    height: '100%',
                    width: '100%'
                  }}
                >
                  {isDemoMode ? (
                    <>
                      {/* 내 비디오 (데모) */}
                      <div className="relative bg-gray-800 rounded-lg overflow-hidden w-full h-full">
                        <video
                          ref={videoRef}
                          autoPlay
                          playsInline
                          muted
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute bottom-2 left-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-xs">
                          나 (데모)
                        </div>
                      </div>
                      
                      {/* 데모 참가자들 */}
                      {demoParticipants.map((participant) => (
                        <div key={participant.id} className="relative bg-gray-800 rounded-lg overflow-hidden w-full h-full">
                          <video
                            ref={(el) => { demoVideoRefs.current[participant.id] = el; }}
                            autoPlay
                            playsInline
                            muted
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute bottom-2 left-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-xs">
                            {participant.name}
                          </div>
                        </div>
                      ))}
                    </>
                  ) : (
                    allParticipants.map((_, index) => (
                      <div key={index} className="relative bg-gray-800 rounded-lg overflow-hidden w-full h-full">
                        <video
                          ref={index === 0 ? videoRef : undefined}
                          autoPlay
                          playsInline
                          muted={index === 0}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute bottom-2 left-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-xs">
                          {index === 0 ? '나' : `참가자 ${index}`}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {isConnected && (
          <div className="bg-gray-800 border-t border-gray-700 p-3 flex-shrink-0">
            <div className="flex justify-center items-center gap-3">
              <CircleButton
                variant={isDemoMode ? 'lightPurple' : (isAudioEnabled ? 'lightPurple' : 'red')}
                size="sm"
                onClick={isDemoMode ? () => {} : toggleAudio}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z"/>
                  <path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z"/>
                </svg>
              </CircleButton>

              <CircleButton
                variant={isDemoMode ? 'lightPurple' : (isVideoEnabled ? 'lightPurple' : 'red')}
                size="sm"
                onClick={isDemoMode ? () => {} : toggleVideo}
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
        )}
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

export default VideoConferencePage;