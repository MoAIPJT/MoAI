import React, { useState } from 'react'
import type { StudyMembersModalProps } from './types'

// 이미지 URL이 유효한지 확인하는 함수
const isValidImageUrl = (url: string): boolean => {
  if (!url || typeof url !== 'string') return false

  // URL이 실제 이미지 파일 확장자를 가지고 있는지 확인
  const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg']
  const hasImageExtension = imageExtensions.some(ext =>
    url.toLowerCase().includes(ext)
  )

  // URL이 http:// 또는 https://로 시작하는지 확인
  const hasValidProtocol = url.startsWith('http://') || url.startsWith('https://')

  // URL이 실제 도메인을 가지고 있는지 확인 (간단한 검증)
  const hasValidDomain = url.includes('.') && url.length > 10

  return hasImageExtension && hasValidProtocol && hasValidDomain
}

const StudyMembersModal: React.FC<StudyMembersModalProps> = ({
  isOpen,
  onClose,
  members,
  studyName,
  currentUserRole,
  currentUserName,
  joinRequests = [],
  onAcceptJoinRequest,
  onRejectJoinRequest,
  onMemberRoleChange,
  onLeaveStudy,
  hashId,
}) => {
  const [showToast, setShowToast] = useState(false)
  const [showConfirmModal, setShowConfirmModal] = useState(false)
  const [pendingRoleChange, setPendingRoleChange] = useState<{ userId: number; newRole: string } | null>(null)
  const [copied, setCopied] = useState(false)

  if (!isOpen) return null

  const handleInviteClick = async () => {
    try {
      // hashId를 사용하여 올바른 초대 링크 생성 (DashboardPage와 동일한 형식)
      const inviteLink = `${window.location.origin}/study/${hashId}`
      await navigator.clipboard.writeText(inviteLink)

      // 복사 상태 업데이트
      setCopied(true)

      // 토스트 메시지 표시
      setShowToast(true)
      setTimeout(() => setShowToast(false), 3000)

      // 복사 상태 초기화
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      alert('링크 복사에 실패했습니다.')
    }
  }

  const handleRoleChange = (member: { userId: number; member: string; role: string }, newRole: string) => {
    // ADMIN으로 변경하려는 경우 확인 메시지 표시
    if (newRole === 'ADMIN' && currentUserRole === 'ADMIN') {
      setPendingRoleChange({ userId: member.userId, newRole })
      setShowConfirmModal(true)
    } else {
      // 일반 권한 변경은 바로 실행
      onMemberRoleChange?.(member.userId, newRole as 'ADMIN' | 'DELEGATE' | 'MEMBER')
    }
  }

  const handleConfirmRoleChange = () => {
    if (pendingRoleChange) {
      onMemberRoleChange?.(pendingRoleChange.userId, pendingRoleChange.newRole as 'ADMIN' | 'DELEGATE' | 'MEMBER')
      setPendingRoleChange(null)
      setShowConfirmModal(false)
      // 권한 변경 후 새로고침
      window.location.reload()
    }
  }

  const handleCancelRoleChange = () => {
    setPendingRoleChange(null)
    setShowConfirmModal(false)
  }

  // 멤버 목록을 정렬: 내가 항상 가장 위에 위치, 그 다음 역할별 정렬
  const sortedMembers = [...members].sort((a, b) => {
    // 1. 내가 항상 첫 번째 (실제 사용자 이름으로 비교)
    if (currentUserName && a.member === currentUserName) return -1
    if (currentUserName && b.member === currentUserName) return 1

    // 2. 역할별 정렬: ADMIN > DELEGATE > MEMBER
    const roleOrder = { 'ADMIN': 3, 'DELEGATE': 2, 'MEMBER': 1 }
    const aRoleOrder = roleOrder[a.role as keyof typeof roleOrder] || 0
    const bRoleOrder = roleOrder[b.role as keyof typeof roleOrder] || 0

    if (aRoleOrder !== bRoleOrder) {
      return bRoleOrder - aRoleOrder // 내림차순 정렬
    }

    // 3. 같은 역할인 경우 이름순 정렬
    return a.member.localeCompare(b.member)
  })

  return (
    <>
      <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50">
        <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-2xl relative">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-black">{studyName} 스터디 멤버</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 text-2xl"
            >
              &times;
            </button>
          </div>

          <div className="space-y-4 max-h-80 overflow-y-auto">
            {sortedMembers.map((member, index) => {
              const isAdmin = member.role === 'ADMIN'
              const isCurrentUserAdmin = currentUserRole === 'ADMIN'
              const canChangeRole = isCurrentUserAdmin && !isAdmin // ADMIN은 자신의 권한을 변경할 수 없음
              const isMe = currentUserName && member.member === currentUserName

              return (
                <div key={index} className="flex items-center justify-between p-2 border-b border-gray-200 last:border-b-0">
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-gray-200 mr-3 overflow-hidden">
                      {member.imageUrl && isValidImageUrl(member.imageUrl) ? (
                        <img
                          src={member.imageUrl}
                          alt={`${member.member}의 프로필`}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            // 이미지 로드 실패 시 기본 아이콘 표시
                            const target = e.target as HTMLImageElement;
                            target.style.display = 'none';
                            target.nextElementSibling?.classList.remove('hidden');
                          }}
                        />
                      ) : null}
                      <div className={`w-full h-full flex items-center justify-center text-xl ${member.imageUrl && isValidImageUrl(member.imageUrl) ? 'hidden' : ''}`}>
                        👤
                      </div>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800">
                        {member.member}
                        {isMe && <span className="text-sm text-gray-500 ml-2">(me)</span>}
                      </p>
                      <p className="text-sm text-gray-500">{member.email || '이메일 없음'}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">

                    {/* Role 표시 */}
                    <span className="text-gray-600 font-medium">
                      {member.role === 'ADMIN' ? '운영자' :
                      member.role === 'DELEGATE' ? '대리인' : '회원'}
                    </span>

                    {/* 권한 변경 드롭다운 (ADMIN만 가능) */}
                    {canChangeRole && (
                      <div className="relative">
                        <select
                          className="block appearance-none bg-white border border-gray-300 text-gray-700 py-1 px-3 rounded text-sm leading-tight focus:outline-none focus:bg-white focus:border-gray-500 pr-8"
                          value={member.role}
                          onChange={(e) => {
                            const newRole = e.target.value as 'ADMIN' | 'DELEGATE' | 'MEMBER'
                            console.log('권한 변경 시도:', { member: member.member, userId: member.userId, newRole })
                            handleRoleChange(member, newRole)
                          }}
                        >
                          <option value="MEMBER">회원</option>
                          <option value="DELEGATE">대리인</option>
                          <option value="ADMIN">운영자</option>
                        </select>
                        {/* 드롭다운 화살표 */}
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                          <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                            <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
                          </svg>
                        </div>
                      </div>
                    )}

                    {/* 내 카드 오른쪽에 "탈퇴하기" 버튼 */}
                    {isMe && (
                      <button
                        onClick={() => {
                          // 내가 admin일 경우, 다른 사람에게 admin role을 먼저 위임해야 함
                          if (currentUserRole === 'ADMIN') {
                            alert('관리자인 경우, 다른 사람에게 관리자 권한을 먼저 위임한 후 탈퇴할 수 있습니다.')
                            return
                          }
                          // 탈퇴 처리
                          if (onLeaveStudy) {
                            onLeaveStudy()
                          }
                        }}
                        className="px-3 py-1 text-red-600 border border-red-300 rounded hover:bg-red-50 transition-colors text-sm"
                      >
                        탈퇴하기
                      </button>
                    )}
                  </div>
                </div>
              )
            })}
          </div>

          {/* 가입 요청 섹션: admin만 볼 수 있음 */}
          {currentUserRole === 'ADMIN' && joinRequests && joinRequests.length > 0 && (
            <div className="mt-6 border-t pt-6">
              <h3 className="text-lg font-semibold mb-4 text-black">
                가입 요청 ({joinRequests.length})
              </h3>
              <div className="space-y-3 max-h-60 overflow-y-auto">
                {joinRequests.map((request) => (
                  <div key={request.userID} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center">
                      <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-xl mr-3">
                        {request.imageUrl ? (
                          <img src={request.imageUrl} alt={request.name} className="w-10 h-10 rounded-full" />
                        ) : (
                          '👤'
                        )}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-800">{request.name}</p>
                        <p className="text-sm text-gray-500">{request.userEmail}</p>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => onAcceptJoinRequest?.(request.userID, 'MEMBER')}
                        className="px-3 py-1 bg-green-500 text-white text-sm rounded hover:bg-green-600"
                      >
                        승인
                      </button>
                      <button
                        onClick={() => onRejectJoinRequest?.(request.userID)}
                        className="px-3 py-1 bg-red-500 text-white text-sm rounded hover:bg-red-600"
                      >
                        거절
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 초대하기 버튼을 모달의 오른쪽 아래에 위치 */}
          <div className="flex justify-end mt-6">
            <button
              onClick={handleInviteClick}
              className="bg-purple-500 text-white px-4 py-2 rounded-xl hover:bg-purple-600 transition-colors"
            >
              {copied ? '복사!' : '초대하기'}
            </button>
          </div>
        </div>
      </div>

      {/* 토스트 메시지 - 중앙 하단에 연보라색 배경에 보라색 글씨 */}
      {showToast && (
        <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 bg-[#F6EEFF] text-purple-600 px-6 py-3 rounded-lg shadow-lg z-50 animate-in slide-in-from-bottom-2 border border-purple-200">
          스터디 링크가 복사되었습니다.
        </div>
      )}

      {/* 권한 변경 확인 모달 */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-[60]">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-4 text-gray-900">
              관리자 권한 변경
            </h3>
            <p className="text-gray-600 mb-6">
              이 스터디의 관리자를 변경하시겠습니까?<br />
              변경 후에는 MEMBER 권한으로 변경됩니다.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={handleCancelRoleChange}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                취소
              </button>
              <button
                onClick={handleConfirmRoleChange}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
              >
                확인
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default StudyMembersModal
