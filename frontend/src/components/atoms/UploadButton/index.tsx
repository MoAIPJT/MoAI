import React from 'react'
import type { UploadButtonProps } from './types'

const UploadButton: React.FC<UploadButtonProps> = ({
  onClick,
  text = "자료 올리기",
  className = "",
}) => {
  return (
    <button
      onClick={onClick}
      className={`px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors ${className}`}
    >
      {text}
    </button>
  )
}

export default UploadButton
