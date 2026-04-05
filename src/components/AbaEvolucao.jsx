import { useEffect, useRef, useState } from 'react'

const TEMPLATES = {
  soap: `S: \nO: \nA: \nP: `,
  sepse: `S: Paciente com suspeita de sepse. Febre/hipotermia, alteração do estado mental.\nO: FC: ___ bpm | FR: ___ irpm | PA: ___×___ mmHg | T: ___°C | SpO2: ___% AA\nLeucos: ___ | Lactato: ___ mmol/L | PCR: ___\nA: Sepse por foco ___ (pulmonar/urinário/abdominal)\nP:\n- Hemoculturas (2 pares) antes do ATB\n- ATB: ___\n- SF 0,9% 30 ml/kg em 3h se hipoperfusão\n- Lactato seriado, gasometria, ECG`,
  icc: `S: Dispneia aos ___, ortopneia, edema MMII. Piora há ___ dias.\nO: FC: ___ | PA: ___×___ | FR: ___ | SpO2: ___% | Edema: ___+/4+\nAusculta: ___ (crepitações, B3/B4)\nA: ICC descompensada — FE ___ (preservada/reduzida)\nP:\n- Furosemida EV: ___ mg\n- Restrição hídrica: ___ ml/dia\n- Monitorar diurese e eletrólitos\n- Ecocardiograma se não realizado`,
  pneumonia: `S: Tosse produtiva há ___ dias, febre (T: ___°C), dispneia.\nO: FR: ___ irpm | SpO2: ___% | Ausculta: crepitações em ___\nA: PAC — CURB-65: ___ pontos\nP:\n- ATB: ___ (amoxicilina-clavulanato/azitromicina)\n- O2 se SpO2 < 92%\n- Hidratação\n- RX tórax e Hemograma/PCR`,
}

const MENU_ITEMS = [
  { key: 'soap', label: '/soap', desc: 'Template SOAP genérico' },
  { key: 'sepse', label: '/sepse', desc: 'Sepse' },
  { key: 'icc', label: '/icc', desc: 'ICC descompensada' },
  { key: 'pneumonia', label: '/pneumonia', desc: 'Pneumonia (PAC)' },
]

export default function AbaEvolucao({ valor, onSalvar }) {
  const [texto, setTexto] = useState(valor || '')
  const [showMenu, setShowMenu] = useState(false)
  const [menuFiltro, setMenuFiltro] = useState('')
  const debounceRef = useRef(null)
  const textareaRef = useRef(null)

  useEffect(() => { setTexto(valor || '') }, [valor])

  function handleChange(e) {
    const val = e.target.value
    setTexto(val)
    clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => onSalvar({ evolucao: val }), 800)

    const match = val.match(/\/(\w*)$/)
    if (match) {
      setMenuFiltro(match[1].toLowerCase())
      setShowMenu(true)
    } else {
      setShowMenu(false)
    }
  }

  function aplicarTemplate(key) {
    const novo = texto.replace(/\/\w*$/, TEMPLATES[key])
    setTexto(novo)
    setShowMenu(false)
    clearTimeout(debounceRef.current)
    onSalvar({ evolucao: novo })
    setTimeout(() => textareaRef.current?.focus(), 50)
  }

  const itensFiltrados = MENU_ITEMS.filter(i => i.key.startsWith(menuFiltro) || menuFiltro === '')

  return (
    <div style={{ position: 'relative' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
        <span style={{ fontSize: 12, color: 'var(--color-text-secondary)' }}>
          Digite <strong style={{ color: 'var(--color-primary)' }}>/</strong> para inserir template
        </span>
        <button
          onClick={() => window.print()}
          style={{ background: 'transparent', color: 'var(--color-primary)', fontSize: 12, minHeight: 'auto', padding: '4px 10px', border: '1px solid var(--color-primary)', borderRadius: 8 }}
        >
          📄 Exportar PDF
        </button>
      </div>

      <textarea
        ref={textareaRef}
        value={texto}
        onChange={handleChange}
        placeholder="Evolução do paciente..."
        style={{
          width: '100%', minHeight: 280,
          background: 'var(--color-bg)',
          border: '1.5px solid rgba(255,255,255,0.1)',
          borderRadius: 'var(--radius)',
          padding: 14, color: 'var(--color-text)',
          fontSize: 14, lineHeight: 1.7,
          resize: 'vertical', outline: 'none',
          fontFamily: 'DM Sans, sans-serif',
        }}
      />

      {showMenu && itensFiltrados.length > 0 && (
        <div style={{
          position: 'absolute', bottom: '100%', left: 0, right: 0,
          background: 'var(--color-sidebar)',
          border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: 'var(--radius)', marginBottom: 4,
          overflow: 'hidden', zIndex: 10,
        }}>
          {itensFiltrados.map(item => (
            <div key={item.key} onClick={() => aplicarTemplate(item.key)} style={{ padding: '12px 16px', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
              <span style={{ color: 'var(--color-primary)', fontWeight: 600 }}>{item.label}</span>
              <span style={{ color: 'var(--color-text-secondary)', fontSize: 13 }}>{item.desc}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
