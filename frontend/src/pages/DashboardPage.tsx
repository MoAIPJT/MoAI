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
import { fetchSummaryList } from '../services/summaryService'
import { useLogout, useMe, usePatchProfile, useChangePassword, useDeleteAccount } from '@/hooks/useUsers'
import { useAuth } from '@/hooks/useAuth'
import { useAppStore } from '@/store/appStore'
import { createStudy, getAllStudies } from '@/services/studyService'
import { scheduleService } from '@/services/scheduleService'

const DashboardPage: React.FC = () => {
  const navigate = useNavigate()
  const logoutMutation = useLogout()
  const { logout } = useAuth()
  const { data: userProfile, isLoading: isProfileLoading } = useMe()
  const setProfile = useAppStore((state) => state.auth.setProfile)
  const patchProfileMutation = usePatchProfile()
  const changePasswordMutation = useChangePassword()
  const deleteAccountMutation = useDeleteAccount()

  const [studies, setStudies] = useState<StudyItem[]>([])
  const [summaries, setSummaries] = useState<AISummary[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSummaryLoading, setIsSummaryLoading] = useState(true)
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
          endTime: endDate.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })
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
  }> = []

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
    } catch (error) {
      setStudies([])
    } finally {
      setIsLoading(false)
    }
  }

  // AI 요약본 목록을 가져오는 함수
  const fetchSummaries = async () => {
    try {
      setIsSummaryLoading(true)

      const userId = localStorage.getItem('userId') || '1'
      const response = await fetchSummaryList(userId)

      const convertedSummaries: AISummary[] = response.summaries.map(summary => ({
        id: parseInt(summary.summaryId) || Date.now(),
        title: summary.title,
        description: summary.description,
        createdAt: new Date().toISOString().split('T')[0],
        pdfUrl: `/pdfs/${summary.summaryId}.pdf`
      }))

      setSummaries(convertedSummaries)
    } catch (error) {
      setSummaries([])
    } finally {
      setIsSummaryLoading(false)
    }
  }

  useEffect(() => {
    fetchStudies()
    fetchSummaries()
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
    } catch (error) {
      alert('프로필 업데이트에 실패했습니다.')
    }
  }

  const handleChangePassword = () => {
    // TODO: 비밀번호 변경 페이지로 이동 또는 모달 열기
  }

  const handleOpenChangePasswordModal = () => {
    setIsChangePasswordModalOpen(true)
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
        const errorCode = (error as any).code
        const errorMsg = (error as any).message

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
        const errorCode = (error as any).code
        const errorMsg = (error as any).message

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
        errorMessage += `\n에러: ${error.message}`
      }
      if (error && typeof error === 'object' && 'code' in error) {
        errorMessage += `\n코드: ${error.code}`
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
    } catch (error) {
      console.error('월별 일정 데이터 로드 실패:', error)
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
                    summaries={summaries}
                    isLoading={isSummaryLoading}
                    onSummaryClick={() => {}}
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

                  {upcomingEvents.length > 0 && (
                    <div className="mt-6">
                      <div className="space-y-3">
                        {upcomingEvents.map((event) => (
                          <div key={event.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                            <div
                              className="w-3 h-3 rounded-full flex-shrink-0"
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
                  )}
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
        onOpenChangePasswordModal={handleOpenChangePasswordModal}
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
