// src/app/components/kidpark/ChildCard.tsx
// ✅ animate-pulse-border substituído por classe Tailwind segura
// ✅ memo nos sub-componentes para evitar re-renders desnecessários
// ✅ Interface alinhada com a API (paymentStatus/paymentValue)

import { memo, useState } from "react";
import { MessageCircle, MoreHorizontal, Pause, Play, X, Clock, DollarSign } from "lucide-react";
import { TimeBar } from "./TimeBar";

// ── Interface pública ─────────────────────────────────────────
export interface ChildData {
  id: string;
  childName: string;
  parentName: string;
  phone: string;
  toy: string;
  timeRemaining: number;
  totalTime: number;
  isPaused: boolean;
  paymentStatus?: "pago" | "pendente";
  paymentValue?: number;
}

// ── Helpers ───────────────────────────────────────────────────
type StatusKey = "ok" | "warning" | "critical" | "paused" | "ended";

function getStatus(c: ChildData): StatusKey {
  if (c.isPaused)           return "paused";
  if (c.timeRemaining <= 0) return "ended";
  if (c.timeRemaining < 120) return "critical";
  if (c.timeRemaining < 300) return "warning";
  return "ok";
}

const COLOR: Record<StatusKey, string> = {
  ok:       "#2E7D32",
  warning:  "#F9A825",
  critical: "#E53935",
  paused:   "#9E9E9E",
  ended:    "#E53935",
};

// Pulso apenas com Tailwind (sem classe customizada que pode falhar)
const PULSE_CLASS: Partial<Record<StatusKey, string>> = {
  critical: "ring-2 ring-[#E53935] ring-opacity-50",
  ended:    "ring-2 ring-[#E53935] ring-opacity-50",
};

export function formatTime(s: number) {
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  return `${String(h).padStart(2,"0")}:${String(m).padStart(2,"0")}:${String(sec).padStart(2,"0")}`;
}

// ── Sub-componentes memorizados ───────────────────────────────

const WhatsAppBtn = memo(function WhatsAppBtn({ onClick }: { onClick?: () => void }) {
  return (
    <button
      onClick={onClick}
      title="Falar com responsável"
      className="flex items-center justify-center w-10 h-10 rounded-full hover:scale-110 active:scale-95 transition-transform flex-shrink-0"
      style={{ backgroundColor: "#25D36620", border: "1.5px solid #25D366" }}
    >
      <MessageCircle className="w-5 h-5" style={{ color: "#25D366" }} />
    </button>
  );
});

const PaymentBadge = memo(function PaymentBadge({
  status, value,
}: { status?: "pago" | "pendente"; value?: number }) {
  const ok = status === "pago";
  return (
    <div
      className="flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-nunito font-bold flex-shrink-0"
      style={{
        backgroundColor: ok ? "#E8F5E9" : "#FFF8E1",
        color: ok ? "#2E7D32" : "#E65100",
        border: `1px solid ${ok ? "#A5D6A7" : "#FFE082"}`,
      }}
    >
      <DollarSign className="w-3 h-3" />
      {ok ? "Pago" : "Pendente"}
      {value !== undefined && <span className="ml-1 opacity-80">R${value.toFixed(2)}</span>}
    </div>
  );
});

const ActionRow = memo(function ActionRow({
  isPaused, onPause, onEnd, onAddTime, size = "sm",
}: {
  isPaused: boolean;
  onPause?: () => void;
  onEnd?: () => void;
  onAddTime?: () => void;
  size?: "sm" | "md";
}) {
  const base =
    size === "md"
      ? "flex items-center justify-center gap-1 rounded-lg px-3 py-2 text-white text-xs font-nunito font-bold transition-all hover:brightness-90 active:scale-95"
      : "flex items-center justify-center rounded-lg w-9 h-9 text-white transition-all hover:brightness-90 active:scale-95";

  return (
    <div className="flex gap-2">
      <button
        onClick={onPause}
        className={base}
        style={{ backgroundColor: isPaused ? "#1565C0" : "#757575" }}
        title={isPaused ? "Retomar" : "Pausar"}
      >
        {isPaused ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
        {size === "md" && <span>{isPaused ? "Retomar" : "Pausar"}</span>}
      </button>
      <button onClick={onEnd} className={base} style={{ backgroundColor: "#E53935" }} title="Encerrar">
        <X className="w-4 h-4" />
        {size === "md" && <span>Encerrar</span>}
      </button>
      <button onClick={onAddTime} className={base} style={{ backgroundColor: "#2E7D32" }} title="+5 minutos">
        <Clock className="w-4 h-4" />
        {size === "md" && <span>+Tempo</span>}
      </button>
    </div>
  );
});

// ═══════════════════════════════════════════════════════════════
// COMPACT CARD
// ═══════════════════════════════════════════════════════════════

interface CompactProps {
  child: ChildData;
  onWhatsApp?: () => void;
  onAddTime?: () => void;
  onPauseResume?: () => void;
  onEnd?: () => void;
}

export const ChildCardCompact = memo(function ChildCardCompact({
  child, onWhatsApp, onAddTime, onPauseResume, onEnd,
}: CompactProps) {
  const [menu, setMenu] = useState(false);
  const status = getStatus(child);
  const color  = COLOR[status];
  const pct    = Math.max(0, Math.min(100, (child.timeRemaining / child.totalTime) * 100));

  return (
    <div className="relative">
      <div
        className={`bg-white rounded-xl shadow-sm flex items-center gap-3 px-3 py-0 ${PULSE_CLASS[status] ?? ""}`}
        style={{ borderLeft: `4px solid ${color}`, minHeight: 64 }}
      >
        <WhatsAppBtn onClick={onWhatsApp} />

        <div className="flex flex-col justify-center min-w-0 flex-1 py-2">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-nunito font-bold text-[15px] text-[#212121] truncate">{child.childName}</span>
            <PaymentBadge status={child.paymentStatus} value={child.paymentValue} />
          </div>
          <div className="flex items-center gap-2 mt-0.5 flex-wrap">
            <span className="font-nunito text-xs text-[#757575] truncate">{child.toy}</span>
            <span className="text-[#BDBDBD] text-xs">·</span>
            <span className="font-nunito text-xs text-[#424242]">
              Restante:{" "}
              <span className="font-bold font-mono" style={{ color }}>
                {formatTime(child.timeRemaining)}
              </span>
            </span>
          </div>
          <TimeBar percentage={pct} className="mt-1.5" />
        </div>

        <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: color }} />
        <button onClick={() => setMenu(!menu)} className="text-[#757575] hover:text-[#424242] flex-shrink-0">
          <MoreHorizontal className="w-5 h-5" />
        </button>
      </div>

      {menu && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setMenu(false)} />
          <div className="absolute right-0 top-full mt-1 bg-white rounded-lg shadow-lg z-50 w-56 py-1 border border-[#E0E0E0]">
            {[
              { label: "Adicionar Tempo", icon: <Clock className="w-4 h-4 text-[#2E7D32]" />, action: onAddTime, cls: "hover:bg-green-50 text-[#212121]" },
              { label: child.isPaused ? "Retomar" : "Pausar", icon: child.isPaused ? <Play className="w-4 h-4 text-[#1565C0]" /> : <Pause className="w-4 h-4 text-[#757575]" />, action: onPauseResume, cls: "hover:bg-gray-50 text-[#212121]" },
              { label: "Encerrar", icon: <X className="w-4 h-4" />, action: onEnd, cls: "hover:bg-red-50 text-[#E53935]" },
              { label: "Abrir WhatsApp", icon: <MessageCircle className="w-4 h-4" />, action: onWhatsApp, cls: "hover:bg-green-50 text-[#25D366]" },
            ].map((item, i) => (
              <button
                key={i}
                onClick={() => { item.action?.(); setMenu(false); }}
                className={`w-full px-4 py-2 text-left flex items-center gap-2 font-nunito text-sm ${item.cls}`}
              >
                {item.icon} {item.label}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
});

// ═══════════════════════════════════════════════════════════════
// EXPANDED CARD
// ═══════════════════════════════════════════════════════════════

interface ExpandedProps {
  child: ChildData;
  onWhatsApp?: () => void;
  onPause?: () => void;
  onEnd?: () => void;
  onAddTime?: () => void;
}

export const ChildCardExpanded = memo(function ChildCardExpanded({
  child, onWhatsApp, onPause, onEnd, onAddTime,
}: ExpandedProps) {
  const status = getStatus(child);
  const color  = COLOR[status];
  const pct    = Math.max(0, Math.min(100, (child.timeRemaining / child.totalTime) * 100));

  return (
    <div
      className={`bg-white rounded-xl shadow-sm flex gap-4 p-4 ${PULSE_CLASS[status] ?? ""} ${status === "ended" ? "bg-red-50" : ""}`}
      style={{ borderLeft: `6px solid ${color}`, minHeight: 110 }}
    >
      <div className="flex-[0.55] flex flex-col justify-between min-w-0">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="font-nunito font-extrabold text-lg truncate" style={{ color: "#1565C0" }}>
              {child.childName}
            </h3>
            <PaymentBadge status={child.paymentStatus} value={child.paymentValue} />
          </div>
          <p className="mt-1 text-sm">
            <span className="text-[#757575] font-nunito font-bold text-[11px] uppercase">Responsável: </span>
            <span className="text-[#212121] font-nunito font-semibold">{child.parentName}</span>
          </p>
          <p className="mt-0.5 text-sm">
            <span className="text-[#757575] font-nunito font-bold text-[11px] uppercase">Brinquedo: </span>
            <span className="text-[#212121] font-nunito font-semibold">{child.toy}</span>
          </p>
        </div>
        <div className="flex items-center gap-2 mt-2">
          <WhatsAppBtn onClick={onWhatsApp} />
          <span className="text-xs font-nunito" style={{ color: "#25D366" }}>Falar com responsável</span>
        </div>
      </div>

      <div className="flex-[0.45] flex flex-col justify-between items-stretch">
        <div className="w-full">
          <TimeBar percentage={pct} className="mb-1" />
          <div className="text-center font-nunito font-bold text-xl font-mono" style={{ color }}>
            {formatTime(child.timeRemaining)}
          </div>
        </div>
        <ActionRow isPaused={child.isPaused} onPause={onPause} onEnd={onEnd} onAddTime={onAddTime} size="md" />
      </div>
    </div>
  );
});
