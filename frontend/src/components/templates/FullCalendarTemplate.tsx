import React from 'react'
import CalendarSidebar from '../organisms/CalendarSidebar'
import CalendarHeader from '../molecules/CalendarHeader'
import CalendarGrid from '../organisms/CalendarGrid'
import type { FullCalendarTemplateProps } from './types'

export interface FullCalendarTemplateProps {
  currentMonth: string
  currentDate: string
  currentView: string
  weekDays: string[]
  weekDates: number[]
  timeSlots: number[]
  events: Event[]
  miniCalendarDays: (number | null)[]
  calendars: CalendarType[]
  onViewChange: (view: string) => void
  onPrevious: () => void
  onNext: () => void
  onPreviousMonth: () => void
  onNextMonth: () => void
  onEventClick: (event: Event) => void
  onToday?: () => void
  onDateClick?: (date: Date) => void
  onCreateEvent?: () => void
}

const FullCalendarTemplate: React.FC<FullCalendarTemplateProps> = ({
  currentMonth,
  currentDate,
  currentView,
  weekDays,
  weekDates,
  timeSlots,
  events,
  miniCalendarDays,
  calendars,
  onViewChange,
  onPrevious,
  onNext,
  onPreviousMonth,
  onNextMonth,
  onEventClick,
  onToday,
  onDateClick,
  onCreateEvent,
}) => {
  // Convert string date to Date object for sidebar
  const currentDateObj = new Date(currentDate)

  return (
    <div className="relative h-full w-full overflow-hidden">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: "url('/src/assets/calendar-background1.png')",
        }}
      />

      {/* Main Content */}
      <main className="relative h-full w-full flex">
        {/* Sidebar */}
        <CalendarSidebar
          currentMonth={currentMonth}
          miniCalendarDays={miniCalendarDays}
          calendars={calendars}
          currentDate={currentDateObj}
          onPreviousMonth={onPreviousMonth}
          onNextMonth={onNextMonth}
          onDateClick={onDateClick}
          onCreateEvent={onCreateEvent}
        />

        {/* Calendar View */}
        <div className="flex-1 flex flex-col">
          {/* Calendar Controls */}
          <CalendarHeader
            currentDate={currentDate}
            currentView={currentView}
            onViewChange={onViewChange}
            onPrevious={onPrevious}
            onNext={onNext}
            onToday={onToday}
          />

          {/* Week View */}
          <div className="flex-1 overflow-auto p-4">
            <CalendarGrid
              weekDays={weekDays}
              weekDates={weekDates}
              timeSlots={timeSlots}
              events={events}
              onEventClick={onEventClick}
            />
          </div>
        </div>
      </main>

      {/* Calendar Moai Image - Outside sidebar */}
      <div className="absolute bottom-4 left-4 z-10">
        <img
          src="/src/assets/calendar-moai.png"
          alt="Calendar Moai"
          className="w-24 h-24 object-contain opacity-80"
        />
      </div>
    </div>
  )
}

export default FullCalendarTemplate
