"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { Button } from "@/components/common/Button";
import { Card } from "@/components/common/Card";

const LAYERS = [
  { id: "identity", icon: "🪪", name: "Device Identity", short: "รู้ว่าใครกำลังเชื่อมต่อ", detail: "Certificate หรือ key ทำให้ระบบแยกอุปกรณ์จริงออกจากอุปกรณ์ปลอมได้", color: "#38bdf8" },
  { id: "encrypt", icon: "🔐", name: "Encryption", short: "ข้อมูลอ่านไม่ได้ระหว่างทาง", detail: "TLS เข้ารหัสข้อมูล แม้มีคนดัก packet ก็อ่านค่า sensor หรือคำสั่งไม่ได้", color: "#818cf8" },
  { id: "firmware", icon: "✅", name: "Signed Firmware", short: "รันเฉพาะซอฟต์แวร์ที่ไว้ใจ", detail: "Secure boot และ digital signature ป้องกัน firmware ที่ถูกแก้ไข", color: "#34d399" },
  { id: "network", icon: "🧱", name: "Network Isolation", short: "จำกัดพื้นที่เมื่อเกิดปัญหา", detail: "แยก IoT VLAN และกำหนด firewall rule ให้ติดต่อเฉพาะบริการที่จำเป็น", color: "#fb923c" },
] as const;

export function SecurityShield() {
  const [active, setActive] = useState(0);
  const [attack, setAttack] = useState(false);
  const layer = LAYERS[active];

  return (
    <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
      <Card className="overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="text-lg font-semibold">ข้อมูลหนึ่ง packet ต้องผ่านเกราะอะไรบ้าง</h3>
            <p className="text-sm text-[var(--color-text-dim)]">เลือกชั้นป้องกัน หรือจำลองการโจมตีเพื่อดูผล</p>
          </div>
          <Button tone="orange" active={attack} onClick={() => setAttack((value) => !value)}>
            {attack ? "หยุดจำลอง" : "⚠ จำลองการโจมตี"}
          </Button>
        </div>

        <div className="relative mt-6 min-h-80 overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg)]/60 p-5">
          <div className="absolute inset-x-5 top-1/2 h-px bg-[var(--color-border)]" />
          <div className="relative z-10 flex h-72 items-center justify-between">
            <SecurityNode icon="🌡️" label="Sensor" color="var(--color-cyan)" />
            <div className="relative flex h-full flex-1 items-center justify-center">
              {LAYERS.map((item, index) => (
                <motion.div
                  key={item.id}
                  className="absolute rounded-[28px] border"
                  style={{
                    width: 95 + index * 38,
                    height: 95 + index * 38,
                    borderColor: item.color,
                    opacity: active === index ? 1 : 0.35,
                    boxShadow: active === index ? `0 0 22px color-mix(in oklch, ${item.color} 35%, transparent)` : "none",
                  }}
                  animate={active === index ? { scale: [0.98, 1.03, 0.98] } : { scale: 1 }}
                  transition={{ duration: 2.5, repeat: Infinity }}
                />
              ))}
              <motion.div
                className="z-10 grid h-16 w-16 place-items-center rounded-2xl border border-[var(--color-green)] bg-[var(--color-surface-2)] text-3xl"
                animate={attack ? { x: [-8, 8, -8] } : { x: 0 }}
                transition={{ duration: 0.35, repeat: attack ? Infinity : 0 }}
              >
                ☁️
              </motion.div>
              <motion.div
                className="absolute left-2 top-1/2 z-20 rounded-full border px-3 py-1 text-xs font-bold"
                style={{
                  color: attack ? "#fb7185" : layer.color,
                  borderColor: attack ? "#fb7185" : layer.color,
                  background: "var(--color-bg)",
                }}
                animate={{ x: attack ? [0, 90, 55] : [0, 205], opacity: attack ? [1, 1, 0] : [0, 1, 1, 0] }}
                transition={{ duration: attack ? 1.4 : 2.5, repeat: Infinity }}
              >
                {attack ? "คำสั่งปลอม ✕" : "encrypted packet"}
              </motion.div>
            </div>
            <SecurityNode icon={attack ? "🛡️" : "📱"} label={attack ? "Blocked" : "App"} color={attack ? "#fb7185" : "var(--color-green)"} />
          </div>
        </div>
      </Card>

      <Card accent={layer.color}>
        <div className="flex gap-2 overflow-x-auto pb-2 lg:flex-col">
          {LAYERS.map((item, index) => (
            <button
              key={item.id}
              onClick={() => setActive(index)}
              aria-pressed={active === index}
              className="flex min-w-52 items-center gap-3 rounded-xl border p-3 text-left transition-colors lg:min-w-0"
              style={{
                borderColor: active === index ? item.color : "var(--color-border)",
                background: active === index ? `color-mix(in oklch, ${item.color} 12%, var(--color-bg))` : "var(--color-bg)",
              }}
            >
              <span className="text-2xl">{item.icon}</span>
              <span>
                <span className="block text-sm font-semibold" style={{ color: item.color }}>{item.name}</span>
                <span className="block text-xs text-[var(--color-text-dim)]">{item.short}</span>
              </span>
            </button>
          ))}
        </div>
        <AnimatePresence mode="wait">
          <motion.div
            key={layer.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mt-5 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg)]/60 p-4"
          >
            <p className="text-sm text-[var(--color-text-soft)]">{layer.detail}</p>
          </motion.div>
        </AnimatePresence>
        <p className="mt-4 text-xs text-[var(--color-text-dim)]">
          หลักคิด: ไม่มีเกราะชั้นเดียวที่พอ ระบบจริงต้องใช้หลายชั้นร่วมกัน
        </p>
      </Card>
    </div>
  );
}

function SecurityNode({ icon, label, color }: { icon: string; label: string; color: string }) {
  return (
    <div className="relative z-10 flex w-16 flex-col items-center gap-2 text-center">
      <div className="grid h-14 w-14 place-items-center rounded-2xl border bg-[var(--color-surface-2)] text-2xl" style={{ borderColor: color }}>
        {icon}
      </div>
      <span className="mono text-[10px]" style={{ color }}>{label}</span>
    </div>
  );
}
