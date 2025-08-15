import React, { useEffect } from 'react'
import Router from './router'
import { useAppStore } from './store/appStore'

const App: React.FC = () => {
  const { auth } = useAppStore()

  // 앱 시작 시 인증 상태 확인
  useEffect(() => {
    const token = localStorage.getItem('accessToken')
    if (token && !auth.accessToken) {
      // localStorage에 토큰이 있지만 store에 없는 경우 동기화
      const refreshToken = localStorage.getItem('refreshToken')
      if (refreshToken) {
        useAppStore.getState().auth.setAuth({
          accessToken: token,
          refreshToken: refreshToken
        })
      }
    }
  }, [auth.accessToken])

  return <Router />
}

export default App
