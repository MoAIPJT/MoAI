import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { refService } from '../services/refService';
import { refKeys } from './queryKeys';

export const useRefFiles = () => {
  const queryClient = useQueryClient();

  // 파일 목록 조회
  const useRefList = (studyId: number, userId?: number) => {
    return useQuery({
      queryKey: refKeys.list(studyId),
      queryFn: () => refService.getFiles(studyId, userId),
      enabled: studyId > 0, // studyId가 유효한 양수일 때만 실행
    });
  };

  // 파일 업로드
  const useUploadRef = (studyId: number) => {
    return useMutation({
      mutationFn: (form: FormData) => refService.uploadFile(form),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: refKeys.list(studyId) });
      },
    });
  };

  // 파일 수정
  const useEditRef = (studyId: number) => {
    return useMutation({
      mutationFn: ({ id, data }: { id: number; data: { title: string; description: string; categoryId: number[] } }) =>
        refService.editFile(id, data),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: refKeys.list(studyId) });
      },
    });
  };

  // 파일 삭제
  const useDeleteRef = (studyId: number) => {
    return useMutation({
      mutationFn: (id: number) =>
        refService.deleteFile(id),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: refKeys.list(studyId) });
      },
    });
  };

  // 카테고리 목록 조회
  const useCategories = (studyId: number) => {
    return useQuery({
      queryKey: refKeys.categories(studyId),
      queryFn: () => refService.getCategories(studyId),
      enabled: !!studyId,
    });
  };

  // 카테고리 생성
  const useCreateCategory = (studyId: number) => {
    return useMutation({
      mutationFn: (name: string) => refService.createCategory(studyId, name),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: refKeys.categories(studyId) });
      },
    });
  };

  // 카테고리 수정
  const useEditCategory = (studyId: number) => {
    return useMutation({
      mutationFn: ({ id, name }: { id: number; name: string }) =>
        refService.editCategory(id, name),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: refKeys.categories(studyId) });
      },
    });
  };

  // 카테고리 삭제
  const useDeleteCategory = (studyId: number) => {
    return useMutation({
      mutationFn: (id: number) => refService.deleteCategory(id),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: refKeys.categories(studyId) });
      },
    });
  };

  return {
    useRefList,
    useUploadRef,
    useEditRef,
    useDeleteRef,
    useCategories,
    useCreateCategory,
    useEditCategory,
    useDeleteCategory,
  };
};
