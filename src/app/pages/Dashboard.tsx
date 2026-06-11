// src/app/pages/Dashboard.tsx
import { useState, useEffect, useRef, useCallback } from 'react'
import { RefreshCw } from 'lucide-react'
import { Logo }             from '../components/kidpark/Logo'
import { AppSidebar }       from '../components/kidpark/AppSidebar'
import { AccessibilityBar } from '../components/kidpark/AccessibilityBar'
import { NotificationPill } from '../components/kidpark/NotificationPill'
import { ChildCardCompact, ChildCardExpanded } from '../components/kidpark/ChildCard'
import type { ChildData }   from '../components/kidpark/ChildCard'
import { childrenService }  from '../../services'
import type { ChildSession } from '../../services'

const TYPE_EMOJI: Record<string, string> = {
  'pula-pula': '🤸', piscina: '⚽', escorregador: '🛝',
  giratório: '🎡', balanço: '⚖️', outro: '🎠',
}

// Timer global em memória (persiste entre re-renders, limpo ao encerrar sessão)
const TIMERS = new Map<string, number>()

function toChildData(s: ChildSession): ChildData {
  const totalSec = s.durationMinutes * 60
  if (!TIMERS.has(s.id)) {
    let remaining = totalSec
    if (s.status === 'ACTIVE' && s.startedAt) {
      const elapsed = Math.floor((Date.now() - new Date(s.startedAt).getTime()) / 1000)
      remaining = Math.max(0, totalSec - elapsed)
    }
    TIMERS.set(s.id, remaining)
  }
  const emoji = TYPE_EMOJI[s.toy?.type?.toLowerCase()] ?? '🎠'
  return {
    id:            s.id,
    childName:     s.childName,
    parentName:    s.parentName,
    phone:         s.phone,
    toy:           `${emoji} ${s.toy?.name ?? ''}`.toUpperCase(),
    timeRemaining: TIMERS.get(s.id) ?? totalSec,
    totalTime:     totalSec,
    isPaused:      s.isPaused,
    paymentStatus: s.paymentStatus === 'PAID' ? 'pago' : 'pendente',
    paymentValue:  s.amountCents / 100,
  }
}

export function Dashboard() {
  const [expanded, setExpanded] = useState(false)
  const [filter,   setFilter]   = useState('todos')
  const [children, setChildren] = useState<ChildData[]>([])
  const [loading,  setLoading]  = useState(true)
  const [lastSync, setLastSync] = useState<Date | null>(null)
  const syncRef     = useRef<number | null>(null)
  const rafRef      = useRef<number | null>(null)
  const lastTickRef = useRef<number>(Date.now())

  const fetchActive = useCallback(async () => {
    try {
      const data = await childrenService.getActive()
      const ids = new Set(data.map(s => s.id))
      TIMERS.forEach((_, id) => { if (!ids.has(id)) TIMERS.delete(id) })
      setChildren(data.map(toChildData))
      setLastSync(new Date())
    } catch (e) { console.error('[Dashboard]', e) }
    finally { setLoading(false) }
  }, [])

  useEffect(() => {
    fetchActive()
    syncRef.current = window.setInterval(fetchActive, 30_000)
    return () => { if (syncRef.current) clearInterval(syncRef.current) }
  }, [fetchActive])

  useEffect(() => {
    const tick = () => {
      const now     = Date.now()
      const elapsed = Math.floor((now - lastTickRef.current) / 1000)
      if (elapsed >= 1) {
        lastTickRef.current = now - ((now - lastTickRef.current) % 1000)
        setChildren(prev => prev.map(c => {
          if (c.isPaused || c.timeRemaining <= 0) return c
          const next = Math.max(0, c.timeRemaining - elapsed)
          TIMERS.set(c.id, next)
          if (next === 0 && c.timeRemaining > 0) {
            childrenService.tick(c.id, 0).catch(() => {})
          }
          return { ...c, timeRemaining: next }
        }))
      }
      rafRef.current = requestAnimationFrame(tick)
    }
    rafRef.current = requestAnimationFrame(tick)
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current) }
  }, [])

  const handlePause    = async (child: ChildData) => {
    try { await childrenService.pause(child.id); setChildren(prev => prev.map(c => c.id === child.id ? { ...c, isPaused: !c.isPaused } : c)) }
    catch { fetchActive() }
  }
  const handleEnd      = async (child: ChildData) => {
    try { await childrenService.end(child.id); TIMERS.delete(child.id); setChildren(prev => prev.filter(c => c.id !== child.id)) }
    catch { fetchActive() }
  }
  const handleAddTime  = async (child: ChildData) => {
    try {
      await childrenService.addTime(child.id, 5)
      const nr = (TIMERS.get(child.id) ?? 0) + 300
      TIMERS.set(child.id, nr)
      setChildren(prev => prev.map(c => c.id === child.id ? { ...c, timeRemaining: nr, totalTime: c.totalTime + 300 } : c))
    } catch { fetchActive() }
  }
  const handleWhatsApp = (child: ChildData) =>
    window.open(`https://wa.me/55${child.phone.replace(/\D/g, '')}`, '_blank')

  const filtered = filter === 'todos' ? children : children.filter(c => {
    const t = c.toy.toLowerCase()
    if (filter === 'cama-elastica') return t.includes('cama')
    if (filter === 'piscina')       return t.includes('piscina')
    if (filter === 'toboga')        return t.includes('tobog')
    return true
  })

  const critical = children.filter(c => c.timeRemaining <= 0 && !c.isPaused)
  const actions  = (child: ChildData) => ({
    onWhatsApp: () => handleWhatsApp(child),
    onPause:    () => handlePause(child),
    onEnd:      () => handleEnd(child),
    onAddTime:  () => handleAddTime(child),
  })

  const filterBtn = (id: string, label: string) => (
    <button key={id} onClick={() => setFilter(id)}
      className={`px-4 py-2 rounded-full font-nunito font-semibold text-sm whitespace-nowrap transition-all ${
        filter === id ? 'bg-[#1565C0] text-white' : 'bg-white border border-[#1565C0] text-[#1565C0]'
      }`}>
      {label}
    </button>
  )

  return (
    <div className="flex h-screen bg-[#F5F5F5] overflow-hidden">
      {/* ← único ponto de uso da Sidebar */}
      <AppSidebar expanded={expanded} />

      <div className="flex-1 flex flex-col min-w-0">
         <AccessibilityBar />     {/* ← adicionar esta linha */}
        {/* Header */}
        <div className="bg-white border-b border-[#E0E0E0] h-14 flex items-center justify-between px-4 flex-shrink-0">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setExpanded(e => !e)}
              className="w-8 h-8 flex flex-col justify-center items-center gap-1.5 hover:opacity-70"
            >
              <span className="block w-5 h-0.5 bg-[#1565C0]" />
              <span className="block w-5 h-0.5 bg-[#1565C0]" />
              <span className="block w-5 h-0.5 bg-[#1565C0]" />
            </button>
            <Logo variant="full" size="sm" />
          </div>
          <div className="flex gap-2 overflow-x-auto max-w-[50%]">
            {critical.map(c => (
              <NotificationPill key={c.id} childName={c.childName} onClick={() => {}} />
            ))}
          </div>
          <button
            onClick={fetchActive}
            className="flex items-center gap-1 text-xs text-[#757575] hover:text-[#1565C0]"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            {lastSync && (
              <span>
                {lastSync.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
              </span>
            )}
          </button>
        </div>

        {/* Filtros */}
        <div className="bg-white border-b border-[#E0E0E0] px-4 py-2 flex gap-2 overflow-x-auto flex-shrink-0">
          {filterBtn('todos',         'Todos')}
          {filterBtn('cama-elastica', '🤸 Cama Elástica')}
          {filterBtn('toboga',        '🛝 Tobogã')}
          {filterBtn('piscina',       '⚽ Piscina de Bolinhas')}
        </div>

        {/* Cards */}
        <div className="flex-1 overflow-auto p-4">
          {loading ? (
            <div className="flex justify-center items-center h-40">
              <div className="w-8 h-8 border-4 border-[#1565C0] border-t-transparent rounded-full animate-spin" />
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-40 text-[#9E9E9E]">
              <span className="text-4xl mb-2">🎉</span>
              <p className="font-nunito font-semibold">Nenhuma sessão ativa no momento</p>
            </div>
          ) : (
            <div className="space-y-2 max-w-3xl mx-auto">
              {filtered.map(child =>
                expanded
                  ? <ChildCardExpanded key={child.id} child={child} {...actions(child)} />
                  : <ChildCardCompact  key={child.id} child={child}
                      onWhatsApp={actions(child).onWhatsApp}
                      onAddTime={actions(child).onAddTime}
                      onPauseResume={actions(child).onPause}
                      onEnd={actions(child).onEnd}
                    />
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
