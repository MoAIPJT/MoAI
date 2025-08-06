export interface Category {
  id: string
  name: string
  isActive: boolean
}

export interface ContentItem {
  id: string
  title: string
  tags: string[]
  description: string
  author: {
    name: string
    avatar: string
  }
  date: string
  isSelected: boolean
}
