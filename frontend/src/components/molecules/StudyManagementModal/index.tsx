import React, { useState } from 'react'
import type { StudyManagementModalProps } from './types'

const StudyManagementModal: React.FC<StudyManagementModalProps> = ({
  isOpen,
  onClose,
  studyName,
  studyDescription,
  studyImage,
  maxMembers = 10,
  members,
  categories,
  currentUserRole,
  onStudyImageChange,
  onCategoryRemove,
  onCategoryAdd,
  onMemberRemove,
  onStudyUpdate,
  onSave,
}) => {
  const [newCategory, setNewCategory] = useState('')
  const [imagePreview, setImagePreview] = useState<string | null>(studyImage || null)
  const [deleteConfirmMember, setDeleteConfirmMember] = useState<{ userId: number; name: string } | null>(null)
  const [localStudyName, setLocalStudyName] = useState(studyName)
  const [localStudyDescription, setLocalStudyDescription] = useState(studyDescription)
  const [localMaxMembers, setLocalMaxMembers] = useState(maxMembers)
  const [selectedImage, setSelectedImage] = useState<File | null>(null)

  if (!isOpen) return null

  const handleAddCategory = () => {
    if (newCategory.trim() && onCategoryAdd) {
      onCategoryAdd(newCategory.trim())
      setNewCategory('')
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleAddCategory()
    }
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string)
      }
      reader.readAsDataURL(file)
      setSelectedImage(file)
      if (onStudyImageChange) {
        onStudyImageChange(file)
      }
    }
  }

  const handleImageRemove = () => {
    setImagePreview(null)
    setSelectedImage(null)
    if (onStudyImageChange) {
      onStudyImageChange(null)
    }
  }

  const handleMemberDelete = (member: { userId: number; member: string }) => {
    // 자기 자신은 삭제할 수 없음
    if (member.member === 'Kuromi') {
      alert('자기 자신은 강제탈퇴할 수 없습니다.')
      return
    }

    // 관리자만 멤버 삭제 가능
    if (currentUserRole !== 'ADMIN') {
      alert('관리자만 멤버를 강제탈퇴할 수 있습니다.')
      return
    }

    setDeleteConfirmMember({ userId: member.userId, name: member.member })
  }

  const confirmMemberDelete = () => {
    if (deleteConfirmMember && onMemberRemove) {
      onMemberRemove(deleteConfirmMember.userId)
      setDeleteConfirmMember(null)
    }
  }

  const cancelMemberDelete = () => {
    setDeleteConfirmMember(null)
  }

  const handleSave = () => {
    if (onStudyUpdate) {
      onStudyUpdate({
        name: localStudyName,
        description: localStudyDescription,
        image: selectedImage || undefined,
        maxCapacity: localMaxMembers
      })
    }
    onSave()
  }

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-4xl relative">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-black">스터디 관리</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl"
          >
            &times;
          </button>
        </div>

        <div className="grid grid-cols-2 gap-6 mb-6">
          {/* 스터디 관리 섹션 */}
          <div className="bg-purple-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold mb-4 text-gray-800">스터디 관리</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  스터디 이름
                </label>
                <input
                  type="text"
                  value={localStudyName}
                  onChange={(e) => setLocalStudyName(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="스터디 이름을 입력하세요"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  스터디 설명
                </label>
                <textarea
                  value={localStudyDescription}
                  onChange={(e) => setLocalStudyDescription(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  rows={3}
                  placeholder="스터디 설명을 입력하세요"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  스터디 대표 이미지
                </label>
                <div className="flex items-center gap-4">
                  <div className="relative">
                    {imagePreview ? (
                      <div className="relative">
                        <img
                          src={imagePreview}
                          alt="스터디 이미지"
                          className="w-20 h-20 rounded-lg object-cover border border-gray-300"
                        />
                        <button
                          onClick={handleImageRemove}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600"
                        >
                          ×
                        </button>
                      </div>
                    ) : (
                      <label className="w-20 h-20 bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50">
                        <div className="text-gray-400 text-2xl mb-1">☁️</div>
                        <div className="text-gray-400 text-xs text-center">이미지 업로드</div>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageChange}
                          className="hidden"
                        />
                      </label>
                    )}
                  </div>
                  {!imagePreview && (
                    <div className="text-sm text-gray-500">
                      클릭하여 이미지를 선택하세요
                    </div>
                  )}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  최대 인원 수
                </label>
                <input
                  type="number"
                  min="1"
                  max="50"
                  value={localMaxMembers}
                  onChange={(e) => setLocalMaxMembers(parseInt(e.target.value) || 1)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="최대 인원 수를 입력하세요"
                />
              </div>
            </div>
          </div>

          {/* 카테고리 관리 섹션 */}
          <div className="bg-purple-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold mb-4 text-gray-800">카테고리 관리</h3>
            <div className="space-y-4">
              <div className="flex flex-wrap gap-2 mb-4">
                {categories.map((category, index) => (
                  <span
                    key={index}
                    className={`px-3 py-1 rounded-full text-sm font-medium flex items-center gap-2 ${
                      index % 2 === 0 ? 'bg-[#DABAFF] text-gray-800' : 'bg-[#F6EEFF] text-gray-800'
                    }`}
                  >
                    {category}
                    <button
                      onClick={() => onCategoryRemove?.(category)}
                      className="text-xs hover:text-red-500"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="flex-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="새 카테고리 입력"
                />
                <button
                  onClick={handleAddCategory}
                  className="px-4 py-2 bg-purple-500 text-white rounded-md hover:bg-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  +
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* 멤버 관리 섹션 */}
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <h3 className="text-lg font-semibold mb-4 text-gray-800">멤버 관리</h3>
          <div className="space-y-3">
            {members.map((member, index) => (
              <div key={index} className="flex items-center justify-between p-3 border-b border-gray-100 last:border-b-0">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-xl">
                    {member.imageUrl || '👤'}
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">
                      {member.member}
                      {member.member === 'Kuromi' && <span className="text-sm text-gray-500 ml-2">(me)</span>}
                    </p>
                    <p className="text-sm text-gray-500">{member.email}</p>
                  </div>
                </div>
                {member.member !== 'Kuromi' && currentUserRole === 'ADMIN' && (
                  <button
                    onClick={() => handleMemberDelete(member)}
                    className="px-3 py-1 bg-red-500 text-white text-sm rounded hover:bg-red-600"
                  >
                    추방
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* 완료 버튼 */}
        <div className="flex justify-end mt-6">
          <button
            onClick={handleSave}
            className="px-6 py-2 bg-purple-500 text-white rounded-md hover:bg-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            완료
          </button>
        </div>
      </div>

      {/* 멤버 삭제 확인 모달 */}
      {deleteConfirmMember && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-60">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-4 text-gray-800">멤버 강제탈퇴</h3>
            <p className="text-gray-600 mb-6">
              <strong>{deleteConfirmMember.name}</strong>님을 정말로 강제탈퇴하시겠습니까?
              <br />
              이 작업은 되돌릴 수 없습니다.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={cancelMemberDelete}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
              >
                취소
              </button>
              <button
                onClick={confirmMemberDelete}
                className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
              >
                강제탈퇴
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default StudyManagementModal
