"use client";

import { motion } from "framer-motion";
import { useMemo, useState } from "react";
import type { ReactNode } from "react";
import { Button } from "@/components/common/Button";
import { Card } from "@/components/common/Card";

type Range = "room" | "building" | "city";
type Power = "battery" | "plug";
type Data = "small" | "large";

const OPTIONS = {
  range: [
    { id: "room", label: "ห้อง / บ้าน", icon: "🏠" },
    { id: "building", label: "อาคาร / โรงงาน", icon: "🏭" },
    { id: "city", label: "ไร่ / ทั่วเมือง", icon: "🌾" },
  ],
  power: [
    { id: "battery", label: "ใช้แบตเตอรี่", icon: "🔋" },
    { id: "plug", label: "มีไฟเลี้ยง", icon: "🔌" },
  ],
  data: [
    { id: "small", label: "ตัวเลขนิดหน่อย", icon: "🌡️" },
    { id: "large", label: "ภาพ / ข้อมูลเยอะ", icon: "📷" },
  ],
} as const;

export function ConnectionPlanner() {
  const [range, setRange] = useState<Range>("city");
  const [power, setPower] = useState<Power>("battery");
  const [data, setData] = useState<Data>("small");

  const recommendation = useMemo(() => {
    if (range === "city" && power === "battery" && data === "small") {
      return { name: "LoRaWAN", color: "#34d399", why: "ส่งไกลหลายกิโลเมตรและให้เซนเซอร์หลับระหว่างรอบส่งได้", gateway: "LoRa Gateway" };
    }
    if (range === "city" && data === "large") {
      return { name: "LTE-M / 4G", color: "#c084fc", why: "ใช้โครงข่ายมือถือและรองรับข้อมูลมากกว่า LPWAN", gateway: "Cell Tower" };
    }
    if (range === "building" && power === "plug") {
      return { name: "Ethernet / Wi-Fi", color: "#f59e0b", why: "มีไฟเลี้ยง จึงเน้นความเร็วและความเสถียรได้เต็มที่", gateway: "Switch / Router" };
    }
    if (range === "building" && data === "small") {
      return { name: "Thread / Zigbee", color: "#2dd4bf", why: "เครือข่าย mesh ช่วยส่งต่อข้อมูลให้ครอบคลุมทั้งอาคาร", gateway: "Border Router" };
    }
    if (data === "large") {
      return { name: "Wi-Fi", color: "#38bdf8", why: "เหมาะกับภาพ เสียง และข้อมูลที่ต้องใช้ bandwidth สูง", gateway: "Wi-Fi Router" };
    }
    return { name: "Bluetooth LE", color: "#818cf8", why: "ประหยัดพลังงานและเหมาะกับข้อมูลก้อนเล็กในระยะใกล้", gateway: "Phone / Hub" };
  }, [data, power, range]);

  return (
    <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
      <Card>
        <h3 className="text-lg font-semibold">บอกโจทย์ของอุปกรณ์</h3>
        <p className="mt-1 text-sm text-[var(--color-text-dim)]">
          เปลี่ยน requirement แล้วดูว่าทางเลือกและภาพเครือข่ายเปลี่ยนอย่างไร
        </p>
        <OptionGroup label="ต้องส่งไกลแค่ไหน">
          {OPTIONS.range.map((option) => (
            <Button key={option.id} active={range === option.id} tone="cyan" onClick={() => setRange(option.id)}>
              {option.icon} {option.label}
            </Button>
          ))}
        </OptionGroup>
        <OptionGroup label="แหล่งพลังงาน">
          {OPTIONS.power.map((option) => (
            <Button key={option.id} active={power === option.id} tone="green" onClick={() => setPower(option.id)}>
              {option.icon} {option.label}
            </Button>
          ))}
        </OptionGroup>
        <OptionGroup label="ปริมาณข้อมูล">
          {OPTIONS.data.map((option) => (
            <Button key={option.id} active={data === option.id} tone="orange" onClick={() => setData(option.id)}>
              {option.icon} {option.label}
            </Button>
          ))}
        </OptionGroup>
      </Card>

      <Card accent={recommendation.color} className="overflow-hidden">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="mono text-[10px] uppercase tracking-[0.2em] text-[var(--color-text-dim)]">
              ทางเลือกที่เหมาะกับโจทย์
            </p>
            <motion.h3
              key={recommendation.name}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-1 text-3xl font-bold"
              style={{ color: recommendation.color }}
            >
              {recommendation.name}
            </motion.h3>
          </div>
          <span className="rounded-full border border-[var(--color-border)] px-3 py-1 text-xs text-[var(--color-text-soft)]">
            ไม่ใช่คำตอบตายตัว
          </span>
        </div>

        <PlannerScene color={recommendation.color} range={range} gateway={recommendation.gateway} />

        <p className="mt-5 text-[var(--color-text-soft)]">{recommendation.why}</p>
        <div className="mt-4 grid grid-cols-3 gap-2 text-center text-xs">
          <PlannerStat label="ระยะ" value={range === "city" ? "ไกล" : range === "building" ? "กลาง" : "ใกล้"} />
          <PlannerStat label="แบต" value={power === "battery" ? "สำคัญมาก" : "ไม่จำกัด"} />
          <PlannerStat label="ข้อมูล" value={data === "large" ? "เยอะ" : "น้อย"} />
        </div>
      </Card>
    </div>
  );
}

function OptionGroup({ label, children }: { label: string; children: ReactNode }) {
  return (
    <fieldset className="mt-6">
      <legend className="mb-2 text-xs uppercase tracking-wider text-[var(--color-text-dim)]">{label}</legend>
      <div className="flex flex-wrap gap-2">{children}</div>
    </fieldset>
  );
}

function PlannerScene({ color, range, gateway }: { color: string; range: Range; gateway: string }) {
  const distance = range === "city" ? 300 : range === "building" ? 220 : 145;
  return (
    <div className="relative mt-6 h-52 overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg)]/60">
      <svg viewBox="0 0 420 210" className="h-full w-full" role="img" aria-label="ภาพเครือข่ายที่แนะนำ">
        <line x1="55" y1="125" x2={55 + distance} y2="80" stroke="var(--color-border)" strokeDasharray="5 5" />
        {[0, 1, 2].map((index) => (
          <motion.circle
            key={`${color}-${index}`}
            r="5"
            fill={color}
            animate={{ cx: [65, 55 + distance], cy: [122, 80], opacity: [0, 1, 1, 0] }}
            transition={{ duration: 2.4, repeat: Infinity, delay: index * 0.7 }}
          />
        ))}
        <Node x={55} y={125} icon="🌡️" label="Sensor" color={color} />
        <Node x={55 + distance} y={80} icon={range === "city" ? "🗼" : "📡"} label={gateway} color={color} />
        <Node x={360} y={160} icon="☁️" label="Cloud" color={color} />
        <line x1={75 + distance} y1="95" x2="340" y2="145" stroke="var(--color-border)" />
      </svg>
    </div>
  );
}

function Node({ x, y, icon, label, color }: { x: number; y: number; icon: string; label: string; color: string }) {
  return (
    <g>
      <rect x={x - 25} y={y - 25} width="50" height="50" rx="12" fill="var(--color-surface-2)" stroke={color} />
      <text x={x} y={y + 7} textAnchor="middle" fontSize="23">{icon}</text>
      <text x={x} y={y + 43} textAnchor="middle" fontSize="9" fill="var(--color-text-dim)">{label}</text>
    </g>
  );
}

function PlannerStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-[var(--color-bg)]/50 p-2">
      <div className="text-[var(--color-text-dim)]">{label}</div>
      <div className="font-semibold text-[var(--color-text)]">{value}</div>
    </div>
  );
}
