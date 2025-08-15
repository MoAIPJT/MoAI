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
// import type { ChangePasswordData } from '../components/organisms/ChangePasswordModal/types'
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
      // setSchedules(schedulesData) // schedules 상태 설정 - 사용하지 않음

      // API 응답을 CalendarEvent 형식으로 변환
      const events: CalendarEvent[] = schedulesData.map(schedule => {
        const startDate = new Date(schedule.startDatetime)
        const endDate = new Date(schedule.endDatetime)

        // 스터디별로 다른 색상 할당
        const getEventColor = (studyName: string) => {
          if (studyName.includes('알고리즘')) return '#AA64FF'
          if (studyName.includes('면접')) return '#FF6B6B'
          if (studyName.includes('CS')) return '#4ECDC4'
          return '#6B7280' // 기본 색상
        }

        return {
          date: startDate, // Date 객체로 변환
          color: getEventColor(schedule.title),
          title: schedule.title,
          startTime: startDate.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' }),
          endTime: endDate.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })
        }
      })

      setCalendarEvents(events)
    } catch (error) {
      console.error('일정 데이터 로드 실패:', error)

      // 에러 시 기본 더미 데이터 사용
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
      ]
      setCalendarEvents(defaultEvents)
      // setSchedules([]) // 빈 배열로 설정 - 사용하지 않음
    } finally {
      // setIsScheduleLoading(false) // 사용하지 않음
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
        status: study.status, // 승인대기중, 가입됨 등 상태 포함
        memberCount: 0, // API에서 제공하지 않는 경우 기본값
        hashId: study.hashId // hashId 포함
      }))

      setStudies(convertedStudies)
    } catch (error) {
      // 에러 시 빈 배열 사용
      setStudies([])
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
        id: parseInt(summary.summaryId) || Date.now(), // summaryId를 숫자로 변환
        title: summary.title,
        description: summary.description,
        createdAt: new Date().toISOString().split('T')[0], // 임시 날짜
        pdfUrl: `/pdfs/${summary.summaryId}.pdf` // 임시 PDF 경로
      }))

      setSummaries(convertedSummaries)
    } catch (error) {
      // 에러 시 빈 배열 사용
      setSummaries([])
    } finally {
      setIsSummaryLoading(false)
    }
  }

  useEffect(() => {
    fetchStudies()
    fetchSummaries()
    fetchSchedules() // 일정 데이터 로드
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
      // 실제 비밀번호 변경 API 호출
      await changePasswordMutation.mutateAsync({
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
        confirmNewPassword: data.confirmPassword
      })

      alert('비밀번호가 성공적으로 변경되었습니다.')
    } catch (error) {
      // 사용자 친화적인 에러 메시지 생성
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
    // 회원탈퇴 확인
    if (!confirm('정말로 회원탈퇴를 하시겠습니까?\n\n⚠️ 주의: 이 작업은 되돌릴 수 없습니다.')) {
      return
    }

    // 추가 확인
    if (!confirm('회원탈퇴를 진행하시겠습니까?\n\n모든 데이터가 영구적으로 삭제됩니다.')) {
      return
    }

    try {
      // 회원탈퇴 API 호출
      await deleteAccountMutation.mutateAsync()

      alert('회원탈퇴가 완료되었습니다.')

      // 로그아웃 처리 및 로그인 페이지로 이동
      logout()

    } catch (error) {
      // 사용자 친화적인 에러 메시지 생성
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
      // 이미지가 없을 때 스터디 첫 글자로 자동 이미지 생성
      let processedImage = data.image
      if (!processedImage && data.name.trim()) {
        // Canvas를 사용하여 첫 글자 이미지 생성
        const canvas = document.createElement('canvas')
        canvas.width = 200
        canvas.height = 200
        const ctx = canvas.getContext('2d')

        if (ctx) {
          // 배경색 설정 (보라색 계열)
          ctx.fillStyle = '#F6EEFF'
          ctx.fillRect(0, 0, 200, 200)

          // 텍스트 설정
          ctx.fillStyle = '#8B5CF6'
          ctx.font = 'bold 80px Arial'
          ctx.textAlign = 'center'
          ctx.textBaseline = 'middle'

          // 첫 글자 그리기
          const firstChar = data.name.charAt(0)
          ctx.fillText(firstChar, 100, 100)

          // Canvas를 Blob으로 변환
          canvas.toBlob((blob) => {
            if (blob) {
              processedImage = new File([blob], 'auto-generated.png', { type: 'image/png' })
            }
          }, 'image/png')
        }
      }

      // API 스펙에 맞는 Request Body 구성
      const requestBody = {
        name: data.name,
        description: data.description,
        image: processedImage || undefined, // null을 undefined로 변환
        maxCapacity: data.maxCapacity
      }

      // 실제 API 호출
      const response = await createStudy(requestBody)

      // 성공적으로 스터디가 생성되면 초대 링크 모달 표시
      const inviteUrl = `${window.location.origin}/study/${response.hashId}`
      setCurrentInviteUrl(inviteUrl)

      // 스터디 목록 새로고침
      await fetchStudies()

      // 스터디 생성 모달 닫기
      setIsCreateStudyModalOpen(false)

      // 초대 링크 모달 표시 (로딩 완료 후)
      setIsInviteModalOpen(true)

    } catch (error) {
      // 백엔드가 실행되지 않은 경우 임시로 프론트엔드에서 처리
      if (error && typeof error === 'object' && 'code' in error && error.code === '500') {
        alert('백엔드 서버에 연결할 수 없습니다. 잠시 후 다시 시도해주세요.')
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
    } finally {
      // 스터디 생성 완료 후 로딩 상태 비활성화
      setIsCreatingStudy(false)
    }
  }

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date)
  }

  // 월 변경 시 일정 데이터 다시 로드
  const handleMonthChange = (date: Date) => {
    // 선택된 월의 시작과 끝 날짜 계산
    const year = date.getFullYear()
    const month = date.getMonth()
    const from = new Date(year, month, 1).toISOString()
    const to = new Date(year, month + 1, 0).toISOString()

    // 해당 월의 일정 데이터 로드
    fetchSchedulesForMonth(from, to)
  }

  // 특정 월의 일정 데이터를 가져오는 함수
  const fetchSchedulesForMonth = async (from: string, to: string) => {
    try {
      // setIsScheduleLoading(true) // 사용하지 않음
      const schedulesData = await scheduleService.getMySchedules(from, to)
      // setSchedules(schedulesData) // schedules 상태 설정 - 사용하지 않음

      // API 응답을 CalendarEvent 형식으로 변환
      const events: CalendarEvent[] = schedulesData.map(schedule => {
        const startDate = new Date(schedule.startDatetime)
        const endDate = new Date(schedule.endDatetime)

        // 스터디별로 다른 색상 할당
        const getEventColor = (studyName: string) => {
          if (studyName.includes('알고리즘')) return '#AA64FF'
          if (studyName.includes('면접')) return '#FF6B6B'
          if (studyName.includes('CS')) return '#4ECDC4'
          return '#6B7280' // 기본 색상
        }

        return {
          date: startDate,
          color: getEventColor(schedule.title),
          title: schedule.title,
          startTime: startDate.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' }),
          endTime: endDate.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })
        }
      })

      setCalendarEvents(events)
    } catch (error) {
      console.error('월별 일정 데이터 로드 실패:', error)
      // 에러 시 기존 이벤트 유지
    } finally {
      // setIsScheduleLoading(false) // 사용하지 않음
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
            {/* 상단 섹션 - 스터디 목록과 일정 관리 */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* 왼쪽 열 - 스터디 목록과 My AI 요약본 */}
              <div className="lg:col-span-2 space-y-6">
                {/* 스터디 목록 */}
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
                      status: study.status // status 정보 추가
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

                {/* My AI 요약본 */}
                <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                  <div className="flex items-center mb-6">
                    <div className="w-2 h-8 rounded-full mr-3" style={{ backgroundColor: '#477866' }}></div>
                    <h2 className="text-2xl font-bold text-gray-900">My AI 요약본</h2>
                  </div>
                  <AISummaryList
                    summaries={summaries}
                    isLoading={isSummaryLoading}
                    onSummaryClick={() => { }}
                  />
                </div>
              </div>

              {/* 오른쪽 열 - 일정 관리 */}
              <div className="lg:col-span-1">
                <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm h-fit">
                  <div className="flex items-center mb-6">
                    <div className="w-2 h-8 rounded-full mr-3" style={{ backgroundColor: '#F8BB50' }}></div>
                    <h2 className="text-2xl font-bold text-gray-900">일정 관리</h2>
                  </div>
                  <Calendar
                    events={calendarEvents}
                    selectedDate={selectedDate}
                    onDateSelect={handleDateSelect}
                    onMonthChange={handleMonthChange}
                    className="w-full"
                  />

                  {/* 다가오는 일정 섹션 */}
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

      {/* 스터디 생성 모달 */}
      <CreateStudyModal
        isOpen={isCreateStudyModalOpen}
        onClose={() => {
          setIsCreateStudyModalOpen(false)
          setIsCreatingStudy(false) // 모달 닫을 때 로딩 상태도 초기화
        }}
        onSubmit={handleCreateStudy}
        isLoading={isCreatingStudy}
        onLoadingChange={setIsCreatingStudy}
      />

      {/* 로딩 토스트 */}
      <LoadingToast
        isVisible={isCreatingStudy}
        message="스터디 시작하는 중..."
      />
    </div>
  )
}

export default DashboardPage
