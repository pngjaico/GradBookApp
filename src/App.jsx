import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import BottomNav from './components/BottomNav'
import Home from './screens/Home'
import Pacientes from './screens/Pacientes'
import Referencia from './screens/Referencia'
import Ferramentas from './screens/Ferramentas'
import Menu from './screens/Menu'
import Login from './auth/Login'
import Cadastro from './auth/Cadastro'

// Por enquanto sem auth real — troca para false para ver tela de login
const isLoggedIn = true

function AppLayout() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/pacientes" element={<Pacientes />} />
        <Route path="/referencia" element={<Referencia />} />
        <Route path="/ferramentas" element={<Ferramentas />} />
        <Route path="/menu" element={<Menu />} />
      </Routes>
      <BottomNav />
    </>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/cadastro" element={<Cadastro />} />
        <Route
          path="/*"
          element={isLoggedIn ? <AppLayout /> : <Navigate to="/login" replace />}
        />
      </Routes>
    </BrowserRouter>
  )
}
