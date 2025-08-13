import React from 'react'
import SidebarItem from '../../atoms/SidebarItem'
import type { SidebarNavigationProps } from './types'
import type { StudyItem } from '../../organisms/DashboardSidebar/types'

interface ExtendedSidebarNavigationProps extends SidebarNavigationProps {
  expandedStudy?: boolean
  studies?: StudyItem[]
  activeStudyId?: string | null
  onStudyClick?: (studyId: string) => void
}

const SidebarNavigation: React.FC<ExtendedSidebarNavigationProps> = ({
  items,
  activeItem,
  onItemClick,
  expandedStudy = false,
  studies = [],
  activeStudyId,
  onStudyClick,
}) => {
  return (
    <nav className="flex-1 p-4 space-y-2">
      {items.map((item) => (
        <div key={item.id}>
          <SidebarItem
            id={item.id}
            label={item.label}
            icon={item.icon}
            isActive={activeItem === item.id}
            isExpanded={item.id === 'study' ? expandedStudy : false}
            hasSubItems={item.id === 'study'}
            onClick={onItemClick}
          />
          {/* 스터디 아이템 바로 아래에 스터디 목록 표시 */}
          {item.id === 'study' && expandedStudy && Array.isArray(studies) && studies.length > 0 && (
            <div className="mt-1 ml-6 space-y-1">
              {studies.map((study: StudyItem) => (
                <div
                  key={study.id}
                  onClick={() => onStudyClick?.(study.id)}
                  className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer transition-colors ${
                    activeStudyId === study.id
                      ? 'bg-purple-200 text-purple-800'
                      : 'hover:bg-purple-100 text-gray-700'
                  }`}
                >
                  <div className="flex items-center justify-center w-6 h-6 rounded overflow-hidden">
                    {study.image || study.image_url ? (
                      <img 
                        src={study.image || study.image_url} 
                        alt={study.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-purple-300 flex items-center justify-center">
                        <span className="text-xs text-purple-700 font-medium">
                          {study.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                    )}
                  </div>
                  <span className={`text-sm truncate ${
                    activeStudyId === study.id ? 'font-medium' : 'text-gray-700'
                  }`}>
                    {study.name}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </nav>
  )
}

export default SidebarNavigation
