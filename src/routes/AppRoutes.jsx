import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { NotificationProvider } from '../context/NotificationContext'
import PlatformLayout from '../components/layout/PlatformLayout'
import ProtectedRoute from '../components/layout/ProtectedRoute'

import { AIChatPage } from '../pages/AIChatPage.tsx'
import { AIReviewPage } from '../pages/AIReviewPage.tsx'
import { CalendarPage } from '../pages/CalendarPage.tsx'
import { DashboardPage } from '../pages/DashboardPage.tsx'
import { EducationContentPage } from '../pages/EducationContentPage.tsx'
import { InternalInvestigationPage } from '../pages/InternalInvestigationPage.tsx'
import { SettingsPage } from '../pages/SettingsPage.tsx'
import { TaskHistoryPage } from '../pages/TaskHistoryPage.tsx'
import LoginPage from '../pages/LoginPage'
import NotFoundPage from '../pages/NotFoundPage'

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <NotificationProvider>
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<LoginPage />} />

          <Route
            path="/"
            element={
              <ProtectedRoute>
                <PlatformLayout />
              </ProtectedRoute>
            }
          >
            <Route path="home" element={<DashboardPage />} />
            <Route path="review" element={<AIReviewPage />} />
            <Route path="review/:docId" element={<AIReviewPage />} />
            <Route path="history" element={<TaskHistoryPage />} />
            <Route path="history/:docId" element={<TaskHistoryPage />} />
            <Route path="history/:docId/:tab" element={<TaskHistoryPage />} />
            <Route path="question" element={<AIChatPage />} />
            <Route path="internal-investigation" element={<InternalInvestigationPage />} />
            <Route path="education-content" element={<EducationContentPage />} />
            <Route path="calendar" element={<CalendarPage />} />
            <Route path="settings" element={<SettingsPage />} />
            <Route path="notifications" element={<DashboardPage />} />
          </Route>

          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </NotificationProvider>
    </BrowserRouter>
  )
}
