"use client";

import { motion } from "framer-motion";
import { STANDARDS } from "@/lib/standards";

// แกน X = ระยะทำการ (log10 เมตร), แกน Y = พลังงาน (1-5)
const W = 760;
const H = 420;
const PAD = { l: 64, r: 28, t: 28, b: 56 };

// ระยะ log: 0.1 ม. (10^-1) ถึง 100,000 ม. (10^5)
const LOG_MIN = -1;
const LOG_MAX = 5;

function xPos(meters: number) {
  const v = Math.log10(meters);
  const t = (v - LOG_MIN) / (LOG_MAX - LOG_MIN);
  return PAD.l + t * (W - PAD.l - PAD.r);
}

function yPos(power: number) {
  const t = (power - 1) / (5 - 1);
  return H - PAD.b - t * (H - PAD.t - PAD.b);
}

const X_TICKS = [
  { m: 0.1, label: "10 ซม." },
  { m: 1, label: "1 ม." },
  { m: 10, label: "10 ม." },
  { m: 100, label: "100 ม." },
  { m: 1000, label: "1 กม." },
  { m: 10000, label: "10 กม." },
  { m: 100000, label: "100 กม." },
];

export function RangePowerChart() {
  return (
    <div className="overflow-x-auto rounded-[var(--radius)] border border-[var(--color-border)] bg-[var(--color-bg-soft)]/60 p-4 backdrop-blur-sm sm:p-6">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full min-w-[640px]" role="img" aria-label="กราฟเปรียบเทียบระยะทำการกับการใช้พลังงานของมาตรฐาน IoT">
        {/* เส้นกริดแกน X */}
        {X_TICKS.map((t) => (
          <g key={t.m}>
            <line x1={xPos(t.m)} y1={PAD.t} x2={xPos(t.m)} y2={H - PAD.b} stroke="var(--color-border)" strokeWidth="1" strokeDasharray="2 5" />
            <text x={xPos(t.m)} y={H - PAD.b + 22} textAnchor="middle" fontSize="12" fill="var(--color-text-dim)">
              {t.label}
            </text>
          </g>
        ))}

        {/* ป้ายแกน */}
        <text x={(W) / 2} y={H - 8} textAnchor="middle" fontSize="13" fill="var(--color-text-soft)">
          ระยะทำการ (ไกลขึ้น →)
        </text>
        <text x={-H / 2} y={18} textAnchor="middle" fontSize="13" fill="var(--color-text-soft)" transform="rotate(-90)">
          ใช้พลังงาน (สูงขึ้น ↑)
        </text>

        {/* จุดของแต่ละมาตรฐาน */}
        {STANDARDS.map((s, i) => {
          const cx = xPos(s.rangeMeters);
          const cy = yPos(s.power);
          return (
            <motion.g
              key={s.id}
              initial={{ opacity: 0, scale: 0 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.12, ease: [0.16, 1, 0.3, 1] }}
            >
              <motion.circle
                cx={cx}
                cy={cy}
                r="9"
                fill={s.color}
                animate={{ r: [9, 13, 9], opacity: [1, 0.6, 1] }}
                transition={{ duration: 2.5, repeat: Infinity, delay: i * 0.3 }}
                style={{ filter: `drop-shadow(0 0 8px ${s.color})` }}
              />
              <text x={cx} y={cy - 18} textAnchor="middle" fontSize="13" fontWeight="600" fill={s.color}>
                {s.name}
              </text>
            </motion.g>
          );
        })}
      </svg>

      <p className="mono mt-3 text-center text-xs text-[var(--color-text-dim)]">
        กฎทอง: ยิ่งส่งไกล + ความเร็วสูง มักยิ่งกินพลังงานมาก — เลือกมาตรฐานตามงาน
      </p>
    </div>
  );
}
