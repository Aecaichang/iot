"use client";

import { motion } from "framer-motion";

// โหนดในเครือข่าย (พิกัดบน viewBox 800x500)
const NODES = [
  { x: 120, y: 110 },
  { x: 300, y: 70 },
  { x: 480, y: 130 },
  { x: 660, y: 90 },
  { x: 200, y: 280 },
  { x: 400, y: 250 },
  { x: 600, y: 300 },
  { x: 140, y: 420 },
  { x: 340, y: 410 },
  { x: 560, y: 440 },
  { x: 700, y: 380 },
];

// เส้นเชื่อมระหว่างโหนด (index)
const LINKS: [number, number][] = [
  [0, 1], [1, 2], [2, 3], [0, 4], [1, 5], [2, 5], [3, 6],
  [4, 5], [5, 6], [4, 7], [5, 8], [6, 9], [6, 10], [7, 8], [8, 9], [9, 10],
];

export function Hero() {
  return (
    <header className="relative flex min-h-[92vh] flex-col justify-center overflow-hidden px-5 sm:px-8">
      {/* เครือข่ายเคลื่อนไหวพื้นหลัง */}
      <svg
        className="pointer-events-none absolute inset-0 h-full w-full opacity-70"
        viewBox="0 0 800 500"
        preserveAspectRatio="xMidYMid slice"
        aria-hidden
      >
        <defs>
          <radialGradient id="nodeGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="var(--color-cyan)" stopOpacity="0.9" />
            <stop offset="100%" stopColor="var(--color-cyan)" stopOpacity="0" />
          </radialGradient>
        </defs>

        {LINKS.map(([a, b], i) => (
          <g key={i}>
            <line
              x1={NODES[a].x}
              y1={NODES[a].y}
              x2={NODES[b].x}
              y2={NODES[b].y}
              stroke="var(--color-border)"
              strokeWidth="1"
            />
            {/* แพ็กเก็ตข้อมูลวิ่งตามเส้น */}
            <motion.circle
              r="3"
              fill="var(--color-cyan)"
              initial={{ cx: NODES[a].x, cy: NODES[a].y, opacity: 0 }}
              animate={{
                cx: [NODES[a].x, NODES[b].x],
                cy: [NODES[a].y, NODES[b].y],
                opacity: [0, 1, 1, 0],
              }}
              transition={{
                duration: 2.4,
                repeat: Infinity,
                delay: (i % 6) * 0.6,
                ease: "easeInOut",
              }}
            />
          </g>
        ))}

        {NODES.map((n, i) => (
          <g key={i}>
            <circle cx={n.x} cy={n.y} r="22" fill="url(#nodeGlow)" />
            <motion.circle
              cx={n.x}
              cy={n.y}
              r="5"
              fill="var(--color-text)"
              animate={{ scale: [1, 1.5, 1], opacity: [0.6, 1, 0.6] }}
              transition={{
                duration: 3,
                repeat: Infinity,
                delay: i * 0.3,
                ease: "easeInOut",
              }}
            />
          </g>
        ))}
      </svg>

      {/* เนื้อหา hero */}
      <div className="relative z-10 mx-auto w-full max-w-6xl">
        <motion.p
          className="mono mb-5 text-xs uppercase tracking-[0.3em] text-[var(--color-cyan)]"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          สื่อการเรียนรู้ · Internet of Things
        </motion.p>

        <motion.h1
          className="max-w-4xl text-[length:var(--text-hero)] font-bold leading-[0.98] tracking-tight"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
        >
          อุปกรณ์ IoT
          <br />
          <span className="bg-gradient-to-r from-[var(--color-cyan)] via-[var(--color-violet)] to-[var(--color-green)] bg-clip-text text-transparent">
            คุยกันได้อย่างไร?
          </span>
        </motion.h1>

        <motion.p
          className="mt-6 max-w-2xl text-lg text-[var(--color-text-soft)] sm:text-xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.25 }}
        >
          เรียนรู้มาตรฐานการเชื่อมต่ออุปกรณ์ IoT แต่ละประเภทผ่านภาพเคลื่อนไหว
          ดูว่าข้อมูลเดินทางจากเซนเซอร์ตัวเล็ก ๆ ไปจนถึงคลาวด์ได้อย่างไร
        </motion.p>

        <motion.div
          className="mt-10 flex flex-wrap gap-3"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <a
            href="#architecture"
            className="rounded-full bg-[var(--color-text)] px-6 py-3 text-sm font-semibold text-[var(--color-bg)] transition-transform hover:scale-[1.04]"
          >
            เริ่มเรียนรู้ ↓
          </a>
          <a
            href="#standards"
            className="rounded-full border border-[var(--color-border)] px-6 py-3 text-sm font-semibold text-[var(--color-text)] transition-colors hover:bg-[var(--color-surface)]"
          >
            ดูมาตรฐานทั้งหมด
          </a>
        </motion.div>
      </div>

      <motion.div
        className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
      >
        <span className="mono text-xs text-[var(--color-text-dim)]">เลื่อนลง</span>
      </motion.div>
    </header>
  );
}
