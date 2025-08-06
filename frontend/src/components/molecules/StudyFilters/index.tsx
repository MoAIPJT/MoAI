import React from 'react'
import type { StudyFiltersProps } from './types'

const StudyFilters: React.FC<StudyFiltersProps> = ({
  selectedFilters,
  onFilterClick,
  onAddFilter,
}) => {
  const defaultFilters = ['프런트', '백엔드', 'AI']

  return (
    <div className="flex gap-2">
      {defaultFilters.map((filter) => (
        <button
          key={filter}
          onClick={() => onFilterClick(filter)}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            selectedFilters.includes(filter)
              ? 'bg-purple-600 text-white'
              : 'bg-purple-100 text-purple-700 hover:bg-purple-200'
          }`}
        >
          {filter}
        </button>
      ))}
      <button
        onClick={onAddFilter}
        className="px-4 py-2 rounded-lg text-sm font-medium bg-purple-100 text-purple-700 hover:bg-purple-200"
      >
        추가 +
      </button>
    </div>
  )
}

export default StudyFilters
