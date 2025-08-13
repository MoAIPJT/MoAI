import React, { useState } from 'react'
import { Plus } from 'lucide-react'
import MiniCalendar from '../../molecules/MiniCalendar'
import CalendarList from '../../molecules/CalendarList'
import EventModal from '../../molecules/EventModal'
import type { CalendarSidebarProps } from './types'

// EventModal에서 사용하는 Event 타입 정의
interface Event {
  id?: string | number
  title: string
  description: string
  location: string
  startTime: string
  endTime: string
  attendees?: string[]
  color: string
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
  onCreateSchedule,
  onEditSchedule,
  studyId,
}) => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null)
  const [selectedDate, setSelectedDate] = useState<Date>(() => {
    // 현재 날짜로 초기화
    const now = new Date()
    console.log('CalendarSidebar selectedDate 초기값:', now)
    console.log('CalendarSidebar currentDate prop:', currentDate)
    return now
  })

  // studyId 디버깅
  console.log('CalendarSidebar에서 받은 studyId:', studyId)
  console.log('CalendarSidebar에서 받은 studyId 타입:', typeof studyId)

  // 날짜 클릭 핸들러
  const handleDateClick = (date: Date) => {
    setSelectedDate(date)
    onDateClick?.(date)
  }

  const handleCreateEvent = () => {
    if (onCreateSchedule && studyId) {
      // 일정 생성 모달 열기
      setIsCreateModalOpen(true)
    } else if (onCreateEvent) {
      // FullCalendar 내에서 일정 생성 버튼을 눌렀을 때
      onCreateEvent()
    }
  }

  const handleSaveEvent = () => {
    // EventModal에서 직접 onCreateSchedule을 호출하므로 여기서는 처리할 필요 없음
    // 기존 onSave 로직을 위한 fallback
    if (onCreateEvent) {
      onCreateEvent()
    }
  }

  const handleEditSchedule = (data: {
    scheduleId: number
    studyId: number
    startDatetime: string
    endDatetime: string
    title: string
    memo?: string
  }) => {
    if (onEditSchedule) {
      onEditSchedule(data)
      setIsCreateModalOpen(false)
      setSelectedEvent(null)
    }
  }

  const handleCloseModal = () => {
    setIsCreateModalOpen(false)
    setIsEditModalOpen(false)
    setSelectedEvent(null)
  }

  return (
    <>
      <div className="w-64 h-full bg-white/10 backdrop-blur-lg p-4 shadow-xl border-r border-white/20 rounded-tr-3xl flex flex-col justify-between">
        <div>
          <button
            onClick={handleCreateEvent}
            className="mb-6 flex items-center justify-center gap-2 rounded-full bg-[#795AA1] px-4 py-3 text-white w-full hover:bg-[#795AA1]/80 transition-colors"
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
            onDateClick={handleDateClick}
          />

          <CalendarList calendars={calendars} />
        </div>
      </div>

      {/* EventModal 사용 - 생성 모드 */}
      <EventModal
        isOpen={isCreateModalOpen}
        onClose={handleCloseModal}
        onSave={handleSaveEvent}
        selectedDate={selectedDate}
        onCreateSchedule={onCreateSchedule}
        studyId={studyId}
        isEditMode={false}
      />

      {/* EventModal 사용 - 수정 모드 */}
      <EventModal
        isOpen={isEditModalOpen}
        onClose={handleCloseModal}
        onSave={handleSaveEvent}
        selectedDate={selectedDate}
        event={selectedEvent || undefined}
        onEditSchedule={handleEditSchedule}
        studyId={studyId}
        isEditMode={true}
      />
    </>
  )
}

export default CalendarSidebar
