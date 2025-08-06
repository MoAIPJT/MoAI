import React from 'react'
import { Plus } from 'lucide-react'
import MiniCalendar from '../../molecules/MiniCalendar'
import CalendarList from '../../molecules/CalendarList'

interface CalendarSidebarProps {
  currentMonth: string
  miniCalendarDays: (number | null)[]
  calendars: any[]
  currentDate?: Date
  onPreviousMonth: () => void
  onNextMonth: () => void
  onDateClick?: (date: Date) => void
  onCreateEvent?: () => void
}

const CalendarSidebar: React.FC<CalendarSidebarProps> = ({
  currentMonth,
  miniCalendarDays,
  calendars,
  currentDate,
  onPreviousMonth,
  onNextMonth,
  onDateClick,
  onCreateEvent,
}) => {
  return (
    <div className="w-64 h-full bg-white/10 backdrop-blur-lg p-4 shadow-xl border-r border-white/20 rounded-tr-3xl flex flex-col justify-between">
      <div>
        <button 
          onClick={onCreateEvent}
          className="mb-6 flex items-center justify-center gap-2 rounded-full bg-blue-500 px-4 py-3 text-white w-full hover:bg-blue-600 transition-colors"
        >
          <Plus className="h-5 w-5" />
          <span>Create</span>
        </button>

        <MiniCalendar
          currentMonth={currentMonth}
          miniCalendarDays={miniCalendarDays}
          currentDate={currentDate}
          onPreviousMonth={onPreviousMonth}
          onNextMonth={onNextMonth}
          onDateClick={onDateClick}
        />

        <CalendarList calendars={calendars} />
      </div>

      {/* Big plus button */}
      <button 
        onClick={onCreateEvent}
        className="mt-6 flex items-center justify-center gap-2 rounded-full bg-blue-500 p-4 text-white w-14 h-14 self-start hover:bg-blue-600 transition-colors"
      >
        <Plus className="h-6 w-6" />
      </button>
    </div>
  )
}

export default CalendarSidebar 