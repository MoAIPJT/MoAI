import React, { useState } from 'react'

interface CategoryAddModalProps {
  isOpen: boolean
  onClose: () => void
  onAdd: (categoryName: string) => void
}

const CategoryAddModal: React.FC<CategoryAddModalProps> = ({
  isOpen,
  onClose,
  onAdd,
}) => {
  const [categoryName, setCategoryName] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (categoryName.trim()) {
      onAdd(categoryName.trim())
      setCategoryName('')
      onClose()
    }
  }

  const handleCancel = () => {
    setCategoryName('')
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-96 max-w-md shadow-lg">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">새 카테고리 추가</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="categoryName" className="block text-sm font-medium text-gray-700 mb-2">
              카테고리 이름
            </label>
            <input
              id="categoryName"
              type="text"
              value={categoryName}
              onChange={(e) => setCategoryName(e.target.value)}
              placeholder="카테고리 이름을 입력하세요"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
            />
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              onClick={handleCancel}
              type="button"
              className="px-4 py-2 bg-gray-100 text-gray-700 hover:bg-gray-200 rounded-lg font-medium transition-colors"
            >
              취소
            </button>
            <button
              type="submit"
              disabled={!categoryName.trim()}
              className="px-4 py-2 bg-purple-500 text-white hover:bg-purple-600 disabled:bg-gray-300 disabled:text-gray-500 rounded-lg font-medium transition-colors"
            >
              추가
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default CategoryAddModal
