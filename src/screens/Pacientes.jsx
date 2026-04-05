export default function Pacientes() {
  return (
    <div style={{ padding: '24px 20px 100px' }}>
      <h2 style={{ fontFamily: 'Outfit', fontSize: 22, marginBottom: 16 }}>Prontuários</h2>
      <div style={{
        background: 'var(--color-surface)',
        borderRadius: 'var(--radius)',
        padding: 20,
        textAlign: 'center',
        color: 'var(--color-text-secondary)',
      }}>
        <div style={{ fontSize: 40, marginBottom: 12 }}>🩺</div>
        <p>Nenhum paciente ainda.</p>
        <button className="btn-primary" style={{ marginTop: 16 }}>
          + Novo Paciente
        </button>
      </div>
    </div>
  )
}
