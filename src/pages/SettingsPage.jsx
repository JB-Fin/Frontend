import { useState } from 'react'
import '../styles/pages.css'

const TABS = [
  ['profile', '프로필'],
  ['notifications', '알림 설정'],
  ['security', '보안'],
  ['language', '언어 및 지역'],
  ['appearance', '화면 설정'],
  ['privacy', '개인정보'],
  ['data', '데이터 관리'],
  ['help', '지원'],
]

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('profile')

  return (
    <main className="workspace-page page-stack">
      <header className="page-head">
        <div>
          <h2>설정</h2>
          <p>계정과 시스템 환경을 관리합니다.</p>
        </div>
      </header>

      <section className="settings-layout">
        <nav className="glass-card settings-tabs">
          {TABS.map(([id, label]) => (
            <button key={id} type="button" className={activeTab === id ? 'active' : ''} onClick={() => setActiveTab(id)}>
              {label}
            </button>
          ))}
        </nav>

        <div className="glass-card panel-pad">
          {activeTab === 'profile' && <ProfileSettings />}
          {activeTab === 'notifications' && <NotificationSettings />}
          {activeTab === 'security' && <SecuritySettings />}
          {activeTab === 'language' && <LanguageSettings />}
          {activeTab === 'appearance' && <AppearanceSettings />}
          {!['profile', 'notifications', 'security', 'language', 'appearance'].includes(activeTab) && (
            <EmptySettings title={TABS.find(([id]) => id === activeTab)?.[1]} />
          )}
        </div>
      </section>
    </main>
  )
}

function ProfileSettings() {
  return (
    <div className="page-stack">
      <h3>프로필 설정</h3>
      <div className="toolbar-row" style={{ justifyContent: 'flex-start' }}>
        <div className="header__avatar" style={{ width: 72, height: 72 }}>김</div>
        <div>
          <button type="button" className="primary-action">사진 변경</button>
          <p className="muted-text">JPG, PNG 최대 5MB</p>
        </div>
      </div>
      <div className="form-grid">
        <Field label="이름" defaultValue="김준또" />
        <Field label="이메일" type="email" defaultValue="juntto@jbgroup.com" />
        <Field label="부서" defaultValue="컴플라이언스팀" />
        <Field label="직책" defaultValue="선임 컴플라이언스 매니저" />
      </div>
      <div className="toolbar-row" style={{ justifyContent: 'flex-end' }}>
        <button type="button" className="secondary-action">취소</button>
        <button type="button" className="primary-action">저장</button>
      </div>
    </div>
  )
}

function NotificationSettings() {
  return (
    <div className="page-stack">
      <h3>알림 설정</h3>
      {[
        ['이메일 알림', '중요한 업데이트를 이메일로 받습니다.'],
        ['브라우저 알림', '데스크톱 푸시 알림을 받습니다.'],
        ['일정 알림', '예정된 일정 전에 알림을 받습니다.'],
        ['AI 검토 완료 알림', '문서 검토가 완료되면 알림을 받습니다.'],
        ['규정 업데이트 알림', '새로운 규정 변경사항을 받습니다.'],
      ].map(([label, desc]) => <ToggleRow key={label} label={label} desc={desc} />)}
    </div>
  )
}

function SecuritySettings() {
  return (
    <div className="page-stack">
      <h3>보안 설정</h3>
      <div className="toggle-row">
        <div><strong>비밀번호 변경</strong><span>정기적인 비밀번호 변경을 권장합니다.</span></div>
        <button type="button" className="primary-action">변경</button>
      </div>
      <ToggleRow label="2단계 인증" desc="계정 보안을 강화합니다." checked={false} />
      <div className="toggle-row">
        <div><strong>활성 세션</strong><span>Chrome - Windows · 현재 세션</span></div>
        <span className="badge-soft green">활성</span>
      </div>
    </div>
  )
}

function LanguageSettings() {
  return (
    <div className="page-stack">
      <h3>언어 및 지역</h3>
      <div className="form-grid">
        <SelectField label="언어" options={['한국어', 'English', '日本語']} />
        <SelectField label="시간대" options={['(GMT+9:00) 서울, 도쿄', '(GMT+0:00) 런던', '(GMT-5:00) 뉴욕']} />
        <SelectField label="날짜 형식" options={['YYYY.MM.DD', 'MM/DD/YYYY', 'DD/MM/YYYY']} />
      </div>
    </div>
  )
}

function AppearanceSettings() {
  return (
    <div className="page-stack">
      <h3>화면 설정</h3>
      <div className="toolbar-row" style={{ justifyContent: 'flex-start' }}>
        {['라이트', '다크', '시스템'].map(theme => (
          <button type="button" key={theme} className={`filter-pill${theme === '라이트' ? ' active' : ''}`}>{theme}</button>
        ))}
      </div>
      <ToggleRow label="컴팩트 모드" desc="UI 요소 간격을 줄입니다." checked={false} />
    </div>
  )
}

function EmptySettings({ title }) {
  return (
    <div className="page-stack">
      <h3>{title}</h3>
      <p className="muted-text">세부 설정 화면을 준비 중입니다.</p>
    </div>
  )
}

function Field({ label, type = 'text', defaultValue }) {
  return (
    <div className="form-field">
      <label>{label}</label>
      <input type={type} defaultValue={defaultValue} />
    </div>
  )
}

function SelectField({ label, options }) {
  return (
    <div className="form-field">
      <label>{label}</label>
      <select>{options.map(option => <option key={option}>{option}</option>)}</select>
    </div>
  )
}

function ToggleRow({ label, desc, checked = true }) {
  return (
    <div className="toggle-row">
      <div><strong>{label}</strong><span>{desc}</span></div>
      <input type="checkbox" defaultChecked={checked} />
    </div>
  )
}
