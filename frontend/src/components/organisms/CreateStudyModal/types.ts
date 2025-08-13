export interface CreateStudyData {
  name: string
  description: string
  image: File | null
  maxCapacity: number
}

export interface CreateStudyModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: CreateStudyData) => void
}
