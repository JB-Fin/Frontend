// 공통 버튼: 버튼 UI 컴토넌트 구현
export default function Button({ children, onClick, variant = 'primary', disabled, style }) {
  const base = {
    padding: '10px 20px',
    border: 'none',
    borderRadius: 'var(--radius-sm)',
    fontSize: 14,
    fontWeight: 600,
    cursor: disabled ? 'default' : 'pointer',
    transition: 'background 0.15s',
    ...style,
  }
  const variants = {
    primary:   { background: 'var(--navy)',  color: 'var(--white)'    },
    secondary: { background: 'var(--white)', color: 'var(--navy)', border: '1.5px solid var(--navy)' },
    sky:       { background: 'var(--sky)',   color: 'var(--white)'    },
    ghost:     { background: 'transparent',  color: 'var(--blue)'     },
  }
  return (
    <button onClick={onClick} disabled={disabled} style={{ ...base, ...variants[variant], opacity: disabled ? 0.5 : 1 }}>
      {children}
    </button>
  )
}
