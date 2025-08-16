import type { Category } from '@/types/content'

export interface EditFileModalProps {
  isOpen: boolean
  onClose: () => void
  onEdit: (data: EditFileData) => void
  categories: Category[]
  initialData: {
    id: string
    title: string
    description: string
    tags: string[]
  }
}

export interface EditFileData {
  id: string
  title: string
  description: string
  categoryId: number[]
}
