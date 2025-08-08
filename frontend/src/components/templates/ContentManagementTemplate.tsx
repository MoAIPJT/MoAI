import React, { useState, useEffect } from 'react'
import CategoryTab from '../atoms/CategoryTab'
import SearchBar from '../molecules/SearchBar'
import ContentList from '../organisms/ContentList'
import FloatingAISummary from '../molecules/FloatingAISummary'
import type { Category, ContentItem } from '@/types/content'

interface ContentManagementTemplateProps {
  categories: Category[]
  selectedCategories: string[]
  contents: ContentItem[]
  searchTerm: string
  sortOrder: 'newest' | 'oldest'
  onCategoryToggle: (categoryId: string) => void
  onAddCategory: () => void
  onSearchChange: (term: string) => void
  onSearch: () => void
  onSortChange: (order: 'newest' | 'oldest') => void
  onContentSelect: (contentId: string) => void
  onContentPreview: (contentId: string) => void
  onUploadData: () => void
}

const ContentManagementTemplate: React.FC<ContentManagementTemplateProps> = ({
  categories,
  selectedCategories,
  contents,
  searchTerm,
  sortOrder,
  onCategoryToggle,
  onAddCategory,
  onSearchChange,
  onSearch,
  onSortChange,
  onContentSelect,
  onContentPreview,
  onUploadData,
}) => {
  // AI Summary Modal 상태 관리
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [modalTitle, setModalTitle] = useState('')
  const [modalDescription, setModalDescription] = useState('')
  const [selectedModel, setSelectedModel] = useState('gpt-mini')
  const [prompt, setPrompt] = useState('')
  const [isSelectAll, setIsSelectAll] = useState(false)
  const [selectionOrder, setSelectionOrder] = useState<string[]>([])

  // 선택된 컨텐츠가 있는지 확인하여 모달 표시 여부 결정
  const hasSelectedContents = contents.some(content => content.isSelected)

  // 선택 순서 업데이트
  useEffect(() => {
    const currentSelected = contents.filter(content => content.isSelected).map(content => content.id)
    const newOrder = selectionOrder.filter(id => currentSelected.includes(id))
    const newSelections = currentSelected.filter(id => !selectionOrder.includes(id))
    setSelectionOrder([...newOrder, ...newSelections])
  }, [contents.map(c => c.isSelected).join(',')]) // 선택 상태가 변경될 때만 실행

  useEffect(() => {
    if (hasSelectedContents && !isModalVisible) {
      setIsModalVisible(true)
    } else if (!hasSelectedContents && isModalVisible) {
      setIsModalVisible(false)
    }
  }, [hasSelectedContents, isModalVisible])

  // 전체선택 처리
  useEffect(() => {
    if (isSelectAll) {
      contents.forEach(content => {
        if (!content.isSelected) {
          onContentSelect(content.id)
        }
      })
    }
  }, [isSelectAll, contents, onContentSelect])

  const handleModalClose = () => {
    setIsModalVisible(false)
    // 모든 선택 해제
    contents.forEach(content => {
      if (content.isSelected) {
        onContentSelect(content.id)
      }
    })
    // 모달 상태 초기화
    setModalTitle('')
    setModalDescription('')
    setPrompt('')
    setIsSelectAll(false)
    setSelectionOrder([])
  }

  const handleContentRemove = (contentId: string) => {
    onContentSelect(contentId) // 선택 해제
    setSelectionOrder(prev => prev.filter(id => id !== contentId))
  }

  // 선택된 컨텐츠들을 선택 순서대로 정렬하여 FloatingAISummary에 전달
  const selectedContents = selectionOrder
    .map(id => contents.find(content => content.id === id && content.isSelected))
    .filter(Boolean)
    .map(content => ({
      id: content!.id,
      title: content!.title,
      description: content!.description,
      tags: content!.tags
    }))

  const handleModalSubmit = async () => {
    const selectedContents = contents.filter(content => content.isSelected)

    // 여기에 실제 AI 요약본 생성 API 호출 로직 추가
    await new Promise(resolve => setTimeout(resolve, 2000)) // 임시 지연

    // 성공 후 모달 닫기
    handleModalClose()
  }
  return (
    <div className="h-full flex flex-col bg-gray-50">
      {/* Category Tabs - attached to the box */}
      <div className="px-0 pt-0 pb-0">
        <CategoryTab
          categories={categories}
          selectedCategories={selectedCategories}
          onCategoryToggle={onCategoryToggle}
          onAddClick={onAddCategory}
        />
      </div>

      {/* Main Content Box - 스크롤 가능하게 수정 */}
      <div className="flex-1 bg-white rounded-lg shadow-sm flex flex-col min-h-0 relative">
        {/* Upload Button - MainContent 박스의 오른쪽 위에 배치 */}
        <div className="absolute top-4 right-4 z-10">
          <button
            onClick={onUploadData}
            className="px-6 py-2 bg-[#AA64FF] text-white rounded-lg hover:bg-[#9955EE] transition-colors"
          >
            자료 올리기
          </button>
        </div>

        {/* Search Bar */}
        <div className="p-4 pb-2 flex-shrink-0">
          <SearchBar
            searchTerm={searchTerm}
            onSearchChange={onSearchChange}
            onSearch={onSearch}
            sortOrder={sortOrder}
            onSortChange={onSortChange}
          />
        </div>

        {/* Content List - 스크롤 가능한 영역 */}
        <div className="flex-1 overflow-y-auto px-4 pb-4">
          <ContentList
            contents={contents}
            onContentSelect={onContentSelect}
            onContentPreview={onContentPreview}
          />
        </div>
      </div>

      {/* AI Summary Modal */}
      <FloatingAISummary
        title={modalTitle}
        description={modalDescription}
        selectedModel={selectedModel}
        prompt={prompt}
        isSelectAll={isSelectAll}
        isVisible={isModalVisible}
        selectedContents={selectedContents}
        onTitleChange={setModalTitle}
        onDescriptionChange={setModalDescription}
        onModelChange={setSelectedModel}
        onPromptChange={setPrompt}
        onSelectAllChange={setIsSelectAll}
        onContentRemove={handleContentRemove}
        onSubmit={handleModalSubmit}
        onClose={handleModalClose}
      />
    </div>
  )
}

export default ContentManagementTemplate
