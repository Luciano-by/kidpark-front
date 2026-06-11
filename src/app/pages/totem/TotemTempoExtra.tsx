import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Logo } from '../../components/kidpark/Logo';
import { ColoredFooter } from '../../components/kidpark/ColoredFooter';
import { ActionButton } from '../../components/kidpark/ActionButton';
import { ChevronUp, ChevronDown, Clock } from 'lucide-react';

export function TotemTempoExtra() {
  const navigate = useNavigate();
  const [tempoExtra, setTempoExtra] = useState(15);

  const handleConfirm = () => {
    const data = JSON.parse(sessionStorage.getItem('totemData') || '{}');
    data.tempoExtraSelecionado = tempoExtra;
    sessionStorage.setItem('totemData', JSON.stringify(data));
    navigate('/totem/pagamento');
  };

  const handleCancel = () => {
    const data = JSON.parse(sessionStorage.getItem('totemData') || '{}');
    data.tempoExtraSelecionado = 0;
    sessionStorage.setItem('totemData', JSON.stringify(data));
    navigate('/totem/pagamento');
  };

  const incrementTime = () => {
    setTempoExtra(prev => Math.min(prev + 5, 30));
  };

  const decrementTime = () => {
    setTempoExtra(prev => Math.max(prev - 5, 5));
  };

  return (
    <div className="w-[480px] h-[854px] bg-[#F5F5F5] relative mx-auto flex flex-col">
      {/* Header */}
      <div className="bg-white px-5 py-5 flex justify-center">
        <Logo variant="full" size="md" />
      </div>

      {/* Content - Centered */}
      <div className="flex-1 flex items-center justify-center px-8 pb-20">
        <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
          {/* Title */}
          <div className="text-center mb-5">
            <div className="text-[#E65100] font-nunito font-bold text-2xl">
              Deseja adicionar
            </div>
            <div className="text-[#2E7D32] font-nunito font-extrabold text-[28px]">
              MAIS TEMPO?
            </div>
          </div>

          {/* Clock Icon */}
          <div className="flex justify-center my-5">
            <Clock className="w-20 h-20" style={{ color: '#2E7D32' }} />
          </div>

          {/* Time Stepper */}
          <div className="flex flex-col items-center gap-3 my-6">
            <button
              onClick={incrementTime}
              className="text-[#424242] hover:text-[#212121] transition-colors"
            >
              <ChevronUp className="w-6 h-6" />
            </button>

            <div className="bg-[#F5F5F5] rounded-lg px-6 py-3">
              <span className="font-nunito font-bold text-[22px] text-[#212121]">
                {tempoExtra} minutos
              </span>
            </div>

            <button
              onClick={decrementTime}
              className="text-[#424242] hover:text-[#212121] transition-colors"
            >
              <ChevronDown className="w-6 h-6" />
            </button>
          </div>

          {/* Buttons */}
          <div className="flex gap-3 mt-8">
            <ActionButton
              variant="cancelar"
              onClick={handleCancel}
              className="flex-1"
            >
              CANCELAR
            </ActionButton>
            <ActionButton
              variant="confirmar"
              onClick={handleConfirm}
              className="flex-1"
            >
              CONFIRMAR
            </ActionButton>
          </div>
        </div>
      </div>

      <ColoredFooter />
    </div>
  );
}
