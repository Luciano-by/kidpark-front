// src/app/routes.tsx
// SUBSTITUIR o arquivo inteiro.
// Adicionada rota /brinquedos (RequireGerente)

import { createBrowserRouter, Navigate } from 'react-router'
import { useAuth } from '../contexts/AuthContext'

import { TotemCadastro }     from './pages/totem/TotemCadastro'
import { TotemTempoExtra }   from './pages/totem/TotemTempoExtra'
import { TotemPagamentoPix } from './pages/totem/TotemPagamentoPix'
import { TotemProcessando }  from './pages/totem/TotemProcessando'
import { TotemAprovado }     from './pages/totem/TotemAprovado'
import { Login }             from './pages/Login'
import { Dashboard }         from './pages/Dashboard'
import { Cadastro }          from './pages/Cadastro'
import { Relatorios }        from './pages/Relatorios'
import { Gerenciamento }     from './pages/Gerenciamento'
import { Perfil }            from './pages/Perfil'
import { Brinquedos }        from './pages/Brinquedos'

// ── Guards ────────────────────────────────────────────────────

function RequireAuth({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth()
  if (loading) return (
    <div className="flex h-screen items-center justify-center text-[#1565C0] font-nunito">
      Carregando...
    </div>
  )
  if (!user) return <Navigate to="/login" replace />
  return <>{children}</>
}

function RequireGerente({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth()
  if (loading) return null
  if (!user) return <Navigate to="/login" replace />
  if (user.role !== 'GERENTE') return <Navigate to="/dashboard" replace />
  return <>{children}</>
}

// ── Router ────────────────────────────────────────────────────

export const router = createBrowserRouter([
  // Totem — público
  { path: '/',                  element: <TotemCadastro /> },
  { path: '/totem/tempo-extra', element: <TotemTempoExtra /> },
  { path: '/totem/pagamento',   element: <TotemPagamentoPix /> },
  { path: '/totem/processando', element: <TotemProcessando /> },
  { path: '/totem/aprovado',    element: <TotemAprovado /> },

  // Auth
  { path: '/login', element: <Login /> },

  // Autenticados
  { path: '/dashboard',   element: <RequireAuth><Dashboard /></RequireAuth> },
  { path: '/cadastro',    element: <RequireAuth><Cadastro /></RequireAuth> },
  { path: '/perfil',      element: <RequireAuth><Perfil /></RequireAuth> },

  // Só gerente
  { path: '/relatorios',    element: <RequireGerente><Relatorios /></RequireGerente> },
  { path: '/gerenciamento', element: <RequireGerente><Gerenciamento /></RequireGerente> },
  { path: '/brinquedos',    element: <RequireGerente><Brinquedos /></RequireGerente> },

  // Fallback
  { path: '*', element: <Navigate to="/login" replace /> },
])