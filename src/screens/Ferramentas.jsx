const calculadoras = [
  'Cockcroft-Gault (ClCr)',
  'Wells (TVP)',
  'Wells (TEP)',
  'CURB-65',
  'SOFA',
  'APACHE II',
  'Glasgow',
  'Child-Pugh',
]

export default function Ferramentas() {
  return (
    <div style={{ padding: '24px 20px 100px' }}>
      <h2 style={{ fontFamily: 'Outfit', fontSize: 22, marginBottom: 16 }}>Calculadoras</h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {calculadoras.map(nome => (
          <div key={nome} style={{
            background: 'var(--color-surface)',
            borderRadius: 'var(--radius)',
            padding: '14px 16px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
            <span>{nome}</span>
            <span style={{ color: 'var(--color-primary)' }}>›</span>
          </div>
        ))}
      </div>
    </div>
  )
}
