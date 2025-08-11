import React, { useState, useRef } from 'react'
import type { ProfileSettingsModalProps } from './types'
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
  const [nickname, setNickname] = useState(profileData.nickname)
  const [isEditingNickname, setIsEditingNickname] = useState(false)
  const [previewUrl, setPreviewUrl] = useState<string>(profileData.profileImage || '')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setPreviewUrl(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleNicknameSave = () => {
    if (nickname.trim() && nickname !== profileData.nickname) {
      onUpdateProfile({ nickname: nickname.trim() })
    }
    setIsEditingNickname(false)
  }

  const handleNicknameCancel = () => {
    setNickname(profileData.nickname)
    setIsEditingNickname(false)
  }

  const handleClose = () => {
    setNickname(profileData.nickname)
    setIsEditingNickname(false)
    setPreviewUrl(profileData.profileImage || '')
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">내 프로필 설정</h2>
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
                   onClick={() => fileInputRef.current?.click()}>
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
            </div>

            {/* 오른쪽 - 닉네임과 이메일 */}
            <div className="flex-1 space-y-4">
              {/* 닉네임 */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin"></div>
                      <span className="text-gray-500">로딩 중...</span>
                    </div>
                  ) : isEditingNickname ? (
                    <>
                      <InputText
                        value={nickname}
                        onChange={(e) => setNickname(e.target.value)}
                        className="flex-1"
                        placeholder="닉네임을 입력하세요"
                      />
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={handleNicknameSave}
                      >
                        저장
                      </Button>
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={handleNicknameCancel}
                      >
                        취소
                      </Button>
                    </>
                  ) : (
                    <>
                      <span className="text-lg font-medium text-gray-900">
                        {profileData.nickname}
                      </span>
                      <button
                        onClick={() => setIsEditingNickname(true)}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                        </svg>
                      </button>
                    </>
                  )}
                </div>
              </div>

              {/* 이메일 */}
              <div className="flex items-center gap-2">
                <img
                  src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/google/google-original.svg"
                  alt="Google"
                  className="w-5 h-5"
                />
                <span className="text-gray-600">{profileData.email}</span>
              </div>
            </div>
          </div>

          {/* 하단 액션 버튼 섹션 - 오른쪽 아래 배치 */}
          <div className="flex justify-end items-center gap-4 pt-4">
            <Button
              variant="primary"
              size="md"
              onClick={onOpenChangePasswordModal}
            >
              비밀번호 변경
            </Button>
            <button
              onClick={onWithdrawMembership}
              className="text-gray-500 hover:text-gray-700 text-sm"
            >
              회원 탈퇴
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProfileSettingsModal
