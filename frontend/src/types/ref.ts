export interface FileItem {
  fileId: number;
  title: string;
  description?: string;
  categories: string[];
  name: string;  // uploaderName -> name
  profileImageUrl?: string;  // profileImage -> profileImageUrl
  updateDate?: string;
  uploadDate?: string;
}

export interface UploadReq {
  categoryId: number[];  // categories -> categoryId, string[] -> number[]
  title: string;
  description?: string;
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
  isActive: boolean;
}

export interface FileListResponse {
  items: FileItem[];
}

export interface CategoryListResponse {
  categories: Category[];
}
