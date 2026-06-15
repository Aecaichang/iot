"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { PEAK_DAY, PEAK_CEILING_KW } from "@/lib/energyDeep";

const W = 680;
const H = 280;
const PAD = { l: 44, r: 16, t: 24, b: 30 };
const PLOT_W = W - PAD.l - PAD.r;
const PLOT_H = H - PAD.t - PAD.b;
const MAX_KW = 150;

const COL_RAW = "#f472b6";
const COL_GRID = "#34d399";
const COL_CEIL = "#fbbf24";

function x(hour: number): number {
  return PAD.l + (hour / 23) * PLOT_W;
}
function y(kw: number): number {
  return PAD.t + PLOT_H - (kw / MAX_KW) * PLOT_H;
}

export function PeakShaving() {
  const [on, setOn] = useState(true);

  // โหลดที่ดึงจากกริดจริง = ดีมานด์ − ที่แบตช่วยจ่าย (เมื่อเปิดระบบ)
  const gridSeries = PEAK_DAY.map((p) => ({
    hour: p.hour,
    kw: on ? Math.max(0, p.demandKw - Math.max(0, p.batteryKw)) : p.demandKw,
  }));

  const rawPeak = Math.max(...PEAK_DAY.map((p) => p.demandKw));
  const shavedPeak = Math.max(...gridSeries.map((p) => p.kw));

  const rawArea =
    `M ${x(0)},${y(0)} ` +
    PEAK_DAY.map((p) => `L ${x(p.hour)},${y(p.demandKw)}`).join(" ") +
    ` L ${x(23)},${y(0)} Z`;
  const gridLine = "M " + gridSeries.map((p) => `${x(p.hour)},${y(p.kw)}`).join(" L ");
  const gridArea = gridLine + ` L ${x(23)},${y(0)} L ${x(0)},${y(0)} Z`;

  return (
    <div className="rounded-[var(--radius)] border border-[var(--color-border)] bg-[var(--color-surface)] p-5 sm:p-7">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="text-lg font-semibold">Peak Shaving — แบตช่วยรีดยอดพีค</h3>
          <p className="text-sm text-[var(--color-text-dim)]">
            การไฟฟ้าคิด &ldquo;ค่าความต้องการพลังไฟฟ้า&rdquo; (demand charge) จากยอดพีคสูงสุด ระบบ IoT จึงสั่งแบตจ่ายไฟแทนช่วงพีค เพื่อกดยอดลง
          </p>
        </div>
        <button
          onClick={() => setOn((v) => !v)}
          aria-pressed={on}
          className="rounded-full border px-4 py-2 text-sm font-semibold transition-colors"
          style={{
            borderColor: on ? COL_GRID : "var(--color-border)",
            color: on ? COL_GRID : "var(--color-text-soft)",
            background: on ? `color-mix(in oklch, ${COL_GRID} 14%, transparent)` : "var(--color-bg)",
          }}
        >
          {on ? "🔋 เปิดระบบแบต" : "⭕ ปิดระบบแบต"}
        </button>
      </div>

      <div className="overflow-hidden rounded-xl border border-[var(--color-border)] bg-[var(--color-bg)]/50">
        <svg viewBox={`0 0 ${W} ${H}`} className="w-full" role="img" aria-label="กราฟ peak shaving">
          <defs>
            <linearGradient id="gridFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={COL_GRID} stopOpacity="0.4" />
              <stop offset="100%" stopColor={COL_GRID} stopOpacity="0.03" />
            </linearGradient>
          </defs>

          {/* กริดแนวนอน */}
          {[0, 30, 60, 90, 120, 150].map((kw) => (
            <g key={kw}>
              <line x1={PAD.l} y1={y(kw)} x2={W - PAD.r} y2={y(kw)} stroke="var(--color-border)" strokeWidth="1" />
              <text x={PAD.l - 6} y={y(kw) + 3} textAnchor="end" fontSize="9" fill="var(--color-text-dim)">
                {kw}
              </text>
            </g>
          ))}

          {/* พื้นที่ดีมานด์ดิบ (เส้นประชมพู) */}
          <path d={rawArea} fill="none" stroke={COL_RAW} strokeWidth="1.6" strokeDasharray="5 4" opacity="0.8" />

          {/* พื้นที่ที่ดึงจากกริดจริง */}
          <motion.path
            d={gridArea}
            fill="url(#gridFill)"
            animate={{ d: gridArea }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
          />
          <motion.path
            d={gridLine}
            fill="none"
            stroke={COL_GRID}
            strokeWidth="2.5"
            animate={{ d: gridLine }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
          />

          {/* เส้นเพดาน demand charge */}
          <line x1={PAD.l} y1={y(PEAK_CEILING_KW)} x2={W - PAD.r} y2={y(PEAK_CEILING_KW)} stroke={COL_CEIL} strokeWidth="1.5" strokeDasharray="2 3" />
          <text x={W - PAD.r} y={y(PEAK_CEILING_KW) - 5} textAnchor="end" fontSize="9" fill={COL_CEIL} className="mono">
            เพดานคิดเงิน {PEAK_CEILING_KW}kW
          </text>

          {/* แกนเวลา */}
          {[0, 6, 12, 18, 23].map((h) => (
            <text key={h} x={x(h)} y={H - 9} textAnchor="middle" fontSize="9" fill="var(--color-text-dim)">
              {String(h).padStart(2, "0")}:00
            </text>
          ))}
          <text x={PAD.l - 30} y={PAD.t + PLOT_H / 2} fontSize="9" fill="var(--color-text-dim)" transform={`rotate(-90 ${PAD.l - 30} ${PAD.t + PLOT_H / 2})`} textAnchor="middle">
            กิโลวัตต์
          </text>
        </svg>
        <div className="flex flex-wrap gap-x-4 gap-y-1 border-t border-[var(--color-border)] px-4 py-2 text-xs">
          <Legend color={COL_RAW} label="ดีมานด์ดิบ" dashed />
          <Legend color={COL_GRID} label="ดึงจากกริดจริง" />
          <Legend color={COL_CEIL} label="เพดานคิดเงิน" dashed />
        </div>
      </div>

      {/* สรุปผล */}
      <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
        <Stat label="พีคก่อนใช้แบต" value={`${rawPeak} kW`} color={COL_RAW} />
        <Stat label={on ? "พีคหลังใช้แบต" : "พีคตอนนี้"} value={`${shavedPeak} kW`} color={on ? COL_GRID : COL_RAW} />
        <Stat
          label="ลดยอดพีคได้"
          value={on ? `${rawPeak - shavedPeak} kW` : "0 kW"}
          color={COL_CEIL}
          hint={on ? `≈ ${Math.round(((rawPeak - shavedPeak) / rawPeak) * 100)}% ของพีค` : "เปิดระบบเพื่อดูผล"}
        />
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

function Stat({
  label,
  value,
  color,
  hint,
}: {
  label: string;
  value: string;
  color: string;
  hint?: string;
}) {
  return (
    <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-bg)]/40 p-3">
      <div className="text-xs text-[var(--color-text-soft)]">{label}</div>
      <div className="mono mt-1 text-xl font-bold tabular-nums" style={{ color }}>
        {value}
      </div>
      {hint && <div className="mt-0.5 text-[11px] text-[var(--color-text-dim)]">{hint}</div>}
    </div>
  );
}
