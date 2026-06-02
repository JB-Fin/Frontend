// 전체 레이아웃 선언, 배치, 랜더링 파트

import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'
import Header from './Header'
import '../../styles/layout.css'

export default function AppLayout() {
  return (
    <div className="app-layout">
      <Sidebar />
      <div className="main-area">
        <Header />
        <div className="page-content">
          <Outlet />
        </div>
      </div>
    </div>
  )
}
