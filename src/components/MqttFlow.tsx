"use client";

import { motion } from "framer-motion";

/**
 * อธิบายรูปแบบ Publish/Subscribe ของ MQTT
 * Publisher (เซนเซอร์) → Broker (ตัวกลาง) → Subscribers (ผู้รับ)
 */
const W = 760;
const H = 360;

const PUBLISHER = { x: 90, y: 180 };
const BROKER = { x: 380, y: 180 };
const SUBS = [
  { x: 660, y: 80, label: "📱", name: "แอปมือถือ" },
  { x: 660, y: 180, label: "💾", name: "ฐานข้อมูล" },
  { x: 660, y: 280, label: "🚨", name: "ระบบแจ้งเตือน" },
];

export function MqttFlow() {
  return (
    <div className="overflow-x-auto rounded-[var(--radius)] border border-[var(--color-border)] bg-[var(--color-bg-soft)]/60 p-4 backdrop-blur-sm sm:p-6">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full min-w-[640px]" role="img" aria-label="แผนภาพการทำงานของ MQTT แบบ publish subscribe">
        {/* เส้น publisher → broker */}
        <line x1={PUBLISHER.x + 36} y1={PUBLISHER.y} x2={BROKER.x - 50} y2={BROKER.y} stroke="var(--color-border)" strokeWidth="1.5" />
        {/* แพ็กเก็ต publish */}
        <motion.circle
          r="6"
          fill="var(--color-cyan)"
          cy={PUBLISHER.y}
          animate={{ cx: [PUBLISHER.x + 36, BROKER.x - 50], opacity: [0, 1, 1, 0] }}
          transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
          style={{ filter: "drop-shadow(0 0 6px var(--color-cyan))" }}
        />
        <text x={(PUBLISHER.x + BROKER.x) / 2 - 10} y={PUBLISHER.y - 14} textAnchor="middle" fontSize="12" fill="var(--color-cyan)">
          publish → topic: temp
        </text>

        {/* broker → subscribers */}
        {SUBS.map((s, i) => (
          <g key={i}>
            <line x1={BROKER.x + 50} y1={BROKER.y} x2={s.x - 36} y2={s.y} stroke="var(--color-border)" strokeWidth="1.5" />
            <motion.circle
              r="6"
              fill="var(--color-violet)"
              animate={{
                cx: [BROKER.x + 50, s.x - 36],
                cy: [BROKER.y, s.y],
                opacity: [0, 1, 1, 0],
              }}
              transition={{ duration: 1.2, repeat: Infinity, repeatDelay: 0.6, delay: 1.4 + i * 0.12, ease: "easeInOut" }}
              style={{ filter: "drop-shadow(0 0 6px var(--color-violet))" }}
            />
          </g>
        ))}

        {/* Publisher */}
        <Node x={PUBLISHER.x} y={PUBLISHER.y} emoji="🌡️" sub="เซนเซอร์" color="var(--color-cyan)" />

        {/* Broker */}
        <g>
          <motion.rect
            x={BROKER.x - 50}
            y={BROKER.y - 50}
            width="100"
            height="100"
            rx="16"
            fill="var(--color-surface-2)"
            stroke="var(--color-text)"
            strokeWidth="2"
            animate={{ strokeOpacity: [0.4, 1, 0.4] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
          <text x={BROKER.x} y={BROKER.y - 6} textAnchor="middle" fontSize="30">
            🏤
          </text>
          <text x={BROKER.x} y={BROKER.y + 28} textAnchor="middle" fontSize="13" fontWeight="600" fill="var(--color-text)">
            Broker
          </text>
        </g>

        {/* Subscribers */}
        {SUBS.map((s, i) => (
          <Node key={i} x={s.x} y={s.y} emoji={s.label} sub={s.name} color="var(--color-violet)" />
        ))}
      </svg>

      <p className="mono mt-3 text-center text-xs text-[var(--color-text-dim)]">
        เซนเซอร์ส่งครั้งเดียวไปที่ Broker · ใครสมัครรับ topic นั้นก็ได้ข้อมูลพร้อมกัน
      </p>
    </div>
  );
}

function Node({
  x,
  y,
  emoji,
  sub,
  color,
}: {
  x: number;
  y: number;
  emoji: string;
  sub: string;
  color: string;
}) {
  return (
    <g>
      <rect x={x - 36} y={y - 36} width="72" height="72" rx="14" fill="var(--color-surface)" stroke={color} strokeWidth="1.5" />
      <text x={x} y={y + 6} textAnchor="middle" fontSize="28">
        {emoji}
      </text>
      <text x={x} y={y + 52} textAnchor="middle" fontSize="11" fontWeight="600" fill={color}>
        {sub}
      </text>
    </g>
  );
}
