import { create } from 'zustand'
import type { Profile } from '../types/users'

interface AuthState {
  accessToken?: string
  refreshToken?: string
  me?: Profile
}

interface AuthActions {
  setAuth: (tokens: { accessToken: string; refreshToken: string }) => void
  setProfile: (profile: Profile) => void
  clearAuth: () => void
}

interface CurrentStudyState {
  studyId?: number
  hashId?: string
  myRole?: 'ADMIN' | 'DELEGATE' | 'MEMBER'
  myStatus?: 'PENDING' | 'APPROVED' | 'LEFT' | 'REJECTED'
}

interface CurrentStudyActions {
  setCurrentStudy: (study: CurrentStudyState) => void
  clearCurrentStudy: () => void
  updateStudyRole: (role: 'ADMIN' | 'DELEGATE' | 'MEMBER') => void
  updateStudyStatus: (status: 'PENDING' | 'APPROVED' | 'LEFT' | 'REJECTED') => void
}

interface SidebarState {
  open: boolean
  selectedStudyId?: number
}

interface SidebarActions {
  setOpen: (open: boolean) => void
  setSelectedStudy: (studyId?: number) => void
}

interface AppState {
  auth: AuthState & AuthActions
  study: CurrentStudyState & CurrentStudyActions
  sidebar: SidebarState & SidebarActions
}

export const useAppStore = create<AppState>((set) => ({
  auth: {
    accessToken: localStorage.getItem('accessToken') || undefined,
    refreshToken: localStorage.getItem('refreshToken') || undefined,
    me: undefined,
    setAuth: (tokens) =>
      set((state) => {
        // 빈 값 저장 방지
        if (!tokens.accessToken) {
          console.error('빈 accessToken으로 setAuth 호출됨:', tokens)
          return state
        }

        // Sync with localStorage for backward compatibility
        localStorage.setItem('accessToken', tokens.accessToken)
        localStorage.setItem('refreshToken', tokens.refreshToken)

        return {
          auth: {
            ...state.auth,
            accessToken: tokens.accessToken,
            refreshToken: tokens.refreshToken,
          },
        }
      }),
    setProfile: (profile) =>
      set((state) => ({
        auth: {
          ...state.auth,
          me: profile,
        },
      })),
    clearAuth: () =>
      set((state) => {
        // Clear localStorage for backward compatibility
        localStorage.removeItem('accessToken')
        localStorage.removeItem('refreshToken')

        return {
          auth: {
            ...state.auth,
            accessToken: undefined,
            refreshToken: undefined,
            me: undefined,
          },
        }
      }),
  },
  study: {
    studyId: undefined,
    hashId: undefined,
    myRole: undefined,
    myStatus: undefined,
    setCurrentStudy: (study) =>
      set((state) => ({
        study: {
          ...state.study,
          ...study,
        },
      })),
    clearCurrentStudy: () =>
      set((state) => ({
        study: {
          ...state.study,
          studyId: undefined,
          hashId: undefined,
          myRole: undefined,
          myStatus: undefined,
        },
      })),
    updateStudyRole: (role) =>
      set((state) => ({
        study: {
          ...state.study,
          myRole: role,
        },
      })),
    updateStudyStatus: (status) =>
      set((state) => ({
        study: {
          ...state.study,
          myStatus: status,
        },
      })),
  },
  sidebar: {
    open: true,
    selectedStudyId: undefined,
    setOpen: (open) =>
      set((state) => ({
        sidebar: {
          ...state.sidebar,
          open,
        },
      })),
    setSelectedStudy: (studyId) =>
      set((state) => ({
        sidebar: {
          ...state.sidebar,
          selectedStudyId: studyId,
        },
      })),
  },
}))
