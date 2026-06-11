// src/app/pages/Relatorios.tsx
import { useState, useEffect, useCallback } from 'react'
import { RefreshCw, TrendingUp, DollarSign, Ticket, Clock } from 'lucide-react'
import { AppSidebar }    from '../components/kidpark/AppSidebar'
import { AccessibilityBar } from '../components/kidpark/AccessibilityBar'
import { reportsService } from '../../services'
import type { DailyReport, MonthlyReport } from '../../services'

// ── Card de métrica ───────────────────────────────────────────
function MetricCard({ icon, label, value, sub, color }: {
  icon:  React.ReactNode
  label: string
  value: string | number
  sub?:  string
  color: string
}) {
  return (
    <div className="bg-white rounded-xl shadow-sm p-5 flex items-center gap-4">
      <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
        style={{ backgroundColor: `${color}15` }}>
        <span style={{ color }}>{icon}</span>
      </div>
      <div>
        <p className="font-nunito text-xs text-[#757575] font-semibold uppercase tracking-wide">{label}</p>
        <p className="font-nunito font-bold text-2xl text-[#212121]">{value}</p>
        {sub && <p className="font-nunito text-xs text-[#9E9E9E]">{sub}</p>}
      </div>
    </div>
  )
}

// ── Relatório Diário ──────────────────────────────────────────
function DailyView() {
  const [data,    setData]    = useState<DailyReport | null>(null)
  const [loading, setLoading] = useState(true)
  const [error,   setError]   = useState('')

  const load = useCallback(async () => {
    setLoading(true); setError('')
    try   { setData(await reportsService.daily()) }
    catch (e) { setError(e instanceof Error ? e.message : 'Erro ao carregar') }
    finally   { setLoading(false) }
  }, [])

  useEffect(() => {
    load()
    const id = setInterval(load, 60_000)
    return () => clearInterval(id)
  }, [load])

  if (loading) return (
    <div className="flex justify-center items-center h-60">
      <div className="w-10 h-10 border-4 border-[#E53935] border-t-transparent rounded-full animate-spin" />
    </div>
  )
  if (error) return (
    <div className="m-6 bg-[#FFEBEE] border border-[#EF9A9A] rounded-xl p-4">
      <p className="font-nunito text-sm text-[#C62828]">⚠️ {error}</p>
    </div>
  )
  if (!data) return null

  const now     = new Date(data.ultimaAtualizacao)
  const hourStr = now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
  const dateStr = now.toLocaleDateString('pt-BR', { weekday: 'long', day: '2-digit', month: 'long' })

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-nunito font-bold text-xl text-[#212121] capitalize">{dateStr}</h2>
          <p className="font-nunito text-xs text-[#9E9E9E]">Atualizado às {hourStr}</p>
        </div>
        <button onClick={load}
          className="flex items-center gap-2 px-3 py-2 border border-[#E0E0E0] rounded-lg text-sm font-nunito text-[#757575] hover:bg-[#F5F5F5]">
          <RefreshCw className="w-4 h-4" /> Atualizar
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <MetricCard icon={<Ticket className="w-6 h-6" />}    label="Tickets hoje"  value={data.totalTickets} color="#1565C0" />
        <MetricCard icon={<DollarSign className="w-6 h-6" />} label="Arrecadado"
          value={`R$ ${data.totalArrecadado.toFixed(2).replace('.', ',')}`}
          sub={`${data.pendentePagamento ?? 0} pendente(s)`} color="#2E7D32" />
        <MetricCard icon={<Clock className="w-6 h-6" />} label="Status ativo"
          value={data.porStatus?.ACTIVE ?? 0}
          sub={`${data.porStatus?.PAUSED ?? 0} pausado(s)`} color="#E65100" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-5">
          <h3 className="font-nunito font-bold text-base text-[#212121] mb-4">🎡 Brinquedos mais usados</h3>
          {data.brinquedos.length === 0
            ? <p className="font-nunito text-sm text-[#9E9E9E]">Nenhum atendimento hoje</p>
            : <div className="space-y-3">
                {data.brinquedos.map((b, i) => {
                  const pct = data.totalTickets > 0 ? Math.round((b.total / data.totalTickets) * 100) : 0
                  return (
                    <div key={i}>
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-nunito text-sm font-semibold text-[#212121]">{b.emoji} {b.nome}</span>
                        <span className="font-nunito text-sm font-bold text-[#1565C0]">{b.total} ({pct}%)</span>
                      </div>
                      <div className="h-2 bg-[#E3F2FD] rounded-full overflow-hidden">
                        <div className="h-full bg-[#1565C0] rounded-full transition-all duration-500" style={{ width: `${pct}%` }} />
                      </div>
                    </div>
                  )
                })}
              </div>
          }
        </div>

        <div className="bg-white rounded-xl shadow-sm p-5">
          <h3 className="font-nunito font-bold text-base text-[#212121] mb-4">👤 Atendentes em atividade</h3>
          {data.atendentes.length === 0
            ? <p className="font-nunito text-sm text-[#9E9E9E]">Nenhum atendente registrado hoje</p>
            : <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2 font-nunito text-xs text-[#757575] font-semibold uppercase">Nome</th>
                    <th className="text-right py-2 font-nunito text-xs text-[#757575] font-semibold uppercase">Atendimentos</th>
                  </tr>
                </thead>
                <tbody>
                  {data.atendentes.map((a, i) => (
                    <tr key={i} className="border-b last:border-0 hover:bg-[#F5F5F5]">
                      <td className="py-2 font-nunito text-sm font-semibold text-[#212121]">{a.nome}</td>
                      <td className="py-2 font-nunito text-sm font-bold text-[#1565C0] text-right">{a.total}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
          }
        </div>
      </div>
    </div>
  )
}

// ── Relatório Mensal ──────────────────────────────────────────
function MonthlyView() {
  const now = new Date()
  const [year,  setYear]  = useState(now.getFullYear())
  const [month, setMonth] = useState(now.getMonth() + 1)
  const [data,    setData]    = useState<MonthlyReport | null>(null)
  const [loading, setLoading] = useState(false)
  const [error,   setError]   = useState('')

  const load = useCallback(async () => {
    setLoading(true); setError('')
    try   { setData(await reportsService.monthly(year, month)) }
    catch (e) { setError(e instanceof Error ? e.message : 'Erro ao carregar') }
    finally   { setLoading(false) }
  }, [year, month])

  useEffect(() => { load() }, [load])

  const MONTHS = ['Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set','Out','Nov','Dez']

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-4 flex-wrap">
        <div className="flex items-center gap-2">
          <label className="font-nunito text-sm font-semibold text-[#757575]">Mês</label>
          <select value={month} onChange={e => setMonth(Number(e.target.value))}
            className="h-9 px-3 rounded-lg border border-[#E0E0E0] font-nunito text-sm focus:outline-none focus:ring-2 focus:ring-[#E53935]">
            {MONTHS.map((m, i) => <option key={i} value={i + 1}>{m}</option>)}
          </select>
        </div>
        <div className="flex items-center gap-2">
          <label className="font-nunito text-sm font-semibold text-[#757575]">Ano</label>
          <select value={year} onChange={e => setYear(Number(e.target.value))}
            className="h-9 px-3 rounded-lg border border-[#E0E0E0] font-nunito text-sm focus:outline-none focus:ring-2 focus:ring-[#E53935]">
            {[2025, 2026, 2027].map(y => <option key={y} value={y}>{y}</option>)}
          </select>
        </div>
        <button onClick={load}
          className="flex items-center gap-2 px-3 py-2 bg-[#E53935] text-white rounded-lg text-sm font-nunito font-bold hover:brightness-90">
          <RefreshCw className="w-4 h-4" /> Consultar
        </button>
      </div>

      {loading && (
        <div className="flex justify-center h-40 items-center">
          <div className="w-8 h-8 border-4 border-[#E53935] border-t-transparent rounded-full animate-spin" />
        </div>
      )}
      {error && (
        <div className="bg-[#FFEBEE] border border-[#EF9A9A] rounded-xl p-4">
          <p className="font-nunito text-sm text-[#C62828]">⚠️ {error}</p>
        </div>
      )}
      {!loading && data && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <MetricCard icon={<Ticket className="w-6 h-6" />} label="Total de tickets"
              value={data.totalTickets} sub={`${MONTHS[month - 1]} / ${year}`} color="#E53935" />
            <MetricCard icon={<TrendingUp className="w-6 h-6" />} label="Total arrecadado"
              value={`R$ ${data.totalArrecadado.toFixed(2).replace('.', ',')}`} color="#2E7D32" />
          </div>

          <div className="bg-white rounded-xl shadow-sm p-5">
            <h3 className="font-nunito font-bold text-base text-[#212121] mb-4">📅 Tickets por dia</h3>
            {data.porDia.every(d => d.tickets === 0)
              ? <p className="font-nunito text-sm text-[#9E9E9E]">Sem dados para o período selecionado</p>
              : <div className="flex items-end gap-1 h-32 overflow-x-auto pb-2">
                  {data.porDia.map((d, i) => {
                    const max = Math.max(...data.porDia.map(x => x.tickets), 1)
                    const h   = Math.round((d.tickets / max) * 100)
                    return (
                      <div key={i} className="flex flex-col items-center gap-1 flex-shrink-0" style={{ minWidth: 24 }}>
                        <div className="w-5 bg-[#E53935] rounded-t transition-all duration-300 hover:bg-[#C62828]"
                          style={{ height: `${h}%` }}
                          title={`${d.dia}: ${d.tickets} ticket(s) · R$ ${d.arrecadado.toFixed(2)}`} />
                        <span className="font-nunito text-[9px] text-[#9E9E9E]">{d.dia.slice(8)}</span>
                      </div>
                    )
                  })}
                </div>
            }
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl shadow-sm p-5">
              <h3 className="font-nunito font-bold text-base text-[#212121] mb-4">🎡 Top brinquedos</h3>
              {data.brinquedos.length === 0
                ? <p className="font-nunito text-sm text-[#9E9E9E]">Sem dados</p>
                : <div className="space-y-2">
                    {data.brinquedos.map((b, i) => (
                      <div key={i} className="flex justify-between items-center py-1 border-b last:border-0">
                        <span className="font-nunito text-sm font-semibold">{b.emoji} {b.nome}</span>
                        <span className="font-nunito text-sm font-bold text-[#1565C0]">{b.total}</span>
                      </div>
                    ))}
                  </div>
              }
            </div>
            <div className="bg-white rounded-xl shadow-sm p-5">
              <h3 className="font-nunito font-bold text-base text-[#212121] mb-4">👤 Por atendente</h3>
              {data.atendentes.length === 0
                ? <p className="font-nunito text-sm text-[#9E9E9E]">Sem dados</p>
                : <div className="space-y-2">
                    {data.atendentes.map((a, i) => (
                      <div key={i} className="flex justify-between items-center py-1 border-b last:border-0">
                        <span className="font-nunito text-sm font-semibold">{a.nome}</span>
                        <span className="font-nunito text-sm font-bold text-[#E53935]">{a.total}</span>
                      </div>
                    ))}
                  </div>
              }
            </div>
          </div>
        </>
      )}
    </div>
  )
}

// ── Página principal ──────────────────────────────────────────
export function Relatorios() {
  const [tab, setTab] = useState<'diario' | 'mensal'>('diario')

  return (
    <div className="flex h-screen bg-[#F5F5F5] overflow-hidden">
      <AppSidebar />

      <div className="flex-1 flex flex-col min-w-0">
        <AccessibilityBar />     {/* ← adicionar esta linha */}
        <div className="bg-white border-b border-[#E0E0E0] h-14 flex items-center justify-between px-6 flex-shrink-0">
          <h1 className="font-nunito font-extrabold text-xl text-[#E53935]">RELATÓRIOS</h1>
          <div className="flex gap-2">
            {(['diario', 'mensal'] as const).map(t => (
              <button key={t} onClick={() => setTab(t)}
                className={`px-4 py-2 rounded-lg font-nunito font-bold text-sm transition-all ${
                  tab === t ? 'bg-[#E53935] text-white' : 'bg-white border border-[#E0E0E0] text-[#757575] hover:bg-[#F5F5F5]'
                }`}>
                {t === 'diario' ? 'Diário' : 'Mensal'}
              </button>
            ))}
          </div>
        </div>
        <div className="flex-1 overflow-auto">
          {tab === 'diario' ? <DailyView /> : <MonthlyView />}
        </div>
      </div>
    </div>
  )
}
