import { Link } from 'react-router-dom'

export default function Cadastro() {
  return (
    <div style={{ padding: '60px 24px 40px', minHeight: '100dvh' }}>
      <h1 style={{ fontFamily: 'Outfit', fontSize: 28, marginBottom: 8 }}>Criar conta</h1>
      <p style={{ color: 'var(--color-text-secondary)', marginBottom: 40 }}>
        7 dias grátis · sem cartão
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        <input
          placeholder="Nome completo"
          style={{ background: 'var(--color-surface)', border: 'none', borderRadius: 'var(--radius)', padding: '16px', color: 'var(--color-text)', fontSize: 15 }}
        />
        <input
          type="email"
          placeholder="E-mail"
          style={{ background: 'var(--color-surface)', border: 'none', borderRadius: 'var(--radius)', padding: '16px', color: 'var(--color-text)', fontSize: 15 }}
        />
        <input
          type="password"
          placeholder="Senha"
          style={{ background: 'var(--color-surface)', border: 'none', borderRadius: 'var(--radius)', padding: '16px', color: 'var(--color-text)', fontSize: 15 }}
        />
        <button className="btn-primary">Começar 7 dias grátis</button>

        <p style={{ textAlign: 'center', color: 'var(--color-text-secondary)', marginTop: 8 }}>
          Já tem conta?{' '}
          <Link to="/login" style={{ color: 'var(--color-primary)' }}>Entrar</Link>
        </p>
      </div>
    </div>
  )
}
