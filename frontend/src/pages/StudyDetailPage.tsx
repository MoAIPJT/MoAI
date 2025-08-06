import React, { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import StudyDetailTemplate from '../components/templates/StudyDetailTemplate'
import CategoryAddModal from '../components/organisms/CategoryAddModal'
import type { StudyItem } from '../components/organisms/DashboardSidebar/types'
import type { Category, ContentItem } from '../types/content'
import type { UploadData } from '../components/organisms/UploadDataModal/types'
import { getStudies, getStudyById } from '../services/studyService'

const StudyDetailPage: React.FC = () => {
  const navigate = useNavigate()
  const { studyId } = useParams<{ studyId: string }>()

  const [expandedStudy, setExpandedStudy] = useState(true)
  const [activeStudyId, setActiveStudyId] = useState<string | null>(studyId || null)
  const [studies, setStudies] = useState<StudyItem[]>([])
  const [currentStudy, setCurrentStudy] = useState<StudyItem | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Content Management 관련 상태
  const [categories, setCategories] = useState<Category[]>([
    { id: 'frontend', name: '프론트', isActive: true },
    { id: 'backend', name: '백엔드', isActive: false },
    { id: 'ai', name: 'AI', isActive: false },
  ])

  const [showCategoryModal, setShowCategoryModal] = useState(false)
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest'>('newest')

  // Upload Modal 관련 상태
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false)

  const [contents, setContents] = useState<ContentItem[]>([
    {
      id: '1',
      title: 'React 컴포넌트 최적화 가이드',
      tags: ['프론트', 'AI'],
      description: 'React 컴포넌트의 성능을 최적화하는 방법과 best practices에 대한 가이드입니다. 메모이제이션과 렌더링 최적화 기법을 다룹니다.',
      author: {
        name: 'Hazel',
        avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=32&h=32&fit=crop&crop=face'
      },
      date: '25.11.22',
      isSelected: false,
    },
    {
      id: '2',
      title: 'Spring Boot API 설계',
      tags: ['백엔드', 'AI'],
      description: 'Spring Boot를 사용한 RESTful API 설계 방법과 데이터베이스 연동, 보안 설정에 대한 내용입니다.',
      author: {
        name: 'Hazel',
        avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=32&h=32&fit=crop&crop=face'
      },
      date: '25.11.22',
      isSelected: false,
    },
    {
      id: '3',
      title: '프론트엔드 상태 관리',
      tags: ['프론트', '백엔드'],
      description: 'Redux, Zustand, Recoil 등 다양한 상태 관리 라이브러리 비교와 실제 프로젝트 적용 사례를 다룹니다.',
      author: {
        name: 'Hazel',
        avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=32&h=32&fit=crop&crop=face'
      },
      date: '25.11.22',
      isSelected: false,
    },
    {
      id: '4',
      title: '머신러닝 모델 배포',
      tags: ['AI', '백엔드'],
      description: 'TensorFlow, PyTorch 모델을 실제 서비스에 배포하는 방법과 MLOps 파이프라인 구축에 대한 가이드입니다.',
      author: {
        name: 'Hazel',
        avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=32&h=32&fit=crop&crop=face'
      },
      date: '25.11.22',
      isSelected: false,
    },
  ])

  // 스터디 목록 로드
  useEffect(() => {
    const loadStudies = async () => {
      try {
        setError(null)
        const studiesData = await getStudies()
        console.log('Loaded studies:', studiesData) // 디버깅용
        setStudies(Array.isArray(studiesData) ? studiesData : [])
      } catch (error) {
        console.error('Failed to load studies:', error)
        setError('스터디 목록을 불러오는데 실패했습니다.')
        setStudies([]) // 에러 시 빈 배열로 설정
      }
    }
    loadStudies()
  }, [])

  // 현재 스터디 정보 로드
  useEffect(() => {
    const loadCurrentStudy = async () => {
      if (activeStudyId) {
        try {
          setError(null)
          const studyData = await getStudyById(activeStudyId)
          setCurrentStudy(studyData)
        } catch (error) {
          console.error('Failed to load current study:', error)
          setError('스터디 정보를 불러오는데 실패했습니다.')
        } finally {
          setLoading(false)
        }
      } else {
        setLoading(false)
      }
    }
    loadCurrentStudy()
  }, [activeStudyId])

  // 선택된 카테고리와 검색어에 따라 콘텐츠 필터링
  const filteredContents = contents.filter(content => {
    // 카테고리 필터링 (AND 조건)
    const categoryFilter = selectedCategories.length === 0 ||
      selectedCategories.every(categoryId => {
        const category = categories.find(c => c.id === categoryId)
        return category && content.tags.some(tag => tag.includes(category.name))
      })

    // 검색어 필터링
    const searchFilter = !searchTerm.trim() ||
      content.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      content.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      content.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))

    return categoryFilter && searchFilter
  })

  const handleItemClick = (itemId: string) => {
    console.log('Navigation clicked:', itemId)

    // 스터디 클릭 시 토글
    if (itemId === 'study') {
      setExpandedStudy(!expandedStudy)
    }

    // AI 요약본 클릭 시 새 탭에서 AI 요약본 페이지 열기
    if (itemId === 'ai-summary') {
      window.open('/ai-summary', '_blank')
    }

    // 마이페이지 클릭 시 대시보드로 이동
    if (itemId === 'mypage') {
      navigate('/dashboard')
    }
  }

  const handleStudyClick = (studyId: string) => {
    setActiveStudyId(studyId)
    setLoading(true) // 로딩 상태 활성화

    // 즉시 현재 스터디 목록에서 해당 스터디 정보를 찾아서 임시로 설정
    const selectedStudy = studies.find(study => study.id === studyId)
    if (selectedStudy) {
      setCurrentStudy(selectedStudy)
    }

    console.log('Selected study:', studyId)
    // 선택된 스터디로 페이지 이동
    navigate(`/study/${studyId}`)
  }

  const handleSearch = () => {
    console.log('Search performed')
  }

  const handleUploadData = () => {
    console.log('Upload data clicked')
    setIsUploadModalOpen(true)
  }

  const handleCreateRoom = () => {
    console.log('Create room clicked')
  }

  const handleAddEvent = () => {
    console.log('Add event clicked')
  }

  const handleEditNotice = () => {
    console.log('Edit notice clicked')
  }



  const handleSettingsClick = () => {
    console.log('Settings clicked')
  }

  // Content Management 관련 핸들러들
  const handleCategoryToggle = (categoryId: string) => {
    setSelectedCategories(prev => {
      if (prev.includes(categoryId)) {
        return prev.filter(id => id !== categoryId)
      } else {
        return [...prev, categoryId]
      }
    })
  }

  const handleAddCategory = () => {
    setShowCategoryModal(true)
  }

  const handleAddNewCategory = (categoryName: string) => {
    const newCategory: Category = {
      id: `category-${Date.now()}`,
      name: categoryName,
      isActive: false,
    }
    setCategories(prev => [...prev, newCategory])
  }

  const handleContentSelect = (contentId: string) => {
    console.log('Content selected:', contentId)
    setContents(prevContents =>
      prevContents.map(content =>
        content.id === contentId
          ? { ...content, isSelected: !content.isSelected }
          : content
      )
    )
  }

  const handleContentPreview = (contentId: string) => {
    console.log('Content preview:', contentId)
  }

  // Upload Modal 관련 핸들러들
  const handleUploadModalClose = () => {
    setIsUploadModalOpen(false)
  }

  const handleUploadSubmit = (data: UploadData) => {
    console.log('Upload data submitted:', data)

    // 새로운 콘텐츠 아이템 생성
    const newContent: ContentItem = {
      id: `content-${Date.now()}`,
      title: data.title,
      description: data.description,
      tags: data.selectedCategories.map(categoryId => {
        const category = categories.find(c => c.id === categoryId)
        return category?.name || categoryId
      }),
      author: {
        name: 'Current User', // 실제로는 현재 로그인한 사용자 정보
        avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=32&h=32&fit=crop&crop=face'
      },
      date: new Date().toLocaleDateString('ko-KR', {
        year: '2-digit',
        month: '2-digit',
        day: '2-digit'
      }).replace(/\. /g, '.').replace(/\.$/, ''),
      isSelected: false,
    }

    // 콘텐츠 목록에 추가 (최신순이므로 맨 앞에 추가)
    setContents(prev => [newContent, ...prev])

    // 모달 닫기
    setIsUploadModalOpen(false)

    // 성공 메시지 표시 (실제로는 toast 등을 사용)
    console.log('자료가 성공적으로 업로드되었습니다!')
  }

  // 화상회의 더미 참여자 데이터
  const dummyParticipants = [
    { id: '1', name: 'Kuromi', avatar: '👻' },
  ]

  // 에러가 있으면 에러 메시지 표시
  if (error) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="text-center">
          <div className="text-red-500 text-xl mb-4">⚠️</div>
          <p className="text-gray-600">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600"
          >
            다시 시도
          </button>
        </div>
      </div>
    )
  }

  return (
    <>
      <StudyDetailTemplate
        studies={Array.isArray(studies) ? studies : []}
        activeStudyId={activeStudyId}
        expandedStudy={expandedStudy}
        loading={loading}
        currentStudy={currentStudy}
        onItemClick={handleItemClick}
        onStudyClick={handleStudyClick}
        onSearch={handleSearch}
        onUploadData={handleUploadData}
        onCreateRoom={handleCreateRoom}
        onAddEvent={handleAddEvent}
        onEditNotice={handleEditNotice}
        onSettingsClick={handleSettingsClick}
        participants={dummyParticipants}
        // Content Management 관련 props
        categories={categories}
        selectedCategories={selectedCategories}
        contents={filteredContents}
        searchTerm={searchTerm}
        sortOrder={sortOrder}
        // Upload Modal 관련 props
        isUploadModalOpen={isUploadModalOpen}
        onCategoryToggle={handleCategoryToggle}
        onAddCategory={handleAddCategory}
        onSearchChange={setSearchTerm}
        onSortChange={setSortOrder}
        onContentSelect={handleContentSelect}
        onContentPreview={handleContentPreview}
        // Upload Modal 관련 핸들러들
        onUploadModalClose={handleUploadModalClose}
        onUploadSubmit={handleUploadSubmit}
      />

      {/* Category Add Modal */}
      <CategoryAddModal
        isOpen={showCategoryModal}
        onClose={() => setShowCategoryModal(false)}
        onAdd={handleAddNewCategory}
      />
    </>
  )
}

export default StudyDetailPage
