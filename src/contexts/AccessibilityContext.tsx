// src/contexts/AccessibilityContext.tsx
// Gerencia: modo noturno, zoom, atalhos de teclado, VLibras


import {
  createContext, useContext, useState,
  useEffect, useCallback, ReactNode,
} from 'react'

type FontSize = 'sm' | 'md' | 'lg' | 'xl'

interface A11yContextType {
  darkMode:    boolean
  fontSize:    FontSize
  vlibrasOn:   boolean
  toggleDark:  () => void
  zoomIn:      () => void
  zoomOut:     () => void
  resetZoom:   () => void
  toggleVLibras: () => void
}

const A11yContext = createContext<A11yContextType | null>(null)

const FONT_SIZES: FontSize[] = ['sm', 'md', 'lg', 'xl']
const FONT_SIZE_PX: Record<FontSize, string> = {
  sm: '14px', md: '16px', lg: '18px', xl: '20px',
}

function load<T>(key: string, fallback: T): T {
  try { return JSON.parse(localStorage.getItem(key) ?? '') ?? fallback }
  catch { return fallback }
}

export function AccessibilityProvider({ children }: { children: ReactNode }) {
  const [darkMode,  setDark]     = useState<boolean>(() => load('kp_dark', false))
  const [fontSize,  setFontSize] = useState<FontSize>(() => load('kp_font', 'md'))
  const [vlibrasOn, setVlibras]  = useState<boolean>(() => load('kp_vlibras', false))

  // Aplica dark mode na raiz
  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode)
    localStorage.setItem('kp_dark', JSON.stringify(darkMode))
  }, [darkMode])

  // Aplica tamanho de fonte
  useEffect(() => {
    document.documentElement.style.setProperty('--font-size', FONT_SIZE_PX[fontSize])
    document.documentElement.setAttribute('data-font-size', fontSize)
    localStorage.setItem('kp_font', JSON.stringify(fontSize))
  }, [fontSize])

  // VLibras — injeta / remove script
  useEffect(() => {
    localStorage.setItem('kp_vlibras', JSON.stringify(vlibrasOn))
    const existing = document.getElementById('vlibras-widget')
    if (vlibrasOn && !existing) {
      const div = document.createElement('div')
      div.id = 'vlibras-widget'
      div.setAttribute('vw', '')
      div.setAttribute('class', 'enabled')
      div.innerHTML = `
        <div vw-access-button class="active"></div>
        <div vw-plugin-wrapper>
          <div class="vw-plugin-top-wrapper"></div>
        </div>
      `
      document.body.appendChild(div)

      const script = document.createElement('script')
      script.id  = 'vlibras-script'
      script.src = 'https://vlibras.gov.br/app/vlibras-plugin.js'
      // script.onload = () => {
      //   (window as Window & { VLibras?: { Widget: new (url: string) => void } })
      //     .VLibras && new (window as Window & { VLibras: { Widget: new (url: string) => void } })
      //     .VLibras.Widget('https://vlibras.gov.br/app')
      // }
      document.head.appendChild(script)
    } else if (!vlibrasOn && existing) {
      existing.remove()
      document.getElementById('vlibras-script')?.remove()
    }
  }, [vlibrasOn])

  // Atalhos de teclado globais
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      // Alt + D = toggle dark
      if (e.altKey && e.key === 'd') { e.preventDefault(); setDark(v => !v) }
      // Alt + + = zoom in
      if (e.altKey && (e.key === '+' || e.key === '=')) { e.preventDefault(); zoomIn() }
      // Alt + - = zoom out
      if (e.altKey && e.key === '-') { e.preventDefault(); zoomOut() }
      // Alt + 0 = reset zoom
      if (e.altKey && e.key === '0') { e.preventDefault(); setFontSize('md') }
      // Alt + L = VLibras
      if (e.altKey && e.key === 'l') { e.preventDefault(); setVlibras(v => !v) }
      // Alt + 1 = ir para Dashboard
      if (e.altKey && e.key === '1') { e.preventDefault(); window.location.href = '/dashboard' }
      // Alt + 2 = ir para Cadastro
      if (e.altKey && e.key === '2') { e.preventDefault(); window.location.href = '/cadastro' }
      // Alt + 3 = ir para Relatórios
      if (e.altKey && e.key === '3') { e.preventDefault(); window.location.href = '/relatorios' }
      // Alt + P = ir para Perfil
      if (e.altKey && e.key === 'p') { e.preventDefault(); window.location.href = '/perfil' }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fontSize])

  const toggleDark = useCallback(() => setDark(v => !v), [])
  const toggleVLibras = useCallback(() => setVlibras(v => !v), [])

  const zoomIn = useCallback(() =>
    setFontSize(f => {
      const i = FONT_SIZES.indexOf(f)
      return FONT_SIZES[Math.min(i + 1, FONT_SIZES.length - 1)]
    }), [])

  const zoomOut = useCallback(() =>
    setFontSize(f => {
      const i = FONT_SIZES.indexOf(f)
      return FONT_SIZES[Math.max(i - 1, 0)]
    }), [])

  const resetZoom = useCallback(() => setFontSize('md'), [])

  return (
    <A11yContext.Provider value={{
      darkMode, fontSize, vlibrasOn,
      toggleDark, zoomIn, zoomOut, resetZoom, toggleVLibras,
    }}>
      {children}
    </A11yContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export function useA11y() {
  const ctx = useContext(A11yContext)
  if (!ctx) throw new Error('useA11y deve ser usado dentro de <AccessibilityProvider>')
  return ctx
}