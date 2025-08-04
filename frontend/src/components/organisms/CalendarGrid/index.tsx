import React from 'react'
import TimeSlot from '../../atoms/TimeSlot'
import WeekDay from '../../atoms/WeekDay'
import CalendarEvent from '../../atoms/CalendarEvent'
import type { CalendarGridProps } from './types'

const CalendarGrid: React.FC<CalendarGridProps> = ({
  weekDays,
  weekDates,
  timeSlots,
  events,
  onEventClick,
}) => {
  // Helper function to calculate event position and height
  const calculateEventStyle = (startTime: string, endTime: string) => {
    const start = Number.parseInt(startTime.split(":")[0]) + Number.parseInt(startTime.split(":")[1]) / 60
    const end = Number.parseInt(endTime.split(":")[0]) + Number.parseInt(endTime.split(":")[1]) / 60
    const top = (start - 8) * 80 // 80px per hour
    const height = (end - start) * 80
    return { top: `${top}px`, height: `${height}px` }
  }

  return (
    <div className="bg-white/20 backdrop-blur-lg rounded-xl border border-white/20 shadow-xl h-full">
      {/* Week Header */}
      <div className="grid grid-cols-8 border-b border-white/20">
        <div className="p-2 text-center text-white/50 text-xs"></div>
        {weekDays.map((day, i) => (
          <WeekDay
            key={i}
            day={day}
            date={weekDates[i]}
            isToday={weekDates[i] === 5}
          />
        ))}
      </div>

      {/* Time Grid */}
      <div className="grid grid-cols-8">
        {/* Time Labels */}
        <div className="text-white/70">
          {timeSlots.map((time, i) => (
            <TimeSlot key={i} time={time} />
          ))}
        </div>

        {/* Days Columns */}
        {Array.from({ length: 7 }).map((_, dayIndex) => (
          <div key={dayIndex} className="border-l border-white/20 relative">
            {timeSlots.map((_, timeIndex) => (
              <div key={timeIndex} className="h-20 border-b border-white/10"></div>
            ))}

            {/* Events */}
            {events
              .filter((event) => event.day === dayIndex + 1)
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
  )
}

export default CalendarGrid 