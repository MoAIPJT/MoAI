import React, { useState, useRef } from 'react'
import type { CreateStudyModalProps } from './types'
import Button from '../../atoms/Button'
import InputText from '../../atoms/InputText'

const CreateStudyModal: React.FC<CreateStudyModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  isLoading = false,
  onLoadingChange
}) => {
  const [studyName, setStudyName] = useState('')
  const [studyDescription, setStudyDescription] = useState('')
  const [maxCapacity, setMaxCapacity] = useState<number>(8)
  const [selectedImage, setSelectedImage] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string>('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  // 스터디 이름의 첫 글자로 이미지 생성
  const generateStudyImage = (name: string) => {
    if (!name.trim()) return ''
    const firstChar = name.charAt(0)
    return firstChar
  }

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setSelectedImage(file)
      const reader = new FileReader()
      reader.onload = (e) => {
        setPreviewUrl(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = () => {
    if (!studyName.trim()) {
      alert('스터디 이름을 입력해주세요.')
      return
    }

    if (maxCapacity < 2 || maxCapacity > 10) {
      alert('최대 인원은 2명 이상 10명 이하로 설정해주세요.')
      return
    }

    // 제출 버튼을 누르는 순간 로딩 상태 활성화
    if (onLoadingChange) {
      onLoadingChange(true)
    }

    onSubmit({
      name: studyName,
      description: studyDescription,
      image: selectedImage,
      maxCapacity: maxCapacity
    })

    // 로딩 중이 아닐 때만 폼 초기화 및 모달 닫기
    if (!isLoading) {
      // 폼 초기화
      setStudyName('')
      setStudyDescription('')
      setMaxCapacity(8)
      setSelectedImage(null)
      setPreviewUrl('')
      onClose()
    }
  }

  const handleClose = () => {
    setStudyName('')
    setStudyDescription('')
    setMaxCapacity(8)
    setSelectedImage(null)
    setPreviewUrl('')
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">스터디 시작하기</h2>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 text-2xl"
          >
            ×
          </button>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* 이미지 업로드 섹션 */}
          <div className="flex flex-col items-center">
            <div className="w-48 h-48 rounded-full bg-gray-100 border-2 border-dashed border-gray-300 flex flex-col items-center justify-center cursor-pointer hover:border-gray-400 transition-colors"
                 onClick={() => fileInputRef.current?.click()}>
              {previewUrl ? (
                <img
                  src={previewUrl}
                  alt="스터디 이미지 미리보기"
                  className="w-full h-full rounded-full object-cover"
                />
              ) : studyName.trim() ? (
                // 스터디 이름이 있을 때 첫 글자로 이미지 생성
                <div className="w-full h-full rounded-full bg-purple-500 text-white flex items-center justify-center text-6xl font-bold">
                  {generateStudyImage(studyName)}
                </div>
              ) : (
                <>
                  <svg className="w-12 h-12 text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                  <span className="text-sm text-gray-500">이미지 업로드</span>
                </>
              )}
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
          </div>

          {/* 입력 필드 섹션 */}
          <div className="flex-1 space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                스터디 이름
              </label>
              <InputText
                value={studyName}
                onChange={(e) => setStudyName(e.target.value)}
                placeholder="스터디 이름을 입력하세요."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                스터디 소개
              </label>
              <textarea
                value={studyDescription}
                onChange={(e) => setStudyDescription(e.target.value)}
                placeholder="스터디 소개를 입력하세요."
                className="w-full h-32 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                인원 <span className="text-gray-500 text-xs">최대 10인</span>
              </label>
              <div className="w-24">
                <input
                  type="number"
                  value={maxCapacity}
                  onChange={(e) => setMaxCapacity(Math.max(2, Math.min(10, parseInt(e.target.value) || 2)))}
                  min={2}
                  max={10}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-center"
                />
              </div>
            </div>
          </div>
        </div>

        {/* 버튼 섹션 */}
        <div className="flex justify-end mt-8">
          <Button
            variant="secondary"
            size="md"
            onClick={handleClose}
            className="mr-3"
          >
            취소
          </Button>
          <Button
            variant="primary"
            size="md"
            onClick={handleSubmit}
            disabled={isLoading}
          >
            {isLoading ? '시작 중...' : '시작'}
          </Button>
        </div>
      </div>
    </div>
  )
}

export default CreateStudyModal
