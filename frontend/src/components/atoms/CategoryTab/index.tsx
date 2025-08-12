import React from 'react'

interface CategoryTabProps {
  categories: Array<{
    id: string
    name: string
    isActive?: boolean
  }>
  selectedCategories: number[]
  onCategoryToggle: (categoryId: number) => void
  onAddClick: () => void
  currentUserRole?: string
}

const CategoryTab: React.FC<CategoryTabProps> = ({
  categories,
  selectedCategories,
  onCategoryToggle,
  onAddClick,
  currentUserRole,
}) => {
  return (
    <div className="flex items-end space-x-3 font-sans">
      {categories.map((category) => {
        const categoryId = parseInt(category.id)
        const isSelected = selectedCategories.includes(categoryId)
        return (
          <button
            key={category.id}
            onClick={() => onCategoryToggle(categoryId)}
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
      {/* ADMIN 권한이 있을 때만 카테고리 추가 버튼 표시 */}
      {currentUserRole === 'ADMIN' && (
        <button
          onClick={onAddClick}
          className="px-7 py-1 rounded-t-lg font-medium bg-[#F0E4FF] text-white hover:bg-[#DABAFF] transition-colors font-sans"
        >
          추가 +
        </button>
      )}
    </div>
  )
}

export default CategoryTab
