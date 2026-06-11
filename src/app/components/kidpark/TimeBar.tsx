interface TimeBarProps {
  percentage: number; // 0-100
  className?: string;
}

export function TimeBar({ percentage, className = '' }: TimeBarProps) {
  let fillColor = '#2E7D32'; // verde
  
  if (percentage <= 20) {
    fillColor = '#E53935'; // vermelho
  } else if (percentage <= 50) {
    fillColor = '#F9A825'; // amarelo
  }

  return (
    <div className={`w-full h-2 bg-[#E0E0E0] rounded ${className}`}>
      <div
        className="h-full rounded transition-all duration-1000 ease-linear"
        style={{
          width: `${percentage}%`,
          backgroundColor: fillColor
        }}
      />
    </div>
  );
}
