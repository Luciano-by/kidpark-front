// src/app/pages/Login.tsx
import { useState } from 'react'
import { useNavigate } from 'react-router'
import { Eye, EyeOff } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'

export function Login() {
  const navigate             = useNavigate()
  const { login, isLoading } = useAuth()
  const [showPass, setShowPass] = useState(false)
  const [form, setForm]         = useState({ username: '', password: '' })
  const [error, setError]       = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (!form.username.trim() || !form.password.trim()) {
      setError('Preencha usuário e senha')
      return
    }
    try {
      await login(form.username.trim(), form.password)
      navigate('/dashboard', { replace: true })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Usuário ou senha incorretos')
    }
  }

  return (
    <div className="min-h-screen w-full">
      <div className="hidden lg:flex h-screen">
        <div className="flex-1 bg-[#1565C0] flex items-center justify-center px-12">
          <div className="w-full max-w-md">
            <h1 className="text-white font-fredoka text-5xl mb-2 text-center">Login</h1>
            <p className="text-white/60 font-nunito text-sm text-center mb-8">KidPark — Sistema de gestão</p>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="text-white font-nunito font-semibold text-[15px] block mb-2">Usuário</label>
                <input
                  type="text"
                  value={form.username}
                  onChange={e => { setForm({ ...form, username: e.target.value }); setError('') }}
                  className="w-full h-11 rounded-lg px-4 font-nunito text-[#212121] focus:outline-none focus:ring-2 focus:ring-white/50"
                  placeholder="seu.usuario"
                  disabled={isLoading}
                  autoComplete="username"
                />
              </div>
              <div>
                <label className="text-white font-nunito font-semibold text-[15px] block mb-2">Senha</label>
                <div className="relative">
                  <input
                    type={showPass ? 'text' : 'password'}
                    value={form.password}
                    onChange={e => { setForm({ ...form, password: e.target.value }); setError('') }}
                    className="w-full h-11 rounded-lg px-4 pr-12 font-nunito text-[#212121] focus:outline-none focus:ring-2 focus:ring-white/50"
                    placeholder="seu.usuario"
                    disabled={isLoading}
                    autoComplete="current-password"
                  />
                  <button type="button" onClick={() => setShowPass(!showPass)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#757575] hover:text-[#424242]">
                    {showPass ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>
              {error && (
                <div className="bg-red-500/20 border border-red-400/40 rounded-lg px-4 py-2">
                  <p className="text-white text-sm font-nunito text-center">{error}</p>
                </div>
              )}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full h-12 bg-[#2E7D32] text-white font-nunito font-bold rounded-lg hover:brightness-90 disabled:opacity-60 flex items-center justify-center gap-2"
              >
                {isLoading
                  ? <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />Entrando...</>
                  : 'Entrar'}
              </button>
            </form>
            {/* <div className="mt-8 p-3 bg-white/10 rounded-lg">
              <p className="text-white/50 text-xs font-nunito text-center mb-1">Logins disponíveis</p>
              <p className="text-white/70 text-xs font-nunito text-center font-mono">
                luciano / 123 · gerente / gerente123 · atendente / atendente123
              </p>
            </div> */}
          </div>
        </div>
        <div className="flex-1 bg-[#F5F5F5] flex items-center justify-center">
          <div className="text-center">
            <div className="font-fredoka text-[80px] leading-none">
              <span className="text-[#1565C0]">Kid</span><span className="text-[#2E7D32]">Park</span>
            </div>
            <p className="font-nunito text-[#9E9E9E] text-sm mt-4">Sistema de gestão de brinquedos</p>
          </div>
        </div>
      </div>
      <div className="lg:hidden flex flex-col min-h-screen">
        <div className="bg-[#1565C0] h-[30vh] flex items-center justify-center">
          <div className="font-fredoka text-5xl leading-none text-center">
            <span className="text-white">Kid</span><span className="text-[#81C784]">Park</span>
          </div>
        </div>
        <div className="bg-white flex-1 px-6 py-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="text-[#212121] font-nunito font-semibold text-[15px] block mb-2">Usuário</label>
              <input type="text" value={form.username}
                onChange={e => { setForm({ ...form, username: e.target.value }); setError('') }}
                className="w-full h-11 rounded-lg px-4 border border-[#BDBDBD] font-nunito focus:outline-none focus:ring-2 focus:ring-[#1565C0]"
                disabled={isLoading}
              />
            </div>
            <div>
              <label className="text-[#212121] font-nunito font-semibold text-[15px] block mb-2">Senha</label>
              <div className="relative">
                <input type={showPass ? 'text' : 'password'} value={form.password}
                  onChange={e => { setForm({ ...form, password: e.target.value }); setError('') }}
                  className="w-full h-11 rounded-lg px-4 pr-12 border border-[#BDBDBD] font-nunito focus:outline-none focus:ring-2 focus:ring-[#1565C0]"
                  disabled={isLoading}
                />
                <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#757575]">
                  {showPass ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>
            {error && <p className="text-red-500 text-sm font-nunito text-center">{error}</p>}
            <button type="submit" disabled={isLoading}
              className="w-full h-12 bg-[#2E7D32] text-white font-nunito font-bold rounded-lg hover:brightness-90 disabled:opacity-60">
              {isLoading ? 'Entrando...' : 'Entrar'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
