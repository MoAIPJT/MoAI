import React, { useState } from 'react'
import type { StudyListProps } from './types'
import StudyCard from '../../molecules/StudyCard'
import Button from '../../atoms/Button'
import CreateStudyModal from '../CreateStudyModal'
import type { CreateStudyData } from '../CreateStudyModal/types'
import travelingImage from '../../../assets/MoAI/traveling.png'

const StudyList: React.FC<StudyListProps> = ({
  studies = [],
  isLoading = false,
  onCreateStudy,
  onStudyClick
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [currentPage, setCurrentPage] = useState(0)
  
  // DashboardPage에서 전달받은 데이터 사용
  const displayStudies = studies
  
  // 페이지당 4개씩 표시 (2x2 그리드)
  const itemsPerPage = 4
  const totalPages = Math.ceil(displayStudies.length / itemsPerPage)
  const currentStudies = displayStudies.slice(
    currentPage * itemsPerPage,
    (currentPage + 1) * itemsPerPage
  )

  const handleCreateStudy = () => {
    setIsModalOpen(true)
  }

  const handleModalClose = () => {
    setIsModalOpen(false)
  }

  const handleModalSubmit = (data: CreateStudyData) => {
    onCreateStudy?.(data)
    // 새 스터디 생성 시 첫 페이지로 이동
    setCurrentPage(0)
  }

  const handlePreviousPage = () => {
    setCurrentPage(prev => Math.max(0, prev - 1))
  }

  const handleNextPage = () => {
    setCurrentPage(prev => Math.min(totalPages - 1, prev + 1))
  }
  
  if (isLoading) {
    return (
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">스터디 목록</h1>
                  <Button
          variant="primary"
          size="md"
          onClick={handleCreateStudy}
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
    <div>
      {/* 헤더 */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">스터디 목록</h1>
        <Button
          variant="primary"
          size="md"
          onClick={handleCreateStudy}
        >
          스터디 생성하기
        </Button>
      </div>

      {/* 스터디 그리드 */}
      <div className="relative">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {currentStudies.map((study) => (
            <StudyCard
              key={study.id}
              study={study}
              onClick={onStudyClick}
            />
          ))}
        </div>
        
        {/* 화살표 네비게이션 */}
        {totalPages > 1 && (
          <div className="flex justify-between items-center mt-6">
            <button
              onClick={handlePreviousPage}
              disabled={currentPage === 0}
              className={`flex items-center justify-center w-10 h-10 rounded-full border transition-colors ${
                currentPage === 0
                  ? 'border-gray-200 text-gray-400 cursor-not-allowed'
                  : 'border-gray-300 text-gray-600 hover:bg-gray-50 hover:border-gray-400'
              }`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            
            {/* 페이지 인디케이터 */}
            <div className="flex space-x-2">
              {Array.from({ length: totalPages }, (_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentPage(index)}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    index === currentPage
                      ? 'bg-purple-500'
                      : 'bg-gray-300 hover:bg-gray-400'
                  }`}
                />
              ))}
            </div>
            
            <button
              onClick={handleNextPage}
              disabled={currentPage === totalPages - 1}
              className={`flex items-center justify-center w-10 h-10 rounded-full border transition-colors ${
                currentPage === totalPages - 1
                  ? 'border-gray-200 text-gray-400 cursor-not-allowed'
                  : 'border-gray-300 text-gray-600 hover:bg-gray-50 hover:border-gray-400'
              }`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        )}
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

      {/* 스터디 생성 모달 */}
      <CreateStudyModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        onSubmit={handleModalSubmit}
      />
    </div>
  )
}

export default StudyList 