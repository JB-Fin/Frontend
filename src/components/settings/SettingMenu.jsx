// 설정 메뉴 컴포넌트
import '../../styles/settings.css'

export function SettingMenu({ active, onChange }) {
  const menus = ['계정 정보', '언어 설정', '알림 설정']
  return (
    <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
      {menus.map(m => (
        <button key={m} onClick={() => onChange(m)} style={{ padding: '8px 16px', borderRadius: 20, border: '1.5px solid', borderColor: active === m ? 'var(--navy)' : 'var(--border)', background: active === m ? 'var(--navy)' : 'var(--white)', color: active === m ? 'var(--white)' : 'var(--text-muted)', fontSize: 13, fontWeight: active === m ? 600 : 400 }}>{m}</button>
      ))}
    </div>
  )
}
