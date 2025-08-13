import React, { useState, useEffect, useMemo } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import StudyDetailTemplate from '../components/templates/StudyDetailTemplate'
import CategoryAddModal from '../components/organisms/CategoryAddModal'
import EditFileModal from '../components/organisms/EditFileModal'
import PDFPreviewModal from '../components/organisms/PDFPreviewModal'
import DashboardSidebar from '../components/organisms/DashboardSidebar'
import type { StudyItem } from '../components/organisms/DashboardSidebar/types'
import type { ContentItem } from '../types/content'
import type { StudyListItem } from '../types/study'
import { getSidebarStudies, updateStudyNotice, joinStudy, leaveStudy, deleteStudyMember } from '../services/studyService'
import { useStudyDetail, useStudyMembers, useJoinRequests, useAcceptJoinRequest, useRejectJoinRequest, useChangeMemberRole, useUpdateStudy } from "../hooks/useStudies";
import { studyKeys } from "../hooks/queryKeys";
import { useQueryClient } from '@tanstack/react-query'
import type { Member } from '../types/study'
import { useRefFiles } from '../hooks/useRefFiles'
import type { FileItem } from '../types/ref'
import type { UploadData } from '../components/organisms/UploadDataModal/types'
import { refService } from '../services/refService'
import { useStudySchedules } from '../hooks/useSchedules'
import { useMe } from '../hooks/useUsers'

const StudyDetailPage: React.FC = () => {
  const navigate = useNavigate()
  const { hashId } = useParams<{ hashId: string }>()
  const queryClient = useQueryClient()
  const { data: userProfile, isLoading: isUserLoading } = useMe()

  const [expandedStudy, setExpandedStudy] = useState(true)
  const [activeStudyId, setActiveStudyId] = useState<string | null>(hashId || null)
  const [studies, setStudies] = useState<StudyItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentMonth] = useState(() => {
    const now = new Date()
    return { year: now.getFullYear(), month: now.getMonth() + 1 }
  })

  // ✅ 로그인 상태 확인 - userProfile이 있고 로딩이 아니어야 함
  const isLoggedIn = !!userProfile && !isUserLoading

  // ✅ 로그인되지 않은 경우 스터디 정보 로딩을 건너뛰기
  const shouldLoadStudyDetail = isLoggedIn && activeStudyId

  // ✅ React Query 훅 사용 - studyDetail만 필요 (로그인된 경우에만)
  const {
    data: studyDetail,
    isLoading: isStudyLoading,
    error: studyError
  } = useStudyDetail(shouldLoadStudyDetail ? (activeStudyId || '') : '')

  // ✅ 멤버 정보는 필요할 때만 로드 (예: 멤버 관리 모달)
  const {
    data: participants = [],
    error: membersError
  } = useStudyMembers(shouldLoadStudyDetail ? (studyDetail?.studyId || 0) : 0)

  // ✅ 스터디별 일정 조회
  const {
    data: studySchedules = [],
    isLoading: isSchedulesLoading
  } = useStudySchedules(
    shouldLoadStudyDetail ? (studyDetail?.studyId || 0) : 0,
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
  } = useCategories(shouldLoadStudyDetail ? (studyDetail?.studyId || 0) : 0)

  // ✅ 공부 자료 목록 조회 - /ref/list 엔드포인트 사용
  const {
    data: refFiles = [],
    isLoading: isRefFilesLoading,
    error: refFilesError
  } = useRefList(shouldLoadStudyDetail ? (studyDetail?.studyId || 0) : 0)

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

  // ✅ 변환된 공부 자료 목록
  const convertedContents = refFiles.map(convertFileToContent)

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
        const convertedStudies: StudyItem[] = studiesData.map((study: StudyListItem) => ({
          id: study.hashId,               // ← hashId로!
          name: study.name,
          description: study.description,
          image: study.imageUrl,
          memberCount: 0, // 기본값 설정
          status: study.status // status 정보 추가
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

  // ✅ 에러 처리 - 로그인된 경우에만 스터디 관련 에러 처리
  useEffect(() => {
    if (isLoggedIn && studyError) {
      console.error('Study detail error:', studyError)
      
      // 403 에러(토큰 만료)인 경우 토큰 제거
      if (studyError && typeof studyError === 'object' && 'response' in studyError) {
        const axiosError = studyError as { response?: { status?: number } }
        if (axiosError.response?.status === 403) {
          console.log('토큰 만료 - 토큰 제거')
          localStorage.removeItem('accessToken')
          localStorage.removeItem('refreshToken')
          return
        }
      }
      
      // 그 외 에러는 기존과 동일하게 처리
      setError('스터디 정보를 불러오는데 실패했습니다.')
      setLoading(false)
    }
    
    // 로그인되지 않은 경우 에러 상태 초기화
    if (!isLoggedIn) {
      setError(null)
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
  }, [isLoggedIn, studyError, membersError, categoriesError, refFilesError])

  // ✅ 로딩 상태 관리 - 로그인된 경우에만 스터디 관련 로딩 상태 체크
  useEffect(() => {
    if (isLoggedIn) {
      setLoading(isStudyLoading || isCategoriesLoading || isRefFilesLoading)
    } else {
      setLoading(false) // 로그인되지 않은 경우 로딩 상태 해제
    }
  }, [isLoggedIn, isStudyLoading, isCategoriesLoading, isRefFilesLoading])

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

    // 마이페이지 클릭 시 현재 창에서 대시보드로 이동
    if (itemId === 'mypage') {
      navigate('/dashboard')
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

  const handleSettingsClick = () => {
    // 프로필 설정 모달을 열거나 설정 페이지로 이동
    // 현재는 대시보드로 이동하여 설정을 할 수 있도록 함
    navigate('/dashboard')
  }
  const handleJoinStudy = async () => {
    console.log('=== handleJoinStudy 함수 호출됨 ===')
    
    // 로그인되지 않은 경우 로그인 페이지로 리다이렉트
    if (!isLoggedIn) {
      console.log('로그인되지 않음, 로그인 페이지로 이동')
      navigate('/login')
      return
    }

    console.log('로그인 상태 확인됨, studyDetail:', studyDetail)
    console.log('hashId:', hashId)

    if (!studyDetail?.studyId || !hashId) {
      console.log('스터디 정보 부족, 함수 종료')
      return
    }
    
    try {
      console.log('가입 요청 API 호출 시작, studyId:', studyDetail.studyId)
      
      // ✅ 즉시 로컬 상태 업데이트 (API 호출 전에 먼저 실행)
      if (studyDetail) {
        const updatedStudyDetail = {
          ...studyDetail,
          status: 'PENDING'
        }
        
        // React Query 캐시 즉시 업데이트
        queryClient.setQueryData(['studyDetail', hashId], updatedStudyDetail)
      }

      // ✅ 사이드바 스터디 목록도 즉시 업데이트
      if (userProfile?.id) {
        // 현재 사이드바 데이터 가져오기
        const currentSidebarData = queryClient.getQueryData(studyKeys.sidebar(userProfile.id)) as StudyItem[] | undefined
        
        if (currentSidebarData && Array.isArray(currentSidebarData)) {
          // 현재 스터디를 PENDING 상태로 업데이트
          const updatedSidebarData = currentSidebarData.map((study: StudyItem) => 
            study.id === hashId 
              ? { ...study, status: 'PENDING' }
              : study
          )
          
          // 사이드바 데이터 즉시 업데이트
          queryClient.setQueryData(studyKeys.sidebar(userProfile.id), updatedSidebarData)
        }
      }

      // 가입 요청 API 호출
      await joinStudy({ studyId: studyDetail.studyId })

      console.log('가입 요청이 전송되었습니다.')
      
      // ✅ API 성공 후 추가 캐시 무효화 (백그라운드에서 최신 데이터 동기화)
      if (hashId) {
        queryClient.invalidateQueries({ queryKey: ['studyDetail', hashId] })
      }
      
      if (userProfile?.id) {
        queryClient.invalidateQueries({ queryKey: studyKeys.sidebar(userProfile.id) })
      }
      
    } catch (error) {
      console.error('가입 요청 실패:', error)
      
      // ✅ API 실패 시 원래 상태로 롤백
      if (studyDetail && hashId) {
        const originalStudyDetail = {
          ...studyDetail,
          status: studyDetail.status // 원래 상태로 복원
        }
        queryClient.setQueryData(['studyDetail', hashId], originalStudyDetail)
      }
      
      if (userProfile?.id) {
        const currentSidebarData = queryClient.getQueryData(studyKeys.sidebar(userProfile.id)) as StudyItem[] | undefined
        if (currentSidebarData && Array.isArray(currentSidebarData)) {
          const rolledBackSidebarData = currentSidebarData.map((study: StudyItem) => 
            study.id === hashId 
              ? { ...study, status: studyDetail?.status || null }
              : study
          )
          queryClient.setQueryData(studyKeys.sidebar(userProfile.id), rolledBackSidebarData)
        }
      }
      
      // 에러 메시지 표시
      alert('가입 요청에 실패했습니다. 다시 시도해주세요.')
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

      // 성공 시 스터디 상세 정보와 멤버 목록 React Query 캐시 무효화
      if (hashId && userProfile?.id) {
        queryClient.invalidateQueries({ queryKey: ['studyDetail', hashId] })
        queryClient.invalidateQueries({ queryKey: studyKeys.members(String(studyDetail.studyId)) })
        queryClient.invalidateQueries({ queryKey: studyKeys.sidebar(userProfile.id) })
      }
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

  const handleContentSelect = (contentId: string) => {
    // This function is no longer needed as ContentItem is directly used.
    // Keeping it for now in case it's called from the template.
    console.log('Content select:', contentId)
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

  // 로그인되지 않은 사용자를 위한 UI를 먼저 렌더링
  if (!isLoggedIn) {
    return (
      <div className="flex h-screen">
        {/* 메인 콘텐츠 - 로그인 필요 화면 */}
        <div className="flex-1 flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">
              {hashId ? '스터디' : '스터디'}
            </h1>
            <p className="text-gray-600 mb-6">로그인이 필요합니다</p>
            <button
              onClick={() => {
                // 현재 URL을 저장하고 로그인 페이지로 이동
                const currentPath = window.location.pathname + window.location.search
                localStorage.setItem('redirectAfterLogin', currentPath)
                navigate('/login')
              }}
              className="px-6 py-3 bg-purple-500 text-white rounded-lg hover:bg-purple-600"
            >
              로그인하기
            </button>
          </div>
        </div>
      </div>
    )
  }

  // 에러가 있으면 에러 메시지 표시
  if (error) {
    return (
      <div className="flex h-screen">
        {/* 로그인된 경우에만 DashboardSidebar 표시 */}
        {isLoggedIn && (
          <DashboardSidebar
            activeItem={undefined}
            expandedStudy={expandedStudy}
            studies={Array.isArray(studies) ? studies : []}
            activeStudyId={activeStudyId}
            onItemClick={handleItemClick}
            onStudyClick={handleStudyClick}
            onLogout={() => {
              localStorage.removeItem('accessToken')
              localStorage.removeItem('refreshToken')
              navigate('/login')
            }}
            onSettingsClick={() => navigate('/dashboard')}
            onLogoClick={() => navigate('/dashboard')}
          />
        )}

        {/* 메인 콘텐츠 - 에러 화면 */}
        <div className={`flex-1 flex items-center justify-center bg-gray-50 ${isLoggedIn ? 'ml-64' : ''}`}>
          <div className="text-center">
            <div className="text-red-500 text-xl mb-4">⚠️</div>
            <p className="text-gray-600 mb-4">{error}</p>
            <div className="flex gap-2 justify-center">
              <button
                onClick={() => window.location.reload()}
                className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600"
              >
                다시 시도
              </button>
              <button
                onClick={() => navigate('/dashboard')}
                className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
              >
                대시보드로 돌아가기
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // status가 left, reject, null인 경우 가입하기 페이지 표시
  if (studyDetail?.status === 'LEFT' || studyDetail?.status === 'REJECTED' || studyDetail?.status === null) {
    
    return (
      <div className="flex h-screen">
        {/* 로그인된 경우에만 DashboardSidebar 표시 */}
        {isLoggedIn && (
          <DashboardSidebar
            activeItem={undefined}
            expandedStudy={expandedStudy}
            studies={Array.isArray(studies) ? studies : []}
            activeStudyId={activeStudyId}
            onItemClick={handleItemClick}
            onStudyClick={handleStudyClick}
            onLogout={() => {
              localStorage.removeItem('accessToken')
              localStorage.removeItem('refreshToken')
              navigate('/login')
            }}
            onSettingsClick={() => navigate('/dashboard')}
            onLogoClick={() => navigate('/dashboard')}
          />
        )}

        {/* 메인 콘텐츠 - 가입하기 화면 */}
        <div className={`flex-1 flex items-center justify-center bg-gray-50 ${isLoggedIn ? 'ml-64' : ''}`}>
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">
              {currentStudy?.name || '스터디'}
            </h1>
            <p className="text-gray-600 mb-6">
              {studyDetail?.status === 'LEFT' && '스터디에서 나간 상태입니다. 다시 가입할 수 있습니다.'}
              {studyDetail?.status === 'REJECTED' && '가입 신청이 거절되었습니다. 다시 신청할 수 있습니다.'}
              {studyDetail?.status === null && '아직 가입하지 않은 스터디입니다. 가입해보세요!'}
            </p>
            <button
              onClick={handleJoinStudy}
              className="px-6 py-3 bg-purple-500 text-white rounded-lg hover:bg-purple-600"
            >
              가입하기
            </button>
          </div>
        </div>
      </div>
    )
  }

  // status가 PENDING인 경우 가입 요청 대기 화면
  if (studyDetail?.status === 'PENDING') {

    return (
      <div className="flex h-screen">
        {/* 로그인된 경우에만 DashboardSidebar 표시 */}
        {isLoggedIn && (
          <DashboardSidebar
            activeItem={undefined}
            expandedStudy={expandedStudy}
            studies={Array.isArray(studies) ? studies : []}
            activeStudyId={activeStudyId}
            onItemClick={handleItemClick}
            onStudyClick={handleStudyClick}
            onLogout={() => {
              localStorage.removeItem('accessToken')
              localStorage.removeItem('refreshToken')
              navigate('/login')
            }}
            onSettingsClick={() => navigate('/dashboard')}
            onLogoClick={() => navigate('/dashboard')}
          />
        )}

        {/* 메인 콘텐츠 - 가입 요청 대기 화면 */}
        <div className={`flex-1 flex items-center justify-center bg-gray-50 ${isLoggedIn ? 'ml-64' : ''}`}>
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">
              {currentStudy?.name}
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
      currentUserRole={studyDetail?.role} // 현재 사용자 역할 전달
      userName={userProfile?.name || '사용자'} // 현재 사용자 이름 전달
      onItemClick={handleItemClick}
      onStudyClick={handleStudyClick}
      onSearch={handleSearch}
      onUploadData={handleUploadData}
      onCreateRoom={handleCreateRoom}
      onEditNotice={handleEditNotice}
      onSettingsClick={handleSettingsClick}
      onLogout={() => {
        // 로그아웃 처리
        localStorage.removeItem('accessToken')
        localStorage.removeItem('refreshToken')
        navigate('/login')
      }}
      onLogoClick={() => navigate('/dashboard')}
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
)
}

export default StudyDetailPage
