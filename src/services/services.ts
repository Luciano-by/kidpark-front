// // src/services/services.ts
// // ─────────────────────────────────────────────────────────────
// // CAMPOS BASEADOS NO SCHEMA.PRISMA REAL:
// //
// // ChildSession: childName, parentName, phone, toyId, scheduledTime,
// //               durationMinutes, isPaused, status, paymentStatus,
// //               amountCents, notes, timeExtensions
// //
// // Controller create() espera:
// //   childName, parentName, phone, toyId, scheduledTime, extraDurationSec
// //
// // Controller addTime() espera: { seconds }
// // Controller tick()    espera: { timeRemainingSec }
// // Controller end()     usa:    status='FINISHED', finishedAt
// //
// // Toy: id, name, type, maxCapacity, defaultMinutes, pricePerSession, isActive
// // (NÃO tem slug nem emoji no schema atual)
// // ─────────────────────────────────────────────────────────────

// import { api } from '../lib/api'

// // ── TIPOS ─────────────────────────────────────────────────────

// export interface Toy {
//   id:              string
//   name:            string
//   type:            string
//   maxCapacity:     number
//   defaultMinutes:  number
//   pricePerSession: number
//   isActive:        boolean
//   createdAt:       string
// }

// export interface TimeExtension {
//   id:          string
//   sessionId:   string
//   minutes:     number
//   amountCents: number
//   createdAt:   string
// }

// export interface ChildSession {
//   id:             string
//   childName:      string
//   parentName:     string
//   phone:          string
//   toyId:          string
//   toy:            Toy
//   userId:         string
//   user:           { id: string; name: string; username: string }
//   scheduledTime:  string | null
//   startedAt:      string | null
//   endedAt:        string | null
//   durationMinutes: number
//   isPaused:       boolean
//   pausedAt:       string | null
//   status:         'SCHEDULED' | 'ACTIVE' | 'PAUSED' | 'ENDED' | 'CANCELLED' | 'FINISHED'
//   paymentStatus:  'PENDING' | 'PAID' | 'REFUNDED'
//   amountCents:    number
//   notes:          string | null
//   createdAt:      string
//   updatedAt:      string
//   timeExtensions: TimeExtension[]
// }

// export interface User {
//   id:        string
//   name:      string
//   username:  string
//   email:     string | null
//   phone:     string | null
//   avatarUrl: string | null
//   isActive:  boolean
//   role:      string
//   createdAt: string
// }

// export interface DailyReport {
//   totalTickets:      number
//   totalArrecadado:   number
//   brinquedos:        { nome: string; total: number }[]
//   atendentes:        { nome: string; total: number }[]
//   porStatus:         Record<string, number>
//   ultimaAtualizacao: string
// }

// export interface MonthlyReport {
//   periodo:         { inicio: string; fim: string }
//   totalTickets:    number
//   totalArrecadado: number
//   brinquedos:      { nome: string; total: number }[]
//   atendentes:      { nome: string; total: number }[]
//   porDia:          { dia: string; tickets: number; arrecadado: number }[]
// }

// // ── BRINQUEDOS ────────────────────────────────────────────────

// export const toysService = {
//   // GET /api/toys
//   getAll: () => api.get<Toy[]>('/toys'),

//   // GET /api/toys/:id
//   getOne: (id: string) => api.get<Toy>(`/toys/${id}`),

//   // POST /api/toys (GERENTE)
//   create: (body: { name: string; type: string; maxCapacity?: number }) =>
//     api.post<Toy>('/toys', body),

//   // PATCH /api/toys/:id (GERENTE)
//   update: (id: string, body: Partial<Toy>) =>
//     api.patch<Toy>(`/toys/${id}`, body),

//   // DELETE /api/toys/:id (GERENTE) — soft delete
//   remove: (id: string) => api.delete<void>(`/toys/${id}`),
// }

// // ── CRIANÇAS / SESSÕES ────────────────────────────────────────

// export const childrenService = {
//   // GET /api/children/active — dashboard em tempo real
//   getActive: () => api.get<ChildSession[]>('/children/active'),

//   // GET /api/children — histórico com filtros opcionais
//   getAll: (params?: { status?: string; date?: string }) => {
//     const q = params ? '?' + new URLSearchParams(params as Record<string, string>) : ''
//     return api.get<ChildSession[]>(`/children${q}`)
//   },

//   // GET /api/children/:id
//   getOne: (id: string) => api.get<ChildSession>(`/children/${id}`),

//   // POST /api/children — cadastrar criança
//   // Body exato que o controller espera:
//   //   childName, parentName, phone, toyId, scheduledTime, extraDurationSec
//   create: (body: {
//     childName:        string
//     parentName:       string
//     phone:            string
//     toyId:            string    // UUID do brinquedo
//     scheduledTime:    string    // "HH:MM" — o controller faz new Date(scheduledTime)
//     extraDurationSec?: number   // segundos extras (0 = sem extra, 900 = +15min)
//     notes?:           string
//   }) => api.post<ChildSession>('/children', body),

//   // PATCH /api/children/:id/start
//   start: (id: string) => api.patch<ChildSession>(`/children/${id}/start`),

//   // PATCH /api/children/:id/pause — alterna pause/resume
//   pause: (id: string) => api.patch<ChildSession>(`/children/${id}/pause`),

//   // PATCH /api/children/:id/add-time
//   // Controller espera: { seconds } (número de segundos a adicionar)
//   addTime: (id: string, seconds: number) =>
//     api.patch<ChildSession>(`/children/${id}/add-time`, { seconds }),

//   // PATCH /api/children/:id/tick — sincroniza timer com banco
//   // Controller espera: { timeRemainingSec }
//   tick: (id: string, timeRemainingSec: number) =>
//     api.patch<ChildSession>(`/children/${id}/tick`, { timeRemainingSec }),

//   // PATCH /api/children/:id/end — encerra sessão
//   end: (id: string) => api.patch<ChildSession>(`/children/${id}/end`),

//   // PATCH /api/children/:id/payment — marca como pago
//   markPaid: (id: string) => api.patch<ChildSession>(`/children/${id}/payment`),

//   // DELETE /api/children/:id
//   remove: (id: string) => api.delete<void>(`/children/${id}`),
// }

// // ── USUÁRIOS ──────────────────────────────────────────────────

// export const usersService = {
//   getAll: () => api.get<User[]>('/users'),
//   getOne: (id: string) => api.get<User>(`/users/${id}`),

//   create: (body: {
//     name:      string
//     username:  string
//     password:  string
//     roleName:  'GERENTE' | 'ATENDENTE'
//     email?:    string
//     phone?:    string
//   }) => api.post<User>('/users', body),

//   update: (id: string, body: Partial<Pick<User, 'name' | 'email' | 'phone' | 'avatarUrl' | 'isActive'>>) =>
//     api.patch<User>(`/users/${id}`, body),

//   changeRole: (id: string, roleName: 'GERENTE' | 'ATENDENTE') =>
//     api.patch<User>(`/users/${id}/role`, { roleName }),

//   remove: (id: string) => api.delete<void>(`/users/${id}`),
// }

// // ── RELATÓRIOS ────────────────────────────────────────────────

// export const reportsService = {
//   daily: () =>
//     api.get<DailyReport>('/reports/daily'),

//   monthly: (year: number, month: number) =>
//     api.get<MonthlyReport>(`/reports/monthly?year=${year}&month=${month}`),
// }
