import React from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface MiniCalendarProps {
  currentMonth: string
  miniCalendarDays: (number | null)[]
  currentDate?: Date
  onPreviousMonth: () => void
  onNextMonth: () => void
  onDateClick?: (date: Date) => void
}

const MiniCalendar: React.FC<MiniCalendarProps> = ({
  currentMonth,
  miniCalendarDays,
  currentDate,
  onPreviousMonth,
  onNextMonth,
  onDateClick,
}) => {
  const handleDateClick = (day: number) => {
    if (onDateClick && day) {
      const clickedDate = new Date(currentDate || new Date())
      clickedDate.setDate(day)
      onDateClick(clickedDate)
    }
  }

  const isCurrentDate = (day: number | null) => {
    if (!day || !currentDate) return false
    return day === currentDate.getDate()
  }

  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-white font-medium">{currentMonth}</h3>
        <div className="flex gap-1">
          <button
            onClick={onPreviousMonth}
            className="p-1 rounded-full hover:bg-[#DABAFF]/20 transition-colors"
          >
            <ChevronLeft className="h-4 w-4 text-white" />
          </button>
          <button
            onClick={onNextMonth}
            className="p-1 rounded-full hover:bg-[#DABAFF]/20 transition-colors"
          >
            <ChevronRight className="h-4 w-4 text-white" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-1 text-center">
        {["S", "M", "T", "W", "T", "F", "S"].map((day: string, i: number) => (
          <div key={i} className="text-xs text-white font-medium py-1">
            {day}
          </div>
        ))}

        {miniCalendarDays.map((day: number | null, i: number) => (
          <button
            key={i}
            onClick={() => handleDateClick(day || 0)}
            disabled={!day}
            className={`text-xs rounded-full w-7 h-7 flex items-center justify-center transition-colors ${
              isCurrentDate(day)
                ? "bg-[#795AA1] text-white"
                : day
                  ? "text-white hover:bg-[#795AA1]/20"
                  : "invisible"
            }`}
          >
            {day}
          </button>
        ))}
      </div>
    </div>
  )
}

export default MiniCalendar
