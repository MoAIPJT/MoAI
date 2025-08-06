import React from 'react'
import type { CalendarEventProps } from './types'

const CalendarEvent: React.FC<CalendarEventProps> = ({
  event,
  style,
  onClick,
}) => {
  return (
    <div
      className={`absolute ${event.color} rounded-md p-2 text-white text-xs shadow-md cursor-pointer transition-all duration-200 ease-in-out hover:translate-y-[-2px] hover:shadow-lg`}
      style={style}
      onClick={() => onClick(event)}
    >
      <div className="font-medium">{event.title}</div>
      <div className="opacity-80 text-[10px] mt-1">{`${event.startTime} - ${event.endTime}`}</div>
    </div>
  )
}

export default CalendarEvent 