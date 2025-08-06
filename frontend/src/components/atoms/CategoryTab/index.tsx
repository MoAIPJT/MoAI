import React from 'react'
import type { Category } from '@/types/content'

interface CategoryTabProps {
  categories: Category[]
  selectedCategories: string[]
  onCategoryToggle: (categoryId: string) => void
  onAddClick: () => void
}

const CategoryTab: React.FC<CategoryTabProps> = ({
  categories,
  selectedCategories,
  onCategoryToggle,
  onAddClick,
}) => {
  return (
    <div className="flex items-end space-x-3 font-sans">
      {categories.map((category) => {
        const isSelected = selectedCategories.includes(category.id)
        return (
          <button
            key={category.id}
            onClick={() => onCategoryToggle(category.id)}
            className={`px-7 py-1 rounded-t-lg font-medium transition-colors font-sans ${
              isSelected
                ? 'bg-[#AA64FF] text-white border-t-2 border-l-2 border-r-2 border-[#AA64FF]'
                : 'bg-[#DABAFF] text-white hover:bg-[#AA64FF]'
            }`}
          >
            {category.name}
          </button>
        )
      })}
      <button
        onClick={onAddClick}
        className="px-7 py-1 rounded-t-lg font-medium bg-[#F0E4FF] text-white hover:bg-[#DABAFF] transition-colors font-sans"
      >
        추가 +
      </button>
    </div>
  )
}

export default CategoryTab
