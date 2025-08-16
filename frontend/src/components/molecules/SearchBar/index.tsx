import React from 'react'
import type { SearchBarProps } from './types'

const SearchBar: React.FC<SearchBarProps> = ({
  searchTerm,
  onSearchChange,
  onSearch,
  sortOrder,
  onSortChange,
}) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSearch()
  }

  return (
    <div className="flex items-center gap-4">
      <form onSubmit={handleSubmit} className="flex-1">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="검색어를 입력하세요"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
      </form>
      <div className="flex items-center gap-2 text-sm text-gray-600">
        <span>|</span>
        <button
          onClick={() => onSortChange('newest')}
          className={`hover:text-purple-600 transition-colors ${
            sortOrder === 'newest' ? 'text-purple-600 font-medium' : ''
          }`}
        >
          최신순
        </button>
        <span>|</span>
        <button
          onClick={() => onSortChange('oldest')}
          className={`hover:text-purple-600 transition-colors ${
            sortOrder === 'oldest' ? 'text-purple-600 font-medium' : ''
          }`}
        >
          오래된 순
        </button>
      </div>
    </div>
  )
}

export default SearchBar
