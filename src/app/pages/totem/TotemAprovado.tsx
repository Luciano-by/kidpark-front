// src/app/pages/totem/TotemAprovado.tsx
// Tela de confirmação após o cadastro no totem.
// Lê os dados da sessão criada no banco via sessionStorage.

import { useEffect, useState } from 'react'
import { useNavigate }         from 'react-router'
import { CheckCircle2 }        from 'lucide-react'
import { Logo }                from '../../components/kidpark/Logo'
import { ColoredFooter }       from '../../components/kidpark/ColoredFooter'
import { ActionButton }        from '../../components/kidpark/ActionButton'

interface SessionData {
  sessionId: string
  childName: string
  toyName:   string
  horario:   string
  phone:     string
}

export function TotemAprovado() {
  const navigate = useNavigate()
  const [session, setSession] = useState<SessionData | null>(null)

  useEffect(() => {
    const raw = sessionStorage.getItem('totemSession')
    if (raw) {
      setSession(JSON.parse(raw))
    }

    // Volta ao início automaticamente após 15 segundos
    const timer = setTimeout(() => {
      sessionStorage.removeItem('totemSession')
      navigate('/')
    }, 15_000)

    return () => clearTimeout(timer)
  }, [navigate])

  const handleNovo = () => {
    sessionStorage.removeItem('totemSession')
    navigate('/')
  }

  return (
    <div className="w-[768px] h-[854px] bg-[#F5F5F5] relative mx-auto overflow-hidden flex flex-col">
      {/* Header */}
      <div className="bg-white px-5 py-5 flex justify-center shadow-sm">
        <Logo variant="full" size="md" />
      </div>

      {/* Conteúdo */}
      <div className="flex-1 flex flex-col items-center justify-center px-8 gap-6">
        {/* Ícone de sucesso */}
        <div className="w-24 h-24 rounded-full bg-[#E8F5E9] flex items-center justify-center">
          <CheckCircle2 className="w-14 h-14 text-[#2E7D32]" />
        </div>

        <div className="text-center">
          <h1 className="font-nunito font-extrabold text-[36px] text-[#2E7D32]">
            Cadastro Realizado!
          </h1>
          <p className="font-nunito text-[#757575] text-lg mt-1">
            Aguarde ser chamado pelo atendente.
          </p>
        </div>

        {/* Card com dados da sessão */}
        {session && (
          <div className="bg-white rounded-2xl shadow-md p-6 w-full max-w-md space-y-3">
            <div className="flex justify-between">
              <span className="font-nunito text-sm text-[#757575] font-semibold">Criança</span>
              <span className="font-nunito text-sm font-bold text-[#212121]">{session.childName}</span>
            </div>
            <div className="h-px bg-[#F0F0F0]" />
            <div className="flex justify-between">
              <span className="font-nunito text-sm text-[#757575] font-semibold">Brinquedo</span>
              <span className="font-nunito text-sm font-bold text-[#212121]">{session.toyName}</span>
            </div>
            <div className="h-px bg-[#F0F0F0]" />
            <div className="flex justify-between">
              <span className="font-nunito text-sm text-[#757575] font-semibold">Horário</span>
              <span className="font-nunito text-sm font-bold text-[#1565C0]">{session.horario}</span>
            </div>
            <div className="h-px bg-[#F0F0F0]" />
            <div className="flex justify-between">
              <span className="font-nunito text-sm text-[#757575] font-semibold">Protocolo</span>
              <span className="font-mono text-xs text-[#9E9E9E]">{session.sessionId.slice(0, 8).toUpperCase()}</span>
            </div>
          </div>
        )}

        <p className="font-nunito text-xs text-[#9E9E9E]">
          Esta tela voltará ao início em 15 segundos.
        </p>

        <ActionButton variant="confirmar" onClick={handleNovo} className="w-48 h-12">
          Novo Cadastro
        </ActionButton>
      </div>

      <ColoredFooter />
    </div>
  )
}
