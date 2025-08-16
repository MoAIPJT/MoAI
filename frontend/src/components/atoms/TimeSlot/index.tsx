import React from 'react'
import { Edit, Trash2 } from 'lucide-react'
import type { TimeSlotProps } from './types'

const TimeSlot: React.FC<TimeSlotProps> = ({
  time,
  events = [],
  onEditEvent,
  onDeleteEvent
}) => {
  return (
    <div className="h-20 border-b border-white/10 pr-2 text-right text-xs text-white relative">
      {/* 시간 표시 */}
      <div className="absolute top-1 right-2">
        {time > 12 ? `${time - 12} PM` : `${time} AM`}
      </div>

      {/* 해당 시간대의 일정들 */}
      {events.map((event) => (
        <div
          key={event.id}
          className="absolute left-2 right-2 bg-white/20 backdrop-blur-sm rounded p-1 text-xs text-white cursor-pointer hover:bg-white/30 transition-colors"
          style={{
            top: `${(event.startMinute / 60) * 80}px`,
            height: `${Math.max((event.duration / 60) * 80, 20)}px`
          }}
        >
          <div className="flex items-center justify-between h-full">
            <span className="truncate flex-1">{event.title}</span>
            <div className="flex gap-1 ml-2">
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  onEditEvent?.(event)
                }}
                className="p-1 hover:bg-white/20 rounded transition-colors"
                title="수정"
              >
                <Edit className="w-3 h-3" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  onDeleteEvent?.(event)
                }}
                className="p-1 hover:bg-red-500/50 rounded transition-colors"
                title="삭제"
              >
                <Trash2 className="w-3 h-3" />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default TimeSlot
