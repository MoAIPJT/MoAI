export interface SearchBarProps {
  searchTerm: string
  onSearchChange: (term: string) => void
  onSearch: () => void
  sortOrder: 'newest' | 'oldest'
  onSortChange: (order: 'newest' | 'oldest') => void
}
