import React, { useState } from 'react'
import NavItem from '../../atoms/NavItem'
import type { SidebarProps } from './types'
import type { StudyWithSummaries } from '../../../services/summaryService'

const Sidebar: React.FC<SidebarProps> = ({
  activeItem,
  expandedStudies,
  studiesWithSummaries = [],
  isLoading = false,
  onItemClick,
  onStudyToggle,
  onSettingsClick,
  onLogout,
  onEditSummary,
  onDeleteSummary,
}) => {
  const [expandedSummaryId, setExpandedSummaryId] = useState<string | null>(null)
  console.log('=== Sidebar Props 디버깅 ===') // 디버깅용 로그
  console.log('onItemClick 함수:', onItemClick) // 디버깅용 로그
  console.log('onItemClick 타입:', typeof onItemClick) // 디버깅용 로그
  // API 데이터를 기존 구조에 맞게 변환
  const convertApiDataToStudyData = (apiData: StudyWithSummaries[]) => {
    console.log('=== convertApiDataToStudyData 디버깅 ===') // 디버깅용 로그
    console.log('API 데이터:', apiData) // 디버깅용 로그
    console.log('API 데이터 타입:', typeof apiData) // 디버깅용 로그
    console.log('API 데이터 길이:', apiData?.length) // 디버깅용 로그

    if (!apiData || apiData.length === 0) {
      console.log('API 데이터가 비어있습니다.') // 디버깅용 로그
      return []
    }

    const converted = apiData.map((study, index) => {
      console.log(`=== Study ${index} 변환 ===`) // 디버깅용 로그
      console.log(`Study ${index}:`, study) // 디버깅용 로그
      console.log(`Study ${index} ID:`, study.studyId) // 디버깅용 로그
      console.log(`Study ${index} Name:`, study.name) // 디버깅용 로그
      console.log(`Study ${index} Image:`, study.studyImg) // 디버깅용 로그
      console.log(`Study ${index} Summaries:`, study.summaries) // 디버깅용 로그

      const convertedStudy = {
        id: study.studyId,
        name: study.name,
        image: study.studyImg || '/src/assets/MoAI/thinking.png',
        summaries: study.summaries.map((summary, summaryIndex) => {
          console.log(`=== Summary ${summaryIndex} 변환 ===`) // 디버깅용 로그
          console.log(`Summary ${summaryIndex}:`, summary) // 디버깅용 로그
          console.log(`Summary ${summaryIndex} 원본 ID:`, summary.summaryId) // 디버깅용 로그
          console.log(`Summary ${summaryIndex} 원본 summary_id:`, (summary as { summary_id?: string }).summary_id) // 디버깅용 로그
          console.log(`Summary ${summaryIndex} summaryId:`, summary.summaryId) // 디버깅용 로그

          const convertedSummary = {
            id: summary.summaryId,  // summaryId 사용
            title: summary.title,
            description: summary.description,
            model_type: summary.modelType,  // modelType 사용
            prompt_type: summary.promptType,  // promptType 사용
            createdAt: summary.createdAt,  // 생성일 추가
            pdfPath: `/src/assets/pdfs/${summary.summaryId}.pdf` // 임시 PDF 경로
          }
          console.log(`변환된 Summary ${summaryIndex}:`, convertedSummary) // 디버깅용 로그
          return convertedSummary
        })
      }

      console.log(`변환된 Study ${index}:`, convertedStudy) // 디버깅용 로그
      return convertedStudy
    })

    console.log('최종 변환된 데이터:', converted) // 디버깅용 로그
    return converted
  }

  // API 데이터 사용
  const studyData = convertApiDataToStudyData(studiesWithSummaries)
  console.log('변환된 데이터:', studyData) // 디버깅용 로그
  console.log('studiesWithSummaries 길이:', studiesWithSummaries.length) // 디버깅용 로그
  console.log('studyData 길이:', studyData.length) // 디버깅용 로그

  // 실제 데이터 사용
  const finalStudyData = studyData
  console.log('최종 사용할 데이터:', finalStudyData) // 디버깅용 로그

  const handleStudyClick = (studyId: string) => {
    console.log('Study 클릭:', studyId) // 디버깅용 로그
    onStudyToggle(studyId)
  }

  const handleSummaryClick = (summaryId: string) => {
    console.log('=== Summary 클릭 디버깅 ===') // 디버깅용 로그
    console.log('전달받은 summaryId:', summaryId) // 디버깅용 로그
    console.log('summaryId 타입:', typeof summaryId) // 디버깅용 로그
    console.log('summaryId 값:', summaryId) // 디버깅용 로그
    console.log('onItemClick 함수:', onItemClick) // 디버깅용 로그
    console.log('onItemClick 타입:', typeof onItemClick) // 디버깅용 로그

    if (typeof onItemClick === 'function') {
      console.log('onItemClick 함수 호출 시작') // 디버깅용 로그
      onItemClick(summaryId)
      console.log('onItemClick 함수 호출 완료') // 디버깅용 로그
    } else {
      console.error('onItemClick이 함수가 아닙니다!') // 디버깅용 로그
    }
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

  // 데이터가 없을 때
  if (finalStudyData.length === 0) {
    return (
      <div className="flex-1 flex flex-col">
        <nav className="flex-1 p-4">
          <div className="text-center py-8">
            <img
              src="/src/assets/MoAI/file.png"
              alt="File Icon"
              className="w-24 h-24 mx-auto mb-4"
            />
            <p className="text-gray-500 text-sm">아직 생성된 요약본이 없습니다</p>
            <p className="text-gray-400 text-xs mt-1">새로운 요약본을 생성해보세요</p>
          </div>
        </nav>

        {/* 사용자 액션 섹션 */}
        <div className="p-4 border-t border-gray-200 space-y-1">
          <NavItem
            icon="👤"
            variant="default"
            onClick={onSettingsClick}
          >
            내 설정
          </NavItem>
          <NavItem
            icon="🚪"
            variant="default"
            onClick={onLogout}
          >
            로그아웃
          </NavItem>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 flex flex-col">
      {/* 네비게이션 메뉴 */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {finalStudyData.map((study) => {
          const isExpanded = expandedStudies.includes(study.id)

          return (
            <div key={study.id}>
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
                  {study.summaries.map((summary) => {
                    console.log('Summary 렌더링:', summary) // 디버깅용 로그
                    return (
                      <React.Fragment key={summary.id}>
                        <div className="flex items-center group">
                          <div className="flex-1 bg-purple-100 rounded-lg p-3 flex items-center justify-between min-w-0">
                            <div className="flex items-center space-x-2 min-w-0 flex-1">
                              {/* 정보 아이콘 */}
                              <button
                                onClick={(e) => {
                                  e.stopPropagation()
                                  // 상세보기 상태 토글
                                  if (expandedSummaryId === summary.id) {
                                    setExpandedSummaryId(null)
                                  } else {
                                    setExpandedSummaryId(summary.id)
                                  }
                                }}
                                className="p-1 rounded transition-colors hover:bg-purple-200"
                                title="상세보기"
                              >
                                <img
                                  src="/src/assets/icons/info.svg"
                                  alt="정보"
                                  className="w-4 h-4"
                                />
                              </button>

                              {/* 제목 */}
                              <span
                                className="text-purple-800 font-medium cursor-pointer hover:text-purple-600 transition-colors truncate"
                                onClick={() => {
                                  console.log('Summary 클릭 - ID:', summary.id) // 디버깅용 로그
                                  handleSummaryClick(summary.id)
                                }}
                                title={summary.title}
                              >
                                {summary.title}
                              </span>
                            </div>

                            {/* 수정/삭제 버튼들 */}
                            <div className="flex space-x-1">
                              {onEditSummary && (
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    console.log('수정 버튼 클릭 - summary 데이터:', summary)
                                    onEditSummary({
                                      summaryId: summary.id,
                                      title: summary.title,
                                      description: summary.description || ''
                                    })
                                  }}
                                  className="p-1 text-gray-600 hover:text-gray-800 transition-colors"
                                  title="수정"
                                >
                                  <img
                                    src="/src/assets/icons/edit.svg"
                                    alt="수정"
                                    className="w-4 h-4"
                                  />
                                </button>
                              )}
                              {onDeleteSummary && (
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    onDeleteSummary(summary.id)
                                  }}
                                  className="p-1 text-red-500 hover:text-red-600 transition-colors"
                                  title="삭제"
                                >
                                  <img
                                    src="/src/assets/icons/delete.svg"
                                    alt="삭제"
                                    className="w-4 h-4"
                                  />
                                </button>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* 상세보기 정보 박스 */}
                        {expandedSummaryId === summary.id && (
                          <div className="mt-2 ml-4 p-3 bg-purple-100 border border-purple-200 rounded-lg">
                            <div className="text-xs text-gray-600 space-y-1">
                              <div><span className="font-medium">설명:</span> {summary.description || '설명이 없습니다.'}</div>
                              <div><span className="font-medium">모델:</span> {summary.model_type}</div>
                              <div><span className="font-medium">프롬프트:</span> {summary.prompt_type}</div>
                              <div><span className="font-medium">생성일:</span> {summary.createdAt && summary.createdAt !== 'undefined'
                                ? new Date(summary.createdAt).toLocaleDateString('ko-KR', {
                                  year: 'numeric',
                                  month: 'long',
                                  day: 'numeric',
                                  hour: '2-digit',
                                  minute: '2-digit'
                                })
                                : '날짜 정보 없음'
                              }</div>
                            </div>
                          </div>
                        )}
                      </React.Fragment>
                    )
                  })}
                </div>
              )}
            </div>
          )
        })}
      </nav>

      {/* 사용자 액션 섹션 */}
      <div className="p-4 border-t border-gray-200 space-y-1">
        <NavItem
          icon="👤"
          variant="default"
          onClick={onSettingsClick}
        >
          내 설정
        </NavItem>
        <NavItem
          icon="🚪"
          variant="default"
          onClick={onLogout}
        >
          로그아웃
        </NavItem>
      </div>
    </div>
  )
}

export default Sidebar
