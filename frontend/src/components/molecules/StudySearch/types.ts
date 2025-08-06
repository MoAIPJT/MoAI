export interface StudySearchProps {
  searchQuery: string
  onSearch: () => void
  onSearchQueryChange: (query: string) => void
  placeholder?: string
}
