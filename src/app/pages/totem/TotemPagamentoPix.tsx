import { useEffect } from 'react';
import { useNavigate } from 'react-router';
import { Logo } from '../../components/kidpark/Logo';
import { ColoredFooter } from '../../components/kidpark/ColoredFooter';

export function TotemPagamentoPix() {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/totem/processando');
    }, 5000); // Simula tempo para escanear QR code

    return () => clearTimeout(timer);
  }, [navigate]);

  const data = JSON.parse(sessionStorage.getItem('totemData') || '{}');
  const tempoBase = 15;
  const tempoExtra = data.tempoExtraSelecionado || 0;
  const tempoTotal = tempoBase + tempoExtra;
  const valorTotal = tempoTotal * 1.00; // R$ 1,00 por minuto

  const getBrinquedoNome = (value: string) => {
    const map: Record<string, string> = {
      'cama-elastica': 'Cama Elástica',
      'piscina-bolinhas': 'Piscina de Bolinhas',
      'toboga': 'Tobogã'
    };
    return map[value] || value;
  };

  return (
    <div className="w-[480px] h-[854px] bg-[#F5F5F5] relative mx-auto">
      {/* Header */}
      <div className="bg-white px-5 py-3 flex flex-col items-center">
        <Logo variant="full" size="sm" />
        <div className="text-[#9E9E9E] text-xs mt-1">Via Pix</div>
      </div>

      {/* Title */}
      <div className="py-3 text-center">
        <h1 className="text-[#E65100] font-nunito font-extrabold text-[28px]">
          PAGAMENTO
        </h1>
      </div>

      {/* Content */}
      <div className="px-6 space-y-4 pb-20">
        {/* Resumo Card */}
        <div className="bg-white rounded-xl border border-[#E0E0E0] p-4 space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-[#757575]">Responsável:</span>
            <span className="text-[#212121] font-semibold">{data.nomeResponsavel}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-[#757575]">Criança:</span>
            <span className="text-[#212121] font-semibold">{data.nomeCrianca}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-[#757575]">Telefone:</span>
            <span className="text-[#212121] font-semibold">{data.telefone}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-[#757575]">Brinquedo:</span>
            <span className="text-[#212121] font-semibold">{getBrinquedoNome(data.brinquedo)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-[#757575]">Horário:</span>
            <span className="text-[#212121] font-semibold">{data.horario}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-[#757575]">Tempo:</span>
            <span className="text-[#212121] font-semibold">{tempoTotal} minutos</span>
          </div>
        </div>

        {/* QR Code */}
        <div className="flex flex-col items-center gap-3 my-6">
          <div className="bg-white border border-[#BDBDBD] p-3 rounded-lg">
            <div className="w-[200px] h-[200px] bg-white flex items-center justify-center">
              {/* QR Code placeholder - seria substituído por QR code real */}
              <svg viewBox="0 0 200 200" className="w-full h-full">
                <rect width="200" height="200" fill="white" />
                <g fill="black">
                  {/* Simple QR code pattern */}
                  <rect x="20" y="20" width="60" height="60" />
                  <rect x="120" y="20" width="60" height="60" />
                  <rect x="20" y="120" width="60" height="60" />
                  <rect x="40" y="40" width="20" height="20" fill="white" />
                  <rect x="140" y="40" width="20" height="20" fill="white" />
                  <rect x="40" y="140" width="20" height="20" fill="white" />
                  <rect x="100" y="40" width="10" height="10" />
                  <rect x="90" y="50" width="10" height="10" />
                  <rect x="110" y="50" width="10" height="10" />
                  <rect x="100" y="60" width="10" height="10" />
                  <rect x="90" y="90" width="30" height="30" />
                  <rect x="100" y="100" width="10" height="10" fill="white" />
                  <rect x="140" y="140" width="10" height="10" />
                  <rect x="150" y="130" width="10" height="10" />
                  <rect x="160" y="140" width="10" height="10" />
                  <rect x="130" y="150" width="10" height="10" />
                  <rect x="150" y="150" width="10" height="10" />
                  <rect x="170" y="150" width="10" height="10" />
                </g>
              </svg>
            </div>
          </div>
          <p className="text-[#757575] text-xs text-center">
            Escaneie com seu banco para pagar
          </p>
        </div>

        {/* Total */}
        <div className="text-center">
          <div className="text-[#2E7D32] font-nunito font-bold text-xl">
            TOTAL — R$ {valorTotal.toFixed(2)}
          </div>
        </div>
      </div>

      <ColoredFooter />
    </div>
  );
}
