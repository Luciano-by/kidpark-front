// src/app/pages/Brinquedos.tsx
// Página exclusiva do GERENTE para gerenciar brinquedos.
// CRUD completo + visualização de ocupação por horário.

import { useState, useEffect, useCallback, useRef } from 'react'
import { createPortal } from 'react-dom'
import { Plus, Pencil, PowerOff, Power, Clock, Users, DollarSign, X, Check } from 'lucide-react'
import { AppSidebar }  from '../components/kidpark/AppSidebar'
import { AccessibilityBar } from '../components/kidpark/AccessibilityBar'
import { toysService } from '../../services'
import type { Toy }    from '../../services'

// ── Emojis por tipo ───────────────────────────────────────────
const TYPE_OPTIONS = [
  { value: 'pula-pula',    label: 'Pula Pula',          emoji: '🤸' },
  { value: 'piscina',      label: 'Piscina de Bolinhas', emoji: '⚽' },
  { value: 'escorregador', label: 'Tobogã / Escorregador', emoji: '🛝' },
  { value: 'giratório',    label: 'Gira-Gira',           emoji: '🎡' },
  { value: 'balanço',      label: 'Gangorra / Balanço',  emoji: '⚖️' },
  { value: 'outro',        label: 'Outro',               emoji: '🎠' },
]
const emojiFor = (type: string) => TYPE_OPTIONS.find(t => t.value === type)?.emoji ?? '🎠'

// ── Modal de criação / edição ─────────────────────────────────
interface FormData {
  name:            string
  type:            string
  emoji:           string
  maxCapacity:     number
  defaultMinutes:  number
  pricePerSession: number
}

const EMPTY_FORM: FormData = {
  name: '', type: 'outro', emoji: '🎠',
  maxCapacity: 1, defaultMinutes: 15, pricePerSession: 1600,
}

function ToyModal({
  toy,
  onClose,
  onSaved,
}: {
  toy?:    Toy
  onClose: () => void
  onSaved: () => void
}) {
  const isEdit = !!toy
  const [form,   setForm]   = useState<FormData>(toy ? {
    name:            toy.name,
    type:            toy.type,
    emoji:           toy.emoji ?? '🎠',
    maxCapacity:     toy.maxCapacity,
    defaultMinutes:  toy.defaultMinutes,
    pricePerSession: toy.pricePerSession,
  } : { ...EMPTY_FORM })
  const [saving, setSaving] = useState(false)
  const [error,  setError]  = useState('')

  const handleTypeChange = (type: string) => {
    const emoji = emojiFor(type)
    setForm(f => ({ ...f, type, emoji }))
  }

  const handleSubmit = async () => {
    if (!form.name.trim()) { setError('Nome é obrigatório'); return }
    if (form.maxCapacity < 1) { setError('Capacidade mínima é 1'); return }
    if (form.defaultMinutes < 5) { setError('Tempo mínimo é 5 minutos'); return }
    setSaving(true); setError('')
    try {
      const payload = {
        name:            form.name.trim(),
        type:            form.type,
        emoji:           form.emoji,
        maxCapacity:     Number(form.maxCapacity),
        defaultMinutes:  Number(form.defaultMinutes),
        pricePerSession: Math.round(Number(form.pricePerSession) * 100),
      }
      if (isEdit) {
        await toysService.update(toy.id, payload)
      } else {
        await toysService.create(payload)
      }
      onSaved()
      onClose()
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Erro ao salvar')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div
      role="dialog" aria-modal="true"
      aria-label={isEdit ? 'Editar brinquedo' : 'Novo brinquedo'}
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
    >
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg">
        <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-[#E0E0E0]">
          <h2 className="font-nunito font-bold text-xl text-[#212121]">
            {isEdit ? '✏️ Editar Brinquedo' : '➕ Novo Brinquedo'}
          </h2>
          <button onClick={onClose} aria-label="Fechar" className="p-1 rounded hover:bg-[#F5F5F5]">
            <X className="w-5 h-5 text-[#757575]" />
          </button>
        </div>

        <div className="px-6 py-5 space-y-4">
          {/* Nome */}
          <div>
            <label className="font-nunito text-sm font-semibold text-[#757575] block mb-1">
              Nome do brinquedo <span className="text-[#E53935]">*</span>
            </label>
            <input
              type="text" value={form.name}
              onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
              placeholder="Ex: Cama Elástica"
              className="w-full h-10 px-3 border border-[#E0E0E0] rounded-lg font-nunito text-sm focus:outline-none focus:ring-2 focus:ring-[#1565C0]"
            />
          </div>

          {/* Tipo */}
          <div>
            <label className="font-nunito text-sm font-semibold text-[#757575] block mb-1">Tipo</label>
            <select value={form.type} onChange={e => handleTypeChange(e.target.value)}
              className="w-full h-10 px-3 border border-[#E0E0E0] rounded-lg font-nunito text-sm focus:outline-none focus:ring-2 focus:ring-[#1565C0]">
              {TYPE_OPTIONS.map(t => (
                <option key={t.value} value={t.value}>{t.emoji} {t.label}</option>
              ))}
            </select>
          </div>

          {/* Capacidade + Tempo + Preço */}
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="font-nunito text-sm font-semibold text-[#757575] block mb-1">
                Capacidade máx. <span className="text-[#E53935]">*</span>
              </label>
              <div className="relative">
                <Users className="absolute left-2.5 top-2.5 w-4 h-4 text-[#9E9E9E]" aria-hidden="true" />
                <input type="number" min={1} max={20} value={form.maxCapacity}
                  onChange={e => setForm(f => ({ ...f, maxCapacity: Number(e.target.value) }))}
                  className="w-full h-10 pl-8 pr-2 border border-[#E0E0E0] rounded-lg font-nunito text-sm focus:outline-none focus:ring-2 focus:ring-[#1565C0]"
                />
              </div>
              <p className="text-[#9E9E9E] text-xs mt-1 font-nunito">crianças/horário</p>
            </div>
            <div>
              <label className="font-nunito text-sm font-semibold text-[#757575] block mb-1">Duração (min)</label>
              <div className="relative">
                <Clock className="absolute left-2.5 top-2.5 w-4 h-4 text-[#9E9E9E]" aria-hidden="true" />
                <input type="number" min={5} max={120} step={5} value={form.defaultMinutes}
                  onChange={e => setForm(f => ({ ...f, defaultMinutes: Number(e.target.value) }))}
                  className="w-full h-10 pl-8 pr-2 border border-[#E0E0E0] rounded-lg font-nunito text-sm focus:outline-none focus:ring-2 focus:ring-[#1565C0]"
                />
              </div>
            </div>
            <div>
              <label className="font-nunito text-sm font-semibold text-[#757575] block mb-1">Preço (R$)</label>
              <div className="relative">
                <DollarSign className="absolute left-2.5 top-2.5 w-4 h-4 text-[#9E9E9E]" aria-hidden="true" />
                <input type="number" min={0} step={0.50}
                  value={(form.pricePerSession / 100).toFixed(2)}
                  onChange={e => setForm(f => ({ ...f, pricePerSession: Math.round(Number(e.target.value) * 100) }))}
                  className="w-full h-10 pl-8 pr-2 border border-[#E0E0E0] rounded-lg font-nunito text-sm focus:outline-none focus:ring-2 focus:ring-[#1565C0]"
                />
              </div>
            </div>
          </div>

          {/* Preview */}
          <div className="bg-[#E3F2FD] rounded-xl p-3 flex items-center gap-3">
            <span className="text-3xl" aria-hidden="true">{form.emoji}</span>
            <div>
              <p className="font-nunito font-bold text-[#1565C0]">{form.name || 'Nome do brinquedo'}</p>
              <p className="font-nunito text-xs text-[#757575]">
                Até {form.maxCapacity} criança(s) · {form.defaultMinutes} min ·
                R$ {(form.pricePerSession / 100).toFixed(2).replace('.', ',')}
              </p>
            </div>
          </div>

          {error && (
            <p className="text-[#E53935] text-sm font-nunito bg-red-50 px-3 py-2 rounded-lg">⚠️ {error}</p>
          )}
        </div>

        <div className="px-6 pb-6 flex gap-2">
          <button onClick={onClose}
            className="flex-1 h-10 border border-[#E0E0E0] rounded-lg font-nunito font-semibold text-sm text-[#757575] hover:bg-[#F5F5F5]">
            Cancelar
          </button>
          <button onClick={handleSubmit} disabled={saving}
            className="flex-1 h-10 bg-[#2E7D32] text-white rounded-lg font-nunito font-bold text-sm hover:brightness-90 disabled:opacity-60 flex items-center justify-center gap-2">
            <Check className="w-4 h-4" aria-hidden="true" />
            {saving ? 'Salvando...' : isEdit ? 'Salvar Alterações' : 'Criar Brinquedo'}
          </button>
        </div>
      </div>
    </div>
  )
}

// ── Card de brinquedo ─────────────────────────────────────────

// ── Slots Popover ─────────────────────────────────────────────
// Renderizado via portal fixo — não afeta o layout do card pai

function SlotsPopover({
  toy,
  anchorRef,
  onClose,
}: {
  toy:       Toy
  anchorRef: React.RefObject<HTMLButtonElement | null>
  onClose:   () => void
}) {
  const [slots,     setSlots]     = useState<{ time: string; ocupado: number; capacidade: number; disponivel: boolean }[]>([])
  const [loading,   setLoading]   = useState(true)
  const [pos,       setPos]       = useState({ top: 0, left: 0, width: 300 })
  const popoverRef = useRef<HTMLDivElement>(null)

  // Posiciona o popover abaixo do botão âncora
  useEffect(() => {
    const btn = anchorRef.current
    if (!btn) return
    const rect = btn.getBoundingClientRect()
    const popW = 320
    let left   = rect.left
    // Não sair da tela pela direita
    if (left + popW > window.innerWidth - 16) {
      left = window.innerWidth - popW - 16
    }
    setPos({ top: rect.bottom + 8, left, width: popW })
  }, [anchorRef])

  // Carrega slots
  useEffect(() => {
    toysService.getSlots(toy.id)
      .then(setSlots)
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [toy.id])

  // Fecha ao clicar fora ou Escape
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    const handleClick = (e: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(e.target as Node) &&
          anchorRef.current && !anchorRef.current.contains(e.target as Node)) {
        onClose()
      }
    }
    document.addEventListener('keydown', handleKey)
    document.addEventListener('mousedown', handleClick)
    return () => {
      document.removeEventListener('keydown', handleKey)
      document.removeEventListener('mousedown', handleClick)
    }
  }, [onClose, anchorRef])

  return createPortal(
    <div
      ref={popoverRef}
      role="dialog"
      aria-label={`Horários de ${toy.name}`}
      style={{ position: 'fixed', top: pos.top, left: pos.left, width: pos.width, zIndex: 9999 }}
      className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-[#E0E0E0] overflow-hidden"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-[#E0E0E0]">
        <div className="flex items-center gap-2">
          <span className="text-xl" aria-hidden="true">{toy.emoji ?? '🎠'}</span>
          <div>
            <p className="font-nunito font-bold text-sm text-[#212121]">{toy.name}</p>
            <p className="font-nunito text-[10px] text-[#9E9E9E]">Ocupação de hoje</p>
          </div>
        </div>
        <button
          onClick={onClose}
          aria-label="Fechar painel de horários"
          className="p-1 rounded-lg hover:bg-[#F5F5F5] text-[#757575]"
        >
          <X className="w-4 h-4" aria-hidden="true" />
        </button>
      </div>

      {/* Slots */}
      <div className="px-3 py-3 max-h-72 overflow-y-auto">
        {loading ? (
          <div className="flex justify-center items-center h-24">
            <div className="w-6 h-6 border-2 border-[#1565C0] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <div className="grid grid-cols-4 gap-1.5">
            {slots.map(s => (
              <div
                key={s.time}
                title={`${s.time} — ${s.ocupado}/${s.capacidade}`}
                className={`rounded-lg px-1.5 py-1.5 text-center ${
                  !s.disponivel
                    ? 'bg-[#FFEBEE] border border-[#EF9A9A]'
                    : s.ocupado > 0
                      ? 'bg-[#FFF8E1] border border-[#FFE082]'
                      : 'bg-[#E8F5E9] border border-[#A5D6A7]'
                }`}
              >
                <p className="font-mono text-[10px] font-bold text-[#212121]">{s.time}</p>
                <p className="font-nunito text-[9px] text-[#757575]">{s.ocupado}/{s.capacidade}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Legenda */}
      <div className="flex gap-3 px-3 py-2 border-t border-[#E0E0E0] bg-[#FAFAFA]">
        {[
          { color: 'bg-[#E8F5E9] border-[#A5D6A7]', label: 'Livre'   },
          { color: 'bg-[#FFF8E1] border-[#FFE082]', label: 'Parcial' },
          { color: 'bg-[#FFEBEE] border-[#EF9A9A]', label: 'Cheio'   },
        ].map(l => (
          <span key={l.label} className="flex items-center gap-1 text-[9px] font-nunito text-[#757575]">
            <span className={`w-2 h-2 rounded-sm border inline-block ${l.color}`} />
            {l.label}
          </span>
        ))}
      </div>
    </div>,
    document.body
  )
}

// ── ToyCard ───────────────────────────────────────────────────
function ToyCard({
  toy,
  onEdit,
  onToggle,
}: {
  toy:      Toy
  onEdit:   () => void
  onToggle: () => void
}) {
  const [showSlots, setShowSlots] = useState(false)
  const [loadSlots, setLoadSlots] = useState(false)
  const btnRef = useRef<HTMLButtonElement>(null)

  const handleSlotsClick = async () => {
    if (showSlots) { setShowSlots(false); return }
    setLoadSlots(true)
    // Pequeno delay para garantir que o popover será posicionado após o browser pintar
    await new Promise(r => setTimeout(r, 50))
    setLoadSlots(false)
    setShowSlots(true)
  }

  return (
    <div className={`bg-white rounded-xl shadow-sm border-l-4 ${
      toy.isActive ? 'border-[#2E7D32]' : 'border-[#9E9E9E] opacity-70'
    }`}>
      <div className="p-4">
        {/* Cabeçalho */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <span className="text-3xl flex-shrink-0" aria-hidden="true">{toy.emoji ?? '🎠'}</span>
            <div className="min-w-0">
              <h3 className="font-nunito font-extrabold text-[#212121] text-base truncate">{toy.name}</h3>
              <p className="font-nunito text-xs text-[#757575] capitalize">{toy.type}</p>
            </div>
          </div>
          <span className={`px-2 py-0.5 rounded-full text-xs font-nunito font-bold flex-shrink-0 ${
            toy.isActive ? 'bg-[#E8F5E9] text-[#2E7D32]' : 'bg-[#F5F5F5] text-[#9E9E9E]'
          }`}>
            {toy.isActive ? 'Ativo' : 'Inativo'}
          </span>
        </div>

        {/* Métricas */}
        <div className="grid grid-cols-3 gap-2 mt-4">
          <div className="bg-[#F5F5F5] rounded-lg p-2 text-center">
            <Users className="w-4 h-4 text-[#1565C0] mx-auto mb-1" aria-hidden="true" />
            <p className="font-nunito font-bold text-[#212121] text-sm">{toy.maxCapacity}</p>
            <p className="font-nunito text-[10px] text-[#9E9E9E]">máx/horário</p>
          </div>
          <div className="bg-[#F5F5F5] rounded-lg p-2 text-center">
            <Clock className="w-4 h-4 text-[#E65100] mx-auto mb-1" aria-hidden="true" />
            <p className="font-nunito font-bold text-[#212121] text-sm">{toy.defaultMinutes} min</p>
            <p className="font-nunito text-[10px] text-[#9E9E9E]">duração</p>
          </div>
          <div className="bg-[#F5F5F5] rounded-lg p-2 text-center">
            <DollarSign className="w-4 h-4 text-[#2E7D32] mx-auto mb-1" aria-hidden="true" />
            <p className="font-nunito font-bold text-[#212121] text-sm">
              R$ {(toy.pricePerSession / 100).toFixed(2).replace('.', ',')}
            </p>
            <p className="font-nunito text-[10px] text-[#9E9E9E]">por sessão</p>
          </div>
        </div>

        {/* Ações */}
        <div className="flex gap-2 mt-4">
          <button onClick={onEdit}
            aria-label={`Editar ${toy.name}`}
            className="flex-1 h-9 flex items-center justify-center gap-1 border border-[#1565C0] text-[#1565C0] rounded-lg font-nunito font-semibold text-xs hover:bg-[#E3F2FD] transition-colors">
            <Pencil className="w-3.5 h-3.5" aria-hidden="true" /> Editar
          </button>
          <button onClick={onToggle}
            aria-label={toy.isActive ? `Desativar ${toy.name}` : `Reativar ${toy.name}`}
            className={`flex-1 h-9 flex items-center justify-center gap-1 rounded-lg font-nunito font-semibold text-xs transition-colors ${
              toy.isActive
                ? 'border border-[#E53935] text-[#E53935] hover:bg-red-50'
                : 'border border-[#2E7D32] text-[#2E7D32] hover:bg-green-50'
            }`}>
            {toy.isActive
              ? <><PowerOff className="w-3.5 h-3.5" aria-hidden="true" /> Desativar</>
              : <><Power    className="w-3.5 h-3.5" aria-hidden="true" /> Reativar</>}
          </button>
          {/* Botão horários — âncora do popover */}
          <button
            ref={btnRef}
            onClick={handleSlotsClick}
            aria-label={`Ver horários de ${toy.name}`}
            aria-expanded={showSlots}
            title="Ver ocupação de horários"
            className={`h-9 px-3 flex items-center justify-center border rounded-lg transition-colors ${
              showSlots
                ? 'bg-[#1565C0] border-[#1565C0] text-white'
                : 'border-[#E0E0E0] text-[#757575] hover:bg-[#F5F5F5]'
            }`}
          >
            {loadSlots
              ? <div className="w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-full animate-spin" />
              : <Clock className="w-3.5 h-3.5" aria-hidden="true" />}
          </button>
        </div>
      </div>

      {/* Popover flutuante — renderizado no document.body via portal */}
      {showSlots && (
        <SlotsPopover
          toy={toy}
          anchorRef={btnRef}
          onClose={() => setShowSlots(false)}
        />
      )}
    </div>
  )
}

// ── Página principal ──────────────────────────────────────────
export function Brinquedos() {
  const [toys,    setToys]   = useState<Toy[]>([])
  const [loading, setLoading] = useState(true)
  const [modal,   setModal]  = useState<'new' | Toy | null>(null)
  const [filter,  setFilter] = useState<'todos' | 'ativos' | 'inativos'>('todos')
  const [search,  setSearch] = useState('')

  const fetchToys = useCallback(async () => {
    setLoading(true)
    try   { setToys(await toysService.getAll()) }
    catch { /* silencioso */ }
    finally { setLoading(false) }
  }, [])

  useEffect(() => { fetchToys() }, [fetchToys])

  const handleToggle = async (toy: Toy) => {
    if (!confirm(`${toy.isActive ? 'Desativar' : 'Reativar'} "${toy.name}"?`)) return
    try {
      toy.isActive
        ? await toysService.remove(toy.id)
        : await toysService.reativar(toy.id)
      await fetchToys()
    } catch (e) {
      alert(e instanceof Error ? e.message : 'Erro ao alterar status')
    }
  }

  const filtered = toys
    .filter(t => filter === 'todos' ? true : filter === 'ativos' ? t.isActive : !t.isActive)
    .filter(t => !search || t.name.toLowerCase().includes(search.toLowerCase()))

  const stats = {
    total:   toys.length,
    ativos:  toys.filter(t =>  t.isActive).length,
    inativos: toys.filter(t => !t.isActive).length,
  }

  return (
    <div className="flex h-screen bg-[#F5F5F5] overflow-hidden">
      <AppSidebar />

      <div className="flex-1 flex flex-col min-w-0">
      <AccessibilityBar />     {/* ← adicionar esta linha */}
        {/* Header */}
        <div className="bg-white border-b border-[#E0E0E0] h-14 flex items-center justify-between px-6 flex-shrink-0">
          <h1 className="font-nunito font-extrabold text-xl text-[#212121]">
            🎡 Brinquedos
          </h1>
          <button
            onClick={() => setModal('new')}
            aria-label="Criar novo brinquedo"
            className="flex items-center gap-2 px-4 py-2 bg-[#2E7D32] text-white rounded-lg font-nunito font-bold text-sm hover:brightness-90 transition-all"
          >
            <Plus className="w-4 h-4" aria-hidden="true" /> Novo Brinquedo
          </button>
        </div>

        <div className="flex-1 overflow-auto p-6" id="main-content">
          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            {[
              { label: 'Total',    value: stats.total,    color: '#1565C0', bg: '#E3F2FD' },
              { label: 'Ativos',   value: stats.ativos,   color: '#2E7D32', bg: '#E8F5E9' },
              { label: 'Inativos', value: stats.inativos, color: '#757575', bg: '#F5F5F5' },
            ].map(s => (
              <div key={s.label} className="bg-white rounded-xl shadow-sm p-4 flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: s.bg }}>
                  <span className="font-nunito font-bold text-lg" style={{ color: s.color }}>{s.value}</span>
                </div>
                <span className="font-nunito text-sm text-[#757575] font-semibold">{s.label}</span>
              </div>
            ))}
          </div>

          {/* Filtros e busca */}
          <div className="flex gap-3 mb-4 flex-wrap">
            <input
              type="search" value={search} placeholder="Buscar brinquedo..."
              onChange={e => setSearch(e.target.value)}
              aria-label="Buscar brinquedo"
              className="h-9 px-3 border border-[#E0E0E0] rounded-lg font-nunito text-sm focus:outline-none focus:ring-2 focus:ring-[#1565C0] w-48"
            />
            {(['todos', 'ativos', 'inativos'] as const).map(f => (
              <button key={f} onClick={() => setFilter(f)}
                aria-pressed={filter === f}
                className={`px-4 py-1.5 rounded-full font-nunito font-semibold text-sm capitalize transition-all ${
                  filter === f ? 'bg-[#1565C0] text-white' : 'bg-white border border-[#E0E0E0] text-[#757575] hover:bg-[#F5F5F5]'
                }`}>
                {f}
              </button>
            ))}
          </div>

          {/* Grid de cards */}
          {loading ? (
            <div className="flex justify-center items-center h-48">
              <div className="w-10 h-10 border-4 border-[#1565C0] border-t-transparent rounded-full animate-spin" />
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-48 text-[#9E9E9E]">
              <span className="text-5xl mb-3">🎠</span>
              <p className="font-nunito font-semibold">
                {search ? 'Nenhum brinquedo encontrado' : 'Nenhum brinquedo cadastrado ainda'}
              </p>
              {!search && (
                <button onClick={() => setModal('new')}
                  className="mt-3 px-4 py-2 bg-[#2E7D32] text-white rounded-lg font-nunito font-bold text-sm hover:brightness-90">
                  Cadastrar primeiro brinquedo
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filtered.map(toy => (
                <ToyCard
                  key={toy.id}
                  toy={toy}
                  onEdit={() => setModal(toy)}
                  onToggle={() => handleToggle(toy)}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      {modal && (
        <ToyModal
          toy={modal === 'new' ? undefined : modal}
          onClose={() => setModal(null)}
          onSaved={fetchToys}
        />
      )}
    </div>
  )
}
