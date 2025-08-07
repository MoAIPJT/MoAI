import React from 'react'
import type { StudyMembersModalProps } from './types'

const StudyMembersModal: React.FC<StudyMembersModalProps> = ({ isOpen, onClose, members, studyName }) => {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-2xl relative">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-black">{studyName} Members</h2>
          <div className="flex items-center gap-4">
            <button className="bg-purple-500 text-white px-4 py-2 rounded-full hover:bg-purple-600">
              초대하기
            </button>
            <button 
              onClick={onClose} 
              className="text-gray-500 hover:text-gray-700 text-2xl"
            >
              &times;
            </button>
          </div>
        </div>
        
        <p className="text-gray-500 mb-6">Invite your team members to study</p>

        <div className="space-y-4 max-h-80 overflow-y-auto">
          {members.map((member, index) => {
            const isOwner = member.role === 'Owner'
            const isCurrentUserOwner = members.some(m => m.role === 'Owner' && m.member === 'Kuromi') // 임시로 Kuromi를 현재 사용자로 가정
            
            return (
              <div key={index} className="flex items-center justify-between p-2 border-b border-gray-200 last:border-b-0">
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-xl mr-3">
                    {member.avatar || '👤'}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800">{member.member}</p>
                    <p className="text-sm text-gray-500">{member.email || '이메일 없음'}</p>
                  </div>
                </div>
                
                <div className="relative">
                  {isCurrentUserOwner && !isOwner ? (
                    <select
                      className="block appearance-none w-full bg-white border border-gray-300 text-gray-700 py-2 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                      value={member.role}
                      onChange={() => {}} // 실제 역할 변경 로직 필요 시 추가
                    >
                      <option value="Owner">Owner</option>
                      <option value="Member">Member</option>
                      <option value="Developer">Developer</option>
                    </select>
                  ) : (
                    <span className="text-gray-600 font-medium">{member.role}</span>
                  )}
                  {isCurrentUserOwner && !isOwner && (
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                      <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                        <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
                      </svg>
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default StudyMembersModal 