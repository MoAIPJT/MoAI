import React from 'react'
import NavItem from '../../atoms/NavItem'
import type { SidebarProps } from './types'

const Sidebar: React.FC<SidebarProps> = ({
  activeItem,
  expandedStudies,
  onItemClick,
  onStudyToggle,
}) => {
  // 더미 데이터
  const studyData = [
    {
      id: 'ssafy-algorithm',
      name: '싸피 알고리즘',
      image: '/src/assets/MoAI/thinking.png',
      summaries: [
        { 
          id: 'cats-dogs', 
          title: 'Cats and Dogs',
          pdfPath: '/src/assets/pdfs/cats-and-dogs.pdf'
        },
        { 
          id: 'i-love-duck', 
          title: 'I Love Duck',
          pdfPath: '/src/assets/pdfs/i-love-duck.pdf'
        },
      ],
    },
    {
      id: 'daejeon-restaurants',
      name: '대전 맛집 탐방',
      image: '/src/assets/MoAI/traveling.png',
      summaries: [
        { 
          id: 'hamburger', 
          title: '햄버거 맛있겠다',
          pdfPath: '/src/assets/pdfs/hamburger.pdf'
        },
        { 
          id: 'omori-kalguksu', 
          title: '오모리생바지락칼국수',
          pdfPath: '/src/assets/pdfs/omori-kalguksu.pdf'
        },
      ],
    },
  ]

  const handleStudyClick = (studyId: string) => {
    onStudyToggle(studyId)
  }

  const handleSummaryClick = (summaryId: string) => {
    onItemClick(summaryId)
  }

  return (
    <div className="flex-1 flex flex-col">
      {/* 네비게이션 메뉴 */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {studyData.map((study) => {
          const isExpanded = expandedStudies.includes(study.id)
          
          return (
            <div key={study.id} className="space-y-1">
              <NavItem
                icon={
                  <img 
                    src={study.image} 
                    alt={study.name} 
                    className="w-6 h-6 object-cover rounded"
                  />
                }
                variant="study"
                isActive={activeItem === study.id}
                isExpanded={isExpanded}
                isStudy={true}
                onClick={() => handleStudyClick(study.id)}
              >
                {study.name}
              </NavItem>
              
              {/* 요약본들 */}
              {isExpanded && (
                <div className="ml-6 space-y-1">
                  {study.summaries.map((summary) => (
                    <NavItem
                      key={summary.id}
                      variant="summary"
                      isActive={activeItem === summary.id}
                      onClick={() => handleSummaryClick(summary.id)}
                    >
                      {summary.title}
                    </NavItem>
                  ))}
                </div>
              )}
            </div>
          )
        })}
      </nav>
    </div>
  )
}

export default Sidebar

// TODO: 백엔드 API 연결 시 사용할 코드들
/*
import React from 'react'
import NavItem from '../../atoms/NavItem'
import type { SidebarProps } from './types'

const Sidebar: React.FC<SidebarProps> = ({
  activeItem,
  expandedStudies,
  studies = [],
  summaries = [],
  isLoading = false,
  onItemClick,
  onStudyToggle,
}) => {
  // 더미 데이터 (API 데이터가 없을 때 사용)
  const dummyStudyData = [
    {
      id: 'ssafy-algorithm',
      name: '싸피 알고리즘',
      image: '/src/assets/MoAI/thinking.png',
      summaries: [
        { 
          id: 'cats-dogs', 
          title: 'Cats and Dogs',
          pdfPath: '/src/assets/pdfs/cats-and-dogs.pdf'
        },
        { 
          id: 'i-love-duck', 
          title: 'I Love Duck',
          pdfPath: '/src/assets/pdfs/i-love-duck.pdf'
        },
      ],
    },
    {
      id: 'daejeon-restaurants',
      name: '대전 맛집 탐방',
      image: '/src/assets/MoAI/traveling.png',
      summaries: [
        { 
          id: 'hamburger', 
          title: '햄버거 맛있겠다',
          pdfPath: '/src/assets/pdfs/hamburger.pdf'
        },
        { 
          id: 'omori-kalguksu', 
          title: '오모리생바지락칼국수',
          pdfPath: '/src/assets/pdfs/omori-kalguksu.pdf'
        },
      ],
    },
  ]

  // API 데이터가 있으면 사용, 없으면 더미 데이터 사용
  const studyData = studies.length > 0 
    ? studies.map(study => ({
        ...study,
        summaries: summaries.filter(summary => summary.studyId === study.id)
      }))
    : dummyStudyData

  const handleStudyClick = (studyId: string) => {
    onStudyToggle(studyId)
  }

  const handleSummaryClick = (summaryId: string) => {
    onItemClick(summaryId)
  }

  if (isLoading) {
    return (
      <div className="flex-1 flex flex-col">
        <nav className="flex-1 p-4 space-y-1">
          <div className="animate-pulse">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-12 bg-gray-200 rounded-lg mb-2"></div>
            ))}
          </div>
        </nav>
      </div>
    )
  }

  return (
    <div className="flex-1 flex flex-col">
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {studyData.map((study) => {
          const isExpanded = expandedStudies.includes(study.id)
          
          return (
            <div key={study.id} className="space-y-1">
              <NavItem
                icon={
                  <img 
                    src={study.image} 
                    alt={study.name} 
                    className="w-6 h-6 object-cover rounded"
                  />
                }
                variant="study"
                isActive={activeItem === study.id}
                isExpanded={isExpanded}
                isStudy={true}
                onClick={() => handleStudyClick(study.id)}
              >
                {study.name}
              </NavItem>
              
              {isExpanded && (
                <div className="ml-6 space-y-1">
                  {study.summaries.map((summary) => (
                    <NavItem
                      key={summary.id}
                      variant="summary"
                      isActive={activeItem === summary.id}
                      onClick={() => handleSummaryClick(summary.id)}
                    >
                      {summary.title}
                    </NavItem>
                  ))}
                </div>
              )}
            </div>
          )
        })}
      </nav>
    </div>
  )
}

export default Sidebar
*/ 