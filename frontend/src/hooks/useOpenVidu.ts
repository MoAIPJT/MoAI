// OpenVidu 관련 훅은 현재 사용하지 않음 - LiveKit 사용 중
// 필요시 다시 구현할 수 있도록 빈 구현체만 제공

export const useOpenViduSession = () => {
  return {
    session: null,
    publisher: null,
    subscribers: [],
    isConnecting: false,
    isConnected: false,
    participants: [],
    createSession: async () => {
      console.warn('OpenVidu는 현재 사용하지 않습니다. LiveKit을 사용해주세요.')
    },
    joinSession: async () => {
      console.warn('OpenVidu는 현재 사용하지 않습니다. LiveKit을 사용해주세요.')
    },
    endSession: async () => {
      console.warn('OpenVidu는 현재 사용하지 않습니다. LiveKit을 사용해주세요.')
    },
    leaveSession: async () => {
      console.warn('OpenVidu는 현재 사용하지 않습니다. LiveKit을 사용해주세요.')
    }
  }
}
