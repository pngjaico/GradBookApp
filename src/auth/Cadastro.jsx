import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  createUserWithEmailAndPassword,
  updateProfile,
  signInWithPopup,
  GoogleAuthProvider,
} from 'firebase/auth'
import { doc, setDoc, serverTimestamp } from 'firebase/firestore'
import { auth, db } from '../firebase'

const ERROS = {
  'auth/email-already-in-use': 'Este e-mail já está cadastrado.',
  'auth/invalid-email': 'E-mail inválido.',
  'auth/weak-password': 'Senha muito fraca. Use pelo menos 6 caracteres.',
  'auth/popup-closed-by-user': '',
}

const TRIAL_DIAS = 7

async function salvarPerfilFirestore(user) {
  const trialEndsAt = new Date()
  trialEndsAt.setDate(trialEndsAt.getDate() + TRIAL_DIAS)

  await setDoc(doc(db, 'users', user.uid), {
    displayName: user.displayName || '',
    email: user.email,
    plan: 'trial',
    trialEndsAt: trialEndsAt,
    createdAt: serverTimestamp(),
  })
}

const inputStyle = {
  background: 'var(--color-surface)',
  border: '1.5px solid transparent',
  borderRadius: 'var(--radius)',
  padding: '16px',
  color: 'var(--color-text)',
  fontSize: 15,
  width: '100%',
  outline: 'none',
}

export default function Cadastro() {
  const navigate = useNavigate()
  const [nome, setNome] = useState('')
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [erro, setErro] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleCadastro(e) {
    e.preventDefault()
    setErro('')
    if (senha.length < 6) {
      setErro('Senha muito fraca. Use pelo menos 6 caracteres.')
      return
    }
    setLoading(true)
    try {
      const { user } = await createUserWithEmailAndPassword(auth, email, senha)
      await updateProfile(user, { displayName: nome })
      await salvarPerfilFirestore({ ...user, displayName: nome })
      navigate('/')
    } catch (err) {
      setErro(ERROS[err.code] || 'Erro ao criar conta. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  async function handleGoogle() {
    setErro('')
    setLoading(true)
    try {
      const { user } = await signInWithPopup(auth, new GoogleAuthProvider())
      await salvarPerfilFirestore(user)
      navigate('/')
    } catch (err) {
      setErro(ERROS[err.code] || 'Erro ao entrar com Google.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ padding: '60px 24px 40px', minHeight: '100dvh' }}>
      <h1 style={{ fontFamily: 'Outfit', fontSize: 28, marginBottom: 8 }}>Criar conta</h1>
      <p style={{ color: 'var(--color-text-secondary)', marginBottom: 40 }}>
        7 dias grátis · sem cartão
      </p>

      <form onSubmit={handleCadastro} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        <input
          placeholder="Nome completo"
          value={nome}
          onChange={e => setNome(e.target.value)}
          required
          style={inputStyle}
        />
        <input
          type="email"
          placeholder="E-mail"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
          style={inputStyle}
        />
        <input
          type="password"
          placeholder="Senha (mín. 6 caracteres)"
          value={senha}
          onChange={e => setSenha(e.target.value)}
          required
          style={inputStyle}
        />

        {erro && (
          <p style={{ color: 'var(--color-danger)', fontSize: 13, marginTop: -4 }}>
            {erro}
          </p>
        )}

        <button
          type="submit"
          className="btn-primary"
          disabled={loading}
          style={{ opacity: loading ? 0.6 : 1 }}
        >
          {loading ? 'Criando conta...' : 'Começar 7 dias grátis'}
        </button>

        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          color: 'var(--color-text-secondary)',
          fontSize: 13,
        }}>
          <hr style={{ flex: 1, border: 'none', borderTop: '1px solid rgba(255,255,255,0.1)' }} />
          ou
          <hr style={{ flex: 1, border: 'none', borderTop: '1px solid rgba(255,255,255,0.1)' }} />
        </div>

        <button
          type="button"
          onClick={handleGoogle}
          disabled={loading}
          style={{
            background: 'var(--color-surface)',
            color: 'var(--color-text)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 10,
            fontWeight: 500,
            opacity: loading ? 0.6 : 1,
          }}
        >
          <svg width="18" height="18" viewBox="0 0 48 48">
            <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
            <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
            <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
            <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.18 1.48-4.97 2.31-8.16 2.31-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
          </svg>
          Continuar com Google
        </button>

        <p style={{ textAlign: 'center', color: 'var(--color-text-secondary)', marginTop: 8 }}>
          Já tem conta?{' '}
          <Link to="/login" style={{ color: 'var(--color-primary)', fontWeight: 600 }}>
            Entrar
          </Link>
        </p>
      </form>
    </div>
  )
}
