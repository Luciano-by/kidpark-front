// src/app/pages/Gerenciamento.tsx
import { useState, useEffect } from 'react'
import { Plus, Trash2, RefreshCw, Users } from 'lucide-react'
import { AppSidebar }   from '../components/kidpark/AppSidebar'
import { AccessibilityBar } from '../components/kidpark/AccessibilityBar'
import { usersService } from '../../services'
import type { User as UserData } from '../../services'

interface CreateModalProps { onClose: () => void; onCreated: () => void }

function CreateModal({ onClose, onCreated }: CreateModalProps) {
  const [form, setForm]   = useState({ name: '', username: '', password: '', roleName: 'ATENDENTE' as 'GERENTE' | 'ATENDENTE' })
  const [err,  setErr]    = useState('')
  const [saving, setSave] = useState(false)

  const handle = async () => {
    if (!form.name || !form.username || !form.password) { setErr('Preencha todos os campos'); return }
    setSave(true)
    try { await usersService.create(form); onCreated(); onClose() }
    catch (e) { setErr(e instanceof Error ? e.message : 'Erro ao criar') }
    finally   { setSave(false) }
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-xl">
        <h2 className="font-nunito font-bold text-lg text-[#212121] mb-4">Novo Usuário</h2>
        <div className="space-y-3">
          {([
            { label: 'Nome completo', key: 'name'     as const, type: 'text'     },
            { label: 'Username',      key: 'username' as const, type: 'text'     },
            { label: 'Senha',         key: 'password' as const, type: 'password' },
          ]).map(f => (
            <div key={f.key}>
              <label className="text-[#757575] text-xs font-nunito font-semibold block mb-1">{f.label}</label>
              <input type={f.type} value={form[f.key]}
                onChange={e => setForm({ ...form, [f.key]: e.target.value })}
                className="w-full h-10 px-3 rounded-lg border border-[#E0E0E0] font-nunito text-sm focus:outline-none focus:ring-2 focus:ring-[#1565C0]"
              />
            </div>
          ))}
          <div>
            <label className="text-[#757575] text-xs font-nunito font-semibold block mb-1">Cargo</label>
            <select value={form.roleName} onChange={e => setForm({ ...form, roleName: e.target.value as 'GERENTE' | 'ATENDENTE' })}
              className="w-full h-10 px-3 rounded-lg border border-[#E0E0E0] font-nunito text-sm focus:outline-none focus:ring-2 focus:ring-[#1565C0]">
              <option value="ATENDENTE">Atendente</option>
              <option value="GERENTE">Gerente</option>
            </select>
          </div>
        </div>
        {err && <p className="text-red-500 text-xs mt-3 font-nunito">{err}</p>}
        <div className="flex gap-2 mt-5">
          <button onClick={onClose} className="flex-1 py-2 border border-[#E0E0E0] rounded-lg font-nunito font-semibold text-sm text-[#757575] hover:bg-[#F5F5F5]">Cancelar</button>
          <button onClick={handle} disabled={saving} className="flex-1 py-2 bg-[#2E7D32] text-white rounded-lg font-nunito font-bold text-sm hover:brightness-90 disabled:opacity-60">
            {saving ? 'Criando...' : 'Criar'}
          </button>
        </div>
      </div>
    </div>
  )
}

export function Gerenciamento() {
  const [users,      setUsers]      = useState<UserData[]>([])
  const [loading,    setLoading]    = useState(true)
  const [showCreate, setShowCreate] = useState(false)
  const [error,      setError]      = useState('')

  const fetchUsers = async () => {
    setLoading(true)
    try   { setUsers(await usersService.getAll()) }
    catch (e) { setError(e instanceof Error ? e.message : 'Erro ao carregar usuários') }
    finally   { setLoading(false) }
  }

  useEffect(() => { fetchUsers() }, [])

  const handleChangeRole = async (id: string, currentRole: string) => {
    const newRole = currentRole === 'GERENTE' ? 'ATENDENTE' : 'GERENTE'
    try {
      await usersService.changeRole(id, newRole as 'GERENTE' | 'ATENDENTE')
      setUsers(prev => prev.map(u => u.id === id ? { ...u, role: newRole } : u))
    } catch (e) { alert(e instanceof Error ? e.message : 'Erro ao alterar cargo') }
  }

  const handleRemove = async (id: string, name: string) => {
    if (!confirm(`Desativar o usuário "${name}"?`)) return
    try {
      await usersService.remove(id)
      setUsers(prev => prev.filter(u => u.id !== id))
    } catch (e) { alert(e instanceof Error ? e.message : 'Erro ao remover usuário') }
  }

  const roleBadge = (role: string) => (
    <span className={`px-2 py-0.5 rounded-full text-xs font-nunito font-bold ${
      role === 'GERENTE' ? 'bg-[#E65100]/10 text-[#E65100]' : 'bg-[#1565C0]/10 text-[#1565C0]'
    }`}>
      {role === 'GERENTE' ? '👑 Gerente' : '👤 Atendente'}
    </span>
  )

  return (
    <div className="flex h-screen bg-[#F5F5F5]">
      <AppSidebar />

      <div className="flex-1 flex flex-col min-w-0">
         <AccessibilityBar />     {/* ← adicionar esta linha */}
        <div className="bg-white border-b border-[#E0E0E0] h-14 flex items-center justify-between px-6 flex-shrink-0">
          <h1 className="font-nunito font-bold text-xl text-[#212121]">Gerenciamento de Usuários</h1>
          <div className="flex gap-2">
            <button onClick={fetchUsers}
              className="flex items-center gap-1 px-3 py-2 border border-[#E0E0E0] rounded-lg text-sm font-nunito text-[#757575] hover:bg-[#F5F5F5]">
              <RefreshCw className="w-4 h-4" /> Atualizar
            </button>
            <button onClick={() => setShowCreate(true)}
              className="flex items-center gap-2 px-4 py-2 bg-[#2E7D32] text-white rounded-lg font-nunito font-bold text-sm hover:brightness-90">
              <Plus className="w-4 h-4" /> Novo Usuário
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-auto p-6">
          {error && (
            <div className="mb-4 bg-[#FFEBEE] border border-[#EF9A9A] rounded-lg px-4 py-3">
              <p className="font-nunito text-sm text-[#C62828]">{error}</p>
            </div>
          )}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            {loading ? (
              <div className="flex justify-center items-center h-40">
                <div className="w-8 h-8 border-4 border-[#1565C0] border-t-transparent rounded-full animate-spin" />
              </div>
            ) : users.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-40 text-[#9E9E9E]">
                <Users className="w-10 h-10 mb-2 opacity-30" />
                <p className="font-nunito font-semibold">Nenhum usuário encontrado</p>
              </div>
            ) : (
              <table className="w-full">
                <thead>
                  <tr className="border-b bg-[#F5F5F5]">
                    {['Nome', 'Username', 'Cargo', 'Status', 'Ações'].map(h => (
                      <th key={h} className="text-left py-3 px-4 font-nunito font-semibold text-xs text-[#757575] uppercase tracking-wide">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {users.map((u, i) => (
                    <tr key={u.id} className={`border-b hover:bg-[#E3F2FD] transition-colors ${i % 2 === 1 ? 'bg-[#FAFAFA]' : ''}`}>
                      <td className="py-3 px-4 font-nunito font-semibold text-[15px] text-[#212121]">{u.name}</td>
                      <td className="py-3 px-4 font-nunito text-sm text-[#757575]">@{u.username}</td>
                      <td className="py-3 px-4">{roleBadge(u.role)}</td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-0.5 rounded-full text-xs font-nunito font-bold ${
                          u.isActive ? 'bg-[#E8F5E9] text-[#2E7D32]' : 'bg-[#F5F5F5] text-[#9E9E9E]'
                        }`}>
                          {u.isActive ? 'Ativo' : 'Inativo'}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex gap-2">
                          <button onClick={() => handleChangeRole(u.id, u.role)}
                            className="px-3 py-1 bg-[#1565C0] text-white text-xs rounded-md hover:brightness-90 font-nunito">
                            {u.role === 'GERENTE' ? '→ Atendente' : '→ Gerente'}
                          </button>
                          <button onClick={() => handleRemove(u.id, u.name)}
                            className="p-1 text-[#E53935] hover:bg-[#FFEBEE] rounded-md" title="Remover">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
      {showCreate && <CreateModal onClose={() => setShowCreate(false)} onCreated={fetchUsers} />}
    </div>
  )
}
