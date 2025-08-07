import React from 'react'
import CalendarSidebar from '../organisms/CalendarSidebar'
import CalendarHeader from '../molecules/CalendarHeader'
import CalendarGrid from '../organisms/CalendarGrid'
import type { Event as CalendarEvent } from '../atoms/CalendarEvent/types'

export interface FullCalendarTemplateProps {
  currentMonth: string
  currentDate: string
  currentView: string
  weekDays: string[]
  weekDates: number[]
  timeSlots: number[]
  events: CalendarEvent[]
  miniCalendarDays: (number | null)[]
  calendars: { name: string; color: string }[]
  onViewChange: (view: string) => void
  onPrevious: () => void
  onNext: () => void
  onPreviousMonth: () => void
  onNextMonth: () => void
  onEventClick: (event: CalendarEvent) => void
  onToday?: () => void
  onDateClick?: (date: Date) => void
  onCreateEvent?: () => void
  selectedDate?: Date // 사용자가 선택한 날짜
  weekDateObjects?: Date[] // 현재 주의 전체 Date 객체들
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
  selectedDate,
  weekDateObjects,
}) => {
  // Convert string date to Date object for sidebar and selected date
  const currentDateObj = new Date(currentDate)
  const selectedDateObj = selectedDate || currentDateObj

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
          <div className="flex-1 p-4 min-h-0">
            <CalendarGrid
              weekDays={weekDays}
              weekDates={weekDates}
              timeSlots={timeSlots}
              events={events}
              onEventClick={onEventClick}
              onDateClick={onDateClick}
              selectedDate={selectedDateObj}
              weekDateObjects={weekDateObjects}
            />
          </div>
        </div>
      </main>


    </div>
  )
}

export default FullCalendarTemplate
