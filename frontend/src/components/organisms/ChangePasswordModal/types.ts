export interface ChangePasswordModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: {
    currentPassword: string
    newPassword: string
    confirmPassword: string
  }) => void
}

export interface ChangePasswordFormData {
  currentPassword: string
  newPassword: string
  confirmPassword: string
}
