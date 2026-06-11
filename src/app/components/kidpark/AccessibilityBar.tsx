// src/app/components/kidpark/AccessibilityBar.tsx
// Barra de acessibilidade que aparece em todas as páginas autenticadas.
// Controla: modo noturno, zoom, VLibras e exibe atalhos de teclado.

import { useState } from 'react'
import {
  Moon, Sun, ZoomIn, ZoomOut, RotateCcw,
  Keyboard, X, HandMetal,
} from 'lucide-react'
import { useA11y } from '../../../contexts/AccessibilityContext'

// ── Modal de atalhos ──────────────────────────────────────────
function KeyboardShortcutsModal({ onClose }: { onClose: () => void }) {
  const shortcuts = [
    { keys: ['Alt', 'D'],    desc: 'Alternar modo noturno' },
    { keys: ['Alt', '+'],    desc: 'Aumentar zoom' },
    { keys: ['Alt', '-'],    desc: 'Diminuir zoom' },
    { keys: ['Alt', '0'],    desc: 'Zoom padrão' },
    { keys: ['Alt', 'L'],    desc: 'Ativar/desativar VLibras' },
    { keys: ['Alt', '1'],    desc: 'Ir para Dashboard' },
    { keys: ['Alt', '2'],    desc: 'Ir para Cadastro' },
    { keys: ['Alt', '3'],    desc: 'Ir para Relatórios' },
    { keys: ['Alt', 'P'],    desc: 'Ir para Perfil' },
    { keys: ['Tab'],         desc: 'Navegar entre elementos' },
    { keys: ['Enter'],       desc: 'Confirmar / Ativar' },
    { keys: ['Esc'],         desc: 'Fechar modal / Cancelar' },
  ]

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Atalhos de teclado"
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-[9999]"
      onKeyDown={e => e.key === 'Escape' && onClose()}
    >
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl p-6 w-full max-w-md mx-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-nunito font-bold text-lg text-[#212121] dark:text-white flex items-center gap-2">
            <Keyboard className="w-5 h-5 text-[#1565C0]" aria-hidden="true" />
            Atalhos de Teclado
          </h2>
          <button
            onClick={onClose}
            aria-label="Fechar modal de atalhos"
            className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-[#757575]"
          >
            <X className="w-5 h-5" aria-hidden="true" />
          </button>
        </div>

        <ul className="space-y-2" role="list">
          {shortcuts.map((s, i) => (
            <li key={i} className="flex items-center justify-between py-1.5 border-b border-gray-100 dark:border-gray-800 last:border-0">
              <span className="font-nunito text-sm text-[#424242] dark:text-gray-300">{s.desc}</span>
              <div className="flex items-center gap-1">
                {s.keys.map((k, j) => (
                  <span key={j}>
                    <kbd className="px-2 py-0.5 bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded text-xs font-mono text-[#212121] dark:text-white">
                      {k}
                    </kbd>
                    {j < s.keys.length - 1 && (
                      <span className="mx-0.5 text-[#9E9E9E] text-xs">+</span>
                    )}
                  </span>
                ))}
              </div>
            </li>
          ))}
        </ul>

        <button
          onClick={onClose}
          className="mt-4 w-full py-2 bg-[#1565C0] text-white rounded-lg font-nunito font-bold text-sm hover:brightness-90"
        >
          Fechar
        </button>
      </div>
    </div>
  )
}

// ── Barra principal ───────────────────────────────────────────
export function AccessibilityBar() {
  const { darkMode, fontSize, vlibrasOn, toggleDark, zoomIn, zoomOut, resetZoom, toggleVLibras } = useA11y()
  const [showShortcuts, setShowShortcuts] = useState(false)

  const btn = (
    onClick: () => void,
    label: string,
    icon: React.ReactNode,
    active = false,
    title?: string,
  ) => (
    <button
      onClick={onClick}
      aria-label={label}
      aria-pressed={active}
      title={title ?? label}
      className={[
        'w-8 h-8 rounded-lg flex items-center justify-center transition-all',
        'focus:outline-none focus:ring-2 focus:ring-[#1565C0] focus:ring-offset-1',
        active
          ? 'bg-[#1565C0] text-white'
          : 'text-[#757575] hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-gray-300',
      ].join(' ')}
    >
      {icon}
    </button>
  )

  const FONT_LABELS: Record<string, string> = { sm: '14', md: '16', lg: '18', xl: '20' }

  return (
    <>
      {/* Skip link — para usuários de teclado/leitor de tela */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[9999] focus:px-4 focus:py-2 focus:bg-[#1565C0] focus:text-white focus:rounded-lg focus:font-nunito focus:font-bold focus:text-sm"
      >
        Ir para o conteúdo principal
      </a>

      {/* Barra */}
      <div
        role="toolbar"
        aria-label="Opções de acessibilidade"
        className="flex items-center gap-1 px-2 py-1 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700"
      >
        {/* Modo noturno */}
        {btn(
          toggleDark,
          darkMode ? 'Desativar modo noturno' : 'Ativar modo noturno',
          darkMode
            ? <Sun  className="w-4 h-4" aria-hidden="true" />
            : <Moon className="w-4 h-4" aria-hidden="true" />,
          darkMode,
          'Alt+D',
        )}

        <div className="w-px h-5 bg-gray-200 dark:bg-gray-700 mx-0.5" role="separator" />

        {/* Zoom out */}
        {btn(zoomOut, 'Diminuir texto (Alt+-)', <ZoomOut className="w-4 h-4" aria-hidden="true" />, false, 'Alt+−')}

        {/* Tamanho atual */}
        <button
          onClick={resetZoom}
          aria-label={`Tamanho de texto atual: ${FONT_LABELS[fontSize]}px. Clique para resetar.`}
          title="Resetar zoom (Alt+0)"
          className="px-2 h-8 rounded-lg text-xs font-mono font-bold text-[#1565C0] dark:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-[#1565C0]"
        >
          {FONT_LABELS[fontSize]}px
        </button>

        {/* Zoom in */}
        {btn(zoomIn, 'Aumentar texto (Alt++)', <ZoomIn className="w-4 h-4" aria-hidden="true" />, false, 'Alt++')}

        <div className="w-px h-5 bg-gray-200 dark:bg-gray-700 mx-0.5" role="separator" />

        {/* VLibras */}
        {btn(
          toggleVLibras,
          vlibrasOn ? 'Desativar VLibras' : 'Ativar VLibras (Língua de Sinais)',
          <HandMetal className="w-4 h-4" aria-hidden="true" />,
          vlibrasOn,
          'Alt+L',
        )}

        <div className="w-px h-5 bg-gray-200 dark:bg-gray-700 mx-0.5" role="separator" />

        {/* Atalhos */}
        {btn(
          () => setShowShortcuts(true),
          'Ver atalhos de teclado',
          <Keyboard className="w-4 h-4" aria-hidden="true" />,
          false,
          'Atalhos de teclado',
        )}

        {/* Label de acessibilidade ativo */}
        <span className="ml-2 text-[10px] text-[#9E9E9E] dark:text-gray-500 hidden sm:block" aria-live="polite">
          {darkMode && '🌙 Noturno · '}
          {fontSize !== 'md' && `🔤 ${FONT_LABELS[fontSize]}px · `}
          {vlibrasOn && '🤟 VLibras'}
        </span>
      </div>

      {showShortcuts && (
        <KeyboardShortcutsModal onClose={() => setShowShortcuts(false)} />
      )}
    </>
  )
}