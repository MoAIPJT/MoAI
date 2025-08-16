import React, { useState, useEffect } from 'react'
import Button from '../../atoms/Button'
import type { StudyVideoConferenceProps } from './types'
import videoConferenceService, { type ParticipantsResponseDto } from '../../../services/videoConferenceService'

const StudyVideoConference: React.FC<StudyVideoConferenceProps> = ({
    currentUserRole,
    hashId
}) => {
    const [sessionStatus, setSessionStatus] = useState<ParticipantsResponseDto | null>(null)
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    // 세션 상태 및 참가자 정보 조회
    useEffect(() => {
        if (hashId) {
            fetchSessionStatus()
        }
    }, [hashId])

    const fetchSessionStatus = async () => {
        try {
            setIsLoading(true)
            setError(null)
            const response = await videoConferenceService.getParticipants(hashId!)
            setSessionStatus(response)
        } catch (error) {
            console.error('세션 상태 조회 실패:', error)
            setError('세션 상태를 조회할 수 없습니다.')
        } finally {
            setIsLoading(false)
        }
    }

    // 세션 시작 및 바로 참여 (ADMIN/DELEGATE만 가능)
    const handleStartSession = async () => {
        console.log('클릭성공')
        if (!hashId) {
            console.log('id 없음:', hashId)
            return
        }

        try {
            setIsLoading(true)
            setError(null)
            console.log('세션 시작 시도:', hashId)
            // 1. 세션 열기
            const openResponse = await videoConferenceService.openSession(hashId)
            console.log('세션 시작 성공:', openResponse)

            // 2. 바로 세션 참여
            const joinResponse = await videoConferenceService.joinSession(hashId)
            console.log('세션 참여 성공:', joinResponse)

            // 3. 화상회의 페이지를 새 탭에서 열기
            const params = new URLSearchParams({
                wsUrl: joinResponse.wsUrl,
                token: joinResponse.token,
                roomName: joinResponse.roomName,
                displayName: joinResponse.displayName,
                sessionId: hashId
            })

            const videoConferenceUrl = `/video-conference?${params.toString()}`
            console.log('화상회의 URL:', videoConferenceUrl)

            // 새 탭에서 열기
            window.open(videoConferenceUrl, '_blank')

            // 4. 세션 상태 업데이트
            setSessionStatus(prev => ({
                ...prev,
                sessionOpen: true,
                count: 1,
                participants: []
            }))

            // 성공 메시지
            alert('온라인 스터디가 시작되었고 화상회의에 참여했습니다!')

        } catch (error) {
            console.error('세션 시작/참여 실패:', error)
            setError('온라인 스터디를 시작할 수 없습니다.')
            alert('온라인 스터디 시작에 실패했습니다. 다시 시도해주세요.')
        } finally {
            setIsLoading(false)
        }
    }

    // 세션 참여
    const handleJoinSession = async () => {
        console.log('일단 클릭:', hashId)
        if (!hashId) {
            console.log('id 없음:', hashId)
            return
        }

        try {
            setIsLoading(true)
            setError(null)

            const response = await videoConferenceService.joinSession(hashId)
            console.log('세션 참여 성공:', response)

            // URL 파라미터로 세션 정보를 전달하여 새 탭에서 열기
            const params = new URLSearchParams({
                wsUrl: response.wsUrl,
                token: response.token,
                roomName: response.roomName,
                sessionId: hashId
            })

            const videoConferenceUrl = `/video-conference?${params.toString()}`
            console.log('화상회의 URL:', videoConferenceUrl)

            // 새 탭에서 열기
            window.open(videoConferenceUrl, '_blank')

        } catch (error) {
            console.error('세션 참여 실패:', error)
            setError('세션에 참여할 수 없습니다.')
            alert('세션 참여에 실패했습니다. 다시 시도해주세요.')
        } finally {
            setIsLoading(false)
        }
    }



    // 권한 확인
    const isAdminOrDelegate = currentUserRole === 'ADMIN' || currentUserRole === 'DELEGATE'
    const isSessionOpen = sessionStatus?.sessionOpen || false
    const currentParticipants = sessionStatus?.participants || []

    // 디버깅용 로그
    console.log('StudyVideoConference 상태:', {
        hashId,
        currentUserRole,
        isAdminOrDelegate,
        sessionStatus,
        isSessionOpen,
        currentParticipants: currentParticipants.length
    })

    return (
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
            <div className="flex items-center mb-6">
                <div className="w-2 h-8 rounded-full mr-3" style={{ backgroundColor: '#8B5CF6' }}></div>
                <h2 className="text-2xl font-bold text-gray-900">온라인 스터디</h2>
            </div>

            {/* 세션 상태 표시 */}
            <div className="mb-6">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-2">
                        <div className={`w-3 h-3 rounded-full ${isSessionOpen ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                        <span className="text-sm font-medium text-gray-700">
                            {isSessionOpen ? '진행 중' : '대기 중'}
                        </span>
                    </div>

                    {isSessionOpen && (
                        <span className="text-sm text-gray-600">
                            참가자: {sessionStatus?.count || 0}명
                        </span>
                    )}
                </div>

                {/* 참가자 목록 */}
                {isSessionOpen && currentParticipants.length > 0 && (
                    <div className="mb-4">
                        <h4 className="text-sm font-medium text-gray-700 mb-2">현재 참가자</h4>
                        <div className="flex flex-wrap gap-2">
                            {currentParticipants.map((participant, index) => (
                                <div key={index} className="flex items-center space-x-2 bg-gray-100 px-3 py-1 rounded-full">
                                    <img
                                        src={participant.profileImageUrl || '/default-avatar.png'}
                                        alt={participant.name}
                                        className="w-5 h-5 rounded-full"
                                    />
                                    <span className="text-sm text-gray-700">{participant.name}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* 버튼 영역 */}
            <div className="flex flex-col space-y-3">
                {!isSessionOpen ? (
                    // 세션이 열려있지 않을 때
                    isAdminOrDelegate ? (
                        <Button
                            variant="primary"
                            size="lg"
                            onClick={handleStartSession}
                            disabled={isLoading}
                            className="w-full"
                        >
                            {isLoading ? '시작 중...' : '온라인 스터디 시작 및 참여'}
                        </Button>
                    ) : (
                        <div className="text-center py-4">
                            <p className="text-gray-500 text-sm">
                                관리자나 대리인이 온라인 스터디를 시작할 수 있습니다.
                            </p>
                        </div>
                    )
                ) : (
                    // 세션이 열려있을 때
                    <>
                        <Button
                            variant="primary"
                            size="lg"
                            onClick={handleJoinSession}
                            disabled={isLoading}
                            className="w-full"
                        >
                            {isLoading ? '참여 중...' : '온라인 스터디 참여'}
                        </Button>


                    </>
                )}
            </div>

            {/* 에러 메시지 */}
            {error && (
                <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-sm text-red-600">{error}</p>
                </div>
            )}

            {/* 도움말 */}
            <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-xs text-blue-600">
                    💡 온라인 스터디에서는 화상회의, 화면 공유, 채팅 등의 기능을 사용할 수 있습니다.
                </p>
            </div>
        </div>
    )
}

export default StudyVideoConference
