import React from 'react'
import WeekDay from '../../atoms/WeekDay'
import CalendarEvent from '../../atoms/CalendarEvent'
import type { CalendarGridProps, CalendarEvent as GridEvent } from './types'

const CalendarGrid: React.FC<CalendarGridProps> = ({
  weekDays,
  weekDates,
  timeSlots,
  events,
  onEventClick,
  onDateClick,
  selectedDate,
  weekDateObjects,
  onEditEvent,
  onDeleteEvent,
}) => {
  // Helper function to calculate event position and height
  const calculateEventStyle = (startTime: string, endTime: string) => {
    // 시간을 24시간 형식으로 변환
    let startHour = 0
    let startMinute = 0
    let endHour = 0
    let endMinute = 0

    // startTime과 endTime 파싱 (예: "오전 02:00", "오후 08:00")
    if (startTime.includes('오전') || startTime.includes('오후')) {
      const timeStr = startTime.replace(/[오전오후]/g, '').trim()
      const [hour, minute] = timeStr.split(':').map(Number)
      startHour = startTime.includes('오후') && hour !== 12 ? hour + 12 : hour
      if (startTime.includes('오전') && hour === 12) startHour = 0
      startMinute = minute
    } else {
      // 이미 24시간 형식인 경우
      const [hour, minute] = startTime.split(':').map(Number)
      startHour = hour
      startMinute = minute
    }

    if (endTime.includes('오전') || endTime.includes('오후')) {
      const timeStr = endTime.replace(/[오전오후]/g, '').trim()
      const [hour, minute] = timeStr.split(':').map(Number)
      endHour = endTime.includes('오후') && hour !== 12 ? hour + 12 : hour
      if (endTime.includes('오전') && hour === 12) endHour = 0
      endMinute = minute
    } else {
      // 이미 24시간 형식인 경우
      const [hour, minute] = endTime.split(':').map(Number)
      endHour = hour
      endMinute = minute
    }

    // 8시부터 시작하므로 8을 빼고 계산
    const start = startHour + startMinute / 60 - 8
    const end = endHour + endMinute / 60 - 8

    // 각 시간 슬롯은 80px (h-20)
    const top = start * 80
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

  // Helper function to check if an event should be displayed on a specific day
  const shouldDisplayEventOnDay = (event: GridEvent, dayIndex: number) => {
    // StudyEvent 타입인 경우 date 속성으로 확인
    if ('date' in event && event.date) {
      const eventDate = new Date(event.date)
      const dayDate = weekDateObjects && weekDateObjects[dayIndex]
        ? weekDateObjects[dayIndex]
        : new Date(selectedDate || new Date())

      return eventDate.getFullYear() === dayDate.getFullYear() &&
             eventDate.getMonth() === dayDate.getMonth() &&
             eventDate.getDate() === dayDate.getDate()
    }

    // 기존 Event 타입인 경우 day 속성으로 확인
    if ('day' in event) {
      return event.day === dayIndex + 1
    }

    return false
  }

  // Helper function to get event display properties
  const getEventDisplayProps = (event: GridEvent) => {
    if ('date' in event && event.date) {
      // StudyEvent 타입: date에서 시간 추출
      const startDate = new Date(event.date)
      const endDate = new Date(event.date)

      // startTime과 endTime을 파싱하여 시간 설정
      if (event.startTime && event.endTime) {
        const [startHour, startMinute] = event.startTime.replace(/[오전오후]/g, '').split(':')
        const [endHour, endMinute] = event.endTime.replace(/[오전오후]/g, '').split(':')

        // 오전/오후 구분
        let startH = parseInt(startHour)
        let endH = parseInt(endHour)

        if (event.startTime.includes('오후') && startH !== 12) startH += 12
        if (event.startTime.includes('오전') && startH === 12) startH = 0
        if (event.endTime.includes('오후') && endH !== 12) endH += 12
        if (event.endTime.includes('오전') && endH === 12) endH = 0

        startDate.setHours(startH, parseInt(startMinute), 0, 0)
        endDate.setHours(endH, parseInt(endMinute), 0, 0)
      }

      // 24시간 형식으로 반환 (위치 계산에 사용)
      return {
        startTime: startDate.toLocaleTimeString('ko-KR', {
          hour: '2-digit',
          minute: '2-digit',
          hour12: false
        }),
        endTime: endDate.toLocaleTimeString('ko-KR', {
          hour: '2-digit',
          minute: '2-digit',
          hour12: false
        })
      }
    }

    // 기존 Event 타입
    return {
      startTime: event.startTime,
      endTime: event.endTime
    }
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
              <div key={i} className="h-20 border-b border-white/10 pr-2 text-right text-xs text-white flex items-center justify-end">
                {time > 12 ? `${time - 12} 오후` : `${time} 오전`}
              </div>
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
                .filter((event) => shouldDisplayEventOnDay(event, dayIndex))
                .map((event, i) => {
                  const displayProps = getEventDisplayProps(event)
                  const eventStyle = calculateEventStyle(displayProps.startTime, displayProps.endTime)

                  return (
                    <CalendarEvent
                      key={`${event.id}-${i}`}
                      event={{
                        ...event,
                        startTime: displayProps.startTime,
                        endTime: displayProps.endTime
                      }}
                      style={{
                        ...eventStyle,
                        left: "4px",
                        right: "4px",
                      }}
                      onClick={onEventClick}
                      onEditEvent={onEditEvent}
                      onDeleteEvent={onDeleteEvent}
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
