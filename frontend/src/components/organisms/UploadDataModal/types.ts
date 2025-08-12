import type { Category } from '@/types/content'

export interface UploadDataModalProps {
  isOpen: boolean
  onClose: () => void
  onUpload: (data: UploadData) => void
  categories: Category[]
}

export interface UploadData {
  title: string
  description: string
  file: File
  categoryId: number[]  // selectedCategories -> categoryId, string[] -> number[]
}
