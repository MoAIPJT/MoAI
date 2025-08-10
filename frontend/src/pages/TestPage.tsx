import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import Button from '../components/atoms/Button'

const TestPage: React.FC = () => {
  const [studyId, setStudyId] = useState<string>('1');

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">테스트 페이지</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* OpenVidu 테스트 섹션 */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">OpenVidu 화상회의 테스트</h2>
            <p className="text-gray-600 mb-4">
              OpenVidu 서버를 사용한 화상회의 기능을 테스트합니다.
            </p>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  스터디 ID
                </label>
                <input
                  type="text"
                  value={studyId}
                  onChange={(e) => setStudyId(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="스터디 ID를 입력하세요"
                />
              </div>

              <div className="flex gap-2">
                <Link to={`/video-conference/${studyId}`}>
                  <Button variant="primary" size="md">
                    화상회의 참가
                  </Button>
                </Link>
                <Link to="/video-conference">
                  <Button variant="secondary" size="md">
                    새 세션 시작
                  </Button>
                </Link>
              </div>

              {/* 데모 모드 링크 추가 */}
              <div className="pt-4 border-t border-gray-200">
                <h3 className="text-sm font-medium text-gray-700 mb-2">데모 모드 (서버 없이 UI 확인)</h3>
                <div className="flex gap-2">
                  <Link to={`/video-conference/${studyId}?demo=true`}>
                    <Button variant="outline" size="md" className="bg-yellow-50 border-yellow-300 text-yellow-700 hover:bg-yellow-100">
                      데모 모드로 보기
                    </Button>
                  </Link>
                  <Link to="/video-conference?demo=true">
                    <Button variant="outline" size="md" className="bg-yellow-50 border-yellow-300 text-yellow-700 hover:bg-yellow-100">
                      데모 새 세션
                    </Button>
                  </Link>
                </div>
              </div>
            </div>

            <div className="mt-4 p-4 bg-blue-50 rounded-md">
              <h3 className="font-medium text-blue-800 mb-2">사용 전 확인사항:</h3>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• OpenVidu 서버가 실행 중인지 확인</li>
                <li>• 브라우저에서 https://localhost:7443 접속 후 SSL 인증서 허용</li>
                <li>• 카메라/마이크 권한 허용</li>
                <li>• <strong>데모 모드</strong>: 서버 없이도 UI 확인 가능</li>
              </ul>
            </div>
          </div>

          {/* 기타 테스트 섹션 */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">기타 테스트</h2>
            <div className="space-y-3">
              <Link to="/dashboard">
                <Button variant="outline" size="md" className="w-full">
                  대시보드 테스트
                </Button>
              </Link>
              <Link to="/ai-summary">
                <Button variant="outline" size="md" className="w-full">
                  AI 요약 테스트
                </Button>
              </Link>
              <Link to="/study-detail">
                <Button variant="outline" size="md" className="w-full">
                  스터디 상세 테스트
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* OpenVidu 서버 설정 가이드 */}
        <div className="mt-8 bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">OpenVidu 서버 설정 가이드</h2>
          <div className="space-y-4">
            <div>
              <h3 className="font-medium text-gray-700 mb-2">1. Docker로 OpenVidu 서버 실행</h3>
              <code className="block bg-gray-100 p-3 rounded text-sm">
                docker run -p 7443:7443 -e OPENVIDU_SECRET=MY_SECRET -e DOMAIN_OR_PUBLIC_IP=localhost openvidu/openvidu-server:2.31.0
              </code>
            </div>

            <div>
              <h3 className="font-medium text-gray-700 mb-2">2. 브라우저에서 SSL 인증서 허용</h3>
              <p className="text-sm text-gray-600">
                https://localhost:7443로 접속 → "고급" → "안전하지 않음" → 계속 진행
              </p>
            </div>

            <div>
              <h3 className="font-medium text-gray-700 mb-2">3. React 앱 실행</h3>
              <code className="block bg-gray-100 p-3 rounded text-sm">
                npm run dev
              </code>
            </div>

            <div className="p-4 bg-yellow-50 rounded-md">
              <h3 className="font-medium text-yellow-800 mb-2">💡 빠른 UI 확인 방법</h3>
              <p className="text-sm text-yellow-700">
                OpenVidu 서버 설정 없이도 UI를 확인하려면 <strong>데모 모드</strong>를 사용하세요.
                데모 모드에서는 가상의 참가자들과 함께 화상회의 인터페이스를 체험할 수 있습니다.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestPage
