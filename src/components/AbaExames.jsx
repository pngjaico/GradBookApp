import { useState } from 'react'

export default function AbaExames({ exames = [], onSalvar }) {
  const [novoExame, setNovoExame] = useState({ nome: '', valor: '', data: '' })

  function handleAdicionar(e) {
    e.preventDefault()
    if (!novoExame.nome.trim()) return
    onSalvar({ exames: [...exames, { id: Date.now().toString(), ...novoExame }] })
    setNovoExame({ nome: '', valor: '', data: '' })
  }

  function handleRemover(id) {
    onSalvar({ exames: exames.filter(e => e.id !== id) })
  }

  const inputStyle = { background: 'var(--color-bg)', border: '1.5px solid rgba(255,255,255,0.1)', borderRadius: 8, padding: '10px 12px', color: 'var(--color-text)', fontSize: 13, outline: 'none', width: '100%' }

  return (
    <div>
      <form onSubmit={handleAdicionar} style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr auto', gap: 8, marginBottom: 16 }}>
        <input placeholder="Exame (ex: Hemoglobina)" value={novoExame.nome} onChange={e => setNovoExame(p => ({ ...p, nome: e.target.value }))} style={inputStyle} />
        <input placeholder="Valor" value={novoExame.valor} onChange={e => setNovoExame(p => ({ ...p, valor: e.target.value }))} style={inputStyle} />
        <input type="date" value={novoExame.data} onChange={e => setNovoExame(p => ({ ...p, data: e.target.value }))} style={{ ...inputStyle, colorScheme: 'dark' }} />
        <button type="submit" style={{ background: 'var(--color-primary)', color: '#0A0F1A', fontWeight: 700, minHeight: 'auto', padding: '0 12px', borderRadius: 8, fontSize: 18 }}>+</button>
      </form>

      {exames.length > 0 ? (
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
          <thead>
            <tr style={{ color: 'var(--color-text-secondary)' }}>
              <th style={{ textAlign: 'left', padding: '8px 0', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>Exame</th>
              <th style={{ textAlign: 'left', padding: '8px 0', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>Valor</th>
              <th style={{ textAlign: 'left', padding: '8px 0', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>Data</th>
              <th style={{ padding: '8px 0', borderBottom: '1px solid rgba(255,255,255,0.1)' }}></th>
            </tr>
          </thead>
          <tbody>
            {exames.map(ex => (
              <tr key={ex.id}>
                <td style={{ padding: '10px 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>{ex.nome}</td>
                <td style={{ padding: '10px 0', borderBottom: '1px solid rgba(255,255,255,0.05)', color: 'var(--color-primary)' }}>{ex.valor}</td>
                <td style={{ padding: '10px 0', borderBottom: '1px solid rgba(255,255,255,0.05)', color: 'var(--color-text-secondary)' }}>{ex.data}</td>
                <td style={{ padding: '10px 0', borderBottom: '1px solid rgba(255,255,255,0.05)', textAlign: 'right' }}>
                  <span onClick={() => handleRemover(ex.id)} style={{ cursor: 'pointer', color: 'var(--color-danger)' }}>✕</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p style={{ textAlign: 'center', color: 'var(--color-text-secondary)', marginTop: 32 }}>Nenhum exame registrado.</p>
      )}
    </div>
  )
}
