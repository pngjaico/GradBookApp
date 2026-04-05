import { NavLink } from 'react-router-dom'

const tabs = [
  { to: '/', label: 'Início', icon: '🏠' },
  { to: '/pacientes', label: 'Pacientes', icon: '🩺' },
  { to: '/referencia', label: 'Referência', icon: '💊' },
  { to: '/ferramentas', label: 'Ferramentas', icon: '🧮' },
  { to: '/menu', label: 'Menu', icon: '☰' },
]

export default function BottomNav() {
  return (
    <nav style={{
      position: 'fixed',
      bottom: 0,
      left: '50%',
      transform: 'translateX(-50%)',
      width: '100%',
      maxWidth: 430,
      background: 'var(--color-sidebar)',
      display: 'flex',
      borderTop: '1px solid rgba(255,255,255,0.07)',
      paddingBottom: 'env(safe-area-inset-bottom)',
    }}>
      {tabs.map(({ to, label, icon }) => (
        <NavLink
          key={to}
          to={to}
          end={to === '/'}
          style={({ isActive }) => ({
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            padding: '10px 4px',
            textDecoration: 'none',
            color: isActive ? 'var(--color-primary)' : 'var(--color-text-secondary)',
            fontSize: 11,
            gap: 4,
            transition: 'color var(--transition)',
          })}
        >
          <span style={{ fontSize: 20 }}>{icon}</span>
          {label}
        </NavLink>
      ))}
    </nav>
  )
}
