import React from 'react'
import type { ChatBoxProps } from './types'

const ChatBox: React.FC<ChatBoxProps> = ({
  chatMessages,
  newChatMessage,
  onNewChatMessageChange,
  onSendChatMessage
}) => {
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      onSendChatMessage()
    }
  }

  return (
    <div className="flex-1 flex flex-col h-full">
      {/* 채팅 메시지 목록 */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {chatMessages.length === 0 ? (
          <div className="text-center py-8 text-gray-400">
            <p>아직 메시지가 없습니다.</p>
            <p className="text-sm">첫 번째 메시지를 보내보세요!</p>
          </div>
        ) : (
          chatMessages.map((message) => (
            <div key={message.id} className="flex flex-col">
              <div className="flex items-center space-x-2 mb-1">
                <span className="text-blue-400 text-sm font-medium">
                  {message.sender}
                </span>
                <span className="text-gray-500 text-xs">
                  {message.timestamp.toLocaleTimeString('ko-KR', {
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </span>
              </div>
              <div className="bg-gray-700 rounded-lg p-3 max-w-xs">
                <p className="text-white text-sm break-words">
                  {message.message}
                </p>
              </div>
            </div>
          ))
        )}
      </div>

      {/* 메시지 입력 */}
      <div className="p-4 border-t border-gray-700">
        <div className="flex space-x-2">
          <textarea
            value={newChatMessage}
            onChange={(e) => onNewChatMessageChange(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="메시지를 입력하세요..."
            className="flex-1 bg-gray-700 text-white rounded-lg px-3 py-2 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={2}
          />
          <button
            onClick={onSendChatMessage}
            disabled={!newChatMessage.trim()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors"
          >
            전송
          </button>
        </div>
        <p className="text-gray-400 text-xs mt-2">
          Enter: 전송, Shift+Enter: 줄바꿈
        </p>
      </div>
    </div>
  )
}

export default ChatBox
