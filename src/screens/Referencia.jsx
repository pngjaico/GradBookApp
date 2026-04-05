export default function Referencia() {
  return (
    <div style={{ padding: '24px 20px 100px' }}>
      <h2 style={{ fontFamily: 'Outfit', fontSize: 22, marginBottom: 16 }}>Bulário</h2>
      <input
        placeholder="🔍 Buscar fármaco..."
        style={{
          width: '100%',
          background: 'var(--color-surface)',
          border: 'none',
          borderRadius: 'var(--radius)',
          padding: '14px 16px',
          color: 'var(--color-text)',
          fontSize: 15,
          marginBottom: 16,
        }}
      />
      <p style={{ color: 'var(--color-text-secondary)', textAlign: 'center' }}>
        Top 500 fármacos disponíveis offline
      </p>
    </div>
  )
}
