"use client";

import { motion } from "framer-motion";

/**
 * ภาพรวม "บ้านพลังงานอัจฉริยะ / ไมโครกริด"
 * แหล่งผลิต (โซลาร์) + กักเก็บ (ESS) + รถ V2G + กริด มาเจอกันที่บัสบาร์กลาง
 * โดยมีสมอง IoT คอยวัด/สั่งทุกจุด — เป็นภาพใหญ่ที่ร้อยทุกกรณีศึกษาเข้าด้วยกัน
 */

const W = 820;
const H = 460;
const BUS_Y = 250;

// สีตามบทบาทของพลังงาน
const C = {
  gen: "#fbbf24", // ผลิต (โซลาร์)
  store: "#22d3ee", // กักเก็บ (แบต)
  grid: "#a78bfa", // กริด
  load: "#34d399", // โหลด/บ้าน
  v2g: "#f472b6", // รถ V2G
  iot: "var(--color-cyan)",
};

interface FlowDef {
  d: string;
  color: string;
  count: number;
  dur: number;
  /** สลับทิศ (จ่ายเข้า/ออกบัส) — เริ่มจากปลายทาง */
  reverse?: boolean;
}

// เส้นพลังงานเชื่อมเข้าบัสบาร์กลาง
const FLOWS: FlowDef[] = [
  { d: "M 150 150 L 150 244", color: C.gen, count: 3, dur: 1.8 }, // โซลาร์ → บัส
  { d: "M 340 150 L 340 244", color: C.store, count: 2, dur: 2.2 }, // ESS → บัส (คายประจุ)
  { d: "M 670 150 L 670 244", color: C.grid, count: 2, dur: 2.4 }, // กริด → บัส (ซื้อไฟ)
  { d: "M 260 256 L 260 350", color: C.load, count: 3, dur: 1.6 }, // บัส → บ้าน
  { d: "M 500 256 L 500 350", color: C.v2g, count: 2, dur: 2 }, // บัส ↔ รถ
];

export function EnergyMicrogrid() {
  return (
    <div className="rounded-[var(--radius)] border border-[var(--color-border)] bg-[var(--color-bg-soft)]/60 p-4 backdrop-blur-sm sm:p-6">
      <div className="overflow-x-auto">
        <svg viewBox={`0 0 ${W} ${H}`} className="w-full min-w-[680px]" role="img" aria-label="ภาพรวมบ้านพลังงานอัจฉริยะ: โซลาร์ แบตเตอรี่ รถ V2G และกริด เชื่อมกันที่บัสบาร์กลาง ควบคุมด้วยระบบ IoT">
          {/* ── บัสบาร์กลาง (สายไฟหลักของบ้าน) ── */}
          <line x1="110" y1={BUS_Y} x2="710" y2={BUS_Y} stroke="var(--color-text-dim)" strokeWidth="4" strokeLinecap="round" opacity="0.5" />
          <motion.line
            x1="110"
            y1={BUS_Y}
            x2="710"
            y2={BUS_Y}
            stroke="var(--color-cyan)"
            strokeWidth="4"
            strokeLinecap="round"
            animate={{ opacity: [0.15, 0.5, 0.15] }}
            transition={{ duration: 3, repeat: Infinity }}
          />
          <text x="410" y={BUS_Y + 26} textAnchor="middle" fontSize="11" fill="var(--color-text-dim)" className="mono">
            บัสบาร์ในบ้าน (Home Energy Bus)
          </text>

          {/* ── เส้นพลังงาน + อนุภาคไหล ── */}
          {FLOWS.map((f, i) => (
            <FlowLine key={i} {...f} />
          ))}

          {/* ── ดวงอาทิตย์ → โซลาร์ ── */}
          <motion.circle cx="80" cy="70" r="16" fill={C.gen} animate={{ opacity: [0.6, 1, 0.6] }} transition={{ duration: 2.5, repeat: Infinity }} style={{ filter: `drop-shadow(0 0 10px ${C.gen})` }} />
          {[0, 60, 120].map((a) => (
            <motion.line key={a} x1="80" y1="70" x2={80 + 26 * Math.cos((a * Math.PI) / 180)} y2={70 + 26 * Math.sin((a * Math.PI) / 180)} stroke={C.gen} strokeWidth="2" animate={{ opacity: [0.2, 0.9, 0.2] }} transition={{ duration: 2, repeat: Infinity, delay: a / 120 }} />
          ))}

          <Node x={150} y={120} emoji="🔆" label="โซลาร์" color={C.gen} role="ผลิต" />
          <Node x={340} y={120} emoji="🔋" label="แบตเตอรี่" color={C.store} role="กักเก็บ" bidi />
          <Node x={670} y={120} emoji="🗼" label="กริด" color={C.grid} role="ซื้อ/ขายไฟ" bidi />
          <Node x={260} y={378} emoji="🏠" label="บ้าน" color={C.load} role="ใช้ไฟ" />
          <Node x={500} y={378} emoji="🚗" label="รถ EV" color={C.v2g} role="V2G สองทาง" bidi />

          {/* ── สมอง IoT คอยวัด/สั่ง (เส้นประไปทุกจุด) ── */}
          {[150, 340, 670, 260, 500].map((x, i) => {
            const y = i < 3 ? 96 : 354;
            return <line key={i} x1="410" y1="56" x2={x} y2={y} stroke="var(--color-cyan)" strokeWidth="1" strokeDasharray="2 5" opacity="0.4" />;
          })}
          <motion.g animate={{ scale: [1, 1.06, 1] }} transition={{ duration: 2.4, repeat: Infinity }} style={{ transformOrigin: "410px 40px" }}>
            <rect x="350" y="14" width="120" height="48" rx="12" fill="var(--color-surface-2)" stroke="var(--color-cyan)" strokeWidth="1.5" />
            <text x="410" y="36" textAnchor="middle" fontSize="18">🧠</text>
            <text x="410" y="53" textAnchor="middle" fontSize="11" fontWeight="600" fill="var(--color-cyan)">สมอง IoT (EMS)</text>
          </motion.g>
        </svg>
      </div>

      {/* ── คำอธิบายสี ── */}
      <div className="mt-4 flex flex-wrap justify-center gap-x-5 gap-y-2 text-xs">
        <Legend color={C.gen} label="ผลิต (โซลาร์)" />
        <Legend color={C.store} label="กักเก็บ (แบต) ↕" />
        <Legend color={C.grid} label="กริด ↕" />
        <Legend color={C.v2g} label="รถ V2G ↕" />
        <Legend color={C.load} label="ใช้ไฟในบ้าน" />
      </div>
      <p className="mono mt-3 text-center text-xs text-[var(--color-text-dim)]">
        ทุกหน่วยมาเจอกันที่บัสบาร์ · ระบบ IoT วัดและสั่งทุกวินาทีว่าจะ เก็บ / ใช้ / ขาย พลังงาน
      </p>
    </div>
  );
}

function FlowLine({ d, color, count, dur, reverse }: FlowDef) {
  return (
    <>
      <path d={d} fill="none" stroke="var(--color-border)" strokeWidth="1.5" />
      {Array.from({ length: count }).map((_, i) => (
        <motion.circle
          key={i}
          r="4.5"
          fill={color}
          animate={{
            offsetDistance: reverse ? ["100%", "0%"] : ["0%", "100%"],
            opacity: [0, 1, 1, 0],
          }}
          transition={{ duration: dur, repeat: Infinity, delay: (i * dur) / count, ease: "linear" }}
          style={{ offsetPath: `path('${d}')`, filter: `drop-shadow(0 0 5px ${color})` }}
        />
      ))}
    </>
  );
}

function Node({
  x,
  y,
  emoji,
  label,
  color,
  role,
  bidi,
}: {
  x: number;
  y: number;
  emoji: string;
  label: string;
  color: string;
  role: string;
  bidi?: boolean;
}) {
  return (
    <g>
      <rect x={x - 30} y={y - 30} width="60" height="60" rx="14" fill="var(--color-surface)" stroke={color} strokeWidth="1.5" />
      <text x={x} y={y + 8} textAnchor="middle" fontSize="26">{emoji}</text>
      <text x={x} y={y + 48} textAnchor="middle" fontSize="12" fontWeight="600" fill={color}>
        {label}
        {bidi ? " ↕" : ""}
      </text>
      <text x={x} y={y + 63} textAnchor="middle" fontSize="10" fill="var(--color-text-dim)">{role}</text>
    </g>
  );
}

function Legend({ color, label }: { color: string; label: string }) {
  return (
    <span className="flex items-center gap-1.5 text-[var(--color-text-soft)]">
      <span className="h-2.5 w-2.5 rounded-full" style={{ background: color, boxShadow: `0 0 6px ${color}` }} />
      {label}
    </span>
  );
}
