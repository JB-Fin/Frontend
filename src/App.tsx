import { BrowserRouter } from 'react-router-dom';
import { NotificationProvider } from './context/NotificationContext';
import AppRoutes from './routes/AppRoutes'; // ⚡ 정의된 라우터 불러오기

export default function App() {
  return (
    <NotificationProvider>
      <BrowserRouter>
        <AppRoutes /> {/* ⚡ 모든 페이지 경로는 여기서 관리합니다 */}
      </BrowserRouter>
    </NotificationProvider>
  );
}