import React, { useEffect, useRef, useState } from 'react'
import type { PDFViewerProps, PDFPageInfo } from './types'
import { getDocument, GlobalWorkerOptions } from 'pdfjs-dist'
import type { PDFDocumentProxy } from 'pdfjs-dist/types/src/display/api'

// ✅ Vite 환경에서 PDF.js 워커 파일을 URL로 로드
import pdfjsWorker from 'pdfjs-dist/build/pdf.worker.mjs?url'
GlobalWorkerOptions.workerSrc = pdfjsWorker

const PDFViewer: React.FC<PDFViewerProps> = ({ pdfUrl, title, onLoad, onError }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [pdfDoc, setPdfDoc] = useState<PDFDocumentProxy | null>(null)
  const [pageInfo, setPageInfo] = useState<PDFPageInfo>({
    pageNumber: 1,
    totalPages: 0,
    scale: 1.0,
  })
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  /** 📌 PDF 문서 로드 */
  useEffect(() => {
    const loadPDF = async () => {
      try {
        setIsLoading(true)
        setError(null)

        // ✅ cMap 옵션 추가 (폰트 렌더링 오류 방지)
        const loadingTask = getDocument({
          url: pdfUrl,
          cMapUrl: 'https://cdn.jsdelivr.net/npm/pdfjs-dist@3.4.120/cmaps/',
          cMapPacked: true,
        })
        const pdf = await loadingTask.promise

        setPdfDoc(pdf)
        setPageInfo(prev => ({
          ...prev,
          totalPages: pdf.numPages,
        }))

        onLoad?.()
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'PDF 로드 실패'
        setError(errorMessage)
        onError?.(err as Error)
      } finally {
        setIsLoading(false)
      }
    }

    if (pdfUrl) loadPDF()
  }, [pdfUrl, onLoad, onError])

  /** 📌 PDF 페이지 렌더링 */
  useEffect(() => {
    let renderTask: any = null

    const renderPage = async () => {
      if (!pdfDoc || !canvasRef.current) return

      try {
        const page = await pdfDoc.getPage(pageInfo.pageNumber)
        const canvas = canvasRef.current
        const context = canvas.getContext('2d')
        if (!context) return

        const viewport = page.getViewport({ scale: pageInfo.scale })
        canvas.height = viewport.height
        canvas.width = viewport.width

        // 🔹 기존 렌더링 작업 중단
        if (renderTask) {
          renderTask.cancel()
        }

        renderTask = page.render({
          canvasContext: context,
          viewport,
        })

        await renderTask.promise
      } catch (err: any) {
        if (err?.name !== 'RenderingCancelledException') {
          console.error('페이지 렌더링 실패:', err)
          setError('페이지 렌더링 실패')
        }
      }
    }

    renderPage()

    return () => {
      if (renderTask) {
        renderTask.cancel()
      }
    }
  }, [pdfDoc, pageInfo.pageNumber, pageInfo.scale])

  /** 📌 페이지 이동 */
  const goToPage = (pageNumber: number) => {
    if (pageNumber >= 1 && pageNumber <= pageInfo.totalPages) {
      setPageInfo(prev => ({ ...prev, pageNumber }))
    }
  }

  /** 📌 확대/축소 */
  const changeScale = (newScale: number) => {
    const clampedScale = Math.max(0.5, Math.min(3.0, newScale))
    setPageInfo(prev => ({ ...prev, scale: clampedScale }))
  }

  /** 📌 로딩 상태 */
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <p className="text-gray-600">PDF 로딩 중...</p>
        </div>
      </div>
    )
  }

  /** 📌 오류 상태 */
  if (error) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">📄</div>
          <p className="text-red-600 mb-2">PDF 로드 실패</p>
          <p className="text-gray-600 text-sm">{error}</p>
        </div>
      </div>
    )
  }

  /** 📌 PDF 뷰어 화면 */
  return (
    <div className="h-full flex flex-col">
      {/* 헤더 */}
      <div className="bg-white border-b border-gray-200 p-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-800">
          {title || '원본 문서'}
        </h2>

        {/* 페이지 네비게이션 */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <button
              onClick={() => goToPage(pageInfo.pageNumber - 1)}
              disabled={pageInfo.pageNumber <= 1}
              className="px-3 py-1 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              이전
            </button>
            <span className="text-sm text-gray-600">
              {pageInfo.pageNumber} / {pageInfo.totalPages}
            </span>
            <button
              onClick={() => goToPage(pageInfo.pageNumber + 1)}
              disabled={pageInfo.pageNumber >= pageInfo.totalPages}
              className="px-3 py-1 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              다음
            </button>
          </div>

          {/* 줌 컨트롤 */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => changeScale(pageInfo.scale - 0.2)}
              className="px-2 py-1 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
            >
              -
            </button>
            <span className="text-sm text-gray-600 w-12 text-center">
              {Math.round(pageInfo.scale * 100)}%
            </span>
            <button
              onClick={() => changeScale(pageInfo.scale + 0.2)}
              className="px-2 py-1 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
            >
              +
            </button>
          </div>
        </div>
      </div>

      {/* PDF Canvas */}
      <div className="flex-1 overflow-auto bg-gray-100 p-4">
        <div className="flex justify-center">
          <canvas ref={canvasRef} className="shadow-lg bg-white" />
        </div>
      </div>
    </div>
  )
}

export default PDFViewer
