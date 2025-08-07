import { AxiosError } from 'axios'

export function extractAxiosErrorMessage(error: unknown, fallback = '오류가 발생했습니다.'): string {
  if (error instanceof AxiosError && error.response?.data?.message) {
    return error.response.data.message
  }
  return fallback
} 