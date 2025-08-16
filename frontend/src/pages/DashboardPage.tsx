import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import DashboardSidebar from '../components/organisms/DashboardSidebar'
import TopBar from '../components/molecules/TopBar'
import StudyList from '../components/organisms/StudyList'
import AISummaryList from '../components/organisms/AISummaryList'
import ProfileSettingsModal from '../components/organisms/ProfileSettingsModal'
import ChangePasswordModal from '../components/organisms/ChangePasswordModal'
import { Calendar } from '../components/ui/calendar'
import Button from '../components/atoms/Button'
import LoadingToast from '../components/atoms/LoadingToast'
import type { StudyItem } from '../components/organisms/DashboardSidebar/types'
import type { AISummary } from '../components/molecules/AISummaryCard/types'
import type { CreateStudyData } from '../components/organisms/CreateStudyModal/types'
import type { ProfileData } from '../components/organisms/ProfileSettingsModal/types'
import type { CalendarEvent } from '../components/ui/calendar'
import InviteLinkModal from '../components/organisms/InviteLinkModal'
import CreateStudyModal from '../components/organisms/CreateStudyModal'
import { useLogout, useMe, usePatchProfile, useChangePassword, useDeleteAccount } from '@/hooks/useUsers'
import { useAuth } from '@/hooks/useAuth'
import { useAppStore } from '@/store/appStore'
import { createStudy, getAllStudies } from '@/services/studyService'
import { scheduleService } from '@/services/scheduleService'
import { useAiDashboardList } from '@/hooks/useAisummaries'

const DashboardPage: React.FC = () => {
  const navigate = useNavigate()
  const logoutMutation = useLogout()
  const { logout } = useAuth()
  const { data: userProfile, isLoading: isProfileLoading } = useMe()
  const setProfile = useAppStore((state) => state.auth.setProfile)
  const patchProfileMutation = usePatchProfile()
  const changePasswordMutation = useChangePassword()
  const deleteAccountMutation = useDeleteAccount()

  // AI 요약본 목록 조회 훅 사용
  const { data: dashboardSummaries, isLoading: isSummaryLoading } = useAiDashboardList()

  const [studies, setStudies] = useState<StudyItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false)
  const [currentInviteUrl, setCurrentInviteUrl] = useState('')
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false)
  const [isChangePasswordModalOpen, setIsChangePasswordModalOpen] = useState(false)
  const [isCreateStudyModalOpen, setIsCreateStudyModalOpen] = useState(false)
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const [expandedStudy, setExpandedStudy] = useState(false)
  const [calendarEvents, setCalendarEvents] = useState<CalendarEvent[]>([])
  const [isCreatingStudy, setIsCreatingStudy] = useState(false)

  // 일정 데이터를 가져오는 함수
  const fetchSchedules = async () => {
    try {
      // 현재 월의 시작과 끝 날짜 계산
      const now = new Date()
      const from = new Date(now.getFullYear(), now.getMonth(), 1).toISOString()
      const to = new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString()

      const schedulesData = await scheduleService.getMySchedules(from, to)

      // API 응답을 CalendarEvent 형식으로 변환
      const events: CalendarEvent[] = schedulesData.map(schedule => {
        const startDate = new Date(schedule.startDatetime)
        const endDate = new Date(schedule.endDatetime)

        // 모든 이벤트를 보라색으로 통일
        const getEventColor = () => {
          return '#AA64FF'
        }

        return {
          date: startDate,
          color: getEventColor(),
          title: schedule.title,
          startTime: startDate.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' }),
          endTime: endDate.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' }),
          // 스터디 정보 추가
          studyId: schedule.studyId,
          studyName: schedule.name,
          studyDescription: schedule.description,
          studyImage: schedule.image
        }
      })

      setCalendarEvents(events)
    } catch (error) {
      console.error('일정 데이터 로드 실패:', error)

      // 에러 시 기본 더미 데이터 사용 (모두 보라색으로 통일)
      const defaultEvents: CalendarEvent[] = [
        {
          date: new Date(new Date().getFullYear(), new Date().getMonth(), 15),
          color: '#AA64FF',
          title: '알고리즘 스터디',
          startTime: '14:00',
          endTime: '16:00'
        },
        {
          date: new Date(new Date().getFullYear(), new Date().getMonth(), 20),
          color: '#AA64FF',
          title: 'CS 면접 준비',
          startTime: '19:00',
          endTime: '21:00'
        },
        {
          date: new Date(new Date().getFullYear(), new Date().getMonth(), 25),
          color: '#AA64FF',
          title: '프로젝트 회의',
          startTime: '10:00',
          endTime: '12:00'
        }
      ]
      setCalendarEvents(defaultEvents)
    }
  }

    // 다가오는 일정을 달력 이벤트에서 동적으로 생성
  const upcomingEvents: Array<{
    id: number;
    title: string;
    date: string;
    time: string;
    studyName: string;
    studyImage: string;
    color: string;
  }> = calendarEvents
    .filter(event => {
      const eventDate = new Date(event.date)
      const now = new Date()
      // 오늘 이후의 일정만 필터링
      return eventDate >= new Date(now.getFullYear(), now.getMonth(), now.getDate())
    })
    .sort((a, b) => {
      // 날짜순으로 정렬 (가장 가까운 일정이 먼저)
      return new Date(a.date).getTime() - new Date(b.date).getTime()
    })
    .slice(0, 5) // 최대 5개까지만 표시
    .map((event, index) => {
      // 실제 스터디 정보가 있으면 사용, 없으면 제목에서 추출
      let studyName = event.studyName || '스터디'
      let studyImage = event.studyImage || 'S'

      // 실제 스터디 정보가 없는 경우에만 제목에서 추출
      if (!event.studyName) {
        const title = event.title || ''
        if (title.includes('알고리즘') || title.includes('코딩') || title.includes('코테')) {
          studyName = '알고리즘 스터디'
          studyImage = '알고리즘'
        } else if (title.includes('CS') || title.includes('컴퓨터') || title.includes('시스템')) {
          studyName = 'CS 면접 준비'
          studyImage = 'CS'
        } else if (title.includes('프로젝트') || title.includes('회의') || title.includes('미팅')) {
          studyName = '프로젝트 회의'
          studyImage = '프로젝트'
        } else if (title.includes('면접') || title.includes('인터뷰')) {
          studyName = '면접 준비'
          studyImage = '면접'
        } else if (title.includes('맛도리') || title.includes('맛집') || title.includes('식사')) {
          studyName = '대전맛집탐방'
          studyImage = '맛집'
        } else if (title.includes('스터디') || title.includes('학습')) {
          studyName = '일반 스터디'
          studyImage = '스터디'
        } else {
          // 제목의 첫 번째 단어를 사용하되, 더 의미있는 이름 생성
          const titleWords = title.split(' ')
          const firstWord = titleWords[0] || '일정'

          // 한 글자인 경우 더 긴 이름으로 확장
          if (firstWord.length === 1) {
            studyName = `${firstWord} 스터디`
          } else if (firstWord.length <= 3) {
            studyName = `${firstWord} 모임`
          } else {
            studyName = firstWord
          }
          studyImage = firstWord
        }
      }

      // 날짜 포맷팅
      const eventDate = new Date(event.date)
      const dayOfWeek = ['일', '월', '화', '수', '목', '금', '토'][eventDate.getDay()]
      const formattedDate = `${eventDate.getFullYear()}.${String(eventDate.getMonth() + 1).padStart(2, '0')}.${String(eventDate.getDate()).padStart(2, '0')}(${dayOfWeek})`

      // 시간 포맷팅
      const time = `${event.startTime || ''} - ${event.endTime || ''}`

      return {
        id: index + 1,
        title: event.title || '제목 없음',
        date: formattedDate,
        time: time,
        studyName: studyName,
        studyImage: studyImage,
        color: event.color || '#AA64FF'
      }
    })

  // 사용자 프로필 데이터를 ProfileData 형식으로 변환
  const profileData: ProfileData = {
    name: userProfile?.name || '',
    email: userProfile?.email || '',
    profileImageUrl: userProfile?.profileImageUrl || '',
    providerType: userProfile?.providerType || 'LOCAL'
  }

  // 프로필 로딩 중일 때 기본값 사용
  const displayName = isProfileLoading ? '' : (userProfile?.name || '')

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

      // API 응답을 StudyItem 타입에 맞게 변환 (DashboardSidebar용)
      const convertedStudies: StudyItem[] = studiesData.map(study => ({
        id: study.studyId.toString(),
        name: study.name,
        description: study.description || '',
        image: study.imageUrl || '',
        image_url: study.imageUrl || '',
        status: study.status,
        memberCount: 0,
        hashId: study.hashId
      }))

      setStudies(convertedStudies)
    } catch {
      setStudies([])
    } finally {
      setIsLoading(false)
    }
  }

  // dashboardSummaries를 AISummary 타입으로 변환
  const convertedSummaries: AISummary[] = React.useMemo(() => {
    if (!dashboardSummaries?.summaries) return []

    return dashboardSummaries.summaries
      .slice(0, 4) // 최대 4개까지만 표시
      .map(summary => ({
        id: summary.summaryId,
        title: summary.title,
        description: summary.description,
        createdAt: summary.createdAt,
        pdfUrl: `/pdfs/${summary.summaryId}.pdf`
      }))
  }, [dashboardSummaries])

  // AI 요약본 클릭 핸들러 추가
  const handleSummaryClick = () => {
    window.open('/ai-summary', '_blank')
  }

  useEffect(() => {
    fetchStudies()
    fetchSchedules()
  }, [])

  const handleItemClick = (itemId: string) => {
    if (itemId === 'ai-summary') {
      window.open('/ai-summary', '_blank')
    }

    if (itemId === 'study') {
      setExpandedStudy(!expandedStudy)
    }
  }

  const handleLogout = () => {
    logoutMutation.mutate(undefined, {
      onSuccess: () => {
        logout()
      },
      onError: () => {
        logout()
      }
    })
  }

  const handleSettingsClick = () => {
    setIsProfileModalOpen(true)
  }

  const handleUpdateProfile = async (data: Partial<ProfileData>) => {
    try {
      const updateData = {
        name: data.name,
        profileImageUrl: data.profileImageUrl
      }

      await patchProfileMutation.mutateAsync(updateData)
      alert('프로필이 성공적으로 업데이트되었습니다.')
    } catch {
      alert('프로필 업데이트에 실패했습니다.')
    }
  }

  const handleChangePassword = () => {
    // TODO: 비밀번호 변경 페이지로 이동 또는 모달 열기
  }

  const handleChangePasswordSubmit = async (data: { currentPassword: string; newPassword: string; confirmPassword: string }) => {
    try {
      await changePasswordMutation.mutateAsync({
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
        confirmNewPassword: data.confirmPassword
      })

      alert('비밀번호가 성공적으로 변경되었습니다.')
    } catch (error) {
      let errorMessage = '비밀번호 변경에 실패했습니다.'

      if (error && typeof error === 'object' && 'code' in error) {
        const errorCode = (error as { code: string; message?: string }).code
        const errorMsg = (error as { code: string; message?: string }).message

        switch (errorCode) {
          case 'INVALID_PASSWORD':
            errorMessage = '현재 비밀번호가 올바르지 않습니다.'
            break
          case 'PASSWORD_CONFIRM_MISMATCH':
            errorMessage = '새 비밀번호와 확인 비밀번호가 일치하지 않습니다.'
            break
          case 'PASSWORD_SAME_AS_OLD':
            errorMessage = '새 비밀번호는 현재 비밀번호와 달라야 합니다.'
            break
          case 'VALIDATION_ERROR':
            errorMessage = '입력값을 확인해주세요.'
            break
          case 'INTERNAL_SERVER_ERROR':
            errorMessage = '서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.'
            break
          default:
            if (errorMsg) {
              errorMessage = errorMsg
            }
        }
      } else if (error instanceof Error) {
        errorMessage = error.message
      }

      alert(errorMessage)
    }
  }

  const handleWithdrawMembership = async () => {
    if (!confirm('정말로 회원탈퇴를 하시겠습니까?\n\n⚠️ 주의: 이 작업은 되돌릴 수 없습니다.')) {
      return
    }

    if (!confirm('회원탈퇴를 진행하시겠습니까?\n\n모든 데이터가 영구적으로 삭제됩니다.')) {
      return
    }

    try {
      await deleteAccountMutation.mutateAsync()

      alert('회원탈퇴가 완료되었습니다.')
      logout()

    } catch (error) {
      let errorMessage = '회원탈퇴에 실패했습니다.'

      if (error && typeof error === 'object' && 'code' in error) {
        const errorCode = (error as { code: string; message?: string }).code
        const errorMsg = (error as { code: string; message?: string }).message

        switch (errorCode) {
          case 'UNAUTHORIZED':
            errorMessage = '인증이 만료되었습니다. 다시 로그인해주세요.'
            break
          case 'USER_NOT_FOUND':
            errorMessage = '사용자 정보를 찾을 수 없습니다.'
            break
          case 'INTERNAL_SERVER_ERROR':
            errorMessage = '서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.'
            break
          default:
            if (errorMsg) {
              errorMessage = errorMsg
            }
        }
      } else if (error instanceof Error) {
        errorMessage = error.message
      }

      alert(errorMessage)
    }
  }

  const handleCreateStudy = async (data: CreateStudyData) => {
    try {
      let processedImage = data.image
      if (!processedImage && data.name.trim()) {
        const canvas = document.createElement('canvas')
        canvas.width = 200
        canvas.height = 200
        const ctx = canvas.getContext('2d')

        if (ctx) {
          ctx.fillStyle = '#F6EEFF'
          ctx.fillRect(0, 0, 200, 200)

          ctx.fillStyle = '#8B5CF6'
          ctx.font = 'bold 80px Arial'
          ctx.textAlign = 'center'
          ctx.textBaseline = 'middle'

          const firstChar = data.name.charAt(0)
          ctx.fillText(firstChar, 100, 100)

          canvas.toBlob((blob) => {
            if (blob) {
              processedImage = new File([blob], 'auto-generated.png', { type: 'image/png' })
            }
          }, 'image/png')
        }
      }

      const requestBody = {
        name: data.name,
        description: data.description,
        image: processedImage || undefined,
        maxCapacity: data.maxCapacity
      }

      const response = await createStudy(requestBody)

      const inviteUrl = `${window.location.origin}/study/${response.hashId}`
      setCurrentInviteUrl(inviteUrl)

      await fetchStudies()

      setIsCreateStudyModalOpen(false)
      setIsInviteModalOpen(true)

    } catch (error) {
      if (error && typeof error === 'object' && 'code' in error && error.code === '500') {
        alert('백엔드 서버에 연결할 수 없습니다. 잠시 후 다시 시도해주세요.')
        return
      }

      let errorMessage = '스터디 생성에 실패했습니다.'
      if (error && typeof error === 'object' && 'message' in error) {
        errorMessage += `\n에러: ${(error as { message: string }).message}`
      }
      if (error && typeof error === 'object' && 'code' in error) {
        errorMessage += `\n코드: ${(error as { code: string }).code}`
      }

      alert(errorMessage)
    } finally {
      setIsCreatingStudy(false)
    }
  }

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date)
  }

  const handleMonthChange = (date: Date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const from = new Date(year, month, 1).toISOString()
    const to = new Date(year, month + 1, 0).toISOString()

    fetchSchedulesForMonth(from, to)
  }

  const fetchSchedulesForMonth = async (from: string, to: string) => {
    try {
      const schedulesData = await scheduleService.getMySchedules(from, to)

      const events: CalendarEvent[] = schedulesData.map(schedule => {
        const startDate = new Date(schedule.startDatetime)
        const endDate = new Date(schedule.endDatetime)

        // 모든 이벤트를 보라색으로 통일
        const getEventColor = () => {
          return '#AA64FF'
        }

        return {
          date: startDate,
          color: getEventColor(),
          title: schedule.title,
          startTime: startDate.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' }),
          endTime: endDate.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })
        }
      })

      setCalendarEvents(events)
    } catch {
      console.error('월별 일정 데이터 로드 실패')
    }
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <DashboardSidebar
        activeItem="mypage"
        expandedStudy={expandedStudy}
        studies={studies}
        onItemClick={handleItemClick}
        activeStudyId={null}
        onStudyClick={(studyId) => {
          const study = studies.find(s => s.id === studyId)
          if (study?.hashId) {
            navigate(`/study/${study.hashId}`)
          } else {
            navigate(`/study/${studyId}`)
          }
        }}
        onLogout={handleLogout}
        onSettingsClick={handleSettingsClick}
        onLogoClick={() => navigate('/dashboard')}
      />

      <div className="flex-1 flex flex-col ml-64">
        <TopBar userName={displayName} />
        <div className="flex-1 overflow-auto">
          <div className="p-6 space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center">
                      <div className="w-2 h-8 bg-purple-500 rounded-full mr-3"></div>
                      <h2 className="text-2xl font-bold text-gray-900">스터디 목록</h2>
                    </div>
                    <Button
                      variant="primary"
                      size="md"
                      onClick={() => setIsCreateStudyModalOpen(true)}
                      className="rounded-xl bg-[#F6EEFF] text-gray-700 hover:bg-[#E8D9FF] border-0"
                    >
                      스터디 시작하기
                    </Button>
                  </div>
                  <StudyList
                    studies={studies.map(study => ({
                      id: parseInt(study.id),
                      name: study.name,
                      description: study.description,
                      imageUrl: study.image || study.image_url || '',
                      createdBy: 1,
                      createdAt: new Date().toISOString().split('T')[0],
                      inviteUrl: study.hashId ? `${window.location.origin}/study/${study.hashId}` : `${window.location.origin}/study/${study.id}`,
                      status: study.status
                    }))}
                    isLoading={isLoading}
                    onCreateStudy={handleCreateStudy}
                    onStudyClick={(studyId) => {
                      const study = studies.find(s => s.id === studyId.toString())
                      if (study?.hashId) {
                        navigate(`/study/${study.hashId}`)
                      } else {
                        navigate(`/study/${studyId}`)
                      }
                    }}
                  />
                </div>

                <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                  <div className="flex items-center mb-6">
                    <div className="w-2 h-8 rounded-full mr-3" style={{ backgroundColor: '#477866' }}></div>
                    <h2 className="text-2xl font-bold text-gray-900">AI 요약 자료</h2>
                  </div>
                  <AISummaryList
                    summaries={convertedSummaries}
                    isLoading={isSummaryLoading}
                    onSummaryClick={handleSummaryClick}
                  />
                </div>
              </div>

              <div className="lg:col-span-1">
                <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm h-fit">
                  <div className="flex items-center mb-6">
                    <div className="w-2 h-8 rounded-full mr-3" style={{ backgroundColor: '#F8BB50' }}></div>
                    <h2 className="text-2xl font-bold text-gray-900">일정</h2>
                  </div>
                  <Calendar
                    events={calendarEvents}
                    selectedDate={selectedDate}
                    onDateSelect={handleDateSelect}
                    onMonthChange={handleMonthChange}
                    className="w-full"
                  />

                  {/* 다가오는 일정 섹션 */}
                  <div className="mt-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">다가오는 일정</h3>
                    {upcomingEvents.length > 0 ? (
                      <div className="space-y-3">
                        {upcomingEvents.map((event) => (
                          <div key={event.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                            <div
                              className="w-2 h-2 rounded-full flex-shrink-0"
                              style={{ backgroundColor: event.color }}
                            />
                            <div className="flex-1 min-w-0">
                              <div className="text-sm font-medium text-gray-900 truncate">
                                {event.title}
                              </div>
                              <div className="text-xs text-gray-500">
                                {event.date} {event.time}
                              </div>
                            </div>
                            <div className="flex items-center gap-2 flex-shrink-0">
                              <div className="px-3 py-1 bg-gray-200 rounded-full flex items-center gap-2">
                                <div className="w-5 h-5 flex items-center justify-center text-xs font-medium">
                                  {event.studyImage.startsWith('http') ? (
                                    // URL인 경우 이미지 표시
                                    <img
                                      src={event.studyImage}
                                      alt={event.studyName}
                                      className="w-5 h-5 rounded object-cover"
                                      onError={(e) => {
                                        // 이미지 로드 실패 시 기본 아이콘 표시
                                        const target = e.target as HTMLImageElement
                                        target.style.display = 'none'
                                        target.nextElementSibling?.classList.remove('hidden')
                                      }}
                                    />
                                  ) : event.studyImage === '알고리즘' ? (
                                    <div className="w-5 h-5 bg-blue-500 text-white rounded flex items-center justify-center text-xs font-bold">
                                      A
                                    </div>
                                  ) : event.studyImage === 'CS' ? (
                                    <div className="w-5 h-5 bg-green-500 text-white rounded flex items-center justify-center text-xs font-bold">
                                      CS
                                    </div>
                                  ) : event.studyImage === '프로젝트' ? (
                                    <div className="w-5 h-5 bg-purple-500 text-white rounded flex items-center justify-center text-xs font-bold">
                                      P
                                    </div>
                                  ) : event.studyImage === '면접' ? (
                                    <div className="w-5 h-5 bg-orange-500 text-white rounded-full flex items-center justify-center text-xs font-bold">
                                      면
                                    </div>
                                  ) : event.studyImage === '맛집' ? (
                                    <div className="w-5 h-5 bg-red-500 text-white rounded flex items-center justify-center text-xs font-bold">
                                      🍖
                                    </div>
                                  ) : event.studyImage === '스터디' ? (
                                    <div className="w-5 h-5 bg-indigo-500 text-white rounded flex items-center justify-center text-xs font-bold">
                                      📚
                                    </div>
                                  ) : (
                                    <div className="w-5 h-5 bg-gray-500 text-white rounded flex items-center justify-center text-xs font-bold">
                                      {event.studyImage.charAt(0)}
                                    </div>
                                  )}
                                  {/* 이미지 로드 실패 시 표시할 기본 아이콘 */}
                                  {event.studyImage.startsWith('http') && (
                                    <div className="w-5 h-5 bg-gray-500 text-white rounded flex items-center justify-center text-xs font-bold hidden">
                                      {event.studyName.charAt(0)}
                                    </div>
                                  )}
                                </div>
                                <span className="text-xs text-gray-700 font-medium">
                                  {event.studyName}
                                </span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-6 text-gray-500">
                        <div className="text-sm">다가오는 일정이 없어요</div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <InviteLinkModal
        isOpen={isInviteModalOpen}
        onClose={() => setIsInviteModalOpen(false)}
        inviteUrl={currentInviteUrl}
      />

      <ProfileSettingsModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        profileData={profileData}
        onUpdateProfile={handleUpdateProfile}
        onChangePassword={handleChangePassword}
        onWithdrawMembership={handleWithdrawMembership}
        isLoading={isProfileLoading}
      />

      <ChangePasswordModal
        isOpen={isChangePasswordModalOpen}
        onClose={() => setIsChangePasswordModalOpen(false)}
        onSubmit={handleChangePasswordSubmit}
      />

      <CreateStudyModal
        isOpen={isCreateStudyModalOpen}
        onClose={() => {
          setIsCreateStudyModalOpen(false)
          setIsCreatingStudy(false)
        }}
        onSubmit={handleCreateStudy}
        isLoading={isCreatingStudy}
        onLoadingChange={setIsCreatingStudy}
      />

      <LoadingToast
        isVisible={isCreatingStudy}
        message="스터디 시작하는 중..."
      />
    </div>
  )
}

export default DashboardPage
