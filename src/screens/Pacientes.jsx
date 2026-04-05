import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { usePatients } from '../hooks/usePatients'
import NovoPacienteModal from '../components/NovoPacienteModal'

const STATUS_BADGE = {
  estavel: { emoji: '🟢', label: 'Estável' },
  atencao: { emoji: '🟡', label: 'Atenção' },
  critico: { emoji: '🔴', label: 'Crítico' },
}

export default function Pacientes() {
  const user = useAuth()
  const navigate = useNavigate()
  const { patients, loading, addPatient, updatePatient } = usePatients(user?.uid)
  const [showModal, setShowModal] = useState(false)

  async function handleAdicionarPaciente(data) {
    await addPatient(user.uid, data)
    setShowModal(false)
  }

  async function togglePendencia(paciente, pendenciaId) {
    const atualizadas = paciente.pendencias.map(p =>
      p.id === pendenciaId ? { ...p, feita: !p.feita } : p
    )
    await updatePatient(user.uid, paciente.id, { pendencias: atualizadas })
  }

  if (loading) {
    return <div style={{ padding: '24px 20px 100px', color: 'var(--color-text-secondary)' }}>Carregando...</div>
  }

  return (
    <div style={{ padding: '24px 20px 100px' }}>
      <h2 style={{ fontFamily: 'Outfit', fontSize: 22, marginBottom: 16 }}>Prontuários</h2>

      {patients.length === 0 ? (
        <div style={{ background: 'var(--color-surface)', borderRadius: 'var(--radius)', padding: 32, textAlign: 'center', color: 'var(--color-text-secondary)' }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>🩺</div>
          <p>Nenhum paciente ainda.</p>
          <p style={{ fontSize: 13, marginTop: 4 }}>Adicione seu primeiro paciente abaixo.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {patients.map(pac => {
            const badge = STATUS_BADGE[pac.status] || STATUS_BADGE.estavel
            const pendenciasAbertas = (pac.pendencias || []).filter(p => !p.feita)
            return (
              <div key={pac.id} style={{ background: 'var(--color-surface)', borderRadius: 'var(--radius)', padding: 16, border: '1px solid rgba(255,255,255,0.06)' }}>
                <div onClick={() => navigate(`/pacientes/${pac.id}`)} style={{ cursor: 'pointer' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: 16 }}>{pac.nome}</div>
                      {pac.leito && <div style={{ fontSize: 12, color: 'var(--color-text-secondary)', marginTop: 2 }}>Leito: {pac.leito}</div>}
                      {pac.diagnostico && <div style={{ fontSize: 13, color: 'var(--color-text-secondary)', marginTop: 4 }}>{pac.diagnostico}</div>}
                    </div>
                    <span style={{ fontSize: 13, whiteSpace: 'nowrap' }}>{badge.emoji} {badge.label}</span>
                  </div>
                </div>

                {pendenciasAbertas.length > 0 && (
                  <div style={{ marginTop: 12, borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: 10 }}>
                    {pendenciasAbertas.slice(0, 3).map(p => (
                      <div key={p.id} onClick={() => togglePendencia(pac, p.id)} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '4px 0', cursor: 'pointer', fontSize: 13, color: 'var(--color-text-secondary)' }}>
                        <span style={{ fontSize: 16 }}>☐</span>
                        {p.texto}
                      </div>
                    ))}
                    {pendenciasAbertas.length > 3 && (
                      <div style={{ fontSize: 12, color: 'var(--color-text-secondary)', marginTop: 4 }}>
                        +{pendenciasAbertas.length - 3} pendências
                      </div>
                    )}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}

      {/* FAB */}
      <button
        onClick={() => setShowModal(true)}
        style={{
          position: 'fixed', bottom: 80, right: 20,
          width: 56, height: 56, borderRadius: '50%',
          background: 'var(--color-primary)', color: '#0A0F1A',
          fontSize: 28, fontWeight: 600, minHeight: 'auto',
          boxShadow: '0 4px 20px rgba(0,200,150,0.4)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}
      >+</button>

      {showModal && (
        <NovoPacienteModal onSalvar={handleAdicionarPaciente} onFechar={() => setShowModal(false)} />
      )}
    </div>
  )
}
