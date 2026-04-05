import { useEffect, useRef, useState } from 'react'

export default function AbaNotas({ valor, onSalvar }) {
  const [texto, setTexto] = useState(valor || '')
  const debounceRef = useRef(null)

  useEffect(() => { setTexto(valor || '') }, [valor])

  function handleChange(e) {
    const val = e.target.value
    setTexto(val)
    clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => onSalvar({ notas: val }), 800)
  }

  return (
    <textarea
      value={texto}
      onChange={handleChange}
      placeholder="Notas rápidas: observações, lembretes, anotações do plantão..."
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
  )
}
