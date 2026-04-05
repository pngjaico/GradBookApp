import { useState } from 'react'

const STATUS_OPTS = [
  { value: 'estavel', label: '🟢 Estável' },
  { value: 'atencao', label: '🟡 Atenção' },
  { value: 'critico', label: '🔴 Crítico' },
]

const inputStyle = {
  background: 'var(--color-bg)',
  border: '1.5px solid rgba(255,255,255,0.1)',
  borderRadius: 'var(--radius)',
  padding: '14px 16px',
  color: 'var(--color-text)',
  fontSize: 15,
  width: '100%',
  outline: 'none',
}

export default function NovoPacienteModal({ onSalvar, onFechar }) {
  const [nome, setNome] = useState('')
  const [leito, setLeito] = useState('')
  const [diagnostico, setDiagnostico] = useState('')
  const [status, setStatus] = useState('estavel')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    await onSalvar({ nome, leito, diagnostico, status })
    setLoading(false)
  }

  return (
    <div
      onClick={onFechar}
      style={{
        position: 'fixed', inset: 0,
        background: 'rgba(0,0,0,0.6)',
        display: 'flex', alignItems: 'flex-end',
        justifyContent: 'center', zIndex: 100,
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          background: 'var(--color-sidebar)',
          borderRadius: '20px 20px 0 0',
          padding: '24px 20px 40px',
          width: '100%',
          maxWidth: 430,
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
          <h3 style={{ fontFamily: 'Outfit', fontSize: 20 }}>Novo Paciente</h3>
          <button onClick={onFechar} style={{ background: 'transparent', color: 'var(--color-text-secondary)', minHeight: 'auto', padding: 4, fontSize: 18 }}>✕</button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <input placeholder="Nome do paciente *" value={nome} onChange={e => setNome(e.target.value)} required style={inputStyle} />
          <input placeholder="Leito / Enfermaria" value={leito} onChange={e => setLeito(e.target.value)} style={inputStyle} />
          <input placeholder="Diagnóstico principal" value={diagnostico} onChange={e => setDiagnostico(e.target.value)} style={inputStyle} />

          <div style={{ display: 'flex', gap: 8 }}>
            {STATUS_OPTS.map(opt => (
              <button
                key={opt.value}
                type="button"
                onClick={() => setStatus(opt.value)}
                style={{
                  flex: 1,
                  background: status === opt.value ? 'var(--color-primary)' : 'var(--color-bg)',
                  color: status === opt.value ? '#0A0F1A' : 'var(--color-text)',
                  fontSize: 12,
                  fontWeight: 600,
                  minHeight: 40,
                  padding: '0 8px',
                }}
              >
                {opt.label}
              </button>
            ))}
          </div>

          <button type="submit" className="btn-primary" disabled={loading} style={{ marginTop: 8, opacity: loading ? 0.6 : 1 }}>
            {loading ? 'Salvando...' : 'Adicionar Paciente'}
          </button>
        </form>
      </div>
    </div>
  )
}
