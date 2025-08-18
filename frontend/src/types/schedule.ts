export interface ScheduleItem {
  id: number
  startDatetime: string
  endDatetime: string
  title: string
  memo?: string
}

export interface MyScheduleItem extends ScheduleItem {
  name: string
  description: string
  image: string
}

export interface CreateScheduleReq {
  studyId: number
  userId: number
  startDatetime: string
  endDatetime: string
  title: string
  memo?: string
}

export interface EditScheduleReq {
  id: number
  studyId: number
  userId: number
  startDatetime?: string
  endDatetime?: string
  title?: string
  memo?: string
}

export interface DeleteScheduleReq {
  user_id: number
}
