import React, { useState } from 'react'
import type { ChangePasswordModalProps } from './types'
import Button from '../../atoms/Button'
import InputText from '../../atoms/InputText'

const ChangePasswordModal: React.FC<ChangePasswordModalProps> = ({
  isOpen,
  onClose,
  onSubmit
}) => {
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isValid, setIsValid] = useState({
    newPassword: false,
    confirmPassword: false
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleInputChange = (field: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))

    // 에러 메시지 초기화
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }

    // 실시간 유효성 검사
    if (field === 'newPassword') {
      const isValidPassword = value.length >= 8
      setIsValid(prev => ({ ...prev, newPassword: isValidPassword }))

      if (formData.confirmPassword && value !== formData.confirmPassword) {
        setErrors(prev => ({ ...prev, confirmPassword: '비밀번호가 일치하지 않습니다.' }))
        setIsValid(prev => ({ ...prev, confirmPassword: false }))
      } else if (formData.confirmPassword && value === formData.confirmPassword) {
        setErrors(prev => ({ ...prev, confirmPassword: '' }))
        setIsValid(prev => ({ ...prev, confirmPassword: true }))
      }
    }

    if (field === 'confirmPassword') {
      const isMatch = value === formData.newPassword
      setIsValid(prev => ({ ...prev, confirmPassword: isMatch }))

      if (value && !isMatch) {
        setErrors(prev => ({ ...prev, confirmPassword: '비밀번호가 일치하지 않습니다.' }))
      } else if (value && isMatch) {
        setErrors(prev => ({ ...prev, confirmPassword: '' }))
      }
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.currentPassword) {
      newErrors.currentPassword = '현재 비밀번호를 입력해주세요.'
    }

    if (!formData.newPassword) {
      newErrors.newPassword = '새 비밀번호를 입력해주세요.'
    } else if (formData.newPassword.length < 8) {
      newErrors.newPassword = '비밀번호는 8자 이상이어야 합니다.'
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = '새 비밀번호 확인을 입력해주세요.'
    } else if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = '비밀번호가 일치하지 않습니다.'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async () => {
    if (validateForm()) {
      setIsSubmitting(true)
      try {
        await onSubmit(formData)
        handleClose()
      } catch (error) {
        // 에러는 상위 컴포넌트에서 처리
      } finally {
        setIsSubmitting(false)
      }
    }
  }

  const handleClose = () => {
    setFormData({
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    })
    setErrors({})
    setIsValid({
      newPassword: false,
      confirmPassword: false
    })
    setIsSubmitting(false)
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">비밀번호 변경</h2>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 text-2xl"
          >
            ×
          </button>
        </div>

        <div className="space-y-6">
          {/* 현재 비밀번호 */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              현재 비밀번호
            </label>
            <InputText
              type="password"
              value={formData.currentPassword}
              onChange={handleInputChange('currentPassword')}
              placeholder="현재 비밀번호를 입력하세요"
              className={`w-full ${errors.currentPassword ? 'border-red-500' : ''}`}
            />
            {errors.currentPassword && (
              <p className="text-red-500 text-sm">{errors.currentPassword}</p>
            )}
          </div>

          {/* 새 비밀번호 */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              새 비밀번호
            </label>
            <InputText
              type="password"
              value={formData.newPassword}
              onChange={handleInputChange('newPassword')}
              placeholder="새 비밀번호를 입력하세요 (8자 이상)"
              className={`w-full ${errors.newPassword ? 'border-red-500' : ''}`}
            />
            {formData.newPassword && (
              <div className="flex items-center gap-2">
                {isValid.newPassword ? (
                  <span className="text-green-500 text-sm">✓ 8자 이상</span>
                ) : (
                  <span className="text-red-500 text-sm">✗ 8자 이상</span>
                )}
              </div>
            )}
            {errors.newPassword && (
              <p className="text-red-500 text-sm">{errors.newPassword}</p>
            )}
          </div>

          {/* 새 비밀번호 확인 */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              새 비밀번호 확인
            </label>
            <InputText
              type="password"
              value={formData.confirmPassword}
              onChange={handleInputChange('confirmPassword')}
              placeholder="새 비밀번호를 다시 입력하세요"
              className={`w-full ${errors.confirmPassword ? 'border-red-500' : ''}`}
            />
            {formData.confirmPassword && (
              <div className="flex items-center gap-2">
                {isValid.confirmPassword ? (
                  <span className="text-green-500 text-sm">✓ 비밀번호 일치</span>
                ) : (
                  <span className="text-red-500 text-sm">✗ 비밀번호 불일치</span>
                )}
              </div>
            )}
            {errors.confirmPassword && (
              <p className="text-red-500 text-sm">{errors.confirmPassword}</p>
            )}
          </div>

          {/* 버튼들 */}
          <div className="flex gap-3 pt-4">
            <Button
              variant="secondary"
              size="md"
              onClick={handleClose}
              className="flex-1"
              disabled={isSubmitting}
            >
              취소
            </Button>
            <Button
              variant="primary"
              size="md"
              onClick={handleSubmit}
              className="flex-1"
              disabled={!isValid.newPassword || !isValid.confirmPassword || isSubmitting}
            >
              {isSubmitting ? '변경 중...' : '변경'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ChangePasswordModal
