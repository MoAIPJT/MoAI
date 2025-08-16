import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../../hooks/useAuth'
import LoadingSpinner from '../../atoms/LoadingSpinner'

interface ProtectedRouteProps {
  children: React.ReactNode
  excludePaths?: string[]
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  excludePaths = []
}) => {
  const { isAuthenticated, checkAuth } = useAuth()
  const navigate = useNavigate()
  const [isChecking, setIsChecking] = useState(true)

  useEffect(() => {
    // 현재 경로가 제외 경로인지 확인
    const currentPath = window.location.pathname
    const isExcluded = excludePaths.some(path => currentPath.startsWith(path))

    if (isExcluded) {
      setIsChecking(false)
      return // 제외된 경로는 보호하지 않음
    }

    // 인증 상태 확인
    if (!isAuthenticated && !checkAuth()) {
      // 현재 URL을 저장하여 로그인 후 해당 페이지로 리다이렉트
      localStorage.setItem('redirectAfterLogin', currentPath)
      navigate('/login', { replace: true })
    } else {
      setIsChecking(false)
    }
  }, [isAuthenticated, checkAuth, navigate, excludePaths])

  // 제외된 경로이거나 인증된 사용자인 경우 children 렌더링
  const currentPath = window.location.pathname
  const isExcluded = excludePaths.some(path => currentPath.startsWith(path))

  if (isExcluded || (!isChecking && (isAuthenticated || checkAuth()))) {
    return <>{children}</>
  }

  // 로딩 중일 때 스피너 표시
  return <LoadingSpinner />
}

export default ProtectedRoute
