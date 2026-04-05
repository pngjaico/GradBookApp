import { useEffect, useRef, useState } from 'react'

export default function AbaAdmissao({ valor, onSalvar }) {
  const [texto, setTexto] = useState(valor || '')
  const debounceRef = useRef(null)

  useEffect(() => { setTexto(valor || '') }, [valor])

  function handleChange(e) {
    const val = e.target.value
    setTexto(val)
    clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => onSalvar({ admissao: val }), 800)
  }

  return (
    <textarea
      value={texto}
      onChange={handleChange}
      placeholder="Dados de admissão: queixa principal, HDA, antecedentes, medicações em uso, alergias, exame físico inicial..."
      style={{
        width: '100%', minHeight: 300,
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
