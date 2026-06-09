import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { CalendarProvider } from '../context/CalendarContext';
import { LanguageProvider } from '../context/LanguageContext';
import { NotificationProvider } from '../context/NotificationContext';
import PlatformLayout from '../components/layout/PlatformLayout';
import ProtectedRoute from '../components/layout/ProtectedRoute';
import { NotificationPage } from '../pages/NotificationPage';
import { AIChatPage } from '../pages/AIChatPage';
import { AIReviewPage } from '../pages/AIReviewPage';
import { CalendarPage } from '../pages/CalendarPage';
import { DashboardPage } from '../pages/DashboardPage';
import { EducationContentPage } from '../pages/EducationContentPage';
import { SettingsPage } from '../pages/SettingsPage';
import { TaskHistoryPage } from '../pages/TaskHistoryPage';
import LoginPage from '../pages/LoginPage';
import NotFoundPage from '../pages/NotFoundPage';

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <NotificationProvider>
        <CalendarProvider>
          <LanguageProvider>
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
                <Route path="library" element={<TaskHistoryPage />} />
                <Route path="question" element={<AIChatPage />} />
                <Route path="education-content" element={<EducationContentPage />} />
                <Route path="calendar" element={<CalendarPage />} />
                <Route path="settings" element={<SettingsPage />} />
                <Route path="notifications" element={<NotificationPage />} />
              </Route>

              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </LanguageProvider>
        </CalendarProvider>
      </NotificationProvider>
    </BrowserRouter>
  );
}
