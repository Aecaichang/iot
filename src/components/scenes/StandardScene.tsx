"use client";

import { motion } from "framer-motion";

/**
 * ฉากอนิเมชั่นเฉพาะของแต่ละมาตรฐาน (viewBox 400x240)
 * เลือกตาม id ของมาตรฐาน
 */
export function StandardScene({ id, color }: { id: string; color: string }) {
  return (
    <div className="relative aspect-[5/3] w-full overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg)]/60">
      <svg viewBox="0 0 400 240" className="h-full w-full" aria-hidden>
        {scene(id, color)}
      </svg>
    </div>
  );
}

function scene(id: string, color: string) {
  switch (id) {
    case "wifi":
      return <WifiScene color={color} />;
    case "ble":
      return <BleScene color={color} />;
    case "zigbee":
      return <ZigbeeScene color={color} />;
    case "nfc":
      return <NfcScene color={color} />;
    case "lorawan":
      return <LoRaScene color={color} />;
    case "nbiot":
    case "ltem":
      return <CellularScene color={color} />;
    case "thread":
      return <ZigbeeScene color={color} />;
    case "ethernet":
      return <WiredStarScene color={color} />;
    case "rs485":
      return <BusScene color={color} />;
    default:
      return <WifiScene color={color} />;
  }
}

/* ── อุปกรณ์พื้นฐาน (ใช้ซ้ำ) ── */
function Box({ x, y, label, color }: { x: number; y: number; label: string; color: string }) {
  return (
    <g>
      <rect x={x - 22} y={y - 22} width="44" height="44" rx="10" fill="var(--color-surface-2)" stroke={color} strokeWidth="1.5" />
      <text x={x} y={y + 5} textAnchor="middle" fontSize="20">
        {label}
      </text>
    </g>
  );
}

/* ── Wi-Fi: เราเตอร์กลาง อุปกรณ์รอบ ๆ คลื่นกระจาย ── */
function WifiScene({ color }: { color: string }) {
  const devices = [
    { x: 80, y: 70, e: "💻" },
    { x: 70, y: 180, e: "📷" },
    { x: 320, y: 70, e: "📺" },
    { x: 330, y: 180, e: "🔌" },
  ];
  return (
    <g>
      {[1, 2, 3].map((r) => (
        <motion.circle
          key={r}
          cx="200"
          cy="120"
          r={30}
          fill="none"
          stroke={color}
          strokeWidth="2"
          initial={{ scale: 0.4, opacity: 0.8 }}
          animate={{ scale: [0.4, 3.2], opacity: [0.7, 0] }}
          transition={{ duration: 2.4, repeat: Infinity, delay: r * 0.7, ease: "easeOut" }}
          style={{ transformOrigin: "200px 120px" }}
        />
      ))}
      {devices.map((d, i) => (
        <g key={i}>
          <line x1="200" y1="120" x2={d.x} y2={d.y} stroke="var(--color-border)" strokeWidth="1" />
          <Box x={d.x} y={d.y} label={d.e} color={color} />
        </g>
      ))}
      <Box x={200} y={120} label="📶" color={color} />
    </g>
  );
}

/* ── BLE: สองอุปกรณ์ใกล้กัน ส่งพัลส์สั้น ๆ ── */
function BleScene({ color }: { color: string }) {
  return (
    <g>
      <Box x={130} y={120} label="⌚" color={color} />
      <Box x={270} y={120} label="📱" color={color} />
      <line x1="155" y1="120" x2="245" y2="120" stroke="var(--color-border)" strokeWidth="1" strokeDasharray="4 4" />
      <motion.circle
        r="5"
        fill={color}
        animate={{ cx: [155, 245, 155], opacity: [1, 1, 0, 1] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        cy="120"
        style={{ filter: `drop-shadow(0 0 6px ${color})` }}
      />
      <text x="200" y="170" textAnchor="middle" fontSize="11" fill="var(--color-text-dim)">
        ส่งทีละนิด แล้วหลับ — ประหยัดแบต
      </text>
    </g>
  );
}

/* ── Zigbee: ตาข่าย แพ็กเก็ตกระโดดทีละโหนด ── */
function ZigbeeScene({ color }: { color: string }) {
  const nodes = [
    { x: 60, y: 120 },
    { x: 150, y: 60 },
    { x: 160, y: 190 },
    { x: 260, y: 110 },
    { x: 340, y: 170 },
  ];
  const path = [0, 1, 3, 4];
  return (
    <g>
      {[[0, 1], [0, 2], [1, 3], [2, 3], [3, 4], [2, 4]].map(([a, b], i) => (
        <line key={i} x1={nodes[a].x} y1={nodes[a].y} x2={nodes[b].x} y2={nodes[b].y} stroke="var(--color-border)" strokeWidth="1" />
      ))}
      {nodes.map((n, i) => (
        <Box key={i} x={n.x} y={n.y} label="💡" color={color} />
      ))}
      {path.slice(0, -1).map((p, i) => {
        const from = nodes[path[i]];
        const to = nodes[path[i + 1]];
        return (
          <motion.circle
            key={i}
            r="5"
            fill={color}
            cx={from.x}
            cy={from.y}
            animate={{ cx: [from.x, to.x], cy: [from.y, to.y], opacity: [0, 1, 1, 0] }}
            transition={{ duration: 1, repeat: Infinity, repeatDelay: 2, delay: i * 1, ease: "easeInOut" }}
            style={{ filter: `drop-shadow(0 0 6px ${color})` }}
          />
        );
      })}
    </g>
  );
}

/* ── NFC: สองการ์ดเกือบแตะกัน พัลส์ตอนแตะ ── */
function NfcScene({ color }: { color: string }) {
  return (
    <g>
      <motion.g animate={{ x: [-18, 0, 0, -18] }} transition={{ duration: 3, repeat: Infinity, times: [0, 0.3, 0.7, 1] }}>
        <Box x={160} y={120} label="💳" color={color} />
      </motion.g>
      <Box x={245} y={120} label="🏧" color={color} />
      <motion.circle
        cx="205"
        cy="120"
        r="14"
        fill="none"
        stroke={color}
        strokeWidth="2"
        animate={{ scale: [0, 1.6, 0], opacity: [0, 1, 0] }}
        transition={{ duration: 3, repeat: Infinity, times: [0.3, 0.5, 0.7] }}
        style={{ transformOrigin: "205px 120px" }}
      />
      <text x="200" y="180" textAnchor="middle" fontSize="11" fill="var(--color-text-dim)">
        ต้องแตะใกล้ &lt; 10 ซม.
      </text>
    </g>
  );
}

/* ── LoRaWAN: เซนเซอร์ไกล → เกตเวย์ สัญญาณช้า ยาว ── */
function LoRaScene({ color }: { color: string }) {
  return (
    <g>
      <Box x={50} y={170} label="🌾" color={color} />
      <Box x={350} y={70} label="🗼" color={color} />
      <path d="M 72 158 Q 200 40 328 82" fill="none" stroke="var(--color-border)" strokeWidth="1" strokeDasharray="5 5" />
      {[0, 1].map((k) => (
        <motion.circle
          key={k}
          r="5"
          fill={color}
          animate={{
            offsetDistance: ["0%", "100%"],
            opacity: [0, 1, 1, 0],
          }}
          transition={{ duration: 3.2, repeat: Infinity, delay: k * 1.6, ease: "linear" }}
          style={{
            offsetPath: "path('M 72 158 Q 200 40 328 82')",
            filter: `drop-shadow(0 0 6px ${color})`,
          }}
        />
      ))}
      <text x="200" y="220" textAnchor="middle" fontSize="11" fill="var(--color-text-dim)">
        ระยะหลายกิโลเมตร · ส่งข้อมูลก้อนเล็ก
      </text>
    </g>
  );
}

/* ── NB-IoT / Cellular: อุปกรณ์ → เสาสัญญาณ ── */
function CellularScene({ color }: { color: string }) {
  return (
    <g>
      <Box x={70} y={150} label="📟" color={color} />
      <Box x={330} y={150} label="🗼" color={color} />
      {/* คลื่นจากเสา */}
      {[1, 2, 3].map((r) => (
        <motion.path
          key={r}
          d={`M 330 ${130} A ${r * 18} ${r * 18} 0 0 0 330 ${110 - r * 6}`}
          fill="none"
          stroke={color}
          strokeWidth="2"
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 0.9, 0] }}
          transition={{ duration: 2, repeat: Infinity, delay: r * 0.4 }}
        />
      ))}
      <line x1="95" y1="150" x2="305" y2="150" stroke="var(--color-border)" strokeWidth="1" />
      <motion.circle
        r="5"
        fill={color}
        cy="150"
        animate={{ cx: [95, 305], opacity: [0, 1, 1, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        style={{ filter: `drop-shadow(0 0 6px ${color})` }}
      />
      <text x="200" y="200" textAnchor="middle" fontSize="11" fill="var(--color-text-dim)">
        ใช้เสาสัญญาณมือถือที่มีอยู่แล้ว
      </text>
    </g>
  );
}

function WiredStarScene({ color }: { color: string }) {
  const devices = [
    { x: 75, y: 65, e: "📷" },
    { x: 75, y: 175, e: "🖥️" },
    { x: 325, y: 65, e: "⚙️" },
    { x: 325, y: 175, e: "☁️" },
  ];

  return (
    <g>
      {devices.map((device, index) => (
        <g key={device.e}>
          <line x1="200" y1="120" x2={device.x} y2={device.y} stroke="var(--color-border)" />
          <motion.circle
            r="4"
            fill={color}
            animate={{ cx: [200, device.x, 200], cy: [120, device.y, 120] }}
            transition={{ duration: 2.2, repeat: Infinity, delay: index * 0.35 }}
          />
          <Box x={device.x} y={device.y} label={device.e} color={color} />
        </g>
      ))}
      <Box x={200} y={120} label="🔀" color={color} />
      <text x="200" y="225" textAnchor="middle" fontSize="11" fill="var(--color-text-dim)">
        สายตรง · เสถียร · latency คาดเดาได้
      </text>
    </g>
  );
}

function BusScene({ color }: { color: string }) {
  const devices = [
    { x: 75, e: "⚡" },
    { x: 165, e: "🔋" },
    { x: 255, e: "☀️" },
    { x: 345, e: "⚙️" },
  ];

  return (
    <g>
      <line x1="45" y1="145" x2="365" y2="145" stroke={color} strokeWidth="3" />
      {devices.map((device) => (
        <g key={device.x}>
          <line x1={device.x} y1="105" x2={device.x} y2="145" stroke="var(--color-border)" />
          <Box x={device.x} y={82} label={device.e} color={color} />
        </g>
      ))}
      <motion.circle
        cy="145"
        r="5"
        fill={color}
        animate={{ cx: [50, 360, 50] }}
        transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
        style={{ filter: `drop-shadow(0 0 6px ${color})` }}
      />
      <text x="200" y="190" textAnchor="middle" fontSize="11" fill="var(--color-text-dim)">
        Master ถาม · อุปกรณ์ตอบ ผ่านสาย bus เดียวกัน
      </text>
    </g>
  );
}
