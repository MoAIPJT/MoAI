import type { Category } from '@/types/content'

export interface CategoryTabProps {
  categories: Category[]
  selectedCategories: number[]
  onCategoryToggle: (categoryId: number) => void
  onAddClick: () => void
}
