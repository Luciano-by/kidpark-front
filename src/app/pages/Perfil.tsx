// src/app/pages/Perfil.tsx
import { useState } from 'react'
import { User, LogOut, Check } from 'lucide-react'
import { AppSidebar }  from '../components/kidpark/AppSidebar'
import { StatusBadge } from '../components/kidpark/StatusBadge'
import { useAuth }     from '../../contexts/AuthContext'
import { usersService } from '../../services'

export function Perfil() {
  const { user, logout } = useAuth()
  const [saving, setSaving] = useState(false)
  const [saved,  setSaved]  = useState(false)
  const [error,  setError]  = useState('')
  const [form,   setForm]   = useState({
    nome:     user?.name     ?? '',
    email:    user?.email    ?? '',
    telefone: user?.phone    ?? '',
  })

  const roleLabelMap: Record<string, 'administrador' | 'atendente'> = {
    GERENTE:   'administrador',
    ATENDENTE: 'atendente',
  }

  const handleSave = async () => {
    if (!user) return
    setSaving(true); setError('')
    try {
      await usersService.update(user.id, {
        name:  form.nome     || undefined,
        email: form.email    || undefined,
        phone: form.telefone || undefined,
      })
      setSaved(true)
      setTimeout(() => setSaved(false), 2500)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Erro ao salvar')
    } finally {
      setSaving(false)
    }
  }

  if (!user) return null

  return (
    <div className="flex h-screen bg-[#F5F5F5]">
      <AppSidebar />

      <div className="flex-1 flex flex-col items-center justify-center p-8">
        <div className="bg-white rounded-2xl p-8 shadow-lg max-w-md w-full">
          <h1 className="font-nunito font-bold text-2xl text-[#212121] mb-6 text-center">
            Meu Perfil
          </h1>

          <div className="flex flex-col items-center mb-6">
            <div className="w-20 h-20 bg-[#1565C0] rounded-full flex items-center justify-center mb-2">
              <User className="w-10 h-10 text-white" />
            </div>
            <p className="font-nunito font-bold text-[#212121] text-lg">{user.name}</p>
            <p className="font-nunito text-[#757575] text-sm">@{user.username}</p>
          </div>

          <div className="flex justify-center mb-6">
            <StatusBadge variant={roleLabelMap[user.role] ?? 'atendente'} />
          </div>

          <div className="space-y-4">
            {([
              { label: 'Nome',     key: 'nome'     as const },
              { label: 'Email',    key: 'email'    as const },
              { label: 'Telefone', key: 'telefone' as const },
            ]).map(({ label, key }) => (
              <div key={key}>
                <label className="text-[#757575] text-sm font-nunito font-semibold block mb-1">
                  {label}
                </label>
                <input
                  value={form[key]}
                  onChange={e => setForm({ ...form, [key]: e.target.value })}
                  className="w-full bg-[#F5F5F5] rounded-lg px-4 py-3 font-nunito text-[#212121] focus:outline-none focus:ring-2 focus:ring-[#1565C0]"
                />
              </div>
            ))}
          </div>

          {error && (
            <p className="text-red-500 text-sm mt-3 font-nunito text-center">{error}</p>
          )}

          <button onClick={handleSave} disabled={saving}
            className="w-full mt-6 bg-[#2E7D32] text-white py-3 rounded-lg font-nunito font-bold hover:brightness-90 disabled:opacity-60 flex items-center justify-center gap-2">
            {saved ? <><Check className="w-4 h-4" /> Salvo!</> : saving ? 'Salvando...' : 'Salvar Alterações'}
          </button>

          <div className="border-t border-[#E0E0E0] my-6" />

          <button onClick={logout}
            className="w-full bg-[#E53935] text-white py-3 rounded-lg font-nunito font-bold hover:brightness-90 flex items-center justify-center gap-2">
            <LogOut className="w-5 h-5" /> Sair da Conta
          </button>
        </div>
      </div>
    </div>
  )
}
