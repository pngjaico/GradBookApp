import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { usePatients } from '../hooks/usePatients'
import AbaEvolucao from '../components/AbaEvolucao'
import AbaAdmissao from '../components/AbaAdmissao'
import AbaExames from '../components/AbaExames'
import AbaPendencias from '../components/AbaPendencias'
import AbaNotas from '../components/AbaNotas'

const ABAS = ['Evolução', 'Admissão', 'Exames', 'Pendências', 'Notas']

const STATUS_OPTS = [
  { value: 'estavel', label: '🟢 Estável' },
  { value: 'atencao', label: '🟡 Atenção' },
  { value: 'critico', label: '🔴 Crítico' },
]

export default function PacienteDetalhe() {
  const { id } = useParams()
  const user = useAuth()
  const navigate = useNavigate()
  const { patients, updatePatient, deletePatient } = usePatients(user?.uid)
  const [abaAtiva, setAbaAtiva] = useState('Evolução')

  const paciente = patients.find(p => p.id === id)

  async function handleUpdate(data) {
    await updatePatient(user.uid, id, data)
  }

  async function handleDelete() {
    if (!window.confirm(`Excluir ${paciente?.nome}? Esta ação não pode ser desfeita.`)) return
    await deletePatient(user.uid, id)
    navigate('/pacientes')
  }

  if (!paciente) {
    return <div style={{ padding: '24px 20px 100px', color: 'var(--color-text-secondary)' }}>Carregando...</div>
  }

  return (
    <div style={{ paddingBottom: 100 }}>
      {/* Header */}
      <div style={{ padding: '16px 20px', background: 'var(--color-sidebar)', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
          <button onClick={() => navigate('/pacientes')} style={{ background: 'transparent', color: 'var(--color-text-secondary)', minHeight: 'auto', padding: '4px 0', fontSize: 20 }}>←</button>
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: 'Outfit', fontSize: 20, fontWeight: 600 }}>{paciente.nome}</div>
            {paciente.leito && <div style={{ fontSize: 12, color: 'var(--color-text-secondary)' }}>Leito: {paciente.leito}</div>}
          </div>
          <button onClick={handleDelete} style={{ background: 'transparent', color: 'var(--color-danger)', minHeight: 'auto', padding: '4px 8px', fontSize: 16 }}>🗑</button>
        </div>

        {paciente.diagnostico && (
          <div style={{ fontSize: 13, color: 'var(--color-text-secondary)', marginBottom: 10 }}>{paciente.diagnostico}</div>
        )}

        <div style={{ display: 'flex', gap: 6 }}>
          {STATUS_OPTS.map(opt => (
            <button
              key={opt.value}
              onClick={() => handleUpdate({ status: opt.value })}
              style={{
                background: paciente.status === opt.value ? 'var(--color-primary)' : 'rgba(255,255,255,0.07)',
                color: paciente.status === opt.value ? '#0A0F1A' : 'var(--color-text-secondary)',
                fontSize: 11, fontWeight: 600, minHeight: 30, padding: '0 10px', borderRadius: 20,
              }}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', overflowX: 'auto', background: 'var(--color-sidebar)', borderBottom: '1px solid rgba(255,255,255,0.07)', scrollbarWidth: 'none' }}>
        {ABAS.map(aba => (
          <button
            key={aba}
            onClick={() => setAbaAtiva(aba)}
            style={{
              background: 'transparent',
              color: abaAtiva === aba ? 'var(--color-primary)' : 'var(--color-text-secondary)',
              borderBottom: abaAtiva === aba ? '2px solid var(--color-primary)' : '2px solid transparent',
              borderRadius: 0, minHeight: 'auto', padding: '12px 16px',
              fontSize: 13, fontWeight: abaAtiva === aba ? 600 : 400,
              whiteSpace: 'nowrap', transition: 'color var(--transition)',
            }}
          >
            {aba}
          </button>
        ))}
      </div>

      {/* Conteúdo */}
      <div style={{ padding: '20px 20px 100px' }}>
        {abaAtiva === 'Evolução' && <AbaEvolucao valor={paciente.evolucao} onSalvar={handleUpdate} />}
        {abaAtiva === 'Admissão' && <AbaAdmissao valor={paciente.admissao} onSalvar={handleUpdate} />}
        {abaAtiva === 'Exames' && <AbaExames exames={paciente.exames} onSalvar={handleUpdate} />}
        {abaAtiva === 'Pendências' && <AbaPendencias pendencias={paciente.pendencias} onSalvar={handleUpdate} />}
        {abaAtiva === 'Notas' && <AbaNotas valor={paciente.notas} onSalvar={handleUpdate} />}
      </div>
    </div>
  )
}
