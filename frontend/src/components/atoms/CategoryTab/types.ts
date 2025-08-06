import type { Category } from '@/types/content'

export interface CategoryTabProps {
  categories: Category[]
  selectedCategories: string[]
  onCategoryToggle: (categoryId: string) => void
  onAddClick: () => void
}
