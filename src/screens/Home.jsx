export default function Home() {
  return (
    <div style={{ padding: '24px 20px 100px' }}>
      <h1 style={{ fontFamily: 'Outfit', fontSize: 24, marginBottom: 4 }}>
        Bom dia, Residente 👋
      </h1>
      <p style={{ color: 'var(--color-text-secondary)', marginBottom: 24 }}>
        GradBook+ · Acesso rápido
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        {[
          { label: 'Prontuários', icon: '🩺', desc: 'Seus pacientes hoje' },
          { label: 'Bulário', icon: '💊', desc: 'Top 500 fármacos' },
          { label: 'Calculadoras', icon: '🧮', desc: '15+ ferramentas clínicas' },
          { label: 'Prescrições', icon: '📝', desc: 'Modelos prontos' },
        ].map(({ label, icon, desc }) => (
          <div key={label} style={{
            background: 'var(--color-surface)',
            borderRadius: 'var(--radius)',
            padding: 16,
          }}>
            <div style={{ fontSize: 28 }}>{icon}</div>
            <div style={{ fontWeight: 600, marginTop: 8 }}>{label}</div>
            <div style={{ fontSize: 12, color: 'var(--color-text-secondary)', marginTop: 4 }}>{desc}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
