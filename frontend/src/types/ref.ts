export interface FileItem {
  fileId: number;
  title: string;
  description?: string;
  categories: string[];
  uploaderName?: string;
  profileImage?: string;
  updateDate?: string;
  uploadDate?: string;
}

export interface UploadReq {
  studyId: number;
  title: string;
  description?: string;
  categories: string[];
  file: File;
}

export interface EditReq {
  fileId: number;
  studyId: number;
  title?: string;
  description?: string;
  categories?: string[];
  file?: File;
}

export interface DeleteReq {
  fileId: number;
  studyId: number;
  uploaderId: number;
  categoryId?: number;
}

export interface Category {
  id: number;
  name: string;
}

export interface FileListResponse {
  items: FileItem[];
}

export interface CategoryListResponse {
  categories: Category[];
}
