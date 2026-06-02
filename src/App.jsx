// App.jsx는 AppRoutes에게 어떤 페이지를 보여줄 지 맡김 -> 화면 직접 생성x

import AppRoutes from './routes/AppRoutes'

export default function App() {
  return <AppRoutes />
}