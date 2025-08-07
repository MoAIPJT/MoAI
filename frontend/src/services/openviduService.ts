// import api from './api';

export interface OpenViduTokenResponse {
  token: string;
  sessionId: string;
}

export interface OpenViduSessionResponse {
  sessionId: string;
  createdAt: number;
  recording: boolean;
  broadcasting: boolean;
  forcedVideoCodec: string;
  allowTranscoding: boolean;
  mediaMode: string;
  recordingLayout: string;
  customSessionId: string;
  connections: {
    numberOfElements: number;
    content: any[];
  };
  recordingProperties: {
    name: string;
    hasAudio: boolean;
    hasVideo: boolean;
    outputMode: string;
    recordingLayout: string;
    resolution: string;
    frameRate: number;
    shmSize: number;
  };
}

class OpenViduService {
  private baseURL: string;
  private secret: string;

  constructor() {
    this.baseURL = import.meta.env.VITE_OPENVIDU_SERVER_URL || 'https://localhost:4443';
    this.secret = import.meta.env.VITE_OPENVIDU_SECRET || 'MY_SECRET';
  }

  /**
   * OpenVidu 세션 토큰을 생성합니다.
   * @param sessionId 세션 ID
   * @param role 사용자 역할 (PUBLISHER, SUBSCRIBER)
   * @returns 토큰 정보
   */
  async createToken(sessionId: string, role: 'PUBLISHER' | 'SUBSCRIBER' = 'PUBLISHER'): Promise<OpenViduTokenResponse> {
    try {
      // 먼저 세션이 존재하는지 확인하고, 없으면 생성
      try {
        await this.getSession(sessionId);
      } catch (error) {
        // 세션이 없으면 생성
        await this.createSession(sessionId);
      }

      // 토큰 생성 - OpenVidu REST API 사용
      const response = await fetch(`${this.baseURL}/openvidu/api/sessions/${sessionId}/connection`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Basic ${btoa(`OPENVIDUAPP:${this.secret}`)}`
        },
        body: JSON.stringify({
          role: role
        })
      });

      if (!response.ok) {
        throw new Error(`토큰 생성 실패: ${response.status}`);
      }

      const data = await response.json();
      return {
        token: data.token,
        sessionId: sessionId
      };
    } catch (error) {
      console.error('토큰 생성 실패:', error);
      if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
        throw new Error('OpenVidu 서버에 연결할 수 없습니다. 서버가 실행 중인지 확인해주세요.');
      }
      throw new Error('토큰을 생성할 수 없습니다.');
    }
  }

  /**
   * OpenVidu 세션을 생성합니다.
   * @param sessionId 세션 ID (선택사항)
   * @returns 세션 정보
   */
  async createSession(sessionId?: string): Promise<OpenViduSessionResponse> {
    try {
      const response = await fetch(`${this.baseURL}/openvidu/api/sessions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Basic ${btoa(`OPENVIDUAPP:${this.secret}`)}`
        },
        body: JSON.stringify({
          customSessionId: sessionId
        })
      });

      if (!response.ok) {
        throw new Error(`세션 생성 실패: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('세션 생성 실패:', error);
      if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
        throw new Error('OpenVidu 서버에 연결할 수 없습니다. 서버가 실행 중인지 확인해주세요.');
      }
      throw new Error('세션을 생성할 수 없습니다.');
    }
  }

  /**
   * OpenVidu 세션 정보를 조회합니다.
   * @param sessionId 세션 ID
   * @returns 세션 정보
   */
  async getSession(sessionId: string): Promise<OpenViduSessionResponse> {
    try {
      const response = await fetch(`${this.baseURL}/openvidu/api/sessions/${sessionId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Basic ${btoa(`OPENVIDUAPP:${this.secret}`)}`
        }
      });

      if (!response.ok) {
        throw new Error(`세션 조회 실패: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('세션 조회 실패:', error);
      if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
        throw new Error('OpenVidu 서버에 연결할 수 없습니다. 서버가 실행 중인지 확인해주세요.');
      }
      throw new Error('세션 정보를 조회할 수 없습니다.');
    }
  }

  /**
   * OpenVidu 세션을 삭제합니다.
   * @param sessionId 세션 ID
   */
  async deleteSession(sessionId: string): Promise<void> {
    try {
      const response = await fetch(`${this.baseURL}/openvidu/api/sessions/${sessionId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Basic ${btoa(`OPENVIDUAPP:${this.secret}`)}`
        }
      });

      if (!response.ok) {
        throw new Error(`세션 삭제 실패: ${response.status}`);
      }
    } catch (error) {
      console.error('세션 삭제 실패:', error);
      throw new Error('세션을 삭제할 수 없습니다.');
    }
  }

  /**
   * OpenVidu 세션에 연결된 사용자를 제거합니다.
   * @param sessionId 세션 ID
   * @param connectionId 연결 ID
   */
  async removeConnection(sessionId: string, connectionId: string): Promise<void> {
    try {
      const response = await fetch(`${this.baseURL}/openvidu/api/sessions/${sessionId}/connection/${connectionId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Basic ${btoa(`OPENVIDUAPP:${this.secret}`)}`
        }
      });

      if (!response.ok) {
        throw new Error(`연결 제거 실패: ${response.status}`);
      }
    } catch (error) {
      console.error('연결 제거 실패:', error);
      throw new Error('연결을 제거할 수 없습니다.');
    }
  }

  /**
   * OpenVidu 서버 상태를 확인합니다.
   * @returns 서버 상태
   */
  async getServerStatus(): Promise<{ status: string; version: string }> {
    try {
      const response = await fetch(`${this.baseURL}/openvidu/api/status`, {
        method: 'GET',
        headers: {
          'Authorization': `Basic ${btoa(`OPENVIDUAPP:${this.secret}`)}`
        }
      });

      if (!response.ok) {
        throw new Error(`서버 상태 확인 실패: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('서버 상태 확인 실패:', error);
      throw new Error('서버 상태를 확인할 수 없습니다.');
    }
  }
}

export default new OpenViduService();
