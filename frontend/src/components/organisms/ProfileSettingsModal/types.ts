export interface ProfileData {
  nickname: string
  email: string
  profileImage?: string
}

export interface ProfileSettingsModalProps {
  isOpen: boolean
  onClose: () => void
  profileData: ProfileData
  onUpdateProfile: (data: Partial<ProfileData>) => void
  onChangePassword: () => void
  onWithdrawMembership: () => void
  onOpenChangePasswordModal: () => void
}
