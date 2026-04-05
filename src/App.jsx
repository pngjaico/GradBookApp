import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './hooks/useAuth'
import BottomNav from './components/BottomNav'
import Home from './screens/Home'
import Pacientes from './screens/Pacientes'
import PacienteDetalhe from './screens/PacienteDetalhe'
import Referencia from './screens/Referencia'
import Ferramentas from './screens/Ferramentas'
import Menu from './screens/Menu'
import Login from './auth/Login'
import Cadastro from './auth/Cadastro'

function Spinner() {
  return (
    <div style={{
      minHeight: '100dvh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'var(--color-bg)',
    }}>
      <div style={{
        width: 36,
        height: 36,
        borderRadius: '50%',
        border: '3px solid var(--color-surface)',
        borderTopColor: 'var(--color-primary)',
        animation: 'spin 0.8s linear infinite',
      }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}

function AppLayout() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/pacientes" element={<Pacientes />} />
        <Route path="/pacientes/:id" element={<PacienteDetalhe />} />
        <Route path="/referencia" element={<Referencia />} />
        <Route path="/ferramentas" element={<Ferramentas />} />
        <Route path="/menu" element={<Menu />} />
      </Routes>
      <BottomNav />
    </>
  )
}

function AuthGate() {
  const user = useAuth()

  // undefined = Firebase ainda resolvendo o estado de auth
  if (user === undefined) return <Spinner />

  return (
    <Routes>
      <Route
        path="/login"
        element={user ? <Navigate to="/" replace /> : <Login />}
      />
      <Route
        path="/cadastro"
        element={user ? <Navigate to="/" replace /> : <Cadastro />}
      />
      <Route
        path="/*"
        element={user ? <AppLayout /> : <Navigate to="/login" replace />}
      />
    </Routes>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AuthGate />
      </AuthProvider>
    </BrowserRouter>
  )
}
