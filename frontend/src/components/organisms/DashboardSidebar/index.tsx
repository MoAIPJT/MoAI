import React from 'react'
import SidebarLogo from '../../molecules/SidebarLogo'
import SidebarNavigation from '../../molecules/SidebarNavigation'
import SidebarUserActions from '../../molecules/SidebarUserActions'
import { HomeAddIcon, DocumentIcon, BarChartIcon, UserIcon, LogoutIcon } from '../../atoms/Icons'
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
  onSettingsClick,
  onLogoClick,
}) => {
  const navigationItems: NavigationItem[] = [
    {
      id: 'mypage',
      label: '마이페이지',
      icon: <HomeAddIcon className="w-5 h-5 text-current" />,
    },
    {
      id: 'ai-summary',
      label: 'AI 요약본',
      icon: <DocumentIcon className="w-5 h-5 text-current" />,
    },
    {
      id: 'study',
      label: '스터디',
      icon: <BarChartIcon className="w-5 h-5 text-current" />,
    },
  ]

  const userActions: UserActionItem[] = [
    {
      id: 'settings',
      label: '내 설정',
      icon: <UserIcon className="w-5 h-5 text-current" />,
    },
    {
      id: 'logout',
      label: '로그아웃',
      icon: <LogoutIcon className="w-5 h-5 text-current" />,
    },
  ]

  const handleItemClick = (itemId: string) => {
    if (itemId === 'logout') {
      onLogout?.()
    } else if (itemId === 'settings') {
      onSettingsClick?.()
    } else {
      onItemClick(itemId)
    }
  }

  const handleStudyClick = (studyId: string) => {
    onStudyClick?.(studyId)
  }

  return (
    <div className="w-64 h-screen bg-white border-r border-gray-200 flex flex-col fixed top-0 left-0 z-30">
      <SidebarLogo useImage={true} onClick={onLogoClick} />
      <div className="flex-1 flex flex-col">
        <SidebarNavigation
          items={navigationItems}
          activeItem={activeItem}
          onItemClick={handleItemClick}
          expandedStudy={expandedStudy}
          studies={studies}
          activeStudyId={activeStudyId}
          onStudyClick={handleStudyClick}
        />
      </div>

      <SidebarUserActions
        items={userActions}
        onItemClick={handleItemClick}
      />
    </div>
  )
}

export default DashboardSidebar
