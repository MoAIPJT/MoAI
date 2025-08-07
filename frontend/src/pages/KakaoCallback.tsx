import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

const KakaoCallback = () => {
  const navigate = useNavigate()

  useEffect(() => {
    const code = new URLSearchParams(window.location.search).get('code')

    const fetchToken = async () => {
      if (!code) return
      try {
        const res = await axios.post('/api/auth/kakao', { code })
        const { accessToken, refreshToken } = res.data
        localStorage.setItem('accessToken', accessToken)
        localStorage.setItem('refreshToken', refreshToken)
        navigate('/dashboard')
      } catch (err) {
        console.error('카카오 로그인 실패:', err)
      }
    }

    fetchToken()
  }, [])

  return <p>로그인 처리 중...</p>
}

export default KakaoCallback
