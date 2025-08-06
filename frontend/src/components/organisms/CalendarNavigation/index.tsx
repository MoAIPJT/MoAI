import React from 'react'
import { Search, Settings, Menu } from 'lucide-react'

const CalendarNavigation: React.FC = () => {
  return (
    <header className="absolute top-0 left-0 right-0 z-10 flex items-center justify-between px-8 py-6">
      <div className="flex items-center gap-4">
        <Menu className="h-6 w-6 text-white" />
        <span className="text-2xl font-semibold text-white drop-shadow-lg">Calendar</span>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/70" />
          <input
            type="text"
            placeholder="Search"
            className="rounded-full bg-white/10 backdrop-blur-sm pl-10 pr-4 py-2 text-white placeholder:text-white/70 border border-white/20 focus:outline-none focus:ring-2 focus:ring-white/30"
          />
        </div>
        <Settings className="h-6 w-6 text-white drop-shadow-md" />
        <div className="h-10 w-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold shadow-md">
          U
        </div>
      </div>
    </header>
  )
}

export default CalendarNavigation 