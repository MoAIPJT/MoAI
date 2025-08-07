import React from 'react'
import type { StudySearchProps } from './types'

const StudySearch: React.FC<StudySearchProps> = ({
  searchQuery,
  onSearch,
  onSearchQueryChange,
  placeholder = "검색어를 입력하세요",
}) => {
  return (
    <div className="flex-1 flex gap-2">
      <input
        type="text"
        placeholder={placeholder}
        value={searchQuery}
        onChange={(e) => onSearchQueryChange(e.target.value)}
        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
      />
      <button
        onClick={onSearch}
        className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
      >
        검색
      </button>
    </div>
  )
}

export default StudySearch
