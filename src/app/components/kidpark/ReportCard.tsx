interface ReportCardProps {
  variant: 'tickets' | 'brinquedos' | 'pagamentos';
  data: {
    tickets?: number;
    brinquedos?: { name: string; count: number; icon: string }[];
    valor?: number;
  };
}

export function ReportCard({ variant, data }: ReportCardProps) {
  if (variant === 'tickets') {
    return (
      <div className="bg-[#1565C0] rounded-2xl p-6 shadow-lg">
        <div className="text-center">
          <div className="text-white text-6xl mb-2">🎫</div>
          <div className="text-white font-nunito font-extrabold text-5xl">
            {data.tickets || 0}
          </div>
          <div className="text-white font-nunito font-bold text-base opacity-80 mt-1">
            TICKETS
          </div>
        </div>
      </div>
    );
  }

  if (variant === 'brinquedos') {
    const total = data.brinquedos?.reduce((sum, b) => sum + b.count, 0) || 0;
    
    return (
      <div className="bg-[#2E7D32] rounded-2xl p-6 shadow-lg">
        <div className="text-white font-nunito font-bold text-xs uppercase mb-3">
          CRIANÇAS POR BRINQUEDO
        </div>
        <div className="space-y-2">
          {data.brinquedos?.map((brinquedo, index) => (
            <div key={index} className="flex items-center justify-between text-white">
              <div className="flex items-center gap-2">
                <span>{['🥇', '🥈', '🥉'][index]}</span>
                <span className="text-sm">{brinquedo.icon}</span>
                <span className="font-nunito">{brinquedo.name}</span>
              </div>
              <span className="font-nunito font-bold">{brinquedo.count}</span>
            </div>
          ))}
        </div>
        <div className="border-t border-white/30 mt-3 pt-2">
          <div className="flex justify-between text-white font-nunito font-bold">
            <span>TOTAL:</span>
            <span>{total}</span>
          </div>
        </div>
      </div>
    );
  }

  if (variant === 'pagamentos') {
    return (
      <div className="bg-[#E65100] rounded-2xl p-6 shadow-lg">
        <div className="text-center">
          <div className="text-white text-5xl mb-2">💰</div>
          <div className="text-white font-nunito font-extrabold text-4xl">
            R$ {data.valor?.toFixed(2) || '0.00'}
          </div>
          <div className="text-white font-nunito text-xs mt-1">
            ARRECADADO HOJE
          </div>
        </div>
      </div>
    );
  }

  return null;
}
