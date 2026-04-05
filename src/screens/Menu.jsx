export default function Menu() {
  return (
    <div style={{ padding: '24px 20px 100px' }}>
      <h2 style={{ fontFamily: 'Outfit', fontSize: 22, marginBottom: 24 }}>Menu</h2>
      {[
        { label: 'Meu Perfil', icon: '👤' },
        { label: 'Assinatura Premium', icon: '⭐' },
        { label: 'Prescrições Salvas', icon: '📝' },
        { label: 'Configurações', icon: '⚙️' },
        { label: 'Suporte', icon: '💬' },
        { label: 'Sair', icon: '🚪' },
      ].map(({ label, icon }) => (
        <div key={label} style={{
          display: 'flex',
          alignItems: 'center',
          gap: 14,
          padding: '16px 0',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
          cursor: 'pointer',
        }}>
          <span style={{ fontSize: 20 }}>{icon}</span>
          <span>{label}</span>
        </div>
      ))}
    </div>
  )
}
