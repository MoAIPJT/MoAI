import React, { useEffect, useRef, useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

pdfjs.GlobalWorkerOptions.workerSrc = process.env.PUBLIC_URL + '/pdf.worker.min.mjs';

// PDF 목록
const pdfList = [
  { id: "doc1", url: "https://moai-docs-assets.s3.us-east-005.backblazeb2.com/ref/1/2025/08/4014caa0-0305-495d-af7d-95a380dd604b.pdf?response-content-disposition=inline%3B%20filename%3D%224014caa0-0305-495d-af7d-95a380dd604b.pdf%22&response-content-type=application%2Fpdf&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Date=20250812T134717Z&X-Amz-SignedHeaders=host&X-Amz-Credential=005bb52fcdd8c200000000002%2F20250812%2Fus-east-005%2Fs3%2Faws4_request&X-Amz-Expires=2400&X-Amz-Signature=10dbe5d86cc0dd6c513056593e5bb89c0dfb342dd350d5063d2b54fb96f77da3" },
  { id: "doc2", url: "https://moai-docs-assets.s3.us-east-005.backblazeb2.com/ref/1/2025/08/630e999e-1e64-46c8-b1cf-c652546cb919.pdf?response-content-disposition=inline%3B%20filename%3D%22630e999e-1e64-46c8-b1cf-c652546cb919.pdf%22&response-content-type=application%2Fpdf&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Date=20250812T134734Z&X-Amz-SignedHeaders=host&X-Amz-Credential=005bb52fcdd8c200000000002%2F20250812%2Fus-east-005%2Fs3%2Faws4_request&X-Amz-Expires=2400&X-Amz-Signature=0e82c004515bb503ec554c70753b6a097bbb3beacf866a37e4d448da195d4f8f" }
];


// summary mock 데이터
const summaryList = [
  {
    docsId: 1,
    pageNumber: 1,
    originalQuote: "본 연구는 향후 워터파크의 공간설계 및 시설계획을 위한 기초 자료를 제공하기위하여 공간개념과 어트랙션(Attraction)을 정의한 후 국내 사례 분석을 통하여 유형분류와 각 유형별 방문객 특성을 조사하였다.",
    summarySentence: "본 연구는 21세기 레저 시장 확대의 배경과 워터파크의 공간 개념 및 어트랙션을 정의하고, 국내 워터파크 유형 분류와 각 유형별 방문객 특성을 분석하여 향후 워터파크 공간 설계 및 시설 계획을 위한 기초 자료를 제공하고자 한다."
  },
  {
    docsId: 1,
    pageNumber: 2,
    originalQuote: "이에 본 연구는 워터파크에 관한 기초 연구로써 공간특성과 어트랙션(Attraction)을 정의한 후 국내 사례에 대한 유형분류 및 특성분석을 통해 향후 워터파크 기본계획을 위한 자료를 제공하는데 그 목적이 있다.",
    summarySentence: "본 연구는 국내 대형 워터파크 10곳을 대상으로 현장 답사와 자료 분석을 통해 워터파크의 공간 특성과 어트랙션을 정의하고, 유형 분류 및 특성 분석을 실시하여 향후 워터파크 기본 계획을 위한 자료를 제공하는 것을 목적으로 한다."
  },
  {
    docsId: 1,
    pageNumber: 3,
    originalQuote: "워터파크는 테마파크의 한 형태로써 일정한 주제에 맞는 전체 환경과 환상(Fantasy)을 유발하는 분위기 연출을 위하여 물을 이용한 공간구성, 시설물 계획 및 다양한 체험프로그램을 활용한다. 내부 공간의 기능은 놀이, 휴식, 공연 및 이벤트, 쇼핑 등으로 구성되어 있으며 일련의 공간 프로그램을 주제에 따른 스토리로 연출함으로써 방문객에게 흥미와 즐거움을 제공할 수 있는 비일상적인 종합문화공원6) 이라고 정의할 수 있다.",
    summarySentence: "워터파크는 일정한 주제의 환경과 분위기를 연출하고, 놀이, 휴식, 공연 등 다양한 기능을 제공하는 종합 문화 공원으로 정의된다."
  },
  {
    docsId: 1,
    pageNumber: 3,
    originalQuote: "이러한 워터파크의 공간계획상의 특성7)은 첫째, 테마성으로써 주어진 공간에 독특한 성격을 부여하며 공간의 분위기를 연출하는 동시에 테마파크의 네이밍(Naming)을 하는데 결정적인 역할을 하는 요소이다. ... 마지막으로 통합성으로써 방문객의 성별, 연령과 국적 등의 다양한 특성을 모두 고려하여 다 함께 수용할 수 있도록 공간 안에서 이루어지는 다양한 놀이와 체험 프로그램을 계획하는 일련의 시스템 구축과정이다.",
    summarySentence: "워터파크의 공간 계획 특성은 테마성, 비일상성, 레저성, 독창성, 통일성, 통합성으로 설명된다."
  },
  {
    docsId: 2,
    pageNumber: 1,
    originalQuote: "본 연구에서는 wav2vec2.0 모델을 활용하여 한국어 감성 발화 데이터에 대한 감정 분류를 위한 데이터 샘플링 전략을 제안한다.",
    summarySentence: "본 연구는 wav2vec2.0 모델을 이용하여 한국어 음성 감정 분류를 위한 데이터 샘플링 전략을 제안한다."
  },
  {
    docsId: 2,
    pageNumber: 1,
    originalQuote: "실험을 통해 한국어 음성 감성분석을 위해 학습 데이터를 활용할 때 감정별로 샘플링하여 데이터의 개수를 유사하게 하는 것이 성능 향상에 도움이 되며, 긴 음성 데이터부터 이용하는 것이 성능 향상에 도움이 됨을 보인다.",
    summarySentence: "실험 결과, 감정별 데이터 개수를 유사하게 하고, 긴 음성 데이터부터 사용하는 것이 한국어 음성 감정 분석 성능 향상에 도움이 된다는 것을 확인하였다."
  }
];

// ────────────────────────────────
// 유틸
const norm = (s) => (s || '').replace(/\s+/g, ' ').trim();
const trigrams = (s) => {
  const t = norm(s);
  if (t.length < 3) return new Set([t]);
  const set = new Set();
  for (let i = 0; i <= t.length - 3; i++) set.add(t.slice(i, i + 3));
  return set;
};
const dice = (aSet, bSet) => {
  if (!aSet.size || !bSet.size) return 0;
  let inter = 0;
  const small = aSet.size < bSet.size ? aSet : bSet;
  const large = aSet.size < bSet.size ? bSet : aSet;
  for (const x of small) if (large.has(x)) inter++;
  return (2 * inter) / (aSet.size + bSet.size);
};

// 정렬 기반 하이라이트(성공 시 true, 아니면 false 반환)
function highlightQuoteByAlignment(pageRootEl, quote) {
  // 기존 오버레이 제거
  pageRootEl.querySelectorAll('.pdf-quote-hit').forEach(n => n.remove());
  const q = norm(quote);
  if (!q) return false;

  const textLayer = pageRootEl.querySelector('.react-pdf__Page__textContent');
  if (!textLayer) return false;

  const spans = Array.from(textLayer.querySelectorAll('span'));
  if (!spans.length) return false;

  // 좌표계
  const layerRect = textLayer.getBoundingClientRect();
  const info = spans.map(sp => {
    const r = sp.getBoundingClientRect();
    return {
      text: sp.textContent || '',
      top: r.top - layerRect.top,
      left: r.left - layerRect.left,
      right: r.right - layerRect.left,
      bottom: r.bottom - layerRect.top
    };
  });

  // 누적 길이
  const lens = info.map(s => s.text.length);
  const pref = [0];
  for (let i = 0; i < lens.length; i++) pref.push(pref[pref.length - 1] + lens[i]);

  const qLen = q.length;
  const qTri = trigrams(q);
  const minChars = Math.max(12, Math.floor(qLen * 0.8));      // 안정성 위해 12로 상향
  const maxChars = Math.max(minChars, Math.floor(qLen * 1.2));

  const findEnd = (start, chars) => {
    let lo = start + 1, hi = spans.length, want = pref[start] + chars;
    while (lo < hi) {
      const mid = (lo + hi) >> 1;
      if (pref[mid] >= want) hi = mid; else lo = mid + 1;
    }
    return lo;
  };

  let best = { score: 0, s: 0, e: 0 };
  for (let sIdx = 0; sIdx < spans.length; sIdx++) {
    for (const tgt of [minChars, qLen, maxChars]) {
      const eIdx = Math.min(findEnd(sIdx, tgt), spans.length);
      if (eIdx <= sIdx + 1) continue;
      const wText = norm(info.slice(sIdx, eIdx).map(x => x.text).join(' '));
      if (!wText) continue;
      const sc = dice(trigrams(wText), qTri);
      if (sc > best.score) best = { score: sc, s: sIdx, e: eIdx };
    }
  }

  if (best.score < 0.35) return false; // 임계값(0.30~0.45 조정 가능)

  const picked = info.slice(best.s, best.e);
  const left = Math.min(...picked.map(s => s.left));
  const right = Math.max(...picked.map(s => s.right));
  const top = Math.min(...picked.map(s => s.top));
  const bottom = Math.max(...picked.map(s => s.bottom));

  const box = document.createElement('div');
  box.className = 'pdf-quote-hit';
  box.style.left = `${left - 3}px`;
  box.style.top = `${top - 2}px`;
  box.style.width = `${(right - left) + 6}px`;
  box.style.height = `${(bottom - top) + 4}px`;
  textLayer.appendChild(box);
  return true;
}

// ────────────────────────────────

function App() {
  const [selectedPdf, setSelectedPdf] = useState(pdfList[0]);
  const [numPages, setNumPages] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  // 대상 문장
  const [highlight, setHighlight] = useState({ page: null, quote: null });

  const pageRef = useRef(null);

  // 렌더 안정화용: 페이지가 그려질 때마다 증가
  const [pageRenderTick, setPageRenderTick] = useState(0);
  const retryTimerRef = useRef(null);

  // 페이지 이동 시 포커스
  useEffect(() => {
    pageRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, [currentPage, selectedPdf]);

  // 하이라이트 실행 (렌더 완료 + 리트라이)
  useEffect(() => {
    // 기존 리트라이 타이머 정리
    if (retryTimerRef.current) {
      clearTimeout(retryTimerRef.current);
      retryTimerRef.current = null;
    }

    if (!pageRef.current) return;

    // 대상 페이지 아니면 제거
    if (!highlight.quote || highlight.page !== currentPage) {
      pageRef.current.querySelectorAll('.pdf-quote-hit').forEach(n => n.remove());
      return;
    }

    let attempts = 0;
    const MAX_ATTEMPTS = 8;
    const DELAY_MS = 60;

    const tryHighlight = () => {
      attempts++;
      requestAnimationFrame(() => {
        const ok = highlightQuoteByAlignment(pageRef.current, highlight.quote);
        if (!ok && attempts < MAX_ATTEMPTS) {
          retryTimerRef.current = setTimeout(tryHighlight, DELAY_MS);
        }
      });
    };

    tryHighlight();

    return () => {
      if (retryTimerRef.current) {
        clearTimeout(retryTimerRef.current);
        retryTimerRef.current = null;
      }
    };
  }, [currentPage, selectedPdf, highlight.page, highlight.quote, pageRenderTick]);

  const onSummaryClick = (item) => {
    const pdf = pdfList.find(p => p.id === `doc${item.docsId}`);
    if (pdf) setSelectedPdf(pdf);
    setHighlight({ page: item.pageNumber, quote: item.originalQuote });
    setCurrentPage(item.pageNumber);
  };

  const clearHighlight = () => {
    setHighlight({ page: null, quote: null });
    if (retryTimerRef.current) {
      clearTimeout(retryTimerRef.current);
      retryTimerRef.current = null;
    }
    pageRef.current?.querySelectorAll('.pdf-quote-hit').forEach(n => n.remove());
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'flex-start', marginTop: 40, gap: 32 }}>
      {/* 스타일: 오버레이 박스 */}
      <style>{`
        .pdf-quote-hit {
          position: absolute;
          background: rgba(255, 230, 140, 0.32);
          box-shadow: 0 0 0 2px rgba(255, 196, 0, 0.55) inset;
          border-radius: 4px;
          pointer-events: none;
          transition: opacity .2s ease;
        }
      `}</style>

      {/* 왼쪽: summary 버튼 목록 */}
      <div style={{ minWidth: 340, maxWidth: 420 }}>
        <h3>Summary List</h3>
        {summaryList.map((item, idx) => (
          <button
            key={idx}
            style={{
              display: 'block',
              width: '100%',
              marginBottom: 12,
              padding: 12,
              background: (highlight.page === item.pageNumber &&
                           highlight.quote === item.originalQuote) ? '#e0f0ff' : '#f5f5f5',
              border: '1px solid #ccc',
              borderRadius: 6,
              textAlign: 'left',
              cursor: 'pointer',
              fontSize: 15
            }}
            onClick={() => onSummaryClick(item)}
          >
            <div><b>docId:</b> {item.docsId} <b>page:</b> {item.pageNumber}</div>
            <div style={{ color: '#555', margin: '6px 0' }}><b>원문:</b> {item.originalQuote}</div>
            <div style={{ color: '#1a6' }}><b>요약:</b> {item.summarySentence}</div>
          </button>
        ))}
      </div>

      {/* 오른쪽: PDF 미리보기 (단일 페이지 렌더) */}
      <div style={{ width: '80vw', maxWidth: 920, background: '#f8f8f8', padding: 16, borderRadius: 8, boxShadow: '0 2px 8px #0001' }}>
        {/* 상단 컨트롤 바 */}
        <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 16 }}>
          <div>
            <span>PDF 선택: </span>
            <select
              value={selectedPdf.id}
              onChange={e => {
                const found = pdfList.find(p => p.id === e.target.value);
                setSelectedPdf(found);
                setNumPages(null);
                setCurrentPage(1);
                clearHighlight();
              }}
              style={{ fontSize: 16, padding: '4px 12px', borderRadius: 4 }}
            >
              {pdfList.map(pdf => (
                <option key={pdf.id} value={pdf.id}>{pdf.id}</option>
              ))}
            </select>
          </div>

          <div style={{ marginLeft: 'auto', display: 'flex', gap: 8 }}>
            <button
              disabled={!numPages || currentPage <= 1}
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              style={{ padding: '6px 10px' }}
            >
              ← Prev
            </button>
            <div style={{ padding: '6px 10px' }}>
              Page {numPages ? currentPage : '-'} {numPages ? `of ${numPages}` : ''}
            </div>
            <button
              disabled={!numPages || currentPage >= numPages}
              onClick={() => setCurrentPage(p => Math.min(numPages, p + 1))}
              style={{ padding: '6px 10px' }}
            >
              Next →
            </button>
            <button onClick={clearHighlight} style={{ padding: '6px 10px' }} title="하이라이트 해제">
              Clear Highlight
            </button>
          </div>
        </div>

        <Document
          file={selectedPdf.url}
          onLoadSuccess={({ numPages }) => {
            setNumPages(numPages);
            setCurrentPage(p => Math.min(Math.max(1, p), numPages));
          }}
          loading={<div style={{ textAlign: 'center', padding: 40 }}>PDF 문서를 불러오는 중...</div>}
          onLoadError={console.error}
        >
          {/* 단일 페이지만 렌더 */}
          <div
            ref={pageRef}
            style={{ marginBottom: 12, background: highlight.page === currentPage ? '#f0f8ff' : undefined }}
          >
            <Page
              pageNumber={currentPage}
              width={820}
              // 텍스트는 건드리지 않음
              onRenderSuccess={() => setPageRenderTick(t => t + 1)} // 렌더 완료 신호
            />
          </div>
        </Document>

        <div style={{ marginTop: 8, textAlign: 'center' }}>
          <a href={selectedPdf.url} target="_blank" rel="noopener noreferrer">PDF 직접 열기</a>
        </div>
      </div>
    </div>
  );
}

export default App;
