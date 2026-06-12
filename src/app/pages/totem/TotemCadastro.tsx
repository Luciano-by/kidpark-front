// src/app/pages/totem/TotemCadastro.tsx
// Correções aplicadas:
//  1. import.meta.env substituído por const seguro (compatível com tsconfig strict)
//  2. disabled removido do ActionButton (controlado internamente pelo estado)

import { useState, useEffect }          from 'react'
import { useNavigate }                  from 'react-router'
import { Clock }                        from 'lucide-react'
import { Logo }                         from '../../components/kidpark/Logo'
import { ColoredFooter }                from '../../components/kidpark/ColoredFooter'
import { InputField, SelectField }      from '../../components/kidpark/InputField'
import { ActionButton }                 from '../../components/kidpark/ActionButton'
import { TimeSlot }                     from '../../components/kidpark/TimeSlot'

// ── URL da API — sem usar import.meta.env diretamente ────────
// O Vite substitui import.meta.env em tempo de build.
// Para evitar o erro ts(2339) em ambientes strict, usamos um cast seguro.
// const _env = (import.meta as Record<string, unknown>).env as Record<string, string> | undefined
// const BASE  = _env?.VITE_API_URL ?? 'http://localhost:3333/api'
const BASE = import.meta.env.VITE_API_URL ?? 'https://kidpark-api.vercel.app'

// ── Helper fetch sem autenticação ─────────────────────────────
async function totemFetch<T>(path: string, opts?: RequestInit): Promise<T> {
  const res  = await fetch(`${BASE}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...opts,
  })
  const body = await res.json()
  if (!res.ok) throw new Error(body.error ?? `Erro ${res.status}`)
  return body.data as T
}

// ── Tipos ─────────────────────────────────────────────────────
interface Toy {
  id:              string
  name:            string
  type:            string
  defaultMinutes:  number
  pricePerSession: number
}

const TYPE_EMOJI: Record<string, string> = {
  'pula-pula':  '🤸',
  piscina:      '⚽',
  escorregador: '🛝',
  giratório:    '🎡',
  balanço:      '⚖️',
  outro:        '🎠',
}
const toyEmoji = (t: Toy) => TYPE_EMOJI[t.type?.toLowerCase()] ?? '🎠'

// ── Horários disponíveis ──────────────────────────────────────
const SLOTS = Array.from({ length: 40 }, (_, i) => {
  const h = Math.floor(i / 4) + 10
  const m = (i % 4) * 15
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`
})

// ── Componente ────────────────────────────────────────────────
export function TotemCadastro() {
  const navigate = useNavigate()

  const [toys,       setToys]      = useState<Toy[]>([])
  const [loadToys,   setLoadToys]  = useState(true)
  const [submitting, setSubmit]    = useState(false)
  const [apiError,   setApiError]  = useState('')
  const [errors,     setErrors]    = useState<Record<string, string>>({})
  const [form, setForm] = useState({
    nomeResponsavel: '',
    nomeCrianca:     '',
    telefone:        '',
    toyId:           '',
    horario:         '',
  })

  // Carrega brinquedos da rota pública do totem
  useEffect(() => {
    totemFetch<Toy[]>('/totem/toys')
      .then(setToys)
      .catch(() => setApiError('Não foi possível carregar os brinquedos. Verifique se o servidor está rodando.'))
      .finally(() => setLoadToys(false))
  }, [])

  const formatPhone = (v: string) => {
    const n = v.replace(/\D/g, '')
    if (n.length <= 2) return n
    if (n.length <= 7) return `(${n.slice(0, 2)}) ${n.slice(2)}`
    return `(${n.slice(0, 2)}) ${n.slice(2, 7)}-${n.slice(7, 11)}`
  }

  const validate = () => {
    const e: Record<string, string> = {}
    if (!form.nomeResponsavel.trim())                      e.nomeResponsavel = 'Campo obrigatório'
    if (!form.nomeCrianca.trim())                          e.nomeCrianca     = 'Campo obrigatório'
    if (form.telefone.replace(/\D/g, '').length < 10)     e.telefone        = 'Telefone inválido'
    if (!form.toyId)                                       e.brinquedo       = 'Selecione um brinquedo'
    if (!form.horario)                                     e.horario         = 'Selecione um horário'
    return e
  }

  const handleSubmit = async () => {
    if (submitting) return
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }

    setSubmit(true)
    setApiError('')
    try {
      const session = await totemFetch<{ id: string; childName: string; toy: Toy }>(
        '/totem/register',
        {
          method: 'POST',
          body: JSON.stringify({
            childName:     form.nomeCrianca.trim(),
            parentName:    form.nomeResponsavel.trim(),
            phone:         form.telefone,
            toyId:         form.toyId,
            scheduledTime: form.horario,
            extraMinutes:  0,
          }),
        }
      )

      sessionStorage.setItem('totemSession', JSON.stringify({
        sessionId: session.id,
        childName: session.childName,
        toyName:   session.toy?.name ?? '',
        horario:   form.horario,
        phone:     form.telefone,
      }))

      navigate('/totem/aprovado')
    } catch (e) {
      setApiError(e instanceof Error ? e.message : 'Erro ao cadastrar. Tente novamente.')
    } finally {
      setSubmit(false)
    }
  }

  const selectedToy = toys.find(t => t.id === form.toyId)

  const toyOptions = [
    { value: '', label: 'Selecione um brinquedo' },
    ...toys.map(t => ({
      value: t.id,
      label: `${toyEmoji(t)} ${t.name} — ${t.defaultMinutes} min · R$ ${(t.pricePerSession / 100).toFixed(2).replace('.', ',')}`,
    })),
  ]

  return (
    <div className="w-[768px] h-[854px] bg-[#F5F5F5] relative mx-auto overflow-hidden">
      {/* Header */}
      <div className="bg-white px-5 py-5 flex justify-center shadow-sm">
        <Logo variant="full" size="md" />
      </div>

      {/* Título */}
      <div className="py-4 text-center">
        <h1 className="text-[#E53935] font-nunito font-extrabold text-[32px] tracking-wide">
          CADASTRO
        </h1>
        <p className="text-[#757575] font-nunito text-sm">
          Preencha os dados para iniciar a sessão
        </p>
      </div>

      {/* Erro de API */}
      {apiError && (
        <div className="mx-6 mb-3 bg-[#FFEBEE] border border-[#EF9A9A] rounded-xl px-4 py-2">
          <p className="font-nunito text-sm text-[#C62828] text-center">⚠️ {apiError}</p>
        </div>
      )}

      {loadToys ? (
        <div className="flex flex-col items-center justify-center h-64 gap-3">
          <div className="w-10 h-10 border-4 border-[#1565C0] border-t-transparent rounded-full animate-spin" />
          <p className="font-nunito text-sm text-[#757575]">Carregando brinquedos...</p>
        </div>
      ) : (
        <div className="flex gap-4 px-6 pb-20">
          {/* Coluna esquerda */}
          <div className="flex-[0.6] space-y-3">
            <InputField
              label="Nome do Responsável" required
              placeholder="Ex: João da Silva"
              value={form.nomeResponsavel}
              error={errors.nomeResponsavel}
              onChange={e => { setForm({ ...form, nomeResponsavel: e.target.value }); setErrors({ ...errors, nomeResponsavel: '' }) }}
            />
            <InputField
              label="Nome da Criança" required
              placeholder="Ex: Pedro Matta"
              value={form.nomeCrianca}
              error={errors.nomeCrianca}
              onChange={e => { setForm({ ...form, nomeCrianca: e.target.value }); setErrors({ ...errors, nomeCrianca: '' }) }}
            />
            <InputField
              label="Telefone para Contato" required
              placeholder="(11) 98765-4321" maxLength={15}
              value={form.telefone}
              error={errors.telefone}
              onChange={e => { setForm({ ...form, telefone: formatPhone(e.target.value) }); setErrors({ ...errors, telefone: '' }) }}
            />
            <SelectField
              label="Brinquedo" required
              options={toyOptions}
              value={form.toyId}
              error={errors.brinquedo}
              onChange={e => { setForm({ ...form, toyId: e.target.value, horario: '' }); setErrors({ ...errors, brinquedo: '' }) }}
            />

            {selectedToy && (
              <div className="bg-[#E3F2FD] rounded-xl p-3 flex items-center justify-between">
                <div>
                  <p className="font-nunito text-xs text-[#1565C0] font-bold uppercase">Resumo</p>
                  <p className="font-nunito font-bold text-[#212121]">
                    {selectedToy.defaultMinutes} min
                    {' · '}
                    R$ {(selectedToy.pricePerSession / 100).toFixed(2).replace('.', ',')}
                  </p>
                </div>
                <Clock className="w-5 h-5 text-[#1565C0]" />
              </div>
            )}

            {/* Botão — disabled tratado via estado interno, sem prop */}
            <ActionButton
              variant="confirmar"
              fullWidth
              onClick={submitting ? undefined : handleSubmit}
              className={`mt-3 h-[56px] text-xl ${submitting ? 'opacity-60 cursor-not-allowed' : ''}`}
            >
              {submitting ? 'Cadastrando...' : 'CONFIRMAR'}
            </ActionButton>
          </div>

          {/* Coluna direita — horários */}
          <div className="flex-[0.5]">
            <p className="text-[#1565C0] font-nunito font-semibold text-sm mb-3">
              Horário disponível
            </p>

            {!form.toyId ? (
              <div className="flex flex-col items-center py-10 text-[#BDBDBD] gap-2">
                <Clock className="w-10 h-10" />
                <p className="font-nunito text-xs text-center">Selecione um brinquedo</p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-4 gap-2 max-h-[430px] overflow-y-auto">
                  {SLOTS.map(h => (
                    <TimeSlot
                      key={h} time={h}
                      variant={form.horario === h ? 'selecionado' : 'disponivel'}
                      onClick={() => { setForm({ ...form, horario: h }); setErrors({ ...errors, horario: '' }) }}
                    />
                  ))}
                </div>
                {form.horario && (
                  <div className="mt-3 p-2 bg-[#E8F5E9] rounded-lg text-center">
                    <p className="font-nunito text-xs font-bold text-[#2E7D32]">
                      ✓ Horário selecionado: {form.horario}
                    </p>
                  </div>
                )}
              </>
            )}
            {errors.horario && (
              <p className="text-[#E53935] text-xs mt-1 font-nunito">{errors.horario}</p>
            )}
          </div>
        </div>
      )}

      <ColoredFooter />
    </div>
  )
}
