import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// 토큰 갱신 함수
const refreshAccessToken = async () => {
  try {
    const refreshToken = localStorage.getItem('refreshToken')
    if (!refreshToken) {
      throw new Error('No refresh token')
    }

    const response = await axios.post('/api/users/refresh-token', {
      refreshToken
    }, {
      baseURL: import.meta.env.VITE_API_BASE_URL || '/api'
    })

    const { accessToken } = response.data
    localStorage.setItem('accessToken', accessToken)
    return accessToken
  } catch (error) {
    // 토큰 갱신 실패 시 로그인 페이지로 리다이렉트
    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
    window.location.href = '/login'
    throw error
  }
}

// 요청 인터셉터
api.interceptors.request.use(
  (config) => {
    // 토큰이 있으면 헤더에 추가
    const token = localStorage.getItem('accessToken')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// 응답 인터셉터
api.interceptors.response.use(
  (response) => {
    return response
  },
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const refreshToken = localStorage.getItem('refreshToken');
        const { data } = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/auth/refresh`, { refreshToken });
        const { accessToken } = data;
        localStorage.setItem('accessToken', accessToken);
        api.defaults.headers.common['Authorization'] = 'Bearer ' + accessToken;
        return api(originalRequest);
      } catch (refreshError) {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error)
  }
)

export default api
