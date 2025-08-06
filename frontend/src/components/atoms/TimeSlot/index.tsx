import React from 'react'
import type { TimeSlotProps } from './types'

const TimeSlot: React.FC<TimeSlotProps> = ({ time }) => {
  return (
    <div className="h-20 border-b border-white/10 pr-2 text-right text-xs text-white/70">
      {time > 12 ? `${time - 12} PM` : `${time} AM`}
    </div>
  )
}

export default TimeSlot 