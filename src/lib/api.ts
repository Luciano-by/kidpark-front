// src/lib/api.ts
// Erro corrigido:
//  ts(2339) 'env' não existe em ImportMeta — resolvido pelo vite-env.d.ts
//  (certifique-se que src/vite-env.d.ts declara ImportMetaEnv com VITE_API_URL)

const BASE = import.meta.env.VITE_API_URL ?? 'http://localhost:3333/api'

export class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message)
    this.name = 'ApiError'
  }
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = localStorage.getItem('kidpark_token')

  const res = await fetch(`${BASE}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers ?? {}),
    },
  })

  if (res.status === 204) return undefined as unknown as T

  const json = await res.json().catch(() => ({ ok: false, error: 'Resposta inválida' }))

  if (!res.ok || json.ok === false) {
    if (res.status === 401) {
      localStorage.removeItem('kidpark_token')
      localStorage.removeItem('kidpark_user')
      window.location.href = '/login'
    }
    throw new ApiError(res.status, json.error ?? `Erro ${res.status}`)
  }

  return (json.data !== undefined ? json.data : json) as T
}

export const api = {
  get:    <T>(p: string)                     => request<T>(p),
  post:   <T>(p: string, b?: unknown)        => request<T>(p, { method: 'POST',   body: JSON.stringify(b ?? {}) }),
  patch:  <T>(p: string, b?: unknown)        => request<T>(p, { method: 'PATCH',  body: JSON.stringify(b ?? {}) }),
  delete: <T>(p: string)                     => request<T>(p, { method: 'DELETE' }),
}
