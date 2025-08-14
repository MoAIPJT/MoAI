export interface ProfileData {
  name: string
  email: string
  profileImageUrl?: string
  providerType?: string
}

export interface ProfileSettingsModalProps {
  isOpen: boolean
  onClose: () => void
  profileData: ProfileData
  onUpdateProfile: (data: Partial<ProfileData>) => void
  onChangePassword: () => void
  onWithdrawMembership: () => void
  isLoading?: boolean
}
