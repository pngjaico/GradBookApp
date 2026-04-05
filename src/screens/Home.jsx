import { signOut } from 'firebase/auth'
import { useNavigate } from 'react-router-dom'
import { auth } from '../firebase'
import { useAuth } from '../hooks/useAuth'

const modulos = [
  { label: 'Prontuários', icon: '🩺', desc: 'Seus pacientes hoje', to: '/pacientes' },
  { label: 'Bulário', icon: '💊', desc: 'Top 500 fármacos', to: '/referencia' },
  { label: 'Calculadoras', icon: '🧮', desc: '15+ ferramentas clínicas', to: '/ferramentas' },
  { label: 'Prescrições', icon: '📝', desc: 'Modelos prontos', to: '/menu' },
]

function saudacao() {
  const hora = new Date().getHours()
  if (hora < 12) return 'Bom dia'
  if (hora < 18) return 'Boa tarde'
  return 'Boa noite'
}

export default function Home() {
  const user = useAuth()
  const navigate = useNavigate()
  const primeiroNome = user?.displayName?.split(' ')[0] || 'Residente'

  async function handleSair() {
    await signOut(auth)
    navigate('/login')
  }

  return (
    <div style={{ padding: '24px 20px 100px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 4 }}>
        <h1 style={{ fontFamily: 'Outfit', fontSize: 24 }}>
          {saudacao()}, {primeiroNome} 👋
        </h1>
        <button
          onClick={handleSair}
          style={{
            background: 'transparent',
            color: 'var(--color-text-secondary)',
            fontSize: 12,
            minHeight: 'auto',
            padding: '4px 8px',
          }}
        >
          Sair
        </button>
      </div>
      <p style={{ color: 'var(--color-text-secondary)', marginBottom: 24 }}>
        GradBook+ · Acesso rápido
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        {modulos.map(({ label, icon, desc }) => (
          <div
            key={label}
            style={{
              background: 'var(--color-surface)',
              borderRadius: 'var(--radius)',
              padding: 16,
              cursor: 'pointer',
            }}
          >
            <div style={{ fontSize: 28 }}>{icon}</div>
            <div style={{ fontWeight: 600, marginTop: 8 }}>{label}</div>
            <div style={{ fontSize: 12, color: 'var(--color-text-secondary)', marginTop: 4 }}>{desc}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
