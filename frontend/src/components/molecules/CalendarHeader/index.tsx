import React from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface CalendarHeaderProps {
  currentDate: string
  currentView: string
  onViewChange: (view: string) => void
  onPrevious: () => void
  onNext: () => void
  onToday?: () => void
}

const CalendarHeader: React.FC<CalendarHeaderProps> = ({
  currentDate,
  currentView,
  onViewChange,
  onPrevious,
  onNext,
  onToday,
}) => {
  return (
    <div className="flex items-center justify-between p-4 border-b border-white/20">
      <div className="flex items-center gap-4">
        <button
          onClick={onToday}
          className="px-4 py-2 text-white bg-[#795AA1] rounded-md hover:bg-[#795AA1]/80 transition-colors"
        >
          Today
        </button>
        <div className="flex">
          <button
            onClick={onPrevious}
            className="p-2 text-white hover:bg-[#DABAFF]/20 rounded-l-md transition-colors"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            onClick={onNext}
            className="p-2 text-white hover:bg-[#DABAFF]/20 rounded-r-md transition-colors"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
        <h2 className="text-xl font-semibold text-white">{currentDate}</h2>
      </div>

      <div className="flex items-center gap-2 rounded-md p-1">
        <button
          onClick={() => onViewChange("day")}
          className={`px-3 py-1 rounded transition-colors ${
            currentView === "day" ? "bg-[#795AA1] text-white" : "text-white hover:bg-[#795AA1]/20"
          } text-sm`}
        >
          Day
        </button>
        <button
          onClick={() => onViewChange("week")}
          className={`px-3 py-1 rounded transition-colors ${
            currentView === "week" ? "bg-[#795AA1] text-white" : "text-white hover:bg-[#795AA1]/20"
          } text-sm`}
        >
          Week
        </button>
        <button
          onClick={() => onViewChange("month")}
          className={`px-3 py-1 rounded transition-colors ${
            currentView === "month" ? "bg-[#795AA1] text-white" : "text-white hover:bg-[#795AA1]/20"
          } text-sm`}
        >
          Month
        </button>
      </div>
    </div>
  )
}

export default CalendarHeader
