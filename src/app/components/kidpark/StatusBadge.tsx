interface StatusBadgeProps {
  variant: 'online' | 'offline' | 'administrador' | 'atendente';
}

export function StatusBadge({ variant }: StatusBadgeProps) {
  const variants = {
    online: {
      bg: '#C8E6C9',
      text: '#2E7D32',
      label: 'Online'
    },
    offline: {
      bg: '#E0E0E0',
      text: '#757575',
      label: 'Offline'
    },
    administrador: {
      bg: '#E6F1FB',
      text: '#185FA5',
      label: 'Administrador'
    },
    atendente: {
      bg: '#EAF3DE',
      text: '#3B6D11',
      label: 'Atendente'
    }
  };

  const config = variants[variant];

  return (
    <span
      className="px-3 py-1 rounded-full text-xs font-nunito font-semibold inline-flex items-center gap-1"
      style={{ backgroundColor: config.bg, color: config.text }}
    >
      {(variant === 'online' || variant === 'offline') && (
        <span className="w-2 h-2 rounded-full" style={{ backgroundColor: config.text }} />
      )}
      {config.label}
    </span>
  );
}
