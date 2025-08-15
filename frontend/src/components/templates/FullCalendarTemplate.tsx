import React from 'react'
import CalendarSidebar from '../organisms/CalendarSidebar'
import CalendarHeader from '../molecules/CalendarHeader'
import CalendarGrid from '../organisms/CalendarGrid'
import type { CalendarEvent } from '../organisms/CalendarGrid/types'

export interface FullCalendarTemplateProps {
  currentMonth: string
  currentDate: Date
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
  // 일정 생성 관련 props 추가
  onCreateSchedule?: (data: {
    studyId: number
    startDatetime: string
    endDatetime: string
    title: string
    memo?: string
  }) => Promise<void>
  // 일정 수정 관련 props 추가
  onEditSchedule?: (data: {
    scheduleId: number
    studyId: number
    startDatetime: string
    endDatetime: string
    title: string
    memo?: string
  }) => Promise<void>
  // 일정 수정/삭제 이벤트 props 추가
  onEditEvent?: (event: CalendarEvent) => void
  onDeleteEvent?: (event: CalendarEvent) => void
  studyId?: number // 현재 스터디 ID
  currentUserRole?: 'ADMIN' | 'DELEGATE' | 'MEMBER' // 현재 사용자 권한
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
  onCreateSchedule,
  onEditSchedule,
  onEditEvent,
  onDeleteEvent,
  studyId,
  currentUserRole,
}) => {
  // 현재 날짜와 선택된 날짜를 Date 객체로 변환
  const currentDateObj = currentDate ? new Date(currentDate) : new Date()
  const selectedDateObj = selectedDate ? new Date(selectedDate) : new Date()

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
          onCreateSchedule={onCreateSchedule}
          onEditSchedule={onEditSchedule}
          studyId={studyId}
          currentUserRole={currentUserRole}
        />

        {/* Calendar View */}
        <div className="flex-1 flex flex-col">
          {/* Calendar Controls */}
          <CalendarHeader
            currentDate={currentDateObj.toISOString().split('T')[0]}
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
              onEditEvent={onEditEvent}
              onDeleteEvent={onDeleteEvent}
            />
          </div>
        </div>
      </main>
    </div>
  )
}

export default FullCalendarTemplate
