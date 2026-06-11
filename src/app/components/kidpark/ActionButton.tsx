// src/app/components/kidpark/ActionButton.tsx
// Erro corrigido:
//  ts(2339) 'textColor' não existe no tipo da variante
//  Solução: tipo explícito para cada variante com textColor opcional

import { Check, X, Pause, Clock } from 'lucide-react'

interface Variant {
  bg:         string
  icon:       React.ElementType
  rounded:    string
  textColor?: string
}

interface ActionButtonProps {
  variant:    'confirmar' | 'cancelar' | 'encerrar' | 'pausar' | 'adicionar-tempo'
  children:   React.ReactNode
  onClick?:   () => void
  className?: string
  fullWidth?: boolean
  disabled?:  boolean
}

const VARIANTS: Record<ActionButtonProps['variant'], Variant> = {
  confirmar: {
    bg:      '#2E7D32',
    icon:    Check,
    rounded: 'rounded-3xl',
  },
  cancelar: {
    bg:        '#E0E0E0',
    icon:      X,
    rounded:   'rounded-3xl',
    textColor: 'text-[#424242]',
  },
  encerrar: {
    bg:      '#E53935',
    icon:    X,
    rounded: 'rounded-lg',
  },
  pausar: {
    bg:      '#757575',
    icon:    Pause,
    rounded: 'rounded-lg',
  },
  'adicionar-tempo': {
    bg:      '#2E7D32',
    icon:    Clock,
    rounded: 'rounded-lg',
  },
}

export function ActionButton({
  variant,
  children,
  onClick,
  className = '',
  fullWidth = false,
  disabled  = false,
}: ActionButtonProps) {
  const config    = VARIANTS[variant]
  const Icon      = config.icon
  const textColor = config.textColor ?? 'text-white'

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={[
        config.rounded,
        fullWidth ? 'w-full' : '',
        textColor,
        'font-nunito font-bold px-6 py-3',
        'flex items-center justify-center gap-2',
        'transition-all duration-150',
        'hover:brightness-90 active:scale-[0.97]',
        'disabled:opacity-60 disabled:cursor-not-allowed disabled:active:scale-100',
        className,
      ].join(' ')}
      style={{ backgroundColor: config.bg }}
    >
      <Icon className="w-5 h-5" />
      {children}
    </button>
  )
}
