import { useState } from 'react'

export default function AbaPendencias({ pendencias = [], onSalvar }) {
  const [novaPendencia, setNovaPendencia] = useState('')

  function handleAdicionar(e) {
    e.preventDefault()
    if (!novaPendencia.trim()) return
    const nova = { id: Date.now().toString(), texto: novaPendencia.trim(), feita: false }
    onSalvar({ pendencias: [...pendencias, nova] })
    setNovaPendencia('')
  }

  function handleToggle(id) {
    onSalvar({ pendencias: pendencias.map(p => p.id === id ? { ...p, feita: !p.feita } : p) })
  }

  function handleRemover(id) {
    onSalvar({ pendencias: pendencias.filter(p => p.id !== id) })
  }

  const abertas = pendencias.filter(p => !p.feita)
  const feitas = pendencias.filter(p => p.feita)

  return (
    <div>
      <form onSubmit={handleAdicionar} style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
        <input
          value={novaPendencia}
          onChange={e => setNovaPendencia(e.target.value)}
          placeholder="Nova pendência..."
          style={{ flex: 1, background: 'var(--color-bg)', border: '1.5px solid rgba(255,255,255,0.1)', borderRadius: 'var(--radius)', padding: '12px 14px', color: 'var(--color-text)', fontSize: 14, outline: 'none' }}
        />
        <button type="submit" style={{ background: 'var(--color-primary)', color: '#0A0F1A', fontWeight: 700, minHeight: 'auto', padding: '0 16px', borderRadius: 'var(--radius)', fontSize: 20 }}>+</button>
      </form>

      {abertas.map(p => (
        <div key={p.id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
          <span onClick={() => handleToggle(p.id)} style={{ fontSize: 20, cursor: 'pointer' }}>☐</span>
          <span style={{ flex: 1, fontSize: 14 }}>{p.texto}</span>
          <span onClick={() => handleRemover(p.id)} style={{ color: 'var(--color-danger)', cursor: 'pointer', fontSize: 18 }}>✕</span>
        </div>
      ))}

      {feitas.length > 0 && (
        <div style={{ marginTop: 16 }}>
          <p style={{ fontSize: 12, color: 'var(--color-text-secondary)', marginBottom: 8 }}>Concluídas</p>
          {feitas.map(p => (
            <div key={p.id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 0', opacity: 0.5 }}>
              <span onClick={() => handleToggle(p.id)} style={{ fontSize: 20, cursor: 'pointer' }}>☑</span>
              <span style={{ flex: 1, fontSize: 14, textDecoration: 'line-through' }}>{p.texto}</span>
              <span onClick={() => handleRemover(p.id)} style={{ color: 'var(--color-danger)', cursor: 'pointer', fontSize: 18 }}>✕</span>
            </div>
          ))}
        </div>
      )}

      {pendencias.length === 0 && (
        <p style={{ textAlign: 'center', color: 'var(--color-text-secondary)', marginTop: 32 }}>Nenhuma pendência.</p>
      )}
    </div>
  )
}
