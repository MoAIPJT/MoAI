import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import DashboardSidebar from '../components/organisms/DashboardSidebar'
import TopBar from '../components/molecules/TopBar'
import StudyList from '../components/organisms/StudyList'
import AISummaryList from '../components/organisms/AISummaryList'
import ProfileSettingsModal from '../components/organisms/ProfileSettingsModal'
import ChangePasswordModal from '../components/organisms/ChangePasswordModal'
import { Calendar } from '../components/ui/calendar'
import type { Study } from '../components/organisms/StudyList/types'
import type { AISummary } from '../components/molecules/AISummaryCard/types'
import type { CreateStudyData } from '../components/organisms/CreateStudyModal/types'
import type { ProfileData } from '../components/organisms/ProfileSettingsModal/types'
// import type { ChangePasswordData } from '../components/organisms/ChangePasswordModal/types'
import type { CalendarEvent } from '../components/ui/calendar'
import InviteLinkModal from '../components/organisms/InviteLinkModal'
import { fetchSummaryList } from '../services/summaryService'
import { useLogout } from '@/hooks/useUsers'

const DashboardPage: React.FC = () => {
  const navigate = useNavigate()
  const logoutMutation = useLogout()
  const [studies, setStudies] = useState<Study[]>([])
  const [summaries, setSummaries] = useState<AISummary[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSummaryLoading, setIsSummaryLoading] = useState(true)
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false)
  const [currentInviteUrl, setCurrentInviteUrl] = useState('')
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false)
  const [isChangePasswordModalOpen, setIsChangePasswordModalOpen] = useState(false)
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const [expandedStudy, setExpandedStudy] = useState(false)
  const [activeStudyId, setActiveStudyId] = useState<string | null>(null)
  const [calendarEvents] = useState<CalendarEvent[]>([
    {
      date: new Date(new Date().getFullYear(), new Date().getMonth(), 15),
      color: '#AA64FF',
      title: '알고리즘 스터디',
      startTime: '14:00',
      endTime: '16:00'
    },
    {
      date: new Date(new Date().getFullYear(), new Date().getMonth(), 20),
      color: '#FF6B6B',
      title: 'CS 면접 준비',
      startTime: '19:00',
      endTime: '21:00'
    },
    {
      date: new Date(new Date().getFullYear(), new Date().getMonth(), 25),
      color: '#4ECDC4',
      title: '프로젝트 회의',
      startTime: '10:00',
      endTime: '12:00'
    }
  ])

  // 이벤트 제목에 따른 스터디 이름 매핑
  const getStudyNameByEvent = (eventTitle: string) => {
    if (eventTitle.includes('알고리즘')) return '싸피 알고리즘'
    if (eventTitle.includes('면접')) return '면접 화상 스터디'
    if (eventTitle.includes('프로젝트')) return 'CS 모여라'
    return '기타'
  }

  // 이벤트 제목에 따른 스터디 이미지 매핑
  const getStudyImageByEvent = (eventTitle: string) => {
    if (eventTitle.includes('알고리즘')) return 'SSAFY'
    if (eventTitle.includes('면접')) return '면'
    if (eventTitle.includes('프로젝트')) return 'CS'
    return '📅'
  }

  // 다가오는 일정을 달력 이벤트에서 동적으로 생성
  const upcomingEvents = calendarEvents
    .filter(event => {
      const eventDate = new Date(event.date)
      const today = new Date()
      // 오늘 이후의 이벤트만 필터링
      return eventDate >= today
    })
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()) // 날짜순 정렬
    .slice(0, 3) // 최대 3개만 표시
    .map((event, index) => {
      const eventDate = new Date(event.date)
      const dayOfWeek = ['일', '월', '화', '수', '목', '금', '토'][eventDate.getDay()]

      return {
        id: index + 1,
        title: event.title || '제목 없음',
        date: `${eventDate.getMonth() + 1}.${eventDate.getDate()}(${dayOfWeek})`,
        time: `${event.startTime} - ${event.endTime}`,
        studyName: getStudyNameByEvent(event.title || ''),
        studyImage: getStudyImageByEvent(event.title || ''),
        color: event.color
      }
    })
  const [profileData, setProfileData] = useState<ProfileData>({
    nickname: '안덕현',
    email: 'dksejrqus2@gmail.com',
    profileImage: ''
  })

  // 스터디 목록을 가져오는 함수 (실제 API 호출)
  const fetchStudies = async () => {
    try {
      setIsLoading(true)

      // 실제 API 호출 (현재는 주석 처리)
      // const response = await fetch('/api/studies')
      // const data = await response.json()
      // setStudies(data)

      // 임시로 로딩 시뮬레이션
      await new Promise(resolve => setTimeout(resolve, 1000))

      // 더미 데이터 설정
      const dummyStudies = [
        {
          id: 1,
          name: '싸피 알고리즘',
          description: '코딩코딩코딩코딩',
          imageUrl: '',
          createdBy: 1,
          createdAt: '2024-01-01',
          inviteUrl: 'https://example.com/invite/1'
        },
        {
          id: 2,
          name: 'CS 모여라',
          description: '취뽀 가보자고',
          imageUrl: '',
          createdBy: 1,
          createdAt: '2024-01-02',
          inviteUrl: 'https://example.com/invite/2'
        },
        {
          id: 3,
          name: '면접 화상 스터디',
          description: '취뽀가자',
          imageUrl: '',
          createdBy: 1,
          createdAt: '2024-01-03',
          inviteUrl: 'https://example.com/invite/3'
        },
        {
          id: 4,
          name: '대전맛집탐방',
          description: '맛있는 것만 취급합니다',
          imageUrl: '',
          createdBy: 1,
          createdAt: '2024-01-04',
          inviteUrl: 'https://example.com/invite/4'
        }
      ]

      setStudies(dummyStudies)
    } catch {
      setStudies([]) // 에러 시에는 빈 배열
    } finally {
      setIsLoading(false)
    }
  }

  // AI 요약본 목록을 가져오는 함수
  const fetchSummaries = async () => {
    try {
      setIsSummaryLoading(true)

      // 실제 API 호출
      const userId = localStorage.getItem('userId') || '1' // 실제로는 로그인된 유저 ID를 사용
      const response = await fetchSummaryList(userId)

      // API 응답을 기존 AISummary 타입에 맞게 변환
      const convertedSummaries: AISummary[] = response.summaries.map(summary => ({
        id: parseInt(summary.summary_id) || Date.now(), // summary_id를 숫자로 변환
        title: summary.title,
        description: summary.description,
        createdAt: new Date().toISOString().split('T')[0], // 임시 날짜
        pdfUrl: `/pdfs/${summary.summary_id}.pdf` // 임시 PDF 경로
      }))

      setSummaries(convertedSummaries)
    } catch {

      // 에러 시 더미 데이터 사용 (개발용)
      const dummySummaries: AISummary[] = [
        {
          id: 1,
          title: 'Cats and Dogs',
          description: 'Fine-grained categorization of pet breeds (37 breeds of cats and dogs).',
          createdAt: '2025-07-24',
          pdfUrl: '/pdfs/cats-and-dogs.pdf'
        },
        {
          id: 2,
          title: 'I Love Duck',
          description: 'Duck Duck Duck',
          createdAt: '2025-07-24',
          pdfUrl: '/pdfs/i-love-duck.pdf'
        },
        {
          id: 3,
          title: '햄버거 마이게다',
          description: '햄버거에 대한 상세한 분석과 레시피',
          createdAt: '2025-07-23',
          pdfUrl: '/pdfs/hamburger.pdf'
        }
      ]

      setSummaries(dummySummaries)
    } finally {
      setIsSummaryLoading(false)
    }
  }

  useEffect(() => {
    fetchStudies()
    fetchSummaries()
  }, [])

  const handleItemClick = (itemId: string) => {
    // AI 요약본 클릭 시 새 탭에서 AI 요약본 페이지 열기
    if (itemId === 'ai-summary') {
      window.open('/ai-summary', '_blank')
    }

    // 스터디 클릭 시 토글
    if (itemId === 'study') {
      setExpandedStudy(!expandedStudy)
    }
  }

  const handleLogout = () => {
    logoutMutation.mutate()
  }

  const handleSettingsClick = () => {
    setIsProfileModalOpen(true)
  }

  const handleUpdateProfile = (data: Partial<ProfileData>) => {
    setProfileData(prev => ({ ...prev, ...data }))
    // TODO: API 호출로 프로필 업데이트
  }

  const handleChangePassword = () => {
    // TODO: 비밀번호 변경 페이지로 이동 또는 모달 열기
  }

  const handleOpenChangePasswordModal = () => {
    setIsChangePasswordModalOpen(true)
  }

  const handleChangePasswordSubmit = () => {
    // TODO: API 호출로 비밀번호 변경

    alert('비밀번호가 성공적으로 변경되었습니다.')
  }

  const handleWithdrawMembership = () => {
    // TODO: 회원탈퇴 확인 모달 또는 페이지로 이동
    if (confirm('정말로 회원탈퇴를 하시겠습니까?')) {
      // 회원탈퇴 처리
    }
  }

  const handleCreateStudy = async (data: CreateStudyData) => {
    try {
      // 스터디 생성 로직

      // API 스펙에 맞는 Request Body 구성
      // const requestBody = {
      //   id: 1, // 실제로는 현재 로그인한 유저의 ID를 사용해야 함
      //   name: data.name,
      //   description: data.description,
      //   image_url: data.image ? await convertImageToBase64(data.image) : null
      // }

      // 실제 API 호출 (현재는 주석 처리)
      // const response = await fetch('/register', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //     'Authorization': `Bearer ${accessToken}` // 실제 access token 사용
      //   },
      //   body: JSON.stringify(requestBody)
      // })

      // if (response.status === 201) {
      //   const responseData = await response.json()
      //   const newStudy: Study = {
      //     id: responseData.study_id,
      //     name: responseData.name,
      //     description: responseData.description,
      //     imageUrl: responseData.image_url || '',
      //     createdBy: responseData.created_by,
      //     createdAt: responseData.created_at,
      //     inviteUrl: responseData.invite_url || `https://duckfac.com/B201-nice-team`
      //   }
      //   setStudies(prevStudies => [newStudy, ...prevStudies])
      //
      //   // 초대 링크 모달 표시
      //   setCurrentInviteUrl(newStudy.inviteUrl)
      //   setIsInviteModalOpen(true)
      // } else {
      //   throw new Error('스터디 생성에 실패했습니다.')
      // }

      // 임시로 프론트엔드에서 즉시 스터디 목록에 추가
      const newStudy: Study = {
        id: Date.now(), // 임시 ID 생성
        name: data.name,
        description: data.description,
        imageUrl: data.image ? URL.createObjectURL(data.image) : '',
        createdBy: 1, // 임시 사용자 ID
        createdAt: new Date().toISOString().split('T')[0],
        inviteUrl: `https://duckfac.com/B201-nice-team` // 임시 초대 링크
      }

      setStudies(prevStudies => [newStudy, ...prevStudies])

      // 초대 링크 모달 표시
      setCurrentInviteUrl(newStudy.inviteUrl || '')
      setIsInviteModalOpen(true)
    } catch {
      alert('스터디 생성에 실패했습니다.')
    }
  }

  // 이미지를 Base64로 변환하는 헬퍼 함수
  // const convertImageToBase64 = (file: File): Promise<string> => {
  //   return new Promise((resolve, reject) => {
  //     const reader = new FileReader()
  //     reader.onload = () => {
  //       const result = reader.result as string
  //       // Base64 문자열에서 data:image/...;base64, 부분 제거
  //       const base64 = result.split(',')[1]
  //       resolve(base64)
  //     }
  //     reader.onerror = reject
  //     reader.readAsDataURL(file)
  //   })
  // }

  // const handleStudyClick = (studyId: number) => {
  //   // 스터디 상세 페이지로 이동
  //   navigate(`/study/${studyId}`)
  // }

  // const handleSummaryClick = (summaryId: number) => {
  //   // AI 요약본 상세 페이지로 이동
  //   // navigate(`/ai-summary/${summaryId}`)
  // }

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date)
  }

  const handleAddEvent = () => {
    // TODO: 이벤트 추가 모달 또는 페이지로 이동
  }

  const handleMonthChange = () => {
    // TODO: 해당 월의 이벤트 데이터 로드
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <DashboardSidebar
        activeItem="mypage"
        expandedStudy={expandedStudy}
        studies={studies.map(study => ({
          id: study.id.toString(),
          name: study.name,
          description: study.description || '',
          image: study.imageUrl || '',
          icon: '📚'
        }))}
        onItemClick={handleItemClick}
        activeStudyId={activeStudyId}
        onStudyClick={(studyId) => {
          setActiveStudyId(studyId)
          navigate(`/study/${studyId}`)
        }}
        onLogout={handleLogout}
        onSettingsClick={handleSettingsClick}
      />
      <div className="flex-1 flex flex-col ml-64">
        <TopBar userName="user"/>
        <div className="flex-1 overflow-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-6">
            {/* 왼쪽 열 - 스터디 목록과 AI 요약본 */}
            <div className="lg:col-span-2 space-y-6">
              <StudyList
                studies={studies}
                isLoading={isLoading}
                onCreateStudy={handleCreateStudy}
                onStudyClick={() => {}}
              />
              <AISummaryList
                summaries={summaries}
                isLoading={isSummaryLoading}
                onSummaryClick={() => {}}
              />
            </div>

            {/* 오른쪽 열 - 달력 및 예정된 이벤트 */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">일정 관리</h2>
                <Calendar
                  events={calendarEvents}
                  selectedDate={selectedDate}
                  onDateSelect={handleDateSelect}
                  onAddEvent={handleAddEvent}
                  onMonthChange={handleMonthChange}
                  className="w-full"
                />

                {/* 다가오는 일정 섹션 */}
                <div className="mt-6">
                  <h3 className="text-md font-semibold text-gray-900 mb-3">다가오는 일정</h3>
                  <div className="space-y-3">
                    {upcomingEvents.map((event) => (
                      <div key={event.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                        {/* 이벤트 색상 점 */}
                        <div
                          className="w-3 h-3 rounded-full flex-shrink-0"
                          style={{ backgroundColor: event.color }}
                        />

                        {/* 이벤트 정보 */}
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-medium text-gray-900 truncate">
                            {event.title}
                          </div>
                          <div className="text-xs text-gray-500">
                            {event.date} {event.time}
                          </div>
                        </div>

                        {/* 스터디 이미지와 이름 */}
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <div className="w-6 h-6 flex items-center justify-center text-xs font-medium">
                            {event.studyImage === 'SSAFY' ? (
                              <div className="w-6 h-6 bg-blue-500 text-white rounded flex items-center justify-center text-xs font-bold">
                                S
                              </div>
                            ) : event.studyImage === '면' ? (
                              <div className="w-6 h-6 bg-purple-500 text-white rounded-full flex items-center justify-center text-xs font-bold">
                                면
                              </div>
                            ) : event.studyImage === 'CS' ? (
                              <div className="w-6 h-6 bg-green-500 text-white rounded flex items-center justify-center text-xs font-bold">
                                CS
                              </div>
                            ) : (
                              <span className="text-lg">{event.studyImage}</span>
                            )}
                          </div>
                          <div className="text-xs text-gray-600 truncate max-w-16">
                            {event.studyName}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 초대 링크 모달 */}
      <InviteLinkModal
        isOpen={isInviteModalOpen}
        onClose={() => setIsInviteModalOpen(false)}
        inviteUrl={currentInviteUrl}
      />

      {/* 프로필 설정 모달 */}
      <ProfileSettingsModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        profileData={profileData}
        onUpdateProfile={handleUpdateProfile}
        onChangePassword={handleChangePassword}
        onWithdrawMembership={handleWithdrawMembership}
        onOpenChangePasswordModal={handleOpenChangePasswordModal}
      />

      {/* 비밀번호 변경 모달 */}
      <ChangePasswordModal
        isOpen={isChangePasswordModalOpen}
        onClose={() => setIsChangePasswordModalOpen(false)}
        onSubmit={handleChangePasswordSubmit}
      />
    </div>
  )
}

export default DashboardPage
