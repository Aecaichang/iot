"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { CHARGE_MODES } from "@/lib/energyDeep";

export function EvChargingTypes() {
  const [activeId, setActiveId] = useState(CHARGE_MODES[2].id);
  const active = CHARGE_MODES.find((m) => m.id === activeId)!;

  // เวลาสัมพัทธ์: ยิ่ง kW มาก แอนิเมชันเติมยิ่งเร็ว (สเกล log เพื่อให้เห็นต่างชัด)
  const fillDur = Math.max(1.4, 9 - Math.log2(active.kW) * 1.1);

  return (
    <div className="rounded-[var(--radius)] border border-[var(--color-border)] bg-[var(--color-surface)] p-5 sm:p-7">
      <h3 className="text-lg font-semibold">สถานีชาร์จ: AC ช้าแต่ถูก · DC เร็วแต่แพง</h3>
      <p className="mb-5 text-sm text-[var(--color-text-dim)]">
        ตู้ AC ส่งไฟสลับให้รถไปแปลงเป็น DC เองในตัว (จำกัดด้วย on-board charger) ส่วนตู้ DC แปลงไฟให้เสร็จแล้วอัดเข้าแบตตรง ๆ จึงเร็วกว่ามาก — เลือกดูทีละแบบ
      </p>

      {/* ปุ่มเลือกชนิด */}
      <div className="mb-6 grid grid-cols-2 gap-2 sm:grid-cols-4">
        {CHARGE_MODES.map((m) => (
          <button
            key={m.id}
            onClick={() => setActiveId(m.id)}
            aria-pressed={m.id === activeId}
            className="rounded-xl border px-3 py-3 text-left transition-all"
            style={{
              borderColor: m.id === activeId ? m.color : "var(--color-border)",
              background:
                m.id === activeId
                  ? `color-mix(in oklch, ${m.color} 14%, var(--color-surface))`
                  : "var(--color-bg)",
            }}
          >
            <span
              className="mono text-[10px] font-bold uppercase tracking-wider"
              style={{ color: m.color }}
            >
              {m.kind}
            </span>
            <div className="text-sm font-semibold">{m.name}</div>
            <div className="text-xs text-[var(--color-text-dim)]">{m.powerLabel}</div>
          </button>
        ))}
      </div>

      <div className="grid gap-5 lg:grid-cols-[1fr_1fr] lg:items-center">
        {/* แอนิเมชันรถ + แบตเติม */}
        <div className="relative overflow-hidden rounded-xl border border-[var(--color-border)] bg-[var(--color-bg)]/50 p-5">
          <svg viewBox="0 0 320 180" className="w-full" aria-hidden>
            {/* ตู้ชาร์จ */}
            <rect x="18" y="50" width="46" height="86" rx="8" fill="var(--color-surface-2)" stroke={active.color} strokeWidth="2" />
            <rect x="28" y="60" width="26" height="20" rx="3" fill="var(--color-bg)" />
            <text x="41" y="74" textAnchor="middle" fontSize="11" fill={active.color} className="mono">
              {active.kind}
            </text>
            <text x="41" y="104" textAnchor="middle" fontSize="14">⚡</text>
            <text x="41" y="126" textAnchor="middle" fontSize="9" fill="var(--color-text-dim)">{active.kW}kW</text>

            {/* สายชาร์จ + พลังงานวิ่ง (ความถี่ตาม kW) */}
            <path id="evcable" d="M 64 96 Q 110 96 138 110" fill="none" stroke="var(--color-border)" strokeWidth="2.5" />
            {Array.from({ length: 4 }).map((_, i) => (
              <motion.circle
                key={`${active.id}-${i}`}
                r="3.5"
                fill={active.color}
                animate={{ offsetDistance: ["0%", "100%"], opacity: [0, 1, 1, 0] }}
                transition={{ duration: fillDur / 3, repeat: Infinity, delay: (i * fillDur) / 12, ease: "linear" }}
                style={{ offsetPath: "path('M 64 96 Q 110 96 138 110')", filter: `drop-shadow(0 0 4px ${active.color})` }}
              />
            ))}

            {/* ตัวรถ */}
            <g transform="translate(150, 70)">
              <rect x="0" y="20" width="150" height="40" rx="12" fill="var(--color-surface-2)" stroke="var(--color-border)" strokeWidth="1.5" />
              <path d="M 22 22 L 40 4 L 110 4 L 128 22 Z" fill="var(--color-surface)" stroke="var(--color-border)" strokeWidth="1.5" />
              <circle cx="34" cy="62" r="13" fill="var(--color-bg)" stroke="var(--color-text-dim)" strokeWidth="3" />
              <circle cx="116" cy="62" r="13" fill="var(--color-bg)" stroke="var(--color-text-dim)" strokeWidth="3" />
              {/* แบตในรถ */}
              <rect x="52" y="30" width="60" height="20" rx="3" fill="var(--color-bg)" stroke={active.color} strokeWidth="1.5" />
              <motion.rect
                key={`fill-${active.id}`}
                x="54"
                y="32"
                height="16"
                rx="2"
                fill={active.color}
                style={{ transformOrigin: "54px 40px" }}
                animate={{ width: [3, 56] }}
                transition={{ duration: fillDur, repeat: Infinity, ease: "easeOut" }}
              />
              <text x="82" y="14" textAnchor="middle" fontSize="9" fill="var(--color-text-soft)">แบตรถ 60 kWh</text>
            </g>
          </svg>
          <p className="mt-1 text-center text-xs text-[var(--color-text-dim)]">
            ความเร็วการเติมในภาพสัมพันธ์กับกำลังไฟจริง
          </p>
        </div>

        {/* สเปก */}
        <div className="space-y-2.5">
          <Spec label="กำลังไฟ" value={active.powerLabel} color={active.color} big />
          <Spec label="หัวชาร์จ" value={active.connector} />
          <Spec label="ชาร์จ 0→80% (แบต 60kWh)" value={active.timeTo80} color={active.color} />
          <Spec label="ระยะที่ได้" value={active.rangePerHour} />
          <Spec label="พบได้ที่" value={active.where} />
          <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)]/40 px-3 py-2 text-xs text-[var(--color-text-dim)]">
            {active.kind === "AC"
              ? "ไฟ AC: รถแปลงเป็น DC เองด้วย on-board charger จึงถูกจำกัดความเร็วที่ตัวรถ — เหมาะกับจอดนาน ๆ"
              : "ไฟ DC: ตู้แปลงเป็น DC ให้แล้วคุยกับ BMS ของรถโดยตรง อัดได้แรง — เหมาะกับแวะชาร์จเร็วระหว่างทาง"}
          </div>
        </div>
      </div>
    </div>
  );
}

function Spec({
  label,
  value,
  color,
  big,
}: {
  label: string;
  value: string;
  color?: string;
  big?: boolean;
}) {
  return (
    <div className="flex items-baseline justify-between gap-3 border-b border-[var(--color-border)] pb-2">
      <span className="text-sm text-[var(--color-text-soft)]">{label}</span>
      <span
        className={`text-right font-semibold ${big ? "mono text-lg" : "text-sm"}`}
        style={{ color: color ?? "var(--color-text)" }}
      >
        {value}
      </span>
    </div>
  );
}
