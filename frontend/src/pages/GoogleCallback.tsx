import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

const GoogleCallback = () => {
  const navigate = useNavigate()

  useEffect(() => {
    const code = new URLSearchParams(window.location.search).get('code')

    const fetchGoogleToken = async () => {
      if (!code) return
      try {
        const res = await axios.post('/api/auth/google', { code })
        const { accessToken, refreshToken } = res.data

        localStorage.setItem('accessToken', accessToken)
        localStorage.setItem('refreshToken', refreshToken)

        navigate('/dashboard')
      } catch (err) {
        console.error('구글 로그인 실패:', err)
      }
    }

    fetchGoogleToken()
  }, [])

  return <p>구글 로그인 처리 중...</p>
}

export default GoogleCallback
