import React, { useState } from 'react'
import Button from '../../atoms/Button'
import InputText from '../../atoms/InputText'
import CheckBox from '../../atoms/CheckBox'
import type { UploadDataModalProps } from './types'

const UploadDataModal: React.FC<UploadDataModalProps> = ({
  isOpen,
  onClose,
  onUpload,
  categories,
}) => {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (title.trim() && description.trim() && selectedFile) {
      onUpload({
        title: title.trim(),
        description: description.trim(),
        file: selectedFile,
        selectedCategories,
      })
      handleCancel()
    }
  }

  const handleCancel = () => {
    setTitle('')
    setDescription('')
    setSelectedFile(null)
    setSelectedCategories([])
    onClose()
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null
    setSelectedFile(file)
  }

  const handleCategoryToggle = (categoryId: string) => (_e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedCategories(prev => {
      if (prev.includes(categoryId)) {
        return prev.filter(id => id !== categoryId)
      } else {
        return [...prev, categoryId]
      }
    })
  }

  const isFormValid = title.trim() && description.trim() && selectedFile

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-[500px] max-w-md max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-semibold mb-4">자료 올리기</h2>

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
              placeholder="자료 제목을 입력하세요"
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
              placeholder="자료 내용을 입력하세요"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              rows={4}
            />
          </div>

          {/* 파일 올리기 */}
          <div>
            <label htmlFor="file" className="block text-sm font-medium text-gray-700 mb-2">
              파일 *
            </label>
            <input
              type="file"
              id="file"
              onChange={handleFileChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              accept=".pdf,.doc,.docx,.txt"
            />
            {selectedFile && (
              <p className="text-sm text-gray-600 mt-1">
                선택된 파일: {selectedFile.name}
              </p>
            )}
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
                    checked={selectedCategories.includes(category.id)}
                    onChange={handleCategoryToggle(category.id)}
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
              올리기
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default UploadDataModal
