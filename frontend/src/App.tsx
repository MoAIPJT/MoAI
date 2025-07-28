import React from 'react'
import { Routes, Route } from 'react-router-dom'
import LoginPage from './pages/LoginPage'
import SignupPage from './pages/SignupPage'
import EmailSentPage from './pages/EmailSentPage'
import SocialSignupPage from './pages/SocialSignupPage'
import ResetPasswordPage from './pages/ResetPasswordPage'

const App: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/email-sent" element={<EmailSentPage />} />
      <Route path="/social-signup" element={<SocialSignupPage />} />
      <Route path="/reset-password" element={<ResetPasswordPage />} />
    </Routes>
  )
}

export default App
