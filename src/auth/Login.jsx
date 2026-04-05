import { Link } from 'react-router-dom'

export default function Login() {
  return (
    <div style={{ padding: '60px 24px 40px', minHeight: '100dvh', display: 'flex', flexDirection: 'column' }}>
      <h1 style={{ fontFamily: 'Outfit', fontSize: 28, marginBottom: 8 }}>
        GradBook<span style={{ color: 'var(--color-primary)' }}>+</span>
      </h1>
      <p style={{ color: 'var(--color-text-secondary)', marginBottom: 40 }}>
        O whitebook do médico residente
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 14, flex: 1 }}>
        <input
          type="email"
          placeholder="E-mail"
          style={{
            background: 'var(--color-surface)',
            border: 'none',
            borderRadius: 'var(--radius)',
            padding: '16px',
            color: 'var(--color-text)',
            fontSize: 15,
          }}
        />
        <input
          type="password"
          placeholder="Senha"
          style={{
            background: 'var(--color-surface)',
            border: 'none',
            borderRadius: 'var(--radius)',
            padding: '16px',
            color: 'var(--color-text)',
            fontSize: 15,
          }}
        />
        <button className="btn-primary">Entrar</button>

        <p style={{ textAlign: 'center', color: 'var(--color-text-secondary)', marginTop: 12 }}>
          Não tem conta?{' '}
          <Link to="/cadastro" style={{ color: 'var(--color-primary)' }}>Cadastre-se</Link>
        </p>
      </div>
    </div>
  )
}
