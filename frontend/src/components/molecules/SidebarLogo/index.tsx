import React from 'react'
import logoImage from '../../../assets/(M)logo.png'

interface SidebarLogoProps {
  logoIcon?: string
  iconColor?: string
  useImage?: boolean
}

const SidebarLogo: React.FC<SidebarLogoProps> = ({
  logoIcon = 'M',
  iconColor = 'bg-green-500',
  useImage = true,
}) => {
  return (
    <div className="p-4 border-b border-gray-100">
      <div className="flex items-center justify-center">
        {useImage ? (
          <img
            src={logoImage}
            alt="MoAI Logo"
            className="w-full max-w-48 h-auto object-contain"
            onError={(e) => {
              console.error('Failed to load logo image:', e)
            }}
          />
        ) : (
          <div className={`w-full max-w-48 h-12 ${iconColor} rounded-full flex items-center justify-center`}>
            <span className="text-white text-xl font-bold">{logoIcon}</span>
          </div>
        )}
      </div>
    </div>
  )
}

export default SidebarLogo
