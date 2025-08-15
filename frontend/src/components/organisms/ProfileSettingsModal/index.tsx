import React, { useState, useRef, useEffect } from 'react'
import type { ProfileSettingsModalProps, ProfileData } from './types'
import Button from '../../atoms/Button'
import InputText from '../../atoms/InputText'

const ProfileSettingsModal: React.FC<ProfileSettingsModalProps> = ({
  isOpen,
  onClose,
  profileData,
  onUpdateProfile,
  onWithdrawMembership,
  onOpenChangePasswordModal,
  isLoading = false
}) => {
  const [name, setName] = useState(profileData.name)
  const [isEditing, setIsEditing] = useState(false)
  const [previewUrl, setPreviewUrl] = useState<string>(profileData.profileImageUrl || '/src/assets/MoAI/smiling.png')
  const [hasChanges, setHasChanges] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // profileData가 변경될 때마다 상태 초기화
  useEffect(() => {
    setName(profileData.name)
    setPreviewUrl(profileData.profileImageUrl || '/src/assets/MoAI/smiling.png')
    setHasChanges(false)
    setIsEditing(false)
  }, [profileData.name, profileData.profileImageUrl, profileData.providerType])

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setPreviewUrl(e.target?.result as string)
        setHasChanges(true)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleNameChange = (value: string) => {
    setName(value)
    setHasChanges(value !== profileData.name)
  }

  const handleEdit = () => {
    setIsEditing(true)
  }

  const handleSave = () => {
    const updateData: Partial<ProfileData> = {}

    // 이름이 변경된 경우에만 포함 (null이 아닌 경우)
    if (name.trim() !== profileData.name) {
      updateData.name = name.trim()
    }

    // 이미지가 변경된 경우에만 포함 (null이 아닌 경우)
    if (previewUrl !== profileData.profileImageUrl) {
      updateData.profileImageUrl = previewUrl
    }

    // 변경사항이 있으면 API 호출
    if (Object.keys(updateData).length > 0) {
      onUpdateProfile(updateData)
      setHasChanges(false)
      setIsEditing(false)
    }
  }

  const handleCancel = () => {
    setName(profileData.name)
    setPreviewUrl(profileData.profileImageUrl || '/src/assets/MoAI/smiling.png')
    setIsEditing(false)
    setHasChanges(false)
  }

  const handleClose = () => {
    if (hasChanges) {
      if (confirm('저장하지 않은 변경사항이 있습니다. 정말로 닫으시겠습니까?')) {
        handleCancel()
        onClose()
      }
    } else {
      onClose()
    }
  }

  // 계정 종류에 따른 로고와 스타일 반환
  const getProviderInfo = (providerType?: string) => {
    switch (providerType) {
      case 'GOOGLE':
        return {
          logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/google/google-original.svg',
          name: 'Google',
          color: 'text-blue-600'
        }
      case 'KAKAO':
        return {
          logo: 'https://developers.kakao.com/assets/img/about/logos/kakaolink/kakaolink_btn_small.png',
          name: 'Kakao',
          color: 'text-yellow-600'
        }
      case 'LOCAL':
      default:
        return {
          logo: null,
          name: 'Local',
          color: 'text-gray-600'
        }
    }
  }

  const providerInfo = getProviderInfo(profileData.providerType)

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">{profileData.name}님의 프로필 설정</h2>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 text-2xl"
          >
            ×
          </button>
        </div>

        <div className="space-y-6">
          {/* 프로필 정보 섹션 */}
          <div className="flex items-start gap-6">
            {/* 왼쪽 - 프로필 이미지 */}
            <div className="flex-shrink-0">
              <div className="w-24 h-24 rounded-full bg-purple-100 border-2 border-dashed border-gray-300 flex flex-col items-center justify-center cursor-pointer hover:border-gray-400 transition-colors"
                onClick={isEditing ? () => fileInputRef.current?.click() : undefined}>
                {previewUrl ? (
                  <img
                    src={previewUrl}
                    alt="프로필 이미지"
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  <>
                    <svg className="w-8 h-8 text-gray-400 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    <span className="text-xs text-gray-500">이미지 변경</span>
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
              {isEditing && (
                <p className="text-xs text-gray-500 mt-2 text-center">클릭하여 이미지 변경</p>
              )}
            </div>

            {/* 오른쪽 - 이름과 이메일 */}
            <div className="flex-1 space-y-4">
              {/* 이름 */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">이름</label>
                <div className="flex items-center gap-2">
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin"></div>
                      <span className="text-gray-500">로딩 중...</span>
                    </div>
                  ) : isEditing ? (
                    <InputText
                      value={name}
                      onChange={(e) => handleNameChange(e.target.value)}
                      className="flex-1"
                      placeholder="이름을 입력하세요"
                    />
                  ) : (
                    <span className="text-lg font-medium text-gray-900">
                      {profileData.name}
                    </span>
                  )}
                </div>
              </div>

              {/* 이메일 */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">이메일</label>
                <div className="flex items-center gap-2">
                  {providerInfo.logo ? (
                    <img
                      src={providerInfo.logo}
                      alt={providerInfo.name}
                      className="w-5 h-5"
                    />
                  ) : null}
                  <span className={`${providerInfo.color}`}>
                    {profileData.email}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* 하단 액션 버튼 섹션 */}
          <div className="flex justify-between items-center pt-6 border-t border-gray-200">
            {/* 왼쪽 - 수정/저장/취소 버튼 */}
            <div className="flex gap-3">
              {!isEditing ? (
                <Button
                  variant="outline"
                  size="md"
                  onClick={handleEdit}
                >
                  프로필 수정
                </Button>
              ) : (
                <>
                  <Button
                    variant="primary"
                    size="md"
                    onClick={handleSave}
                    disabled={isLoading}
                  >
                    {isLoading ? '저장 중...' : '저장'}
                  </Button>
                  <Button
                    variant="secondary"
                    size="md"
                    onClick={handleCancel}
                    disabled={isLoading}
                  >
                    취소
                  </Button>
                </>
              )}
            </div>

            {/* 오른쪽 - 비밀번호 변경/회원 탈퇴 */}
            <div className="flex gap-3">
              <Button
                variant="outline"
                size="md"
                onClick={onOpenChangePasswordModal}
              >
                비밀번호 변경
              </Button>
              <button
                onClick={onWithdrawMembership}
                className="text-red-500 hover:text-red-700 text-sm px-3 py-2 border border-red-300 rounded-md hover:bg-red-50 transition-colors"
              >
                회원 탈퇴
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProfileSettingsModal
