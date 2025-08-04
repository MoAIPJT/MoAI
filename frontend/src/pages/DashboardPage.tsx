import React from 'react'
import DashboardSidebar from '../components/organisms/DashboardSidebar'
import TopBar from '../components/molecules/TopBar'

const DashboardPage: React.FC = () => {
  const handleItemClick = (itemId: string) => {
    console.log('Navigation clicked:', itemId)

    // AI 요약본 클릭 시 새 탭에서 AI 요약본 페이지 열기
    if (itemId === 'ai-summary') {
      window.open('/ai-summary', '_blank')
    }
  }

  const handleLogout = () => {
    console.log('Logout clicked')
    // TODO: 로그아웃 로직 구현
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <DashboardSidebar
        activeItem="mypage"
        onItemClick={handleItemClick}
        onLogout={handleLogout}
      />
      <div className="flex-1 flex flex-col">
        <TopBar userName="user"/>
        <div className="flex-1 p-6">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md">
            <h2 className="text-lg font-semibold mb-4">빠른 가이드</h2>
            <div className="space-y-3 text-left">
              <div className="flex items-center gap-3">
                <span className="text-blue-500">🏠</span>
                <span>마이페이지: 프로필 및 활동 정보</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-green-500">📄</span>
                <span>AI 요약본: 새 탭에서 요약본 관리</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-purple-500">📚</span>
                <span>스터디: 학습 그룹 관리</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DashboardPage
