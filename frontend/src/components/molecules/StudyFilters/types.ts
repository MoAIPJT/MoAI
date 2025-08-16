export interface StudyFiltersProps {
  selectedFilters: string[]
  onFilterClick: (filter: string) => void
  onAddFilter: () => void
}
