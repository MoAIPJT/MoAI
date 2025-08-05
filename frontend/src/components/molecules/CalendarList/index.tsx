import React from 'react'
import type { CalendarListProps } from './types'

const CalendarList: React.FC<CalendarListProps> = ({ calendars }) => {
  return (
    <div>
      <h3 className="text-white font-medium mb-3">My calendars</h3>
      <div className="space-y-2">
        {calendars.map((cal, i) => (
          <div key={i} className="flex items-center gap-3">
            <div className={`w-3 h-3 rounded-sm ${cal.color}`}></div>
            <span className="text-white text-sm">{cal.name}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default CalendarList
