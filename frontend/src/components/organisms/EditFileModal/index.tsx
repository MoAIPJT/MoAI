import React, { useState, useEffect } from 'react'
import Button from '../../atoms/Button'
import InputText from '../../atoms/InputText'
import CheckBox from '../../atoms/CheckBox'
import type { EditFileModalProps } from './types'

const EditFileModal: React.FC<EditFileModalProps> = ({
  isOpen,
  onClose,
  onEdit,
  categories,
  initialData,
}) => {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [selectedCategories, setSelectedCategories] = useState<number[]>([])

  // 초기 데이터로 폼 초기화
  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title)
      setDescription(initialData.description)
      // 태그를 카테고리 ID로 변환 (실제 구현에서는 태그와 카테고리를 매핑해야 함)
      const categoryIds = initialData.tags
        .map(tag => {
          const category = categories.find(cat => cat.name === tag)
          return category ? parseInt(category.id) : null
        })
        .filter((id): id is number => id !== null)
      setSelectedCategories(categoryIds)
    }
  }, [initialData, categories])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (title.trim() && description.trim()) {
      onEdit({
        id: initialData.id,
        title: title.trim(),
        description: description.trim(),
        categoryId: selectedCategories,
      })
      handleCancel()
    }
  }

  const handleCancel = () => {
    setTitle('')
    setDescription('')
    setSelectedCategories([])
    onClose()
  }

  const handleCategoryToggle = (categoryId: number) => () => {
    setSelectedCategories(prev => {
      if (prev.includes(categoryId)) {
        return prev.filter(id => id !== categoryId)
      } else {
        return [...prev, categoryId]
      }
    })
  }

  const isFormValid = title.trim() && description.trim()

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-[500px] max-w-md max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-semibold mb-4">파일 수정</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* 제목 입력 */}
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
              제목 *
            </label>
            <InputText
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="파일 제목을 입력하세요"
            />
          </div>

          {/* 내용 입력 */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
              내용 *
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="파일 내용을 입력하세요"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              rows={4}
            />
          </div>

          {/* 카테고리 설정 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              카테고리 설정
            </label>
            <div className="space-y-2">
              {categories.map((category) => (
                <div key={category.id}>
                  <CheckBox
                    id={`category-${category.id}`}
                    label={category.name}
                    checked={selectedCategories.includes(parseInt(category.id))}
                    onChange={handleCategoryToggle(parseInt(category.id))}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* 버튼 */}
          <div className="flex justify-end space-x-3 pt-4">
            <Button
              variant="secondary"
              onClick={handleCancel}
              type="button"
            >
              취소
            </Button>
            <Button
              variant="primary"
              type="submit"
              disabled={!isFormValid}
            >
              수정
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default EditFileModal
