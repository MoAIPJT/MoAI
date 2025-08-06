import React from 'react'
import type { ContentListProps } from './types'

const ContentList: React.FC<ContentListProps> = ({
  contents,
  onContentSelect,
  onContentPreview,
}) => {
  if (contents.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <p>표시할 자료가 없습니다.</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {contents.map((content) => (
        <div
          key={content.id}
          className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
          onClick={() => onContentPreview(content.id)}
        >
          <div className="flex items-start gap-4">
            <input
              type="checkbox"
              checked={content.isSelected}
              onChange={(e) => {
                e.stopPropagation()
                onContentSelect(content.id)
              }}
              className="mt-1"
            />
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <h4 className="font-medium text-gray-900">{content.title}</h4>
                <div className="flex gap-1">
                  {content.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 text-xs bg-purple-100 text-purple-700 rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              <p className="text-sm text-gray-600 mb-2">{content.description}</p>
              <div className="flex items-center justify-between text-xs text-gray-500">
                <div className="flex items-center gap-1">
                  <img
                    src={content.author.avatar}
                    alt={content.author.name}
                    className="w-4 h-4 rounded-full"
                  />
                  <span>{content.author.name}</span>
                </div>
                <div className="flex items-center gap-4">
                  <span>{content.date}</span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      onContentPreview(content.id)
                    }}
                    className="text-purple-600 hover:text-purple-700"
                  >
                    미리보기
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default ContentList
