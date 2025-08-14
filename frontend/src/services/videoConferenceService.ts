import api from './api'

// API 응답 타입 정의
export interface SessionResponseDto {
  sessionId: string
  status: 'OPEN' | 'CLOSED'
  createdAt: string
  participants: ParticipantDto[]
}

export interface JoinSessionResponseDto {
  token: string
  wsUrl: string
  roomName: string
  sessionId: string
}

export interface ParticipantDto {
  id: string
  name: string
  role: 'ADMIN' | 'DELEGATE' | 'MEMBER'
  joinedAt: string
}

export interface CloseSessionResponseDto {
  sessionId: string
  closed: boolean
  message: string
}

export interface ParticipantsResponseDto {
  participants: ParticipantDto[]
  totalCount: number
}

class VideoConferenceService {
  private baseURL: string

  constructor() {
    this.baseURL = '/api/study'
  }

  /**
   * 세션 열기 (ADMIN/DELEGATE만 가능)
   * @param studyId 스터디 ID
   * @returns 세션 정보
   */
  async openSession(studyId: number): Promise<SessionResponseDto> {
    try {
      const response = await api.post(`${this.baseURL}/${studyId}/session/open`)
      return response.data
    } catch (error) {
      console.error('세션 열기 실패:', error)
      throw new Error('세션을 열 수 없습니다.')
    }
  }

  /**
   * 세션 참가 및 LiveKit 토큰 발급
   * @param studyId 스터디 ID
   * @returns 참가 정보 및 LiveKit 토큰
   */
  async joinSession(studyId: number): Promise<JoinSessionResponseDto> {
    try {
      const response = await api.post(`${this.baseURL}/${studyId}/session/join`)
      return response.data
    } catch (error) {
      console.error('세션 참가 실패:', error)
      throw new Error('세션에 참가할 수 없습니다.')
    }
  }

  /**
   * 세션 상태 조회
   * @param studyId 스터디 ID
   * @returns 세션 상태 정보
   */
  async getSessionStatus(studyId: number): Promise<SessionResponseDto> {
    try {
      const response = await api.get(`${this.baseURL}/${studyId}/session/status`)
      return response.data
    } catch (error) {
      console.error('세션 상태 조회 실패:', error)
      throw new Error('세션 상태를 조회할 수 없습니다.')
    }
  }

  /**
   * 세션 종료 (ADMIN/DELEGATE만 가능)
   * @param studyId 스터디 ID
   * @returns 세션 종료 결과
   */
  async closeSession(studyId: number): Promise<CloseSessionResponseDto> {
    try {
      const response = await api.post(`${this.baseURL}/${studyId}/session/close`)
      return response.data
    } catch (error) {
      console.error('세션 종료 실패:', error)
      throw new Error('세션을 종료할 수 없습니다.')
    }
  }

  /**
   * 참가자 목록 조회
   * @param studyId 스터디 ID
   * @returns 참가자 목록
   */
  async getParticipants(studyId: number): Promise<ParticipantsResponseDto> {
    try {
      const response = await api.get(`${this.baseURL}/${studyId}/session/participants`)
      return response.data
    } catch (error) {
      console.error('참가자 목록 조회 실패:', error)
      throw new Error('참가자 목록을 조회할 수 없습니다.')
    }
  }

  /**
   * 화상회의 방 생성 (기존 API와의 호환성을 위해)
   * @param studyId 스터디 ID
   * @returns 방 생성 결과
   */
  async createRoom(studyId: number): Promise<any> {
    try {
      const response = await api.post(`/api/video-conference/create`, {
        studyId
      })
      return response.data
    } catch (error) {
      console.error('방 생성 실패:', error)
      throw new Error('화상회의 방을 생성할 수 없습니다.')
    }
  }

  /**
   * 화상회의 방 참가 (기존 API와의 호환성을 위해)
   * @param studyId 스터디 ID
   * @returns 방 참가 결과
   */
  async joinRoom(studyId: number): Promise<any> {
    try {
      const response = await api.post(`/api/video-conference/${studyId}/join`)
      return response.data
    } catch (error) {
      console.error('방 참가 실패:', error)
      throw new Error('화상회의 방에 참가할 수 없습니다.')
    }
  }

  /**
   * 화상회의 방 상태 조회 (기존 API와의 호환성을 위해)
   * @param studyId 스터디 ID
   * @returns 방 상태
   */
  async getRoomStatus(studyId: number): Promise<any> {
    try {
      const response = await api.get(`/api/video-conference/${studyId}/status`)
      return response.data
    } catch (error) {
      console.error('방 상태 조회 실패:', error)
      throw new Error('화상회의 방 상태를 조회할 수 없습니다.')
    }
  }
}

export default new VideoConferenceService()
