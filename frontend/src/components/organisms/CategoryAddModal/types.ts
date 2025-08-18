export interface CategoryAddModalProps {
  isOpen: boolean
  onClose: () => void
  onAdd: (categoryName: string) => void
}
