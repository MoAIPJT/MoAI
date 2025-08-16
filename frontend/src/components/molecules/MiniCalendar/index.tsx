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
      // currentMonth 문자열을 파싱해서 올바른 년도와 월을 얻어옴
      const monthMatch = currentMonth.match(/^(\w+) (\d+)$/)
      if (monthMatch) {
        const [, monthName, year] = monthMatch
        const monthNames = [
          'January', 'February', 'March', 'April', 'May', 'June',
          'July', 'August', 'September', 'October', 'November', 'December'
        ]
        const monthIndex = monthNames.indexOf(monthName)
        if (monthIndex !== -1) {
          const clickedDate = new Date(parseInt(year), monthIndex, day)
          onDateClick(clickedDate)
          return
        }
      }

      // 백업: currentDate가 있으면 사용하고, 없으면 현재 날짜 사용
      const clickedDate = new Date(currentDate || new Date())
      clickedDate.setDate(day)
      onDateClick(clickedDate)
    }
  }

  // 월 표시를 한글 형식으로 변환
  const formatMonthDisplay = (monthString: string) => {
    const monthMatch = monthString.match(/^(\w+) (\d+)$/)
    if (monthMatch) {
      const [, monthName, year] = monthMatch
      const monthNames = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
      ]
      const monthIndex = monthNames.indexOf(monthName)
      if (monthIndex !== -1) {
        return `${year}.${monthIndex + 1}`
      }
    }
    return monthString
  }

  const isCurrentDate = (day: number | null) => {
    if (!day || !currentDate) return false
    return day === currentDate.getDate()
  }

  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-white font-medium">{formatMonthDisplay(currentMonth)}</h3>
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
        {["일", "월", "화", "수", "목", "금", "토"].map((day: string, i: number) => (
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
