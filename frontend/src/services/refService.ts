import api from './api';
import type { FileItem, Category } from '@/types/ref';

export const refService = {
  // 파일 목록 조회
  getFiles: async (studyId: number, userId?: number): Promise<FileItem[]> => {
    try {
      const params = new URLSearchParams();
      params.append('studyId', studyId.toString());
      if (userId) {
        params.append('userId', userId.toString());
      }

      const url = `/ref/list?${params.toString()}`;

      const response = await api.get<FileItem[]>(url);

      return response.data;
    } catch (error: unknown) {
      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as { response?: { status?: number; data?: unknown } };
        if (axiosError.response?.status === 404) {
          return [];
        }
      }
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
      const requestBody = {
        title: data.title,
        description: data.description,
        categoryIdList: data.categoryId,
      }

      const response = await api.patch(`/ref/edit/${id}`, requestBody);

      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // 파일 삭제
  deleteFile: async (id: number): Promise<void> => {
    try {
      const response = await api.delete(`/ref/delete/${id}`);

      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // 파일 View URL 발급
  getViewUrl: async (id: number): Promise<{ presignedUrl: string }> => {
    try {
      const response = await api.get<{ presignedUrl: string }>(`/ref/view-url/${id}`);

      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // 파일 다운로드 URL 발급
  getDownloadUrl: async (id: number): Promise<{ presignedUrl: string }> => {
    try {
      const response = await api.get<{ presignedUrl: string }>(`/ref/download-url/${id}`);

      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // 카테고리 목록 조회
  getCategories: async (studyId: number): Promise<Category[]> => {
    try {
      const response = await api.get<Category[]>(`/ref/categories?studyId=${studyId}`)

      if (!response.data) {
        return []
      }

      // 백엔드에서 카테고리 배열을 직접 반환하므로 response.data가 바로 배열
      if (Array.isArray(response.data)) {
        // Ensure all categories have isActive property
        return response.data.map(category => ({
          ...category,
          isActive: category.isActive ?? true
        }))
      }

      return []
    } catch (error: unknown) {
      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as { response?: { status?: number } }
        if (axiosError.response?.status === 404) {
          return []
        }
      }

      return []
    }
  },

  // 카테고리 생성
  createCategory: async (studyId: number, name: string): Promise<Category> => {
    try {
      const response = await api.post('/ref/categories/create', {
        studyId,
        categoryName: name,  // 백엔드 API 스펙에 맞춰 필드명 변경
      })

      // 응답이 성공 상태라면 성공으로 처리 (data가 없어도 OK)
      if (response.status >= 200 && response.status < 300) {
        // data가 있으면 반환, 없으면 빈 객체 반환
        return response.data || { id: 0, name: name, isActive: true }
      }

      throw new Error(`API 요청 실패: ${response.status}`)
    } catch (error) {
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
