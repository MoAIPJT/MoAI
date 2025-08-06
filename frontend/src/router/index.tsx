import React from 'react'
import { Routes, Route } from 'react-router-dom'
import LoginPage from '@/pages/LoginPage'
import SignupPage from '@/pages/SignupPage'
import EmailSentPage from '@/pages/EmailSentPage'
import PasswordSentPage from '@/pages/PasswordSentPage'
import SocialSignupPage from '@/pages/SocialSignupPage'
import ResetPasswordPage from '@/pages/ResetPasswordPage'
import ResetPasswordConfirmPage from '@/pages/ResetPasswordConfirmPage'
import AISummaryPage from '@/pages/AISummaryPage'
import DashboardPage from '@/pages/DashboardPage'
import TestPage from '@/pages/TestPage'
import StudyDetailPage from '@/pages/StudyDetailPage'
import VideoConferencePage from '@/pages/VideoConferencePage'

const Router: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/email-sent" element={<EmailSentPage />} />
      <Route path="/password-sent" element={<PasswordSentPage />} />
      <Route path="/social-signup" element={<SocialSignupPage />} />
      <Route path="/reset-password" element={<ResetPasswordPage />} />
      <Route path="/reset-password/confirm" element={<ResetPasswordConfirmPage />} />
      <Route path="/ai-summary" element={<AISummaryPage />} />
      <Route path="/dashboard" element={<DashboardPage />} />
      <Route path="/test" element={<TestPage />} />
      <Route path="/study-detail" element={<StudyDetailPage />} />
      <Route path="/study/:studyId" element={<StudyDetailPage />} />
      <Route path="/video-conference" element={<VideoConferencePage />} />
      <Route path="/video-conference/:studyId" element={<VideoConferencePage />} />
    </Routes>
  )
}

export default Router
