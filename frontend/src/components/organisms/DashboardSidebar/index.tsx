import React from 'react'
import SidebarLogo from '../../molecules/SidebarLogo'
import SidebarNavigation from '../../molecules/SidebarNavigation'
import SidebarUserActions from '../../molecules/SidebarUserActions'
import type { DashboardSidebarProps } from './types'
import type { NavigationItem } from '../../molecules/SidebarNavigation/types'
import type { UserActionItem } from '../../molecules/SidebarUserActions/types'

const DashboardSidebar: React.FC<DashboardSidebarProps> = ({
  activeItem = 'mypage',
  expandedStudy = false,
  studies = [],
  activeStudyId,
  onItemClick,
  onStudyClick,
  onLogout,
}) => {
  const navigationItems: NavigationItem[] = [
    {
      id: 'mypage',
      label: '마이페이지',
      icon: '🏠',
    },
    {
      id: 'ai-summary',
      label: 'AI 요약본',
      icon: '📄',
    },
    {
      id: 'study',
      label: '스터디',
      icon: '📚',
    },
  ]

  const userActions: UserActionItem[] = [
    {
      id: 'settings',
      label: '내 설정',
      icon: '👤',
    },
    {
      id: 'logout',
      label: '로그아웃',
      icon: '🚪',
    },
  ]

  const handleItemClick = (itemId: string) => {
    if (itemId === 'logout') {
      onLogout?.()
    } else {
      onItemClick(itemId)
    }
  }

  const handleStudyClick = (studyId: string) => {
    onStudyClick?.(studyId)
  }

  return (
    <div className="w-64 h-full bg-white border-r border-gray-200 flex flex-col">
      <SidebarLogo useImage={true} />
      <SidebarNavigation
        items={navigationItems}
        activeItem={activeItem}
        onItemClick={handleItemClick}
        expandedStudy={expandedStudy}
        studies={studies}
        activeStudyId={activeStudyId}
        onStudyClick={handleStudyClick}
      />

      <SidebarUserActions
        items={userActions}
        onItemClick={handleItemClick}
      />
    </div>
  )
}

export default DashboardSidebar
