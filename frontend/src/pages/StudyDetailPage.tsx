import React, { useState, useEffect, useMemo } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import StudyDetailTemplate from '../components/templates/StudyDetailTemplate'
import CategoryAddModal from '../components/organisms/CategoryAddModal'
import EditFileModal from '../components/organisms/EditFileModal'
import PDFPreviewModal from '../components/organisms/PDFPreviewModal'
import type { StudyItem } from '../components/organisms/DashboardSidebar/types'
import type { ContentItem } from '../types/content'
import { getSidebarStudies, updateStudyNotice, joinStudy, leaveStudy, deleteStudyMember } from '../services/studyService'
import { useStudyDetail, useStudyMembers, useJoinRequests, useAcceptJoinRequest, useRejectJoinRequest, useChangeMemberRole, useUpdateStudy } from "../hooks/useStudies";
import { useQueryClient } from '@tanstack/react-query'
import type { Member } from '../types/study'
import { useRefFiles } from '../hooks/useRefFiles'
import type { FileItem } from '../types/ref'
import type { UploadData } from '../components/organisms/UploadDataModal/types'
import { refService } from '../services/refService'
import { useStudySchedules } from '../hooks/useSchedules'

const StudyDetailPage: React.FC = () => {
  const navigate = useNavigate()
  const { hashId } = useParams<{ hashId: string }>()
  const queryClient = useQueryClient()

  const [expandedStudy, setExpandedStudy] = useState(true)
  const [activeStudyId, setActiveStudyId] = useState<string | null>(hashId || null)
  const [studies, setStudies] = useState<StudyItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentMonth] = useState(() => {
    const now = new Date()
    return { year: now.getFullYear(), month: now.getMonth() + 1 }
  })

  // ✅ React Query 훅 사용 - studyDetail만 필요
  const {
    data: studyDetail,
    isLoading: isStudyLoading,
    error: studyError
  } = useStudyDetail(activeStudyId || '')

  // ✅ 멤버 정보는 필요할 때만 로드 (예: 멤버 관리 모달)
  const {
    data: participants = [],
    error: membersError
  } = useStudyMembers(studyDetail?.studyId)

  // ✅ 스터디별 일정 조회
  const {
    data: studySchedules = [],
    isLoading: isSchedulesLoading
  } = useStudySchedules(
    studyDetail?.studyId || 0,
    currentMonth.year,
    currentMonth.month
  )

  // ✅ refService 훅 사용 - 카테고리 관리
  const { useCategories, useCreateCategory, useDeleteCategory, useRefList, useUploadRef } = useRefFiles()

  // 카테고리 목록 조회
  const {
    data: categories = [],
    isLoading: isCategoriesLoading,
    error: categoriesError
  } = useCategories(studyDetail?.studyId || 0)

  // ✅ 공부 자료 목록 조회 - /ref/list 엔드포인트 사용
  const {
    data: refFiles = [],
    isLoading: isRefFilesLoading,
    error: refFilesError
  } = useRefList(studyDetail?.studyId || 0)

  // 디버깅을 위한 로그
  console.log('=== 공부 자료 목록 조회 디버깅 ===')
  console.log('studyDetail?.studyId:', studyDetail?.studyId)
  console.log('refFiles:', refFiles)
  console.log('isRefFilesLoading:', isRefFilesLoading)
  console.log('refFilesError:', refFilesError)
  console.log('================================')

  // 카테고리 생성/삭제 mutation
  const createCategoryMutation = useCreateCategory(studyDetail?.studyId || 0)
  const deleteCategoryMutation = useDeleteCategory(studyDetail?.studyId || 0)

  // ✅ 파일 업로드 mutation
  const uploadRefMutation = useUploadRef(studyDetail?.studyId || 0)

  // 멤버 데이터 디버깅
  console.log('=== 멤버 목록 디버깅 ===')
  console.log('participants:', participants)
  participants.forEach(member => {
    console.log('Member:', {
      userId: member.userId,
      name: member.member,
      role: member.role,
      email: member.email
    })
  })
  console.log('========================')

  const {
  data: joinRequests = []
} = useJoinRequests(
  // 관리자 권한이 있을 때만 가입 요청 목록 조회
  studyDetail?.role === 'ADMIN' ? (studyDetail?.studyId || 0) : 0
)

  // Mutation 훅들
  const acceptJoinRequestMutation = useAcceptJoinRequest(studyDetail?.studyId || 0)
  const rejectJoinRequestMutation = useRejectJoinRequest(studyDetail?.studyId || 0)
  const changeMemberRoleMutation = useChangeMemberRole(studyDetail?.studyId || 0)

  // Content Management 관련 상태
  const [showCategoryModal, setShowCategoryModal] = useState(false)
  const [selectedCategories, setSelectedCategories] = useState<number[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest'>('newest')

  // Upload Modal 관련 상태
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false)

  // ✅ 수정 모달 관련 상태
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [editingContent, setEditingContent] = useState<ContentItem | null>(null)

  // ✅ PDF 미리보기 모달 관련 상태
  const [isPDFModalOpen, setIsPDFModalOpen] = useState(false)
  const [previewingContent, setPreviewingContent] = useState<(ContentItem & { originalFileId: number }) | null>(null)

  // ✅ FileItem을 ContentItem으로 변환하는 함수
  const convertFileToContent = (file: FileItem): ContentItem & { originalFileId: number } => ({
    id: file.fileId.toString(),
    title: file.title,
    description: file.description || '',
    tags: file.categories || [],
    author: {
      name: file.name || 'Unknown',
      avatar: file.profileImageUrl || 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=32&h=32&fit=crop&crop=face'
    },
    date: file.updateDate || file.uploadDate || new Date().toLocaleDateString('ko-KR'),
    isSelected: false,
    originalFileId: file.fileId, // 원본 파일 ID 보존
  })

  // ✅ 변환된 공부 자료 목록을 state로 관리
  const [convertedContents, setConvertedContents] = useState<(ContentItem & { originalFileId: number })[]>([])

  // refFiles가 변경될 때 convertedContents 업데이트
  useEffect(() => {
    setConvertedContents(refFiles.map(convertFileToContent))
  }, [refFiles])

  // 체크박스 선택 상태 변경 핸들러
  const handleContentSelect = (contentId: string) => {
    setConvertedContents(prev =>
      prev.map(content =>
        content.id === contentId
          ? { ...content, isSelected: !content.isSelected }
          : content
      )
    )
  }

  // 공지사항 관련 상태
  const [notice, setNotice] = useState<string>('')
  const [isNoticeModalOpen, setIsNoticeModalOpen] = useState(false)
  const [noticeTitle, setNoticeTitle] = useState<string>('공지사항')
  const [noticeContent, setNoticeContent] = useState<string>('공지사항이 없습니다.')

  // 공지사항을 로컬 스토리지에서 불러오기
  useEffect(() => {
    if (activeStudyId) {
      const savedNotice = localStorage.getItem(`study_notice_${activeStudyId}`)
      if (savedNotice) {
        setNotice(savedNotice)
        setNoticeContent(savedNotice)
      }
    }
  }, [activeStudyId])

  // 스터디 목록 로드
  useEffect(() => {
    const loadStudies = async () => {
      try {
        setError(null)
        const studiesData = await getSidebarStudies()
        // StudyListItem을 StudyItem으로 변환
        const convertedStudies: StudyItem[] = studiesData.map(study => ({
          id: study.hashId,               // ← hashId로!
          name: study.name,
          description: study.description,
          image: study.imageUrl,
          memberCount: 0 // 기본값 설정
        }))
        setStudies(convertedStudies)
      } catch {
        setError('스터디 목록을 불러오는데 실패했습니다.')
        setStudies([]) // 에러 시 빈 배열로 설정
      }
    }
    loadStudies()
  }, [])

  // ✅ useMemo를 사용한 더 간단한 방법 - userCount 직접 사용
  const currentStudy = useMemo(() => {
    if (!studyDetail || !activeStudyId) return null

    return {
      id: activeStudyId,
      name: studyDetail.name,
      description: studyDetail.description || '',
      image: studyDetail.imageUrl,
      memberCount: studyDetail.userCount || 0  // ✅ userCount 직접 사용
    }
  }, [studyDetail, activeStudyId])  // ✅ participants 의존성 제거

  // ✅ 로딩 상태만 별도로 관리 - 더 간단해짐
  useEffect(() => {
    if (studyDetail) {
      console.log('Study detail loaded:', studyDetail)
      setLoading(false)
    }
  }, [studyDetail])  // ✅ participants 의존성 제거

  // ✅ 에러 처리
  useEffect(() => {
    if (studyError) {
      console.error('Study detail error:', studyError)
      setError('스터디 정보를 불러오는데 실패했습니다.')
      setLoading(false)
    }
    if (membersError) {
      console.error('Members error:', membersError)
      // 멤버 로드 실패는 전체 에러로 처리하지 않음
    }
    if (categoriesError) {
      console.error('Categories error:', categoriesError)
      // 카테고리 로드 실패는 전체 에러로 처리하지 않음
    }
    if (refFilesError) {
      console.error('Ref files error:', refFilesError)
      // 공부 자료 로드 실패는 전체 에러로 처리하지 않음
    }
  }, [studyError, membersError, categoriesError, refFilesError])

  // ✅ 로딩 상태 관리 - studyDetail, 카테고리, 공부 자료 로딩 상태 체크
  useEffect(() => {
    setLoading(isStudyLoading || isCategoriesLoading || isRefFilesLoading)
  }, [isStudyLoading, isCategoriesLoading, isRefFilesLoading])

  // 선택된 카테고리와 검색어에 따라 콘텐츠 필터링
  const filteredContents = convertedContents.filter(content => {
    // 카테고리 필터링 (AND 조건)
    const categoryFilter = selectedCategories.length === 0 ||
      selectedCategories.every(categoryId => {
        const category = categories.find(c => c.id.toString() === categoryId.toString())
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
    // 스터디 클릭 시 토글
    if (itemId === 'study') {
      setExpandedStudy(!expandedStudy)
    }

    // AI 요약본 클릭 시 새 탭에서 AI 요약본 페이지 열기
    if (itemId === 'ai-summary') {
      window.open('/ai-summary', '_blank')
    }

    // 마이페이지 클릭 시 새 탭에서 대시보드 열기
    if (itemId === 'mypage') {
      window.open('/dashboard', '_blank')
    }
  }

  const handleStudyClick = (studyId: string) => {
    // 현재 페이지의 스터디와 다른 스터디를 클릭한 경우에만 페이지 이동
    if (activeStudyId !== studyId) {
      setActiveStudyId(studyId)
      setLoading(true) // 로딩 상태 활성화

      // currentStudy는 이제 useMemo로 계산되므로 별도 처리 불필요

      // 선택된 스터디로 페이지 이동
      navigate(`/study/${studyId}`)
    }
  }

  const handleSearch = () => {
  }

  const handleUploadData = () => {
    setIsUploadModalOpen(true)
  }

  const handleCreateRoom = () => {
  }

  const handleEditNotice = () => {
    setIsNoticeModalOpen(true)
    setNoticeTitle('공지사항')
    setNoticeContent(notice)
  }

  const handleNoticeSubmit = async () => {
    if (!currentStudy || !noticeContent.trim() || !studyDetail?.studyId) return

    try {
      // 공지사항 업데이트 API 호출
      await updateStudyNotice({
        studyId: studyDetail.studyId,
        notice: noticeContent
      })

      // 로컬 상태 업데이트
      setNotice(noticeContent)
      setIsNoticeModalOpen(false)

      // 로컬 스토리지에 공지사항 저장
      if (activeStudyId) {
        localStorage.setItem(`study_notice_${activeStudyId}`, noticeContent)
      }

      // 성공 메시지 (실제로는 toast 등을 사용)
      console.log('공지사항이 업데이트되었습니다.')
      // 성공 시 스터디 상세 정보 React Query 캐시 무효화
      if (hashId) {
        queryClient.invalidateQueries({ queryKey: ['studyDetail', hashId] })
      }

    } catch (error: unknown) {
      console.error('공지사항 업데이트 실패:', error)
      // 에러 메시지 (실제로는 toast 등을 사용)
    }
  }

  const handleNoticeModalClose = () => {
    setIsNoticeModalOpen(false)
  }

  const handleJoinStudy = async () => {
    if (!studyDetail?.studyId || !hashId) return
    try {
      // 가입 요청 API 호출
      await joinStudy({ studyId: studyDetail.studyId })

      // 성공 시 스터디 상세 정보 React Query 캐시 무효화
      if (hashId) {
        queryClient.invalidateQueries({ queryKey: ['studyDetail', hashId] })
      }

      console.log('가입 요청이 전송되었습니다.')
    } catch (error) {
      console.error('가입 요청 실패:', error)
      // 에러 처리
    }
  }

  const handleAcceptJoinRequest = async (userId: number, role: 'ADMIN' | 'DELEGATE' | 'MEMBER' = 'MEMBER') => {
    if (!studyDetail?.studyId) return
    try {
      await acceptJoinRequestMutation.mutateAsync({
        studyId: studyDetail.studyId,
        userId,
        role
      })
      console.log('가입 요청 승인 완료')
    } catch (error) {
      console.error('가입 요청 승인 실패:', error)
    }
  }

  const handleRejectJoinRequest = async (userId: number) => {
    if (!studyDetail?.studyId) return
    try {
      await rejectJoinRequestMutation.mutateAsync({
        studyId: studyDetail.studyId,
        userId
      })
      console.log('가입 요청 거절 완료')
    } catch (error) {
      console.error('가입 요청 거절 실패:', error)
    }
  }
  // 스터디 관리 모달 관련 핸들러들
  const handleStudyNameChange = (name: string) => {
    // currentStudy는 이제 useMemo로 계산되므로 직접 수정 불가
    console.log('Study name change:', name)
  }

  const handleStudyDescriptionChange = (description: string) => {
    // currentStudy는 이제 useMemo로 계산되므로 직접 수정 불가
    console.log('Study description change:', description)
  }

  // 스터디 수정 훅
  const updateStudyMutation = useUpdateStudy(studyDetail?.studyId || 0)

  // 스터디 수정 핸들러
  const handleStudyUpdate = async (data: {
    name: string
    description: string
    image?: File
    maxCapacity: number
  }) => {
    if (!studyDetail?.studyId) return

    try {
      // useUpdateStudy 훅을 사용하여 스터디 수정
      await updateStudyMutation.mutateAsync(data)

      console.log('스터디 수정 완료')

      // 성공 메시지 (실제로는 toast 등을 사용)
      alert('스터디 정보가 수정되었습니다.')
    } catch (error) {
      console.error('스터디 수정 실패:', error)
      // 에러 메시지 표시 (실제로는 toast 등을 사용)
      alert('스터디 수정에 실패했습니다. 다시 시도해주세요.')
    }
  }

  const handleCategoryRemove = async (categoryId: number) => {
    if (!studyDetail?.studyId) return

    try {
      // 카테고리 삭제 API 호출
      await deleteCategoryMutation.mutateAsync(categoryId)
      console.log('카테고리 삭제 완료')
    } catch (error) {
      console.error('카테고리 삭제 실패:', error)
      alert('카테고리 삭제에 실패했습니다. 다시 시도해주세요.')
    }
  }

  const handleCategoryAdd = async (categoryName: string) => {
    if (!studyDetail?.studyId) return

    try {
      // 카테고리 생성 API 호출
      await createCategoryMutation.mutateAsync(categoryName)
      console.log('카테고리 생성 완료')
    } catch (error) {
      console.error('카테고리 생성 실패:', error)
      alert('카테고리 생성에 실패했습니다. 다시 시도해주세요.')
    }
  }

  // 멤버 삭제(강제탈퇴) 핸들러
  const handleMemberRemove = async (userId: number) => {
    if (!studyDetail?.studyId) return

    try {
      // 멤버 삭제 API 호출
      await deleteStudyMember({
        studyId: studyDetail.studyId,
        userId: userId
      })

      console.log('멤버 강제탈퇴 완료')

      // 성공 시 멤버 목록 React Query 캐시 무효화
      if (hashId) {
        queryClient.invalidateQueries({ queryKey: ['studyDetail', hashId] })
      }
    } catch (error) {
      console.error('멤버 강제탈퇴 실패:', error)
      alert('멤버 강제탈퇴에 실패했습니다. 다시 시도해주세요.')
    }
  }

      const handleMemberRoleChange = async (userId: number, newRole: 'ADMIN' | 'DELEGATE' | 'MEMBER') => {
    if (!studyDetail?.studyId) return

    const payload = {
      studyId: studyDetail.studyId,
      userId: userId, // 백엔드에서 기대하는 필드명
      role: newRole
    }

    console.log('=== 멤버 역할 변경 디버깅 ===')
    console.log('studyDetail:', studyDetail)
    console.log('전달받은 userId:', userId)
    console.log('전달받은 newRole:', newRole)
    console.log('최종 payload:', payload)
    console.log('==============================')

    try {
      // 멤버 역할 변경 API 호출
      await changeMemberRoleMutation.mutateAsync(payload)

      console.log('멤버 역할 변경 완료')
    } catch (error) {
      console.error('멤버 역할 변경 실패:', error)
      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as { response?: { data?: unknown; status?: number } }
        console.error('에러 상세 정보:', {
          response: axiosError.response?.data,
          status: axiosError.response?.status
        })
      }
    }
  }

  const handleStudyImageChange = (image: File | null) => {
    if (image) {
      // 이미지 업로드 API 호출 (실제 구현 필요)
      console.log('Image upload:', image)
    } else {
      // 이미지 제거 API 호출 (실제 구현 필요)
      console.log('Image remove')
    }
  }

  const handleMaxMembersChange = (maxMembers: number) => {
    // 최대 멤버 수 변경 API 호출 (실제 구현 필요)
    console.log('Max members change:', maxMembers)
  }

  // 스터디 탈퇴 핸들러
  const handleLeaveStudy = async () => {
    if (!studyDetail?.studyId) return

    // 확인 창 표시
    const isConfirmed = window.confirm(
      '정말로 이 스터디를 탈퇴하시겠습니까?\n탈퇴 후에는 다시 가입해야 합니다.'
    )

    if (!isConfirmed) return

    try {
      // 스터디 탈퇴 API 호출
      await leaveStudy({
        studyGroupId: studyDetail.studyId
      })

      console.log('스터디 탈퇴 완료')

      // 성공 시 대시보드로 이동
      navigate('/dashboard')
    } catch (error) {
      console.error('스터디 탈퇴 실패:', error)
      // 에러 메시지 표시 (실제로는 toast 등을 사용)
      alert('스터디 탈퇴에 실패했습니다. 다시 시도해주세요.')
    }
  }

  // Content Management 관련 핸들러들
  const handleCategoryToggle = (categoryId: number) => {
    setSelectedCategories(prev => {
      if (prev.includes(categoryId)) {
        return prev.filter(id => id !== categoryId)
      } else {
        return [...prev, categoryId]
      }
    })
  }

  const handleAddCategory = () => {
    // ADMIN 권한 체크
    if (studyDetail?.role !== 'ADMIN') {
      alert('카테고리를 생성할 수 있는 권한이 없습니다.')
      return
    }
    setShowCategoryModal(true)
  }

  const handleAddNewCategory = async (categoryName: string) => {
    if (!studyDetail?.studyId) return

    try {
      // 카테고리 생성 API 호출
      await createCategoryMutation.mutateAsync(categoryName)
      console.log('카테고리 생성 완료')

      // 카테고리 생성 성공 후 React Query 캐시 무효화하여 목록 새로고침
      if (studyDetail?.studyId) {
        queryClient.invalidateQueries({ queryKey: ['ref', 'categories', studyDetail.studyId] })
      }

      setShowCategoryModal(false)
    } catch (error) {
      console.error('카테고리 생성 실패:', error)

      // 상세 에러 정보 로깅
      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as { response?: { data?: unknown; status?: number } }
        const status = axiosError.response?.status
        const errorData = axiosError.response?.data

        console.error('에러 상세 정보:', {
          status,
          data: errorData,
          studyId: studyDetail?.studyId,
          categoryName: categoryName
        })

        // HTTP 상태 코드별 사용자 친화적 메시지
        if (status === 409) {
          alert('이미 존재하는 카테고리 이름입니다. 다른 이름을 사용해주세요.')
          return
        } else if (status === 400) {
          alert('잘못된 요청입니다. 입력 정보를 확인해주세요.')
          return
        } else if (status === 401) {
          alert('권한이 없습니다. 로그인 상태를 확인해주세요.')
          return
        } else if (status === 403) {
          alert('카테고리를 생성할 권한이 없습니다.')
          return
        } else if (status && status >= 500) {
          alert('서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.')
          return
        }
      }

      alert('카테고리 생성에 실패했습니다. 다시 시도해주세요.')
    }
  }

  // ✅ 공부 자료 수정 핸들러
  const handleContentEdit = (contentId: string) => {
    const content = convertedContents.find(c => c.id === contentId)
    if (content) {
      setEditingContent(content)
      setIsEditModalOpen(true)
    }
  }

  // ✅ 공부 자료 수정 제출 핸들러
  const handleFileEditSubmit = async (data: { id: string; title: string; description: string; categoryId: number[] }) => {
    if (!studyDetail?.studyId) return

    try {
      // 파일 수정 API 호출 - JSON 형태로 데이터 전송
      await refService.editFile(parseInt(data.id), {
        title: data.title,
        description: data.description,
        categoryId: data.categoryId,
      })

      // 성공 시 React Query 캐시 무효화하여 목록 새로고침
      if (studyDetail?.studyId) {
        queryClient.invalidateQueries({ queryKey: ['ref', 'list', studyDetail.studyId] })
      }

      // 모달 닫기
      setIsEditModalOpen(false)
      setEditingContent(null)

      // 성공 메시지 표시 (실제로는 toast 등을 사용)
      console.log('파일 수정 완료')
    } catch (error) {
      console.error('파일 수정 실패:', error)
      alert('파일 수정에 실패했습니다. 다시 시도해주세요.')
    }
  }

  // ✅ 공부 자료 삭제 핸들러
  const handleContentDelete = async (contentId: string) => {
    if (!studyDetail?.studyId) return

    // 확인 창 표시
    const isConfirmed = window.confirm(
      '정말로 이 파일을 삭제하시겠습니까?\n삭제된 파일은 복구할 수 없습니다.'
    )

    if (!isConfirmed) return

    try {
      // 파일 삭제 API 호출
      await refService.deleteFile(parseInt(contentId))

      // 성공 시 React Query 캐시 무효화하여 목록 새로고침
      if (studyDetail?.studyId) {
        queryClient.invalidateQueries({ queryKey: ['ref', 'list', studyDetail.studyId] })
      }

      console.log('파일 삭제 완료')
    } catch (error) {
      console.error('파일 삭제 실패:', error)
      alert('파일 삭제에 실패했습니다. 다시 시도해주세요.')
    }
  }

  const handleContentPreview = (contentId: string) => {
    const content = convertedContents.find(c => c.id === contentId)
    if (content && 'originalFileId' in content) {
      setPreviewingContent(content)
      setIsPDFModalOpen(true)
    }
  }

  // ✅ 공부 자료 다운로드 핸들러
  const handleContentDownload = async (contentId: string) => {
    const content = convertedContents.find(c => c.id === contentId)
    if (!content || !('originalFileId' in content)) return

    try {
      // 다운로드 URL 발급
      const response = await refService.getDownloadUrl(content.originalFileId)

      // 새 창에서 다운로드 URL 열기
      window.open(response.presignedUrl, '_blank')

      console.log('다운로드 URL 발급 완료:', response.presignedUrl)
    } catch (error) {
      console.error('다운로드 URL 발급 실패:', error)
      alert('파일 다운로드에 실패했습니다. 다시 시도해주세요.')
    }
  }

  // Upload Modal 관련 핸들러들
  const handleUploadModalClose = () => {
    setIsUploadModalOpen(false)
  }

  const handleUploadSubmit = async (data: UploadData) => {
    if (!studyDetail?.studyId) return

    try {
      // FormData 생성 - API 요청 구조에 맞춤
      const formData = new FormData()
      formData.append('title', data.title)
      formData.append('description', data.description)
      formData.append('file', data.file)

      // categoryId 배열을 개별 항목으로 추가
      data.categoryId.forEach(categoryId => {
        formData.append('categoryId', categoryId.toString())
      })

      // 파일 업로드 API 호출
      await uploadRefMutation.mutateAsync(formData)

      // 성공 시 React Query 캐시 무효화하여 목록 새로고침
      if (studyDetail?.studyId) {
        queryClient.invalidateQueries({ queryKey: ['ref', 'list', studyDetail.studyId] })
      }

      // 모달 닫기
      setIsUploadModalOpen(false)

      // 성공 메시지 표시 (실제로는 toast 등을 사용)
      console.log('파일 업로드 완료')
    } catch (error) {
      console.error('파일 업로드 실패:', error)
      alert('파일 업로드에 실패했습니다. 다시 시도해주세요.')
    }
  }

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
    {(studyDetail?.status === null || studyDetail?.status === 'REJECTED') ? (
      // 가입하지 않은 상태 또는 거절된 상태 - 가입하기 버튼
      <div className="flex h-screen">
        {/* 사이드바 */}
        <div className="w-64 bg-white border-r">
          {/* 기존 사이드바 컴포넌트 */}
        </div>

        {/* 메인 콘텐츠 - 가입 요청 화면 */}
        <div className="flex-1 flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">
              {currentStudy?.name} 📊
            </h1>
            <p className="text-gray-600 mb-6">스터디에 가입하여 학습을 시작해보세요</p>
            <button
              onClick={handleJoinStudy}
              className="px-6 py-3 bg-purple-500 text-white rounded-lg hover:bg-purple-600"
            >
              가입하기
            </button>
          </div>
        </div>
      </div>
    ) : studyDetail?.status === 'PENDING' ? (
      // 가입 요청 대기 중 - 가입 요청 완료
      <div className="flex h-screen">
        {/* 사이드바 */}
        <div className="w-64 bg-white border-r">
          {/* 기존 사이드바 컴포넌트 */}
        </div>

        {/* 메인 콘텐츠 - 가입 요청 대기 화면 */}
        <div className="flex-1 flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">
              {currentStudy?.name} 📊
            </h1>
            <p className="text-gray-600 mb-6">가입 요청이 승인 대기 중입니다</p>
            <button
              disabled
              className="px-6 py-3 bg-gray-400 text-white rounded-lg cursor-not-allowed"
            >
              가입 요청 완료
            </button>
          </div>
        </div>
      </div>
    ) : (
      <StudyDetailTemplate
        studies={Array.isArray(studies) ? studies : []}
        activeStudyId={activeStudyId}
        expandedStudy={expandedStudy}
        loading={loading}
        currentStudy={currentStudy}
        currentUserRole={studyDetail?.role} // 현재 사용자 역할 전달
        onItemClick={handleItemClick}
        onStudyClick={handleStudyClick}
        onSearch={handleSearch}
        onUploadData={handleUploadData}
        onCreateRoom={handleCreateRoom}
        onEditNotice={handleEditNotice}
        participants={participants.map((member: Member) => ({
          id: member.email,
          name: member.member,
          avatar: member.imageUrl
        }))}
        studyParticipants={participants}
        // 공지사항 관련 props
        noticeTitle={noticeTitle}
        noticeContent={noticeContent}
        // Content Management 관련 props - ref API의 Category 타입을 content 타입으로 변환
        categories={categories}
        selectedCategories={selectedCategories}
        contents={filteredContents}
        searchTerm={searchTerm}
        sortOrder={sortOrder}
        // Upload Modal 관련 props
        isUploadModalOpen={isUploadModalOpen}
        // 일정 관련 props
        studySchedules={studySchedules}
        isSchedulesLoading={isSchedulesLoading}
        onCategoryToggle={handleCategoryToggle}
        onAddCategory={handleAddCategory}
        onSearchChange={setSearchTerm}
        onSortChange={setSortOrder}
        onContentSelect={handleContentSelect}
        onContentPreview={handleContentPreview}
        // Upload Modal 관련 핸들러들
        onUploadModalClose={handleUploadModalClose}
        onUploadSubmit={handleUploadSubmit}
        // Study Management 관련 핸들러들
        onStudyNameChange={handleStudyNameChange}
        onStudyDescriptionChange={handleStudyDescriptionChange}
        onStudyImageChange={handleStudyImageChange}
        onMaxMembersChange={handleMaxMembersChange}
        onCategoryRemove={handleCategoryRemove}
        onCategoryAdd={handleCategoryAdd}
        onMemberRemove={handleMemberRemove}
        onMemberRoleChange={handleMemberRoleChange}
        joinRequests={studyDetail?.role === 'ADMIN' ? joinRequests : []}
        onAcceptJoinRequest={studyDetail?.role === 'ADMIN' ? handleAcceptJoinRequest : undefined}
        onRejectJoinRequest={studyDetail?.role === 'ADMIN' ? handleRejectJoinRequest : undefined}
        onLeaveStudy={handleLeaveStudy}
        onStudyUpdate={handleStudyUpdate}
        onContentEdit={handleContentEdit}
        onContentDelete={handleContentDelete}
        onContentDownload={handleContentDownload}
        studyId={studyDetail?.studyId}
      />
    )}

    {/* Category Add Modal */}
    <CategoryAddModal
      isOpen={showCategoryModal}
      onClose={() => setShowCategoryModal(false)}
      onAdd={handleAddNewCategory}
    />

    {/* Edit File Modal */}
    <EditFileModal
      isOpen={isEditModalOpen}
      onClose={() => {
        setIsEditModalOpen(false)
        setEditingContent(null)
      }}
      onEdit={handleFileEditSubmit}
      categories={categories}
      initialData={editingContent ? {
        id: editingContent.id,
        title: editingContent.title,
        description: editingContent.description,
        tags: editingContent.tags
      } : {
        id: '',
        title: '',
        description: '',
        tags: []
      }}
    />

    {/* Notice Edit Modal */}
    {isNoticeModalOpen && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 w-96 max-w-md">
          <h3 className="text-lg font-semibold mb-4">공지사항 편집</h3>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              제목
            </label>
            <input
              type="text"
              value={noticeTitle}
              onChange={(e) => setNoticeTitle(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="공지사항 제목을 입력하세요"
            />
          </div>
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              내용
            </label>
            <textarea
              value={noticeContent}
              onChange={(e) => setNoticeContent(e.target.value)}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="공지사항 내용을 입력하세요"
            />
          </div>
          <div className="flex justify-end gap-2">
            <button
              onClick={handleNoticeModalClose}
              className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
            >
              취소
            </button>
            <button
              onClick={handleNoticeSubmit}
              className="px-4 py-2 bg-purple-500 text-white rounded-md hover:bg-purple-600"
            >
              저장
            </button>
          </div>
        </div>
      </div>
    )}

    {/* PDF Preview Modal */}
    {isPDFModalOpen && previewingContent && (
      <PDFPreviewModal
        isOpen={isPDFModalOpen}
        onClose={() => setIsPDFModalOpen(false)}
        fileId={previewingContent.originalFileId}
        fileName={previewingContent.title}
      />
    )}
  </>
  )}

export default StudyDetailPage
