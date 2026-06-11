// src/contexts/AuthContext.tsx
import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { api } from '../lib/api'

export interface AuthUser { id: string; name: string; username: string; role: 'GERENTE'|'ATENDENTE'; email?: string; phone?: string; avatarUrl?: string }

const PERMS: Record<string,string[]> = {
  GERENTE:   ['reports:read','users:read','users:write','toys:write','children:read','children:write'],
  ATENDENTE: ['children:read','children:write'],
}

interface Ctx { user: AuthUser|null; token: string|null; isGerente: boolean; loading: boolean; isLoading: boolean; login(u:string,p:string):Promise<void>; logout():void; can(p:string):boolean }
const AuthContext = createContext<Ctx|null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user,    setUser]    = useState<AuthUser|null>(null)
  const [token,   setToken]   = useState<string|null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const saved = localStorage.getItem('kidpark_token')
    if (!saved) { setLoading(false); return }
    setToken(saved)
    api.get<AuthUser>('/auth/me')
      .then(u => setUser(u))
      .catch(() => { localStorage.removeItem('kidpark_token'); localStorage.removeItem('kidpark_user') })
      .finally(() => setLoading(false))
  }, [])

  async function login(username: string, password: string) {
    const data = await api.post<{ token: string; user: AuthUser }>('/auth/login', { username, password })
    localStorage.setItem('kidpark_token', data.token)
    localStorage.setItem('kidpark_user', JSON.stringify(data.user))
    setToken(data.token); setUser(data.user)
  }

  function logout() {
    localStorage.removeItem('kidpark_token'); localStorage.removeItem('kidpark_user')
    setToken(null); setUser(null)
  }

  const can = (p: string) => !!user && (PERMS[user.role] ?? []).includes(p)

  return (
    <AuthContext.Provider value={{ user, token, isGerente: user?.role==='GERENTE', loading, isLoading: loading, login, logout, can }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth fora de AuthProvider')
  return ctx
}