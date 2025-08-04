import React from 'react'
import type { WeekDayProps } from './types'

const WeekDay: React.FC<WeekDayProps> = ({ day, date, isToday }) => {
  return (
    <div className="p-2 text-center border-l border-white/20">
      <div className="text-xs text-white/70 font-medium">{day}</div>
      <div
        className={`text-lg font-medium mt-1 text-white ${
          isToday ? "bg-blue-500 rounded-full w-8 h-8 flex items-center justify-center mx-auto" : ""
        }`}
      >
        {date}
      </div>
    </div>
  )
}

export default WeekDay 