import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { NotificationProvider } from '../context/NotificationContext'  // ← 추가
import AppLayout from '../components/layout/AppLayout'
import ProtectedRoute from '../components/layout/ProtectedRoute'

import AIReviewPage from '../pages/AIReviewPage'
import CalendarPage from '../pages/CalendarPage'
import EducationContentPage from '../pages/EducationContentPage'
import HistoryDetailPage from '../pages/HistoryDetailPage'
import HistoryPage from '../pages/HistoryPage'
import HomePage from '../pages/HomePage'
import InternalInvestigationPage from '../pages/InternalInvestigationPage'
import LoginPage from '../pages/LoginPage'
import NotFoundPage from '../pages/NotFoundPage'
import NotificationsPage from '../pages/NotificationsPage'
import QuestionPage from '../pages/QuestionPage'
import ReviewDetailPage from '../pages/ReviewDetailPage'
import SettingsPage from '../pages/SettingsPage'

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <NotificationProvider>  {/* ← 추가 */}
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<LoginPage />} />

          <Route
            path="/"
            element={
              <ProtectedRoute>
                <AppLayout />
              </ProtectedRoute>
            }
          >
            <Route path="home" element={<HomePage />} />
            <Route path="review" element={<AIReviewPage />} />
            <Route path="review/:docId" element={<ReviewDetailPage />} />
            <Route path="history" element={<HistoryPage />} />
            <Route path="history/:docId" element={<Navigate to="result" replace />} />
            <Route path="history/:docId/:tab" element={<HistoryDetailPage />} />
            <Route path="question" element={<QuestionPage />} />
            <Route path="internal-investigation" element={<InternalInvestigationPage />} />
            <Route path="education-content" element={<EducationContentPage />} />
            <Route path="calendar" element={<CalendarPage />} />
            <Route path="settings" element={<SettingsPage />} />
            <Route path="notifications" element={<NotificationsPage />} />
          </Route>

          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </NotificationProvider>  {/* ← 추가 */}
    </BrowserRouter>
  )
}