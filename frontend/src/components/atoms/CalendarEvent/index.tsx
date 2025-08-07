import React from 'react'
import type { CalendarEventProps } from './types'

const CalendarEvent: React.FC<CalendarEventProps> = ({
  event,
  style,
  onClick,
}) => {
  // 메모 내용이 있는 경우 적절히 줄임
  const truncateDescription = (text: string, maxLength: number = 30) => {
    if (!text) return ''
    return text.length > maxLength ? `${text.substring(0, maxLength)}...` : text
  }

  return (
    <div
      className={`absolute ${event.color} rounded-md p-2 text-white text-xs shadow-md cursor-pointer transition-all duration-200 ease-in-out hover:translate-y-[-2px] hover:shadow-lg overflow-hidden`}
      style={style}
      onClick={() => onClick(event)}
    >
      <div className="font-medium truncate">{event.title}</div>
      <div className="opacity-80 text-[10px] mt-1">{`${event.startTime} - ${event.endTime}`}</div>
      {event.description && (
        <div className="opacity-70 text-[9px] mt-1 leading-tight">
          {truncateDescription(event.description)}
        </div>
      )}
    </div>
  )
}

export default CalendarEvent
