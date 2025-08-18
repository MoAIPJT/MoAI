import React from 'react'
import type { ContentListProps } from './types'
import checkboxChecked from '@/assets/icons/checkbox.svg'
import checkboxUnchecked from '@/assets/icons/none-checkbox.svg'

const ContentList: React.FC<ContentListProps> = ({
  contents,
  onContentSelect,
  onContentPreview,
  onContentEdit,
  onContentDelete,
  onContentDownload,
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
          className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer relative"
          onClick={() => onContentPreview(content.id)}
        >
          {/* 체크박스를 오른쪽 상단에 배치 */}
          <div className="absolute top-3 right-3 z-10">
            <button
              onClick={(e) => {
                e.stopPropagation()
                onContentSelect(content.id)
              }}
              className="p-1 hover:bg-gray-100 rounded transition-colors"
              title={content.isSelected ? "선택 해제" : "선택"}
            >
              <img
                src={content.isSelected ? checkboxChecked : checkboxUnchecked}
                alt={content.isSelected ? "선택됨" : "선택 안됨"}
                className="w-5 h-5"
              />
            </button>
          </div>

          <div className="flex-1 pr-8">
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
                <span>{content.author.name}</span>
                <span className="ml-2">
                  {content.date
                    ? new Date(content.date).toISOString().slice(0, 10)
                    : ""}
                </span>
              </div>
            </div>
          </div>

          {/* 버튼들을 오른쪽 하단에 가로로 배치 */}
          <div className="absolute bottom-3 right-3 flex items-center gap-2">
            <button
              onClick={(e) => {
                e.stopPropagation()
                onContentPreview(content.id)
              }}
              className="text-purple-600 hover:text-purple-700 text-xs"
            >
              미리보기
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation()
                onContentDownload(content.id)
              }}
              className="text-green-600 hover:text-green-700 text-xs"
            >
              다운로드
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation()
                onContentEdit(content.id)
              }}
              className="text-blue-600 hover:text-blue-700 text-xs"
            >
              수정
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation()
                onContentDelete(content.id)
              }}
              className="text-red-600 hover:text-red-700 text-xs"
            >
              삭제
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}

export default ContentList
