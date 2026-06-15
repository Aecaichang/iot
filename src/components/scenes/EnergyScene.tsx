"use client";

import { motion } from "framer-motion";
import type { EnergyDeviceId } from "@/lib/energy";

export function EnergyScene({ id, color }: { id: EnergyDeviceId; color: string }) {
  return (
    <div className="relative aspect-[5/3] w-full overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg)]/60">
      <svg viewBox="0 0 400 240" className="h-full w-full" aria-hidden>
        {id === "solar" && <SolarScene color={color} />}
        {id === "ess" && <EssScene color={color} />}
        {id === "ev" && <EvScene color={color} />}
        {id === "v2g" && <V2gScene color={color} />}
        {id === "meter" && <MeterScene color={color} />}
      </svg>
    </div>
  );
}

function Unit({ x, y, label, color }: { x: number; y: number; label: string; color: string }) {
  return (
    <g>
      <rect x={x - 24} y={y - 24} width="48" height="48" rx="11" fill="var(--color-surface-2)" stroke={color} strokeWidth="1.5" />
      <text x={x} y={y + 7} textAnchor="middle" fontSize="22">
        {label}
      </text>
    </g>
  );
}

/** อนุภาคพลังงานวิ่งตาม path */
function EnergyParticles({ d, color, count = 3, dur = 2.4 }: { d: string; color: string; count?: number; dur?: number }) {
  return (
    <>
      <path d={d} fill="none" stroke="var(--color-border)" strokeWidth="1.5" />
      {Array.from({ length: count }).map((_, i) => (
        <motion.circle
          key={i}
          r="4"
          fill={color}
          animate={{ offsetDistance: ["0%", "100%"], opacity: [0, 1, 1, 0] }}
          transition={{ duration: dur, repeat: Infinity, delay: (i * dur) / count, ease: "linear" }}
          style={{ offsetPath: `path('${d}')`, filter: `drop-shadow(0 0 5px ${color})` }}
        />
      ))}
    </>
  );
}

/* ── โซลาร์: ดวงอาทิตย์ → แผง → อินเวอร์เตอร์ → บ้าน/กริด ── */
function SolarScene({ color }: { color: string }) {
  return (
    <g>
      {/* ดวงอาทิตย์ + รังสี */}
      <motion.circle
        cx="55"
        cy="55"
        r="20"
        fill={color}
        animate={{ opacity: [0.7, 1, 0.7] }}
        transition={{ duration: 2.5, repeat: Infinity }}
        style={{ filter: `drop-shadow(0 0 12px ${color})` }}
      />
      {[0, 45, 90, 135].map((a) => (
        <motion.line
          key={a}
          x1="55"
          y1="55"
          x2={55 + 34 * Math.cos((a * Math.PI) / 180)}
          y2={55 + 34 * Math.sin((a * Math.PI) / 180)}
          stroke={color}
          strokeWidth="2"
          animate={{ opacity: [0.2, 0.9, 0.2] }}
          transition={{ duration: 2, repeat: Infinity, delay: a / 180 }}
        />
      ))}

      {/* แผง → อินเวอร์เตอร์ → จุดแยก */}
      <Unit x={130} y={120} label="🔆" color={color} />
      <Unit x={230} y={120} label="🔄" color={color} />
      <EnergyParticles d="M 154 120 L 206 120" color={color} count={3} dur={1.6} />

      {/* อินเวอร์เตอร์ → บ้าน และ → กริด */}
      <Unit x={345} y={70} label="🏠" color={color} />
      <Unit x={345} y={175} label="🗼" color={color} />
      <EnergyParticles d="M 254 112 Q 300 90 321 76" color="#34d399" count={2} dur={1.8} />
      <EnergyParticles d="M 254 128 Q 300 155 321 168" color="#34d399" count={2} dur={1.8} />

      <text x="200" y="222" textAnchor="middle" fontSize="11" fill="var(--color-text-dim)">
        DC → AC · อ่านค่าผ่าน Modbus / SunSpec
      </text>
    </g>
  );
}

/* ── EV: รถ + ตู้ชาร์จ แบตค่อย ๆ เต็ม + OCPP ขึ้นคลาวด์ ── */
function EvScene({ color }: { color: string }) {
  return (
    <g>
      <Unit x={90} y={150} label="🔌" color={color} />
      <Unit x={250} y={150} label="🚗" color={color} />

      {/* สายชาร์จ + พลังงานไหลเข้ารถ */}
      <EnergyParticles d="M 114 150 L 226 150" color={color} count={4} dur={1.4} />

      {/* แบตเตอรี่ค่อย ๆ เต็ม */}
      <rect x={300} y={135} width="44" height="30" rx="5" fill="none" stroke={color} strokeWidth="2" />
      <rect x={344} y={143} width="5" height="14" rx="2" fill={color} />
      <motion.rect
        x={303}
        y={138}
        width="38"
        height="24"
        rx="3"
        fill={color}
        style={{ transformOrigin: "303px 150px" }}
        animate={{ scaleX: [0, 1, 1] }}
        transition={{ duration: 3, repeat: Infinity, times: [0, 0.85, 1], ease: "easeInOut" }}
      />

      {/* ตู้ → คลาวด์ (OCPP) */}
      <Unit x={90} y={55} label="☁️" color="var(--color-cyan)" />
      <motion.circle
        r="4"
        fill="var(--color-cyan)"
        cx="90"
        animate={{ cy: [126, 79], opacity: [0, 1, 1, 0] }}
        transition={{ duration: 1.6, repeat: Infinity }}
        style={{ filter: "drop-shadow(0 0 5px var(--color-cyan))" }}
      />
      <line x1="90" y1="126" x2="90" y2="79" stroke="var(--color-border)" strokeWidth="1.5" strokeDasharray="3 4" />
      <text x="150" y="48" textAnchor="middle" fontSize="10" fill="var(--color-cyan)" className="mono">
        OCPP: MeterValues
      </text>

      <text x="200" y="222" textAnchor="middle" fontSize="11" fill="var(--color-text-dim)">
        StartTransaction → ชาร์จ → StopTransaction (คิดเงิน)
      </text>
    </g>
  );
}

/* ── ESS: โซลาร์/กริด → แบต → บ้าน + BMS ขึ้นคลาวด์ + SoC เต็มวน ── */
function EssScene({ color }: { color: string }) {
  return (
    <g>
      <Unit x={70} y={75} label="🔆" color="#fbbf24" />
      <Unit x={70} y={175} label="🗼" color={color} />
      <Unit x={330} y={120} label="🏠" color="#34d399" />

      {/* แบตเตอรี่กลางเวที — SoC เต็มวน */}
      <rect x={170} y={92} width="60" height="56" rx="8" fill="var(--color-surface-2)" stroke={color} strokeWidth="2" />
      <rect x={230} y={108} width="6" height="24" rx="2" fill={color} />
      <motion.rect
        x={174}
        y={96}
        width="52"
        height="48"
        rx="4"
        fill={color}
        style={{ transformOrigin: "174px 144px" }}
        animate={{ scaleY: [0.25, 1, 1, 0.25], opacity: [0.5, 0.9, 0.9, 0.5] }}
        transition={{ duration: 6, repeat: Infinity, times: [0, 0.45, 0.6, 1], ease: "easeInOut" }}
      />
      <text x={200} y={166} textAnchor="middle" fontSize="10" fill="var(--color-text-dim)">SoC</text>

      {/* โซลาร์/กริด → แบต (ชาร์จ) */}
      <EnergyParticles d="M 94 80 Q 140 90 168 108" color="#fbbf24" count={2} dur={1.8} />
      <EnergyParticles d="M 94 170 Q 140 150 168 132" color={color} count={2} dur={2.2} />
      {/* แบต → บ้าน (จ่าย) */}
      <EnergyParticles d="M 232 120 L 306 120" color="#34d399" count={3} dur={1.6} />

      {/* BMS → คลาวด์ */}
      <Unit x={200} y={45} label="☁️" color="var(--color-cyan)" />
      <line x1="200" y1="92" x2="200" y2="69" stroke="var(--color-border)" strokeWidth="1.5" strokeDasharray="3 4" />
      <motion.circle r="3.5" fill="var(--color-cyan)" cx="200" animate={{ cy: [90, 69], opacity: [0, 1, 0] }} transition={{ duration: 1.8, repeat: Infinity }} style={{ filter: "drop-shadow(0 0 4px var(--color-cyan))" }} />

      <text x="200" y="226" textAnchor="middle" fontSize="11" fill="var(--color-text-dim)">
        เก็บไฟถูก/แดดจัด → จ่ายตอนแพง · BMS over CAN
      </text>
    </g>
  );
}

/* ── V2G: รถ ↔ ตู้ สองทาง (ชาร์จ/จ่ายคืน) สลับทิศ + บ้าน/กริด ── */
function V2gScene({ color }: { color: string }) {
  return (
    <g>
      <Unit x={250} y={70} label="🚗" color={color} />
      <Unit x={110} y={70} label="🔌" color={color} />
      <Unit x={110} y={175} label="🏠" color="#34d399" />
      <Unit x={250} y={175} label="🗼" color="#a78bfa" />

      {/* รถ ↔ ตู้: พลังงานสองทาง (สลับสีตามทิศ) */}
      <path d="M 134 70 L 226 70" fill="none" stroke="var(--color-border)" strokeWidth="1.5" />
      <motion.circle
        r="4"
        fill={color}
        cy="70"
        animate={{ cx: [134, 226, 134], opacity: [0, 1, 0, 1, 0] }}
        transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
        style={{ filter: `drop-shadow(0 0 5px ${color})` }}
      />
      <text x="180" y="58" textAnchor="middle" fontSize="9" fill={color}>⇄ สองทาง</text>

      {/* ตู้ → บ้าน (จ่ายคืน) */}
      <EnergyParticles d="M 110 94 L 110 151" color="#34d399" count={2} dur={2} />
      {/* ตู้ ↔ กริด */}
      <EnergyParticles d="M 250 94 L 250 151" color="#a78bfa" count={2} dur={2.2} />

      <text x="200" y="222" textAnchor="middle" fontSize="11" fill="var(--color-text-dim)">
        รถเป็นแบตเคลื่อนที่ · ISO 15118 + OCPP
      </text>
    </g>
  );
}

/* ── สมาร์ตมิเตอร์: บ้าน ↔ มิเตอร์ ↔ การไฟฟ้า (สองทาง) ── */
function MeterScene({ color }: { color: string }) {
  return (
    <g>
      <Unit x={70} y={120} label="🏠" color={color} />
      <Unit x={200} y={120} label="⚡" color={color} />
      <Unit x={330} y={120} label="🏢" color={color} />

      {/* บ้าน → มิเตอร์ */}
      <EnergyParticles d="M 94 120 L 176 120" color={color} count={3} dur={1.8} />
      {/* มิเตอร์ → การไฟฟ้า (อ่านค่า) */}
      <EnergyParticles d="M 224 112 L 306 112" color="#a78bfa" count={2} dur={2} />
      {/* การไฟฟ้า → มิเตอร์ (สั่งกลับ) ลูกศรย้อน */}
      <motion.circle
        r="3.5"
        fill="var(--color-cyan)"
        cy="130"
        animate={{ cx: [306, 224], opacity: [0, 1, 1, 0] }}
        transition={{ duration: 2.4, repeat: Infinity, delay: 1 }}
      />
      <line x1="224" y1="130" x2="306" y2="130" stroke="var(--color-border)" strokeWidth="1" strokeDasharray="3 4" />

      <text x="200" y="195" textAnchor="middle" fontSize="11" fill="var(--color-text-dim)">
        อ่านค่าอัตโนมัติสองทาง · DLMS/COSEM
      </text>
    </g>
  );
}
