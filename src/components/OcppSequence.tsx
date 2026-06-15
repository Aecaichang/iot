"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { OCPP_STEPS, type OcppStep } from "@/lib/energyDeep";

const STEP_MS = 2200;

export function OcppSequence() {
  const [idx, setIdx] = useState(0);
  const [playing, setPlaying] = useState(true);

  useEffect(() => {
    if (!playing) return;
    const t = setInterval(() => setIdx((i) => (i + 1) % OCPP_STEPS.length), STEP_MS);
    return () => clearInterval(t);
  }, [playing]);

  const step = OCPP_STEPS[idx];

  return (
    <div className="rounded-[var(--radius)] border border-[var(--color-border)] bg-[var(--color-surface)] p-5 sm:p-7">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="text-lg font-semibold">OCPP 1.6: ชีวิตของการชาร์จหนึ่งครั้ง</h3>
          <p className="text-sm text-[var(--color-text-dim)]">
            ทุกข้อความที่ตู้ชาร์จกับระบบหลังบ้านคุยกัน ตั้งแต่เปิดเครื่องจนคิดเงิน
          </p>
        </div>
        <button
          onClick={() => setPlaying((p) => !p)}
          className="rounded-full border border-[var(--color-border)] px-4 py-2 text-sm font-semibold text-[var(--color-green)] transition-colors hover:bg-[var(--color-surface-2)]"
        >
          {playing ? "⏸ หยุด" : "▶ เล่น"}
        </button>
      </div>

      {/* เวที: ตู้ชาร์จ ↔ คลาวด์ */}
      <div className="relative mb-5 grid grid-cols-[1fr_2fr_1fr] items-center gap-2 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg)]/50 px-3 py-6">
        <Pole emoji="🔌" label="ตู้ชาร์จ" sub="Charge Point" active={step.dir !== "down"} />

        <div className="relative h-16">
          <div className="absolute left-0 right-0 top-1/2 h-px -translate-y-1/2 bg-[var(--color-border)]" />
          <AnimatePresence mode="wait">
            <motion.div
              key={step.id}
              initial={{ opacity: 0, x: step.dir === "down" ? 40 : step.dir === "up" ? -40 : 0, y: step.dir === "local" ? 14 : 0 }}
              animate={{ opacity: 1, x: 0, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="absolute left-1/2 top-1/2 w-max max-w-full -translate-x-1/2 -translate-y-1/2"
            >
              <div
                className="mono flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-semibold"
                style={{
                  borderColor: dirColor(step.dir),
                  color: dirColor(step.dir),
                  background: `color-mix(in oklch, ${dirColor(step.dir)} 12%, var(--color-bg))`,
                }}
              >
                <span>{dirArrow(step.dir)}</span>
                {step.message}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        <Pole emoji="☁️" label="หลังบ้าน" sub="CSMS" active={step.dir !== "up" || step.dir === "up"} />
      </div>

      {/* รายละเอียดสเต็ป */}
      <AnimatePresence mode="wait">
        <motion.div
          key={step.id}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.3 }}
          className="mb-5 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg)]/40 p-4"
          style={{ borderLeft: `3px solid ${dirColor(step.dir)}` }}
        >
          <div className="flex items-center gap-2 text-sm">
            <span className="mono text-xs text-[var(--color-text-dim)]">ขั้นที่ {step.id}</span>
            <span className="font-semibold" style={{ color: dirColor(step.dir) }}>
              {step.actor}
            </span>
          </div>
          <p className="mt-1.5 text-[var(--color-text-soft)]">{step.detail}</p>
        </motion.div>
      </AnimatePresence>

      {/* แถบไทม์ไลน์คลิกได้ */}
      <ol className="flex flex-wrap gap-1.5">
        {OCPP_STEPS.map((s, i) => (
          <li key={s.id}>
            <button
              onClick={() => {
                setPlaying(false);
                setIdx(i);
              }}
              className="mono rounded-lg border px-2.5 py-1 text-xs transition-all"
              style={{
                borderColor: i === idx ? dirColor(s.dir) : "var(--color-border)",
                color: i === idx ? dirColor(s.dir) : "var(--color-text-dim)",
                background: i === idx ? `color-mix(in oklch, ${dirColor(s.dir)} 12%, transparent)` : "transparent",
              }}
            >
              {s.id}. {shortName(s)}
            </button>
          </li>
        ))}
      </ol>
    </div>
  );
}

function dirColor(dir: OcppStep["dir"]): string {
  if (dir === "up") return "#34d399";
  if (dir === "down") return "var(--color-cyan)";
  return "var(--color-violet)";
}
function dirArrow(dir: OcppStep["dir"]): string {
  if (dir === "up") return "→";
  if (dir === "down") return "←";
  return "•";
}
function shortName(s: OcppStep): string {
  return s.message.split(" ")[0];
}

function Pole({
  emoji,
  label,
  sub,
  active,
}: {
  emoji: string;
  label: string;
  sub: string;
  active: boolean;
}) {
  return (
    <div className="flex flex-col items-center gap-1 text-center">
      <motion.div
        className="grid h-12 w-12 place-items-center rounded-xl border bg-[var(--color-surface-2)] text-2xl"
        animate={{
          borderColor: active ? "var(--color-cyan)" : "var(--color-border)",
          boxShadow: active ? "0 0 14px color-mix(in oklch, var(--color-cyan) 40%, transparent)" : "0 0 0 transparent",
        }}
        transition={{ duration: 0.3 }}
        style={{ borderWidth: 1 }}
      >
        {emoji}
      </motion.div>
      <span className="text-sm font-semibold">{label}</span>
      <span className="mono text-[10px] text-[var(--color-text-dim)]">{sub}</span>
    </div>
  );
}
