import React from 'react'
import type { StudyListProps } from './types'
import StudyCard from '../../molecules/StudyCard'
import Button from '../../atoms/Button'
import travelingImage from '../../../assets/MoAI/traveling.png'

const StudyList: React.FC<StudyListProps> = ({
  studies = [],
  isLoading = false,
  onCreateStudy,
  onStudyClick
}) => {
  // DashboardPage에서 전달받은 데이터 사용
  const displayStudies = studies
  
  if (isLoading) {
    return (
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">스터디 목록</h1>
          <Button
            variant="primary"
            size="md"
            onClick={onCreateStudy}
            disabled
          >
            스터디 생성하기
          </Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-white rounded-lg border border-gray-200 p-6 animate-pulse">
              <div className="flex items-start space-x-4">
                <div className="w-16 h-16 bg-gray-200 rounded-full"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="p-6">
      {/* 헤더 */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">스터디 목록</h1>
        <Button
          variant="primary"
          size="md"
          onClick={onCreateStudy}
        >
          스터디 생성하기
        </Button>
      </div>

      {/* 스터디 그리드 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {displayStudies.map((study) => (
          <StudyCard
            key={study.id}
            study={study}
            onClick={onStudyClick}
          />
        ))}
      </div>

      {/* 스터디가 없을 때 */}
      {displayStudies.length === 0 && (
        <div className="bg-white rounded-lg border border-gray-200 p-6 flex items-center justify-center" style={{ minHeight: '200px' }}>
          <div className="text-center">
            <div className="text-gray-500 mb-4">
              <img src={travelingImage} alt="스터디 목록 비어있음" className="mx-auto w-48 h-50" />
            </div>
            <h3 className="text-lg font-medium mb-2" style={{ color: '#61857b' }}>
              현재 참여 중인 스터디가 없어요.
            </h3>
          </div>
        </div>
      )}
    </div>
  )
}

export default StudyList 