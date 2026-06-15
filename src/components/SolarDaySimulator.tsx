"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import { computeSolarDay, type SolarHour } from "@/lib/energyDeep";

const W = 720;
const H = 260;
const PAD = { l: 40, r: 16, t: 20, b: 28 };
const PLOT_W = W - PAD.l - PAD.r;
const PLOT_H = H - PAD.t - PAD.b;
const MAX_KW = 5.5;

const COL = {
  solar: "#fbbf24",
  load: "#f472b6",
  battery: "#22d3ee",
};

function x(hour: number): number {
  return PAD.l + (hour / 23) * PLOT_W;
}
function yKw(kw: number): number {
  return PAD.t + PLOT_H - (kw / MAX_KW) * PLOT_H;
}
function ySoc(pct: number): number {
  return PAD.t + PLOT_H - (pct / 100) * PLOT_H;
}

function areaPath(data: SolarHour[], key: "solarKw" | "loadKw"): string {
  const top = data.map((d) => `${x(d.hour)},${yKw(d[key])}`).join(" L ");
  return `M ${PAD.l},${yKw(0)} L ${top} L ${x(23)},${yKw(0)} Z`;
}
function linePath(data: SolarHour[], y: (d: SolarHour) => number): string {
  return "M " + data.map((d) => `${x(d.hour)},${y(d)}`).join(" L ");
}

export function SolarDaySimulator() {
  const day = useMemo(() => computeSolarDay(), []);
  const [hour, setHour] = useState(12);
  const [playing, setPlaying] = useState(true);
  const raf = useRef<number | null>(null);
  const last = useRef(0);

  useEffect(() => {
    if (!playing) return;
    const HOUR_MS = 650;
    function tick(t: number) {
      if (t - last.current >= HOUR_MS) {
        last.current = t;
        setHour((h) => (h + 1) % 24);
      }
      raf.current = requestAnimationFrame(tick);
    }
    raf.current = requestAnimationFrame(tick);
    return () => {
      if (raf.current) cancelAnimationFrame(raf.current);
    };
  }, [playing]);

  const now = day[hour];
  const isDay = now.solarKw > 0.2;
  const px = x(hour);

  // โทนท้องฟ้าตามเวลา: กลางคืน → เช้า → กลางวัน → เย็น
  const skyTop = isDay ? "oklch(45% 0.12 240)" : "oklch(22% 0.06 270)";
  const skyBottom = isDay ? "oklch(70% 0.14 80)" : "oklch(16% 0.04 265)";

  return (
    <div className="rounded-[var(--radius)] border border-[var(--color-border)] bg-[var(--color-surface)] p-5 sm:p-7">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold">หนึ่งวันของบ้านที่ติดโซลาร์ + แบตเตอรี่</h3>
          <p className="text-sm text-[var(--color-text-dim)]">
            ระบบ IoT คอยตัดสินใจทุกชั่วโมงว่าจะเก็บไฟ ใช้ไฟ หรือขายคืนกริด — กดเล่นแล้วดูพลังงานไหล
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setPlaying((p) => !p)}
            className="rounded-full border border-[var(--color-border)] px-4 py-2 text-sm font-semibold transition-colors hover:bg-[var(--color-surface-2)]"
            style={{ color: COL.solar }}
          >
            {playing ? "⏸ หยุด" : "▶ เล่น"}
          </button>
          <div className="mono rounded-full bg-[var(--color-bg)]/60 px-3 py-2 text-sm tabular-nums">
            {String(hour).padStart(2, "0")}:00 น.
          </div>
        </div>
      </div>

      {/* แถบเลื่อนเวลา */}
      <input
        type="range"
        min={0}
        max={23}
        value={hour}
        onChange={(e) => {
          setPlaying(false);
          setHour(Number(e.target.value));
        }}
        aria-label="เลือกเวลาในแต่ละวัน"
        className="mb-5 w-full accent-[var(--color-cyan)]"
      />

      <div className="grid gap-5 lg:grid-cols-[1.5fr_1fr] lg:items-start">
        {/* กราฟพลังงานตลอดวัน */}
        <div className="overflow-hidden rounded-xl border border-[var(--color-border)] bg-[var(--color-bg)]/50">
          <svg viewBox={`0 0 ${W} ${H}`} className="h-full w-full" role="img" aria-label="กราฟการผลิตและใช้พลังงานตลอดวัน">
            <defs>
              <linearGradient id="solarFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={COL.solar} stopOpacity="0.45" />
                <stop offset="100%" stopColor={COL.solar} stopOpacity="0.02" />
              </linearGradient>
            </defs>

            {/* เส้นกริดแนวนอน */}
            {[0, 1, 2, 3, 4, 5].map((kw) => (
              <g key={kw}>
                <line x1={PAD.l} y1={yKw(kw)} x2={W - PAD.r} y2={yKw(kw)} stroke="var(--color-border)" strokeWidth="1" />
                <text x={PAD.l - 6} y={yKw(kw) + 3} textAnchor="end" fontSize="9" fill="var(--color-text-dim)">
                  {kw}kW
                </text>
              </g>
            ))}

            {/* พื้นที่โซลาร์ + เส้นโหลด */}
            <path d={areaPath(day, "solarKw")} fill="url(#solarFill)" stroke={COL.solar} strokeWidth="2" />
            <path d={linePath(day, (d) => yKw(d.loadKw))} fill="none" stroke={COL.load} strokeWidth="2" strokeDasharray="1 0" />
            {/* เส้นแบต SoC (สเกลขวา 0–100%) */}
            <path d={linePath(day, (d) => ySoc(d.socPct))} fill="none" stroke={COL.battery} strokeWidth="1.6" strokeDasharray="4 4" opacity="0.85" />

            {/* playhead */}
            <line x1={px} y1={PAD.t} x2={px} y2={PAD.t + PLOT_H} stroke="var(--color-text)" strokeWidth="1" opacity="0.5" />
            <circle cx={px} cy={yKw(now.solarKw)} r="4.5" fill={COL.solar} stroke="var(--color-bg)" strokeWidth="1.5" />
            <circle cx={px} cy={yKw(now.loadKw)} r="4.5" fill={COL.load} stroke="var(--color-bg)" strokeWidth="1.5" />
            <circle cx={px} cy={ySoc(now.socPct)} r="4" fill={COL.battery} stroke="var(--color-bg)" strokeWidth="1.5" />

            {/* แกนเวลา */}
            {[0, 6, 12, 18, 23].map((h) => (
              <text key={h} x={x(h)} y={H - 8} textAnchor="middle" fontSize="9" fill="var(--color-text-dim)">
                {String(h).padStart(2, "0")}:00
              </text>
            ))}
          </svg>
          <div className="flex flex-wrap gap-x-4 gap-y-1 border-t border-[var(--color-border)] px-4 py-2 text-xs">
            <Legend color={COL.solar} label="ผลิตจากโซลาร์" />
            <Legend color={COL.load} label="บ้านใช้" />
            <Legend color={COL.battery} label="แบตคงเหลือ (%)" dashed />
          </div>
        </div>

        {/* แผงค่าปัจจุบัน + ภาพท้องฟ้า */}
        <div className="space-y-3">
          <div
            className="relative h-24 overflow-hidden rounded-xl border border-[var(--color-border)]"
            style={{ background: `linear-gradient(180deg, ${skyTop}, ${skyBottom})` }}
          >
            <motion.div
              className="absolute text-3xl"
              animate={{
                left: `${(hour / 23) * 86 + 6}%`,
                top: isDay ? `${28 + 32 * Math.abs(hour - 12) / 6}%` : "62%",
                opacity: isDay ? 1 : 0.35,
              }}
              transition={{ duration: 0.5 }}
            >
              {isDay ? "☀️" : "🌙"}
            </motion.div>
            <div className="absolute bottom-2 left-3 text-2xl">🏠</div>
            <div className="absolute bottom-2 right-3 flex items-end gap-1 text-xl">
              <span>🔆</span>
            </div>
          </div>

          <Metric label="ผลิตจากโซลาร์" value={`${now.solarKw} kW`} color={COL.solar} bar={now.solarKw / MAX_KW} />
          <Metric label="บ้านใช้ไฟ" value={`${now.loadKw} kW`} color={COL.load} bar={now.loadKw / MAX_KW} />
          <Metric label="แบตเตอรี่" value={`${now.socPct}%`} color={COL.battery} bar={now.socPct / 100}
            hint={now.batteryKw > 0 ? `กำลังชาร์จ +${now.batteryKw}kW` : now.batteryKw < 0 ? `กำลังจ่าย ${now.batteryKw}kW` : "นิ่ง"} />
          <div
            className="rounded-lg border px-3 py-2 text-sm"
            style={{
              borderColor: now.gridKw > 0 ? "var(--color-border)" : COL.solar,
              background: now.gridKw <= 0 ? `color-mix(in oklch, ${COL.solar} 10%, transparent)` : "var(--color-bg)",
            }}
          >
            {now.gridKw > 0 ? (
              <span>🗼 ดึงจากกริด <b className="tabular-nums">{now.gridKw} kW</b> (ไฟไม่พอ)</span>
            ) : now.gridKw < 0 ? (
              <span style={{ color: COL.solar }}>💰 ขายคืนกริด <b className="tabular-nums">{-now.gridKw} kW</b> (ไฟเหลือ)</span>
            ) : (
              <span>⚖️ พอดี — ไม่แตะกริด (พึ่งตัวเองได้)</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function Legend({ color, label, dashed }: { color: string; label: string; dashed?: boolean }) {
  return (
    <span className="flex items-center gap-1.5 text-[var(--color-text-soft)]">
      <span
        className="inline-block h-0.5 w-4"
        style={{ background: dashed ? `repeating-linear-gradient(90deg, ${color} 0 4px, transparent 4px 7px)` : color }}
      />
      {label}
    </span>
  );
}

function Metric({
  label,
  value,
  color,
  bar,
  hint,
}: {
  label: string;
  value: string;
  color: string;
  bar: number;
  hint?: string;
}) {
  return (
    <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)]/40 px-3 py-2">
      <div className="flex items-baseline justify-between">
        <span className="text-sm text-[var(--color-text-soft)]">{label}</span>
        <span className="mono text-sm font-semibold tabular-nums" style={{ color }}>
          {value}
        </span>
      </div>
      <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-[var(--color-surface-2)]">
        <motion.div
          className="h-full rounded-full"
          style={{ background: color }}
          animate={{ width: `${Math.min(100, Math.max(0, bar * 100))}%` }}
          transition={{ duration: 0.4 }}
        />
      </div>
      {hint && <p className="mt-1 text-[11px] text-[var(--color-text-dim)]">{hint}</p>}
    </div>
  );
}
