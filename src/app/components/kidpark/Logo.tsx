interface LogoProps {
  variant?: 'full' | 'compact';
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export function Logo({ variant = 'full', size = 'md' }: LogoProps) {
  const sizeClasses = {
    sm: 'text-2xl',
    md: 'text-4xl',
    lg: 'text-5xl',
    xl: 'text-6xl'
  };

  const colors = ['#E53935', '#1565C0', '#2E7D32', '#F9A825'];

  if (variant === 'compact') {
    return (
      <div className={`font-fredoka ${sizeClasses[size]} text-center leading-tight`}>
        <div>
          <span style={{ color: colors[0] }}>K</span>
          <span style={{ color: colors[1] }}>i</span>
          <span style={{ color: colors[2] }}>d</span>
        </div>
        <div>
          <span style={{ color: colors[3] }}>P</span>
          <span style={{ color: colors[0] }}>a</span>
          <span style={{ color: colors[1] }}>r</span>
          <span style={{ color: colors[2] }}>k</span>
        </div>
      </div>
    );
  }

  return (
    <div className={`font-fredoka ${sizeClasses[size]}`}>
      <span style={{ color: colors[0] }}>K</span>
      <span style={{ color: colors[1] }}>i</span>
      <span style={{ color: colors[2] }}>d</span>
      <span style={{ color: colors[3] }}>P</span>
      <span style={{ color: colors[0] }}>a</span>
      <span style={{ color: colors[1] }}>r</span>
      <span style={{ color: colors[2] }}>k</span>
    </div>
  );
}
