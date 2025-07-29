import React, { useRef, useEffect, useState } from 'react'
import type { ResizerProps } from './types'

const Resizer: React.FC<ResizerProps> = ({
  onResize,
  minWidth = 200,
  maxWidth = 500,
  initialWidth = 256,
}) => {
  const [isDragging, setIsDragging] = useState(false)
  const [width, setWidth] = useState(initialWidth)
  const resizerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return

      const newWidth = e.clientX
      const clampedWidth = Math.max(minWidth, Math.min(maxWidth, newWidth))
      
      setWidth(clampedWidth)
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
  }, [isDragging, minWidth, maxWidth, onResize])

  const handleMouseDown = () => {
    setIsDragging(true)
  }

  return (
    <div
      ref={resizerRef}
      className="w-1 bg-gray-300 hover:bg-gray-400 cursor-col-resize transition-colors duration-200 relative group"
      onMouseDown={handleMouseDown}
      style={{ width: '4px' }}
    >
      {/* 호버 시 더 넓은 클릭 영역 */}
      <div className="absolute inset-y-0 -left-1 -right-1" />
      
      {/* 드래그 핸들 */}
      <div className="absolute inset-y-0 left-1/2 transform -translate-x-1/2 w-0.5 bg-gray-400 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
    </div>
  )
}

export default Resizer 