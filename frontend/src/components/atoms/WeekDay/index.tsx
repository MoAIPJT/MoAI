import React from 'react'
import type { WeekDayProps } from './types'

const WeekDay: React.FC<WeekDayProps> = ({ day, date, isToday }) => {
  return (
    <div className="p-2 text-center border-l border-white/20">
      <div className="text-xs text-white font-medium">{day}</div>
      <div
        className={`text-lg font-medium mt-1 ${
          isToday ? "bg-[#795AA1] rounded-full w-8 h-8 flex items-center justify-center mx-auto text-white" : "text-white"
        }`}
      >
        {date}
      </div>
    </div>
  )
}

export default WeekDay
