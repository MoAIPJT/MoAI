import React from 'react'
import TimeSlot from '../../atoms/TimeSlot'
import WeekDay from '../../atoms/WeekDay'
import CalendarEvent from '../../atoms/CalendarEvent'
import type { CalendarGridProps } from './types'

// StudyEvent 타입 정의 (StudyCalendar와 동일)
interface StudyEvent {
  id: number
  title: string
  startTime: string
  endTime: string
  color: string
  day: number
  description: string
  location: string
  attendees: string[]
  organizer: string
  date?: Date // 선택적 date 속성
}

const CalendarGrid: React.FC<CalendarGridProps> = ({
  weekDays,
  weekDates,
  timeSlots,
  events,
  onEventClick,
  onDateClick,
  selectedDate,
  weekDateObjects,
}) => {
  // Helper function to calculate event position and height
  const calculateEventStyle = (startTime: string, endTime: string) => {
    const start = Number.parseInt(startTime.split(":")[0]) + Number.parseInt(startTime.split(":")[1]) / 60
    const end = Number.parseInt(endTime.split(":")[0]) + Number.parseInt(endTime.split(":")[1]) / 60
    const top = (start - 8) * 80 // 80px per hour
    const height = (end - start) * 80
    return { top: `${top}px`, height: `${height}px` }
  }

  // Helper function to check if a date is selected/today
  const isDateSelected = (dayIndex: number) => {
    // Use selected date if provided, otherwise use today
    const targetDate = selectedDate || new Date()

    // If we have weekDateObjects, use them for accurate comparison
    if (weekDateObjects && weekDateObjects[dayIndex]) {
      const dayDate = weekDateObjects[dayIndex]
      return targetDate.getFullYear() === dayDate.getFullYear() &&
             targetDate.getMonth() === dayDate.getMonth() &&
             targetDate.getDate() === dayDate.getDate()
    }

    // Simple approach: just check if the date number matches
    // This works when the selected date is in the same week being displayed
    return targetDate.getDate() === weekDates[dayIndex]
  }

  // Handle date cell click
  const handleDateCellClick = (dayIndex: number, timeIndex: number) => {
    if (!onDateClick) return

    let clickedDate: Date

    // Use weekDateObjects if available for accurate date calculation
    if (weekDateObjects && weekDateObjects[dayIndex]) {
      clickedDate = new Date(weekDateObjects[dayIndex])
    } else {
      // Fallback: Use weekDates to create date for the clicked cell
      const referenceDate = selectedDate || new Date()
      const clickedDateNumber = weekDates[dayIndex]
      clickedDate = new Date(referenceDate.getFullYear(), referenceDate.getMonth(), clickedDateNumber)
    }

    // Set time based on time slot (starting from 8 AM)
    const hour = 8 + timeIndex
    clickedDate.setHours(hour, 0, 0, 0)

    onDateClick(clickedDate)
  }

  return (
    <div className="bg-white/20 backdrop-blur-lg rounded-xl border border-white/20 shadow-xl flex flex-col min-h-0">
      {/* Week Header */}
      <div className="grid grid-cols-8 border-b border-white/20 flex-shrink-0">
        <div className="p-2 text-center text-white text-xs"></div>
        {weekDays.map((day, i) => (
          <WeekDay
            key={i}
            day={day}
            date={weekDates[i]}
            isToday={isDateSelected(i)}
          />
        ))}
      </div>

      {/* Time Grid - Scrollable */}
      <div className="flex-1 overflow-auto">
        <div className="grid grid-cols-8">
          {/* Time Labels */}
          <div className="text-white">
            {timeSlots.map((time, i) => (
              <TimeSlot key={i} time={time} />
            ))}
          </div>

          {/* Days Columns */}
          {Array.from({ length: 7 }).map((_, dayIndex) => (
            <div key={dayIndex} className="border-l border-white/20 relative">
              {timeSlots.map((_, timeIndex) => (
                <div
                  key={timeIndex}
                  className="h-20 border-b border-white/10 cursor-pointer hover:bg-white/10 transition-colors"
                  onClick={() => handleDateCellClick(dayIndex, timeIndex)}
                ></div>
              ))}

              {/* Events */}
              {events
                .filter((event) => {
                  // StudyEvent 타입으로 캐스팅하여 date 속성 확인
                  const studyEvent = event as StudyEvent

                  // event.date가 있는 경우 date 기반으로 필터링
                  if (studyEvent.date) {
                    const eventDate = new Date(studyEvent.date)
                    const dayDate = weekDateObjects && weekDateObjects[dayIndex]
                      ? weekDateObjects[dayIndex]
                      : new Date(selectedDate || new Date())

                    return eventDate.getFullYear() === dayDate.getFullYear() &&
                           eventDate.getMonth() === dayDate.getMonth() &&
                           eventDate.getDate() === dayDate.getDate()
                  }

                  // event.day가 있는 경우 기존 로직 사용
                  return event.day === dayIndex + 1
                })
                .map((event, i) => {
                  const eventStyle = calculateEventStyle(event.startTime, event.endTime)
                  return (
                    <CalendarEvent
                      key={i}
                      event={event}
                      style={{
                        ...eventStyle,
                        left: "4px",
                        right: "4px",
                      }}
                      onClick={onEventClick}
                    />
                  )
                })}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default CalendarGrid
