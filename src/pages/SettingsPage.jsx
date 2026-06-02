// 설정 화면 구현: 개인정보페이지(우선순위 낮음)
import { useState } from 'react'
import { SettingMenu } from '../components/settings/SettingMenu'
import AccountForm from '../components/settings/AccountForm'
import { useLanguage } from '../hooks/useLanguage'
import '../styles/settings.css'

export default function SettingsPage() {
  const [activeMenu, setActiveMenu] = useState('계정 정보')
  const { language, setLanguage, languages } = useLanguage()

  return (
    <div className="settings-page">
      <h2 style={{ fontSize: 20, fontWeight: 700, color: 'var(--navy)', marginBottom: 20 }}>설정</h2>
      <SettingMenu active={activeMenu} onChange={setActiveMenu} />

      {activeMenu === '계정 정보' && <AccountForm />}

      {activeMenu === '언어 설정' && (
        <div className="settings-section">
          <h3>언어 설정</h3>
          <div className="settings-field">
            <label>기본 검토 언어</label>
            <select value={language} onChange={e => setLanguage(e.target.value)}>
              {languages.map(l => <option key={l} value={l}>{l}</option>)}
            </select>
          </div>
          <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 8 }}>
            문서 업로드 시 기본으로 선택될 언어입니다.
          </p>
        </div>
      )}

      {activeMenu === '알림 설정' && (
        <div className="settings-section">
          <h3>알림 설정</h3>
          {['검토 완료 알림', '규정 업데이트 알림', '일정 리마인더'].map(item => (
            <div key={item} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
              <span style={{ fontSize: 13, color: 'var(--text-dark)' }}>{item}</span>
              <input type="checkbox" defaultChecked style={{ width: 16, height: 16, accentColor: 'var(--navy)' }} />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
