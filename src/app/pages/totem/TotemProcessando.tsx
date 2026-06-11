import { useEffect } from 'react';
import { useNavigate } from 'react-router';
import { Logo } from '../../components/kidpark/Logo';
import { ColoredFooter } from '../../components/kidpark/ColoredFooter';

export function TotemProcessando() {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/totem/aprovado');
    }, 4000); // 2s processando + 2s avançando

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="w-[480px] h-[854px] bg-[#F5F5F5] relative mx-auto flex flex-col">
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

      {/* Content - Centered */}
      <div className="flex-1 flex flex-col items-center justify-center px-8 pb-20">
        <div className="text-center">
          <div className="text-[#424242] font-nunito font-semibold text-lg mb-6">
            PROCESSANDO PAGAMENTO
          </div>

          {/* Progress Bar - Orange initially, then green */}
          <div className="w-[70%] mx-auto">
            <div className="h-2.5 bg-[#E0E0E0] rounded-full overflow-hidden">
              <div className="h-full bg-[#F9A825] rounded-full animate-pulse-slow" 
                   style={{ width: '70%' }} />
            </div>
          </div>
        </div>
      </div>

      <ColoredFooter />
    </div>
  );
}
