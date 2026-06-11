import { AlertCircle } from 'lucide-react';

interface NotificationPillProps {
  childName: string;
  onClick?: () => void;
}

export function NotificationPill({ childName, onClick }: NotificationPillProps) {
  return (
    <button
      onClick={onClick}
      className="bg-[#E53935] text-white rounded-full px-3 py-1 text-xs font-nunito flex items-center gap-2 hover:brightness-90 transition-all animate-slideInRight"
    >
      <AlertCircle className="w-4 h-4" />
      <span>{childName} · tempo finalizado</span>
    </button>
  );
}
