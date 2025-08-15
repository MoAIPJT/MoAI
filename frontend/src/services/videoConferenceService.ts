import api from './api'

// 백엔드 API 응답 타입 정의
export interface SessionResponseDto {
  id: number
  studyGroupId: number
  studyGroupHashId: string
  roomName: string
  created: boolean
}

export interface JoinSessionResponseDto {
  roomName: string
  wsUrl: string
  displayName: string
  token: string
}

export interface ParticipantDto {
  name: string
  profileImageUrl: string
}

export interface ParticipantsResponseDto {
  sessionOpen: boolean
  count: number
  participants: ParticipantDto[]
}

export interface CloseSessionResponseDto {
  id: number
  studyGroupHashId: string
  roomName: string
  closed: boolean
  closedAt: string
}

class VideoConferenceService {
  private baseURL: string

  constructor() {
    this.baseURL = '/study'
  }

  /**
   * 세션 열기 (ADMIN/DELEGATE만 가능)
   * @param hashId 스터디 해시 ID
   * @returns 세션 정보
   */
  async openSession(hashId: string): Promise<SessionResponseDto> {
    try {
      const response = await api.post(`${this.baseURL}/${hashId}/session/open`)
      return response.data
    } catch (error) {
      console.error('세션 열기 실패:', error)
      throw new Error('세션을 열 수 없습니다.')
    }
  }

  /**
   * 세션 참가 및 LiveKit 토큰 발급
   * @param hashId 스터디 해시 ID
   * @returns 참가 정보 및 LiveKit 토큰
   */
  async joinSession(hashId: string): Promise<JoinSessionResponseDto> {
    try {
      const response = await api.post(`${this.baseURL}/${hashId}/session/join`)
      return response.data
    } catch (error) {
      console.error('세션 참가 실패:', error)
      throw new Error('세션에 참가할 수 없습니다.')
    }
  }

  /**
   * 세션 종료 (ADMIN/DELEGATE만 가능)
   * @param hashId 스터디 해시 ID
   * @returns 세션 종료 결과
   */
  async closeSession(hashId: string): Promise<CloseSessionResponseDto> {
    try {
      const response = await api.post(`${this.baseURL}/${hashId}/session/close`)
      return response.data
    } catch (error) {
      console.error('세션 종료 실패:', error)
      throw new Error('세션을 종료할 수 없습니다.')
    }
  }

  /**
   * 참가자 목록 조회
   * @param hashId 스터디 해시 ID
   * @returns 참가자 목록
   */
  async getParticipants(hashId: string): Promise<ParticipantsResponseDto> {
    try {
      const response = await api.get(`${this.baseURL}/${hashId}/session/participants`)
      return response.data
    } catch (error) {
      console.error('참가자 목록 조회 실패:', error)
      throw new Error('참가자 목록을 조회할 수 없습니다.')
    }
  }
}

export default new VideoConferenceService()
