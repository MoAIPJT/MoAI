import React, { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import StudyDetailTemplate from '../components/templates/StudyDetailTemplate'
import type { StudyItem } from '../components/organisms/DashboardSidebar/types'
import { getStudies, getStudyById } from '../services/studyService'

const StudyDetailPage: React.FC = () => {
  const navigate = useNavigate()
  const { studyId } = useParams<{ studyId: string }>()
  const [selectedFilters, setSelectedFilters] = useState<string[]>(['프런트'])
  const [searchQuery, setSearchQuery] = useState('')
  const [expandedStudy, setExpandedStudy] = useState(true)
  const [activeStudyId, setActiveStudyId] = useState<string | null>(studyId || null)
  const [studies, setStudies] = useState<StudyItem[]>([])
  const [currentStudy, setCurrentStudy] = useState<StudyItem | null>(null)
  const [loading, setLoading] = useState(true)

  // 스터디 목록 로드
  useEffect(() => {
    const loadStudies = async () => {
      try {
        const studiesData = await getStudies()
        setStudies(studiesData)
      } catch (error) {
        console.error('Failed to load studies:', error)
      }
    }
    loadStudies()
  }, [])

  // 현재 스터디 정보 로드
  useEffect(() => {
    const loadCurrentStudy = async () => {
      if (activeStudyId) {
        try {
          const studyData = await getStudyById(activeStudyId)
          setCurrentStudy(studyData)
        } catch (error) {
          console.error('Failed to load current study:', error)
        } finally {
          setLoading(false)
        }
      }
    }
    loadCurrentStudy()
  }, [activeStudyId])

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

  const handleFilterClick = (filter: string) => {
    setSelectedFilters(prev =>
      prev.includes(filter)
        ? prev.filter(f => f !== filter)
        : [...prev, filter]
    )
  }

  const handleSearch = () => {
    console.log('Search:', searchQuery)
  }

  const handleUploadData = () => {
    console.log('Upload data clicked')
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

  const handleAddFilter = () => {
    console.log('Add filter clicked')
  }

  const handleSettingsClick = () => {
    console.log('Settings clicked')
  }

  // 화상회의 더미 참여자 데이터
  const dummyParticipants = [
    { id: '1', name: 'Kuromi', avatar: '👻' },
    // { id: '2', name: 'Heo', avatar: '👨' },
    // { id: '3', name: 'Hazel', avatar: '👩' },
    // { id: '4', name: 'Alice', avatar: '👧' },
    // { id: '5', name: 'Bob', avatar: '👦' },
    // { id: '6', name: 'Charlie', avatar: '🧑' },
    // { id: '7', name: 'Diana', avatar: '👱‍♀️' },
    // { id: '8', name: 'Eve', avatar: '👱‍♂️' },
  ]

    return (
    <StudyDetailTemplate
      studies={studies}
      activeStudyId={activeStudyId}
      expandedStudy={expandedStudy}
      loading={loading}
      currentStudy={currentStudy}
      selectedFilters={selectedFilters}
      searchQuery={searchQuery}
      onItemClick={handleItemClick}
      onStudyClick={handleStudyClick}
      onFilterClick={handleFilterClick}
      onSearch={handleSearch}
      onUploadData={handleUploadData}
      onCreateRoom={handleCreateRoom}
      onAddEvent={handleAddEvent}
      onEditNotice={handleEditNotice}
      onSearchQueryChange={setSearchQuery}
      onAddFilter={handleAddFilter}
      onSettingsClick={handleSettingsClick}
      participants={dummyParticipants}
    />
  )
}

export default StudyDetailPage
