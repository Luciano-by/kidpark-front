interface TimeSlotProps {
  time: string;
  variant: 'disponivel' | 'selecionado' | 'indisponivel' | 'fila-espera';
  onClick?: () => void;
}

export function TimeSlot({ time, variant, onClick }: TimeSlotProps) {
  const variants = {
    disponivel: {
      bg: '#1565C0',
      text: 'text-white',
      cursor: 'cursor-pointer hover:brightness-90'
    },
    selecionado: {
      bg: '#2E7D32',
      text: 'text-white',
      border: 'border-2 border-white',
      cursor: 'cursor-pointer'
    },
    indisponivel: {
      bg: '#E0E0E0',
      text: 'text-[#9E9E9E]',
      cursor: 'cursor-not-allowed'
    },
    'fila-espera': {
      bg: '#F9A825',
      text: 'text-[#212121]',
      cursor: 'cursor-pointer hover:brightness-90'
    }
  };

  const config = variants[variant];

  return (
    <button
      onClick={variant !== 'indisponivel' ? onClick : undefined}
      disabled={variant === 'indisponivel'}
      className={`
        ${config.text}
        ${config.cursor}
        rounded-lg
        h-11
        px-4
        w-fit
        font-nunito
        font-semibold
        transition-all
        active:scale-95
      `}
      style={{ backgroundColor: config.bg }}
    >
      {time}
    </button>
  );
}
