import React, { useRef, useEffect, useState } from 'react'
import type { SplitResizerProps } from './types'

const SplitResizer: React.FC<SplitResizerProps> = ({
  onResize,
  minLeftWidth = 300,
  maxLeftWidth = 800,
}) => {
  const [isDragging, setIsDragging] = useState(false)
  const resizerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return

      const newLeftWidth = e.clientX
      const clampedWidth = Math.max(minLeftWidth, Math.min(maxLeftWidth, newLeftWidth))
      
      onResize(clampedWidth)
    }

    const handleMouseUp = () => {
      setIsDragging(false)
    }

    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)
      document.body.style.cursor = 'col-resize'
      document.body.style.userSelect = 'none'
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
      document.body.style.cursor = ''
      document.body.style.userSelect = ''
    }
  }, [isDragging, minLeftWidth, maxLeftWidth, onResize])

  const handleMouseDown = () => {
    setIsDragging(true)
  }

  return (
    <div
      ref={resizerRef}
      className="w-1 bg-gray-400 hover:bg-gray-600 cursor-col-resize transition-colors duration-200 relative group"
      onMouseDown={handleMouseDown}
      style={{ width: '4px' }}
    >
      {/* 호버 시 더 넓은 클릭 영역 */}
      <div className="absolute inset-y-0 -left-1 -right-1" />
      
      {/* 드래그 핸들 */}
      <div className="absolute inset-y-0 left-1/2 transform -translate-x-1/2 w-0.5 bg-gray-600 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
    </div>
  )
}

export default SplitResizer 