// TODO: OpenVidu 온라인 스터디 관리 훅
// import { useState, useEffect, useCallback } from 'react'
// import { OpenVidu, Session, Publisher, Subscriber } from 'openvidu-browser'

// interface UseOpenViduSessionProps {
//   studyId: number
//   onParticipantJoined?: (participant: any) => void
//   onParticipantLeft?: (participantId: string) => void
//   onSessionEnded?: () => void
// }

// interface OpenViduSessionState {
//   session: Session | null
//   publisher: Publisher | null
//   subscribers: Subscriber[]
//   isConnecting: boolean
//   isConnected: boolean
//   participants: Array<{
//     id: string
//     name: string
//     avatar: string
//     isPublisher: boolean
//   }>
// }

// export const useOpenViduSession = ({
//   studyId,
//   onParticipantJoined,
//   onParticipantLeft,
//   onSessionEnded
// }: UseOpenViduSessionProps) => {
//   const [state, setState] = useState<OpenViduSessionState>({
//     session: null,
//     publisher: null,
//     subscribers: [],
//     isConnecting: false,
//     isConnected: false,
//     participants: []
//   })

//   // OpenVidu 인스턴스 초기화
//   const initializeOpenVidu = useCallback(() => {
//     try {
//       const ov = new OpenVidu()
//       return ov
//     } catch (error) {
//       console.error('OpenVidu 초기화 실패:', error)
//       return null
//     }
//   }, [])

//   // 세션 생성
//   const createSession = useCallback(async () => {
//     try {
//       setState(prev => ({ ...prev, isConnecting: true }))
//       
//       // 백엔드에서 세션 토큰 요청
//       const response = await fetch('/api/openvidu/sessions/create', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
//         },
//         body: JSON.stringify({
//           studyId,
//           sessionName: `study-${studyId}-${Date.now()}`
//         })
//       })
//       
//       if (!response.ok) {
//         throw new Error('세션 생성 실패')
//       }
//       
//       const { token, sessionId } = await response.json()
//       
//       // OpenVidu 세션 초기화
//       const ov = initializeOpenVidu()
//       if (!ov) throw new Error('OpenVidu 초기화 실패')
//       
//       const session = ov.initSession()
//       
//       // 세션 이벤트 리스너 설정
//       session.on('streamCreated', (event) => {
//         const subscriber = session.subscribe(event.stream, undefined)
//         setState(prev => ({
//           ...prev,
//           subscribers: [...prev.subscribers, subscriber]
//         }))
//         
//         // 새로운 참여자 정보 추가
//         const newParticipant = {
//           id: event.stream.connection.connectionId,
//           name: event.stream.connection.data || 'Unknown',
//           avatar: '👤',
//           isPublisher: false
//         }
//         
//         setState(prev => ({
//           ...prev,
//           participants: [...prev.participants, newParticipant]
//         }))
//         
//         onParticipantJoined?.(newParticipant)
//       })
//       
//       session.on('streamDestroyed', (event) => {
//         setState(prev => ({
//           ...prev,
//           subscribers: prev.subscribers.filter(sub => sub !== event.stream)
//         }))
//         
//         // 참여자 제거
//         const participantId = event.stream.connection.connectionId
//         setState(prev => ({
//           ...prev,
//           participants: prev.participants.filter(p => p.id !== participantId)
//         }))
//         
//         onParticipantLeft?.(participantId)
//       })
//       
//       session.on('sessionDisconnected', () => {
//         setState(prev => ({
//           ...prev,
//           session: null,
//           publisher: null,
//           subscribers: [],
//           isConnected: false,
//           participants: []
//         }))
//         
//         onSessionEnded?.()
//       })
//       
//       // 세션 연결
//       await session.connect(token)
//       
//       // 퍼블리셔 생성
//       const publisher = ov.initPublisher(undefined, {
//         audioSource: undefined,
//         videoSource: undefined,
//         publishAudio: true,
//         publishVideo: true,
//         resolution: '640x480',
//         frameRate: 30,
//         insertMode: 'APPEND',
//         mirror: false
//       })
//       
//       // 퍼블리셔를 세션에 발행
//       await session.publish(publisher)
//       
//       // 퍼블리셔 정보를 참여자 목록에 추가
//       const publisherParticipant = {
//         id: session.connection.connectionId,
//         name: '나',
//         avatar: '👤',
//         isPublisher: true
//       }
//       
//       setState(prev => ({
//         ...prev,
//         session,
//         publisher,
//         isConnecting: false,
//         isConnected: true,
//         participants: [publisherParticipant]
//       }))
//       
//       return { session, sessionId }
//       
//     } catch (error) {
//       console.error('세션 생성 실패:', error)
//       setState(prev => ({ ...prev, isConnecting: false }))
//       throw error
//     }
//   }, [studyId, initializeOpenVidu, onParticipantJoined, onParticipantLeft])

//   // 기존 세션 참여
//   const joinSession = useCallback(async (sessionId: string) => {
//     try {
//       setState(prev => ({ ...prev, isConnecting: true }))
//       
//       // 백엔드에서 참여 토큰 요청
//       const response = await fetch(`/api/openvidu/sessions/${sessionId}/join`, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
//         },
//         body: JSON.stringify({ studyId })
//       })
//       
//       if (!response.ok) {
//         throw new Error('세션 참여 실패')
//       }
//       
//       const { token } = await response.json()
//       
//       // OpenVidu 세션 초기화
//       const ov = initializeOpenVidu()
//       if (!ov) throw new Error('OpenVidu 초기화 실패')
//       
//       const session = ov.initSession()
//       
//       // 세션 이벤트 리스너 설정 (createSession과 동일)
//       // ... 이벤트 리스너 코드
//       
//       // 세션 연결
//       await session.connect(token)
//       
//       // 퍼블리셔 생성 및 발행
//       const publisher = ov.initPublisher(undefined, {
//         audioSource: undefined,
//         videoSource: undefined,
//         publishAudio: true,
//         publishVideo: true,
//         resolution: '640x480',
//         frameRate: 30,
//         insertMode: 'APPEND',
//         mirror: false
//       })
//       
//       await session.publish(publisher)
//       
//       setState(prev => ({
//         ...prev,
//         session,
//         publisher,
//         isConnecting: false,
//         isConnected: true
//       }))
//       
//     } catch (error) {
//       console.error('세션 참여 실패:', error)
//       setState(prev => ({ ...prev, isConnecting: false }))
//       throw error
//     }
//   }, [studyId, initializeOpenVidu])

//   // 세션 종료
//   const endSession = useCallback(async () => {
//     try {
//       if (!state.session) return
//       
//       // 백엔드에 세션 종료 요청
//       await fetch(`/api/openvidu/sessions/${state.session.sessionId}/end`, {
//         method: 'DELETE',
//         headers: {
//           'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
//         }
//       })
//       
//       // OpenVidu 세션 종료
//       state.session.disconnect()
//       
//       setState(prev => ({
//         ...prev,
//         session: null,
//         publisher: null,
//         subscribers: [],
//         isConnected: false,
//         participants: []
//       }))
//       
//     } catch (error) {
//       console.error('세션 종료 실패:', error)
//     }
//   }, [state.session])

//   // 세션 떠나기
//   const leaveSession = useCallback(async () => {
//     try {
//       if (!state.session) return
//       
//       // 백엔드에 참여자 제거 요청
//       await fetch(`/api/openvidu/sessions/${state.session.sessionId}/leave`, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
//         },
//         body: JSON.stringify({ studyId })
//       })
//       
//       // OpenVidu 세션 연결 해제
//       state.session.disconnect()
//       
//       setState(prev => ({
//         ...prev,
//         session: null,
//         publisher: null,
//         subscribers: [],
//         isConnected: false,
//         participants: []
//       }))
//       
//     } catch (error) {
//       console.error('세션 떠나기 실패:', error)
//     }
//   }, [state.session, studyId])

//   // 컴포넌트 언마운트 시 정리
//   useEffect(() => {
//     return () => {
//       if (state.session) {
//         state.session.disconnect()
//       }
//     }
//   }, [state.session])

//   return {
//     ...state,
//     createSession,
//     joinSession,
//     endSession,
//     leaveSession
//   }
// }

// 임시 export (실제 구현 시 주석 해제)
export const useOpenViduSession = () => {
  return {
    session: null,
    publisher: null,
    subscribers: [],
    isConnecting: false,
    isConnected: false,
    participants: [],
    createSession: async () => {},
    joinSession: async () => {},
    endSession: async () => {},
    leaveSession: async () => {}
  }
}
