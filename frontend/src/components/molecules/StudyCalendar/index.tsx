import React, { useState } from 'react'
import { Calendar } from '@/components/ui/calendar'
import { Button } from '@/components/ui/button'
import type { StudyCalendarProps } from './types'
import { customLocale } from '@/lib/locales/en-custom'

const getMonthName = (month: number): string => {
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ]
  return months[month]
}

const StudyCalendar: React.FC<StudyCalendarProps> = ({
  onAddEvent,
}) => {
  const [date, setDate] = useState<Date | undefined>(new Date())

  return (
    <div className="bg-white rounded-lg border border-gray-200 h-full flex flex-col">
      {/* 헤더 */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => {
              const newDate = new Date(date || new Date())
              newDate.setMonth(newDate.getMonth() - 1)
              setDate(newDate)
            }}
            className="text-gray-400 -mt-3 hover:bg-transparent hover:text-gray-400"
          >
            <span className="text-5xl">‹</span>
          </Button>
          <h3 className="text-2xl font-bold">
            {date ? `${getMonthName(date.getMonth())} ${date.getFullYear()}` : `${getMonthName(new Date().getMonth())} ${new Date().getFullYear()}`}
          </h3>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => {
              const newDate = new Date(date || new Date())
              newDate.setMonth(newDate.getMonth() + 1)
              setDate(newDate)
            }}
            className="text-gray-400 -mt-2 hover:bg-transparent hover:text-gray-400"
          >
            <span className="text-5xl">›</span>
          </Button>
        </div>
        <Button
          onClick={onAddEvent}
          className="w-8 h-8 p-0 rounded-full"
          variant="ghost"
        >
          <span className="text-xl">+</span>
        </Button>
      </div>

      {/* 달력 */}
      <div className="flex-1 px-4 pb-4 pt-0 flex justify-center">
        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
          month={date}
          locale={customLocale}
          className="w-fit"

          classNames={{
            months: "w-full",
            month: "w-full",
            caption: "hidden m-0 p-0 h-0",
            caption_label: "hidden",
            nav: "hidden m-0 p-0",
            nav_button: "hidden",
            nav_button_previous: "hidden",
            nav_button_next: "hidden",
            table: "w-full border-collapse",
            head_row: "flex m-0 p-0",
            weekday: "size-14 p-0 text-xs font-medium text-muted-foreground/80 [&:nth-child(1)]:text-red-500 [&:nth-child(7)]:text-blue-500 [&:nth-child(1)]:before:content-['Sun'] [&:nth-child(2)]:before:content-['Mon'] [&:nth-child(3)]:before:content-['Tue'] [&:nth-child(4)]:before:content-['Wed'] [&:nth-child(5)]:before:content-['Thu'] [&:nth-child(6)]:before:content-['Fri'] [&:nth-child(7)]:before:content-['Sat'] [&:nth-child(1)]:before:text-red-500 [&:nth-child(7)]:before:text-blue-500 [&>*]:hidden [&:before]:block [&:before]:text-center [&>*]:opacity-0 [&>*]:text-transparent [&>*]:font-size-0 [&>*]:text-[0px]",
            head_cell: "text-muted-foreground rounded-md w-14 font-normal text-[0.8rem] [&:nth-child(1)]:text-red-500 [&:nth-child(7)]:text-blue-500",
            row: "flex w-full mt-2",
            cell: "h-9 w-14 text-center text-sm p-0 relative [&:has([aria-selected].day-range-end)]:rounded-r-md [&:has([aria-selected].day-outside)]:bg-accent/50 [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
            day: "h-9 w-14 p-0 font-normal aria-selected:opacity-100",
            day_range_end: "day-range-end",
            day_selected: "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
            day_today: "bg-accent text-accent-foreground",
            day_outside: "day-outside text-muted-foreground opacity-50 aria-selected:bg-accent/50 aria-selected:text-muted-foreground aria-selected:opacity-30",
            day_disabled: "text-muted-foreground opacity-50",
            day_range_middle: "aria-selected:bg-accent aria-selected:text-accent-foreground",
            day_hidden: "invisible",
          }}

        />
      </div>


    </div>
  )
}

export default StudyCalendar
