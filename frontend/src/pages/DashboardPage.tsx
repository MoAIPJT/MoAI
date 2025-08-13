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
import { useLogout, useMe, usePatchProfile } from '@/hooks/useUsers'
import { useAuth } from '@/hooks/useAuth'
import { useAppStore } from '@/store/appStore'
import { createStudy, getAllStudies } from '@/services/studyService'

const DashboardPage: React.FC = () => {
  const navigate = useNavigate()
  const logoutMutation = useLogout()
  const { logout } = useAuth()
  const { data: userProfile, isLoading: isProfileLoading } = useMe()
  const setProfile = useAppStore((state) => state.auth.setProfile)
  const patchProfileMutation = usePatchProfile()

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
  // 디버깅을 위한 콘솔 로그
  console.log('useMe 결과:', { userProfile, isProfileLoading })

  // 사용자 프로필 데이터를 ProfileData 형식으로 변환
  const profileData: ProfileData = {
    nickname: userProfile?.name || '안덕현',
    email: userProfile?.email || 'dksejrqus2@gmail.com',
    profileImage: userProfile?.profileImageUrl || ''
  }

  // 프로필 로딩 중일 때 기본값 사용
  const displayName = isProfileLoading ? '안덕현' : (userProfile?.name || '안덕현')

  // 프로필 정보가 로딩 완료되면 store에 저장
  useEffect(() => {
    if (userProfile && !isProfileLoading) {
      setProfile(userProfile)
    }
  }, [userProfile, isProfileLoading, setProfile])

  // 스터디 목록을 가져오는 함수 (실제 API 호출)
  const fetchStudies = async () => {
    try {
      setIsLoading(true)

      // 실제 API 호출
      const studiesData = await getAllStudies()

      // API 응답을 기존 Study 타입에 맞게 변환
      const convertedStudies: Study[] = studiesData.map(study => ({
        id: study.studyId,
        name: study.name,
        description: study.description || '',
        imageUrl: study.imageUrl || '',
        createdBy: 1, // API에서 제공하지 않는 경우 기본값
        createdAt: new Date().toISOString().split('T')[0], // API에서 제공하지 않는 경우 기본값
        inviteUrl: `${window.location.origin}/study/${study.hashId}` // hashId를 사용하여 초대 링크 생성
      }))

      setStudies(convertedStudies)
    } catch (error) {
      console.error('스터디 목록 로드 실패:', error)

      // 백엔드가 실행되지 않은 경우 임시 더미데이터 사용
      console.log('백엔드 연결 실패, 임시 더미데이터 사용')
      const dummyStudies: Study[] = [
        {
          id: 1,
          name: '싸피 알고리즘',
          description: '코딩코딩코딩코딩',
          imageUrl: '',
          createdBy: 1,
          createdAt: '2024-01-01',
          inviteUrl: `${window.location.origin}/study/demo1`
        },
        {
          id: 2,
          name: 'CS 모여라',
          description: '취뽀 가보자고',
          imageUrl: '',
          createdBy: 1,
          createdAt: '2024-01-02',
          inviteUrl: `${window.location.origin}/study/demo2`
        }
      ]
      setStudies(dummyStudies)
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
    // 로그아웃 API 호출
    logoutMutation.mutate(undefined, {
      onSuccess: () => {
        // 로그아웃 성공 시 로컬 상태 정리 및 로그인 페이지로 이동
        logout()
      },
      onError: () => {
        // API 호출 실패 시에도 로컬 상태 정리 및 로그인 페이지로 이동
        logout()
      }
    })
  }

  const handleSettingsClick = () => {
    setIsProfileModalOpen(true)
  }

  const handleUpdateProfile = async (data: Partial<ProfileData>) => {
    try {
      // ProfileData를 API 형식에 맞게 변환
      const updateData = {
        nickname: data.nickname,
        profileImageUrl: data.profileImage
      }

      await patchProfileMutation.mutateAsync(updateData)
      alert('프로필이 성공적으로 업데이트되었습니다.')
    } catch (error) {
      console.error('프로필 업데이트 에러:', error)
      alert('프로필 업데이트에 실패했습니다.')
    }
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
      console.log('스터디 생성 요청 데이터:', data)

      // API 스펙에 맞는 Request Body 구성
      const requestBody = {
        name: data.name,
        description: data.description,
        image: data.image || undefined, // null을 undefined로 변환
        maxCapacity: data.maxCapacity
      }

      console.log('API 요청 데이터:', requestBody)

      // 실제 API 호출
      const response = await createStudy(requestBody)

      console.log('API 응답:', response)

      // 성공적으로 스터디가 생성되면 초대 링크 모달 표시
      const inviteUrl = `${window.location.origin}/study/${response.hashId}`
      setCurrentInviteUrl(inviteUrl)
      setIsInviteModalOpen(true)

      // 스터디 목록 새로고침
      await fetchStudies()

      alert('스터디가 성공적으로 생성되었습니다!')
    } catch (error) {
      console.error('스터디 생성 실패 상세:', error)

      // 백엔드가 실행되지 않은 경우 임시로 프론트엔드에서 처리
      if (error && typeof error === 'object' && 'code' in error && error.code === '500') {
        console.log('백엔드 연결 실패, 임시로 프론트엔드에서 스터디 추가')

        // 임시 스터디 생성
        const tempStudy: Study = {
          id: Date.now(),
          name: data.name,
          description: data.description,
          imageUrl: data.image ? URL.createObjectURL(data.image) : '',
          createdBy: 1,
          createdAt: new Date().toISOString().split('T')[0],
          inviteUrl: `${window.location.origin}/study/demo${Date.now()}`
        }

        setStudies(prevStudies => [tempStudy, ...prevStudies])

        // 초대 링크 모달 표시
        setCurrentInviteUrl(tempStudy.inviteUrl || '')
        setIsInviteModalOpen(true)

        alert('백엔드 연결 실패로 임시로 스터디가 생성되었습니다.\n실제 데이터는 저장되지 않습니다.')
        return
      }

      // 더 자세한 에러 메시지 표시
      let errorMessage = '스터디 생성에 실패했습니다.'
      if (error && typeof error === 'object' && 'message' in error) {
        errorMessage += `\n에러: ${error.message}`
      }
      if (error && typeof error === 'object' && 'code' in error) {
        errorMessage += `\n코드: ${error.code}`
      }

      alert(errorMessage)
    }
  }

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
        activeStudyId={null}
        onStudyClick={(studyId) => {
          // studyId는 실제로는 hashId여야 함
          const study = studies.find(s => s.id.toString() === studyId)
          if (study && study.inviteUrl) {
            const hashId = study.inviteUrl.split('/').pop()
            if (hashId) {
              navigate(`/study/${hashId}`)
            }
          }
        }}
        onLogout={handleLogout}
        onSettingsClick={handleSettingsClick}
        onLogoClick={() => navigate('/dashboard')}
      />
      <div className="flex-1 flex flex-col ml-64">
        <TopBar userName={displayName} />
        <div className="flex-1 overflow-auto">


          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-6">
            {/* 왼쪽 열 - 스터디 목록과 AI 요약본 */}
            <div className="lg:col-span-2 space-y-6">
              <StudyList
                studies={studies}
                isLoading={isLoading}
                onCreateStudy={handleCreateStudy}
                onStudyClick={(studyId) => {
                  // hashId를 사용하여 스터디 상세 페이지로 이동
                  const study = studies.find(s => s.id === studyId)
                  if (study && study.inviteUrl) {
                    const hashId = study.inviteUrl.split('/').pop() // URL에서 hashId 추출
                    if (hashId) {
                      navigate(`/study/${hashId}`)
                    }
                  }
                }}
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
        isLoading={isProfileLoading}
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
