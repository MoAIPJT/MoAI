import { api } from './api';
import { FileItem, UploadReq, EditReq, DeleteReq, Category, FileListResponse, CategoryListResponse } from '../types/ref';

export const refService = {
  // 파일 목록 조회
  getFiles: async (studyId: number, userId?: number): Promise<FileItem[]> => {
    try {
      const params = new URLSearchParams();
      params.append('studyId', studyId.toString());
      if (userId) {
        params.append('userId', userId.toString());
      }
      
      const response = await api.get<FileListResponse>(`/ref/list?${params.toString()}`);
      return response.data.items;
    } catch (error: any) {
      if (error.response?.status === 404) {
        return [];
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
  editFile: async (id: number, form: FormData): Promise<void> => {
    const response = await api.patch(`/ref/edit/${id}`, form, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // 파일 삭제
  deleteFile: async (id: number, req: DeleteReq): Promise<void> => {
    const response = await api.delete(`/ref/delete/${id}`, {
      data: req,
    });
    return response.data;
  },

  // 카테고리 목록 조회
  getCategories: async (studyId: number): Promise<Category[]> => {
    try {
      const response = await api.get<CategoryListResponse>(`/ref/categories?studyId=${studyId}`);
      return response.data.categories;
    } catch (error: any) {
      if (error.response?.status === 404) {
        return [];
      }
      throw error;
    }
  },

  // 카테고리 생성
  createCategory: async (studyId: number, name: string): Promise<Category> => {
    const response = await api.post('/ref/categories/create', {
      studyId,
      name,
    });
    return response.data;
  },

  // 카테고리 수정
  editCategory: async (id: number, name: string): Promise<Category> => {
    const response = await api.patch(`/ref/categories/edit/${id}`, {
      name,
    });
    return response.data;
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
