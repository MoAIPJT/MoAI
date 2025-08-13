import api from './api';
import type { FileItem, Category } from '@/types/ref';

export const refService = {
  // 파일 목록 조회
  getFiles: async (studyId: number, userId?: number): Promise<FileItem[]> => {
    try {
      console.log('=== 파일 목록 조회 요청 ===')
      console.log('studyId:', studyId)
      console.log('userId:', userId)

      const params = new URLSearchParams();
      params.append('studyId', studyId.toString());
      if (userId) {
        params.append('userId', userId.toString());
      }

      const url = `/ref/list?${params.toString()}`;
      console.log('요청 URL:', url)

      const response = await api.get<FileItem[]>(url);
      console.log('=== 파일 목록 조회 응답 ===')
      console.log('응답 전체:', response)
      console.log('응답 데이터:', response.data)
      console.log('응답 데이터 타입:', typeof response.data)
      console.log('응답 데이터가 배열인가:', Array.isArray(response.data))
      console.log('========================')

      return response.data;
    } catch (error: unknown) {
      console.error('=== 파일 목록 조회 에러 ===')
      console.error('에러:', error)
      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as { response?: { status?: number; data?: unknown } };
        console.error('HTTP 상태:', axiosError.response?.status)
        console.error('에러 데이터:', axiosError.response?.data)
        if (axiosError.response?.status === 404) {
          console.log('파일이 없습니다 (404), 빈 배열 반환')
          return [];
        }
      }
      console.error('========================')
      throw error;
    }
  },

  // 파일 업로드
  uploadFile: async (form: FormData): Promise<void> => {
    const response = await api.post('/ref/upload', form, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // 파일 수정
  editFile: async (id: number, data: { title: string; description: string; categoryId: number[] }): Promise<void> => {
    try {
      console.log('=== 파일 수정 요청 ===')
      console.log('파일 ID:', id)
      console.log('수정 데이터:', data)
      console.log('요청 URL:', `/ref/edit/${id}`)

      const requestBody = {
        title: data.title,
        description: data.description,
        categoryIdList: data.categoryId,
      }
      console.log('요청 본문:', requestBody)

      const response = await api.patch(`/ref/edit/${id}`, requestBody);

      console.log('=== 파일 수정 응답 ===')
      console.log('응답 전체:', response)
      console.log('응답 상태:', response.status)
      console.log('응답 데이터:', response.data)
      console.log('========================')

      return response.data;
    } catch (error) {
      console.error('=== 파일 수정 에러 ===')
      console.error('에러:', error)
      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as { response?: { status?: number; data?: unknown } }
        console.error('HTTP 상태:', axiosError.response?.status)
        console.error('에러 데이터:', axiosError.response?.data)
      }
      console.error('========================')
      throw error;
    }
  },

  // 파일 삭제
  deleteFile: async (id: number): Promise<void> => {
    try {
      console.log('=== 파일 삭제 요청 ===')
      console.log('파일 ID:', id)
      console.log('요청 URL:', `/ref/delete/${id}`)

      const response = await api.delete(`/ref/delete/${id}`);

      console.log('=== 파일 삭제 응답 ===')
      console.log('응답 전체:', response)
      console.log('응답 상태:', response.status)
      console.log('========================')

      return response.data;
    } catch (error) {
      console.error('=== 파일 삭제 에러 ===')
      console.error('에러:', error)
      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as { response?: { status?: number; data?: unknown } }
        console.error('HTTP 상태:', axiosError.response?.status)
        console.error('에러 데이터:', axiosError.response?.data)
      }
      console.error('========================')
      throw error;
    }
  },

  // 파일 View URL 발급
  getViewUrl: async (id: number): Promise<{ presignedUrl: string }> => {
    try {
      console.log('=== 파일 View URL 요청 ===')
      console.log('파일 ID:', id)
      console.log('요청 URL:', `/ref/view-url/${id}`)

      const response = await api.get<{ presignedUrl: string }>(`/ref/view-url/${id}`);

      console.log('=== 파일 View URL 응답 ===')
      console.log('응답 전체:', response)
      console.log('응답 상태:', response.status)
      console.log('응답 데이터:', response.data)
      console.log('========================')

      return response.data;
    } catch (error) {
      console.error('=== 파일 View URL 에러 ===')
      console.error('에러:', error)
      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as { response?: { status?: number; data?: unknown } }
        console.error('HTTP 상태:', axiosError.response?.status)
        console.error('에러 데이터:', axiosError.response?.data)
      }
      console.error('========================')
      throw error;
    }
  },

  // 파일 다운로드 URL 발급
  getDownloadUrl: async (id: number): Promise<{ presignedUrl: string }> => {
    try {
      console.log('=== 파일 다운로드 URL 요청 ===')
      console.log('파일 ID:', id)
      console.log('요청 URL:', `/ref/download-url/${id}`)

      const response = await api.get<{ presignedUrl: string }>(`/ref/download-url/${id}`);

      console.log('=== 파일 다운로드 URL 응답 ===')
      console.log('응답 전체:', response)
      console.log('응답 상태:', response.status)
      console.log('응답 데이터:', response.data)
      console.log('========================')

      return response.data;
    } catch (error) {
      console.error('=== 파일 다운로드 URL 에러 ===')
      console.error('에러:', error)
      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as { response?: { status?: number; data?: unknown } }
        console.error('HTTP 상태:', axiosError.response?.status)
        console.error('에러 데이터:', axiosError.response?.data)
      }
      console.error('========================')
      throw error;
    }
  },

  // 카테고리 목록 조회
  getCategories: async (studyId: number): Promise<Category[]> => {
    try {
      console.log('카테고리 목록 조회 요청:', { studyId })

      const response = await api.get<Category[]>(`/ref/categories?studyId=${studyId}`)

      console.log('카테고리 목록 조회 응답:', response)

      if (!response.data) {
        console.warn('API 응답에 data가 없습니다, 빈 배열 반환')
        return []
      }

      // 백엔드에서 카테고리 배열을 직접 반환하므로 response.data가 바로 배열
      if (Array.isArray(response.data)) {
        console.log('카테고리 목록 조회 성공:', response.data)
        // Ensure all categories have isActive property
        return response.data.map(category => ({
          ...category,
          isActive: category.isActive ?? true
        }))
      }

      console.warn('API 응답이 배열이 아닙니다, 빈 배열 반환')
      return []
    } catch (error: unknown) {
      console.error('카테고리 목록 조회 에러:', error)

      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as { response?: { status?: number } }
        if (axiosError.response?.status === 404) {
          console.log('카테고리가 없습니다 (404), 빈 배열 반환')
          return []
        }
      }

      console.error('카테고리 목록 조회 실패, 빈 배열 반환')
      return []
    }
  },

  // 카테고리 생성
  createCategory: async (studyId: number, name: string): Promise<Category> => {
    try {
      console.log('카테고리 생성 요청:', { studyId, name })

      const response = await api.post('/ref/categories/create', {
        studyId,
        categoryName: name,  // 백엔드 API 스펙에 맞춰 필드명 변경
      })

      console.log('카테고리 생성 응답 전체:', response)
      console.log('응답 상태:', response.status)
      console.log('응답 헤더:', response.headers)
      console.log('응답 데이터:', response.data)

      // 응답이 성공 상태라면 성공으로 처리 (data가 없어도 OK)
      if (response.status >= 200 && response.status < 300) {
        console.log('카테고리 생성 성공')
        // data가 있으면 반환, 없으면 빈 객체 반환
        return response.data || { id: 0, name: name, isActive: true }
      }

      throw new Error(`API 요청 실패: ${response.status}`)
    } catch (error) {
      console.error('카테고리 생성 API 에러:', error)

      // 상세 에러 정보 로깅
      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as { response?: { data?: any; status?: number } }
        console.error('API 에러 상세:', {
          status: axiosError.response?.status,
          data: axiosError.response?.data
        })
      }

      throw error
    }
  },

  // 카테고리 수정
  editCategory: async (id: number, name: string): Promise<Category> => {
    const response = await api.patch(`/ref/categories/edit/${id}`, {
      name,
    });
    // Ensure the returned category has isActive property
    return {
      ...response.data,
      isActive: response.data.isActive ?? true
    };
  },

  // 카테고리 삭제
  deleteCategory: async (id: number): Promise<void> => {
    const response = await api.delete(`/ref/categories/delete/${id}`);
    return response.data;
  },

  // 파일 다운로드
  downloadFile: async (id: number): Promise<Blob> => {
    const response = await api.get(`/ref/download/${id}`, {
      responseType: 'blob',
    });
    return response.data;
  },
};
