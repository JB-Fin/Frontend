// 계정 form 컴포넌트
import { dummyUser } from '../../data/dummyUser'
import '../../styles/settings.css'

export default function AccountForm() {
  return (
    <div className="settings-section">
      <h3>계정 정보</h3>
      {[['이름', dummyUser.name], ['팀', dummyUser.team], ['이메일', dummyUser.email]].map(([label, val]) => (
        <div key={label} className="settings-field">
          <label>{label}</label>
          <input defaultValue={val} />
        </div>
      ))}
      <button style={{ padding: '9px 20px', background: 'var(--navy)', color: 'var(--white)', border: 'none', borderRadius: 'var(--radius-sm)', fontSize: 13, fontWeight: 600 }}>저장</button>
    </div>
  )
}
