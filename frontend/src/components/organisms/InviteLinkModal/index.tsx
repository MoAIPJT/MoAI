import React, { useState } from 'react'
import type { InviteLinkModalProps } from './types'
import Button from '../../atoms/Button'
import bikingImage from '../../../assets/MoAI/biking.png'

const InviteLinkModal: React.FC<InviteLinkModalProps> = ({
  isOpen,
  onClose,
  inviteUrl
}) => {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(inviteUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000) // 2초 후 복사 상태 초기화
    } catch {
      // fallback: 구식 브라우저 지원
      const textArea = document.createElement('textarea')
      textArea.value = inviteUrl
      document.body.appendChild(textArea)
      textArea.select()
      document.execCommand('copy')
      document.body.removeChild(textArea)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 max-w-2xl w-full mx-4">
        <div className="flex flex-col lg:flex-row gap-8 items-center">
          {/* 왼쪽 이미지 */}
          <div className="flex-shrink-0">
            <div className="w-48 h-48 rounded-full bg-yellow-100 flex items-center justify-center">
              <img
                src={bikingImage}
                alt="스터디 생성 완료"
                className="w-32 h-32 object-contain"
              />
            </div>
          </div>

          {/* 오른쪽 콘텐츠 */}
          <div className="flex-1 bg-purple-50 rounded-lg p-6">
            <h2 className="text-2xl font-bold text-purple-600 mb-4">
              스터디 생성이 완료되었어요!
            </h2>

            <p className="text-gray-600 mb-6">
              친구에게 스터디 링크 전송하기
            </p>

            {/* 초대 링크 입력 필드 */}
            <div className="flex gap-2 mb-4">
              <input
                type="text"
                value={inviteUrl}
                readOnly
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md bg-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              <Button
                variant="primary"
                size="md"
                onClick={handleCopy}
              >
                {copied ? '복사됨!' : '복사'}
              </Button>
            </div>

            <p className="text-sm text-gray-500">
              초대 링크가 7일 후 만료돼요.
            </p>
          </div>
        </div>

        {/* 닫기 버튼 */}
        <div className="flex justify-end mt-6">
          <Button
            variant="secondary"
            size="md"
            onClick={onClose}
          >
            닫기
          </Button>
        </div>
      </div>
    </div>
  )
}

export default InviteLinkModal
