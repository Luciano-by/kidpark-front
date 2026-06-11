// src/app/pages/Cadastro.tsx
import { useState, useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router'
import { ArrowLeft, Clock, CheckCircle2 } from 'lucide-react'
import { Logo }         from '../components/kidpark/Logo'
import { AppSidebar }   from '../components/kidpark/AppSidebar'
import { AccessibilityBar } from '../components/kidpark/AccessibilityBar'
import { InputField, SelectField } from '../components/kidpark/InputField'
import { ActionButton } from '../components/kidpark/ActionButton'
import { TimeSlot }     from '../components/kidpark/TimeSlot'
import { Switch }       from '../components/ui/switch'
import { toysService, childrenService } from '../../services'
import type { Toy }     from '../../services'

const TYPE_EMOJI: Record<string, string> = {
  'pula-pula': '🤸', piscina: '⚽', escorregador: '🛝',
  giratório: '🎡', balanço: '⚖️', outro: '🎠',
}
const toyEmoji = (t: Toy) => TYPE_EMOJI[t.type?.toLowerCase()] ?? '🎠'

const SLOTS = Array.from({ length: 40 }, (_, i) => {
  const h = Math.floor(i / 4) + 10
  const m = (i % 4) * 15
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`
})

export function Cadastro() {
  const navigate = useNavigate()
  const [toys,        setToys]        = useState<Toy[]>([])
  const [loadingToys, setLoadingToys] = useState(true)
  const [submitting,  setSubmitting]  = useState(false)
  const [success,     setSuccess]     = useState(false)
  const [apiError,    setApiError]    = useState('')
  const [errors,      setErrors]      = useState<Record<string, string>>({})
  const [form, setForm] = useState({
    nomeResponsavel: '', nomeCrianca: '', telefone: '',
    toyId: '', horario: '', tempoExtra: false, notes: '',
  })

  const selectedToy = useMemo(() => toys.find(t => t.id === form.toyId) ?? null, [toys, form.toyId])

  useEffect(() => {
    toysService.getAll()
      .then(d => setToys(d.filter(t => t.isActive)))
      .catch(() => setApiError('Erro ao carregar brinquedos. API está rodando?'))
      .finally(() => setLoadingToys(false))
  }, [])

  const formatPhone = (v: string) => {
    const n = v.replace(/\D/g, '')
    if (n.length <= 2)  return n
    if (n.length <= 7)  return `(${n.slice(0, 2)}) ${n.slice(2)}`
    return `(${n.slice(0, 2)}) ${n.slice(2, 7)}-${n.slice(7, 11)}`
  }

  const validate = () => {
    const e: Record<string, string> = {}
    if (!form.nomeResponsavel.trim()) e.nomeResponsavel = 'Campo obrigatório'
    if (!form.nomeCrianca.trim())     e.nomeCrianca     = 'Campo obrigatório'
    if (form.telefone.replace(/\D/g, '').length < 10) e.telefone = 'Telefone inválido'
    if (!form.toyId)                  e.brinquedo       = 'Selecione um brinquedo'
    if (!form.horario)                e.horario         = 'Selecione um horário'
    return e
  }

  const handleSubmit = async () => {
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }
    setSubmitting(true); setApiError('')
    try {
      await childrenService.create({
        childName:     form.nomeCrianca.trim(),
        parentName:    form.nomeResponsavel.trim(),
        phone:         form.telefone,
        toyId:         form.toyId,
        scheduledTime: form.horario,
        extraMinutes:  form.tempoExtra ? 15 : 0,
        notes:         form.notes || undefined,
      })
      setSuccess(true)
      setTimeout(() => {
        setSuccess(false)
        setForm({ nomeResponsavel: '', nomeCrianca: '', telefone: '', toyId: '', horario: '', tempoExtra: false, notes: '' })
        navigate('/dashboard')
      }, 2000)
    } catch (e) {
      setApiError(e instanceof Error ? e.message : 'Erro ao cadastrar')
    } finally {
      setSubmitting(false)
    }
  }

  const toyOptions = [
    { value: '', label: 'Selecione um brinquedo' },
    ...toys.map(t => ({ value: t.id, label: `${toyEmoji(t)} ${t.name} (${t.defaultMinutes} min)` })),
  ]

  const precoTotal = selectedToy
    ? Math.round((selectedToy.pricePerSession / selectedToy.defaultMinutes) * (selectedToy.defaultMinutes + (form.tempoExtra ? 15 : 0)))
    : 0

  return (
    <div className="flex h-screen bg-[#F5F5F5] overflow-hidden">
      {/* ← sidebar compartilhada, sem prop expanded (usa collapsed por padrão) */}
      <AppSidebar />

      <div className="flex-1 flex flex-col min-w-0">
        <AccessibilityBar />     {/* ← adicionar esta linha */}
        <div className="bg-white border-b border-[#E0E0E0] h-14 flex items-center px-4 gap-3 flex-shrink-0">
          <button onClick={() => navigate('/dashboard')} className="flex items-center gap-1 text-[#1565C0] hover:opacity-70">
            <ArrowLeft className="w-5 h-5" />
            <span className="font-nunito font-semibold text-sm">Dashboard</span>
          </button>
          <div className="h-5 w-px bg-[#E0E0E0]" />
          <Logo variant="full" size="sm" />
          <span className="font-nunito font-bold text-[#E53935] text-lg ml-2">CADASTRO</span>
        </div>

        {success && (
          <div className="mx-6 mt-4 bg-[#E8F5E9] border border-[#A5D6A7] rounded-xl px-4 py-3 flex items-center gap-3">
            <CheckCircle2 className="w-6 h-6 text-[#2E7D32]" />
            <div>
              <p className="font-nunito font-bold text-[#2E7D32]">Cadastro realizado com sucesso!</p>
              <p className="font-nunito text-sm text-[#388E3C]">Redirecionando para o dashboard...</p>
            </div>
          </div>
        )}
        {apiError && (
          <div className="mx-6 mt-4 bg-[#FFEBEE] border border-[#EF9A9A] rounded-xl px-4 py-3">
            <p className="font-nunito text-sm text-[#C62828]">⚠️ {apiError}</p>
          </div>
        )}

        <div className="flex-1 overflow-auto p-6">
          <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-sm p-6">
            {loadingToys ? (
              <div className="flex flex-col items-center py-16 gap-3">
                <div className="w-10 h-10 border-4 border-[#1565C0] border-t-transparent rounded-full animate-spin" />
                <p className="font-nunito text-sm text-[#757575]">Carregando brinquedos...</p>
              </div>
            ) : (
              <div className="flex gap-8">
                <div className="flex-[0.6] space-y-4">
                  <InputField label="Nome do Responsável" required placeholder="Ex: João da Silva"
                    value={form.nomeResponsavel} error={errors.nomeResponsavel}
                    onChange={e => { setForm({ ...form, nomeResponsavel: e.target.value }); setErrors({ ...errors, nomeResponsavel: '' }) }}
                  />
                  <InputField label="Nome da Criança" required placeholder="Ex: Pedro Matta"
                    value={form.nomeCrianca} error={errors.nomeCrianca}
                    onChange={e => { setForm({ ...form, nomeCrianca: e.target.value }); setErrors({ ...errors, nomeCrianca: '' }) }}
                  />
                  <InputField label="Telefone" required placeholder="(11) 98765-4321" maxLength={15}
                    value={form.telefone} error={errors.telefone}
                    onChange={e => { setForm({ ...form, telefone: formatPhone(e.target.value) }); setErrors({ ...errors, telefone: '' }) }}
                  />
                  <SelectField label="Brinquedo" required options={toyOptions}
                    value={form.toyId} error={errors.brinquedo}
                    onChange={e => { setForm({ ...form, toyId: e.target.value, horario: '' }); setErrors({ ...errors, brinquedo: '' }) }}
                  />
                  {selectedToy && (
                    <div className="bg-[#E3F2FD] rounded-xl p-3 flex justify-between items-center">
                      <div>
                        <p className="font-nunito text-xs text-[#1565C0] font-bold uppercase">Resumo</p>
                        <p className="font-nunito font-bold text-[#212121]">
                          {selectedToy.defaultMinutes + (form.tempoExtra ? 15 : 0)} min
                          {' · '}R$ {(precoTotal / 100).toFixed(2).replace('.', ',')}
                        </p>
                      </div>
                      <Clock className="w-5 h-5 text-[#1565C0]" />
                    </div>
                  )}
                  <div className="flex items-center justify-between pt-1">
                    <div>
                      <p className="text-[#424242] font-nunito text-sm font-semibold">Adicionar mais 15 minutos?</p>
                      {selectedToy && (
                        <p className="text-[#757575] font-nunito text-xs">
                          + R$ {(Math.round(selectedToy.pricePerSession / selectedToy.defaultMinutes * 15) / 100).toFixed(2).replace('.', ',')}
                        </p>
                      )}
                    </div>
                    <Switch checked={form.tempoExtra} onCheckedChange={v => setForm({ ...form, tempoExtra: v })} />
                  </div>
                  <div>
                    <label className="text-[#424242] font-nunito text-sm font-semibold block mb-1">
                      Observações <span className="text-[#9E9E9E] font-normal">(opcional)</span>
                    </label>
                    <textarea rows={2} placeholder="Informações adicionais..."
                      value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })}
                      className="w-full px-3 py-2 border border-[#E0E0E0] rounded-lg font-nunito text-sm resize-none focus:outline-none focus:ring-2 focus:ring-[#1565C0]"
                    />
                  </div>
                  <ActionButton variant="confirmar" fullWidth onClick={handleSubmit}
                    className="mt-2 h-[52px] text-lg" disabled={submitting || success}
                  >
                    {submitting ? 'Cadastrando...' : 'CONFIRMAR CADASTRO'}
                  </ActionButton>
                </div>

                <div className="flex-[0.4]">
                  <p className="text-[#1565C0] font-nunito font-semibold text-sm mb-3">Horário disponível</p>
                  {!form.toyId ? (
                    <div className="flex flex-col items-center py-8 text-[#BDBDBD]">
                      <Clock className="w-8 h-8 mb-2" />
                      <p className="font-nunito text-xs text-center">Selecione um brinquedo</p>
                    </div>
                  ) : (
                    <>
                      <div className="grid grid-cols-2 gap-2 max-h-[420px] overflow-y-auto pr-1">
                        {SLOTS.map(h => (
                          <TimeSlot key={h} time={h}
                            variant={form.horario === h ? 'selecionado' : 'disponivel'}
                            onClick={() => { setForm({ ...form, horario: h }); setErrors({ ...errors, horario: '' }) }}
                          />
                        ))}
                      </div>
                      {form.horario && (
                        <div className="mt-3 p-2 bg-[#E8F5E9] rounded-lg text-center">
                          <p className="font-nunito text-xs font-bold text-[#2E7D32]">✓ {form.horario}</p>
                        </div>
                      )}
                    </>
                  )}
                  {errors.horario && <p className="text-[#E53935] text-xs mt-2 font-nunito">{errors.horario}</p>}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
