"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { Button } from "@/components/common/Button";
import { Card } from "@/components/common/Card";

const DEVICES = Array.from({ length: 36 }, (_, index) => ({
  id: index,
  warning: [5, 17, 28].includes(index),
  offline: [9, 24].includes(index),
}));

const LIFECYCLE = [
  { icon: "🏭", name: "Provision", text: "ลงทะเบียน identity" },
  { icon: "📊", name: "Monitor", text: "ดู health และข้อมูล" },
  { icon: "⬆️", name: "Update", text: "ส่ง OTA firmware" },
  { icon: "🧰", name: "Maintain", text: "แก้ปัญหาระยะไกล" },
  { icon: "♻️", name: "Retire", text: "ถอน key อย่างปลอดภัย" },
];

export function FleetLifecycle() {
  const [qos, setQos] = useState<0 | 1 | 2>(1);
  const [updating, setUpdating] = useState(false);

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_1fr]">
      <Card>
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h3 className="text-lg font-semibold">Fleet Health: ดูแลอุปกรณ์ทั้งระบบ</h3>
            <p className="text-sm text-[var(--color-text-dim)]">สถานะผิดปกติต้องมองเห็นได้ก่อนผู้ใช้พบปัญหา</p>
          </div>
          <Button tone="green" active={updating} onClick={() => setUpdating((value) => !value)}>
            {updating ? "กำลัง OTA…" : "ส่ง OTA Update"}
          </Button>
        </div>
        <div className="mt-6 grid grid-cols-9 gap-2 rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg)]/50 p-4">
          {DEVICES.map((device) => {
            const color = device.offline ? "#fb7185" : device.warning ? "#fbbf24" : "#34d399";
            return (
              <motion.div
                key={device.id}
                title={device.offline ? "Offline" : device.warning ? "Battery low" : "Healthy"}
                className="aspect-square rounded-md border"
                style={{ background: `color-mix(in oklch, ${color} 35%, var(--color-surface))`, borderColor: color }}
                animate={updating && !device.offline ? { opacity: [1, 0.35, 1] } : { opacity: 1 }}
                transition={{ duration: 1.2, repeat: updating ? Infinity : 0, delay: device.id * 0.025 }}
              />
            );
          })}
        </div>
        <div className="mt-4 flex flex-wrap gap-4 text-xs">
          <Legend color="#34d399" label="Healthy 31" />
          <Legend color="#fbbf24" label="Battery low 3" />
          <Legend color="#fb7185" label="Offline 2" />
        </div>
      </Card>

      <Card>
        <h3 className="text-lg font-semibold">Message Delivery: ส่งซ้ำแค่ไหนถึงพอดี</h3>
        <div className="mt-4 flex flex-wrap gap-2">
          {([0, 1, 2] as const).map((value) => (
            <Button key={value} tone="cyan" active={qos === value} onClick={() => setQos(value)}>
              QoS {value}
            </Button>
          ))}
        </div>
        <div className="relative mt-6 h-36 overflow-hidden rounded-xl border border-[var(--color-border)] bg-[var(--color-bg)]/50">
          <div className="absolute left-8 top-10 text-3xl">🌡️</div>
          <div className="absolute right-8 top-10 text-3xl">☁️</div>
          <div className="absolute left-20 right-20 top-14 h-px bg-[var(--color-border)]" />
          {Array.from({ length: qos + 1 }, (_, index) => (
            <motion.div
              key={`${qos}-${index}`}
              className="absolute top-[45px] rounded-full border border-[var(--color-cyan)] bg-[var(--color-bg)] px-2 py-1 text-[10px] text-[var(--color-cyan)]"
              animate={{ x: [75, 300], opacity: [0, 1, 1, 0] }}
              transition={{ duration: 1.8, repeat: Infinity, delay: index * 0.45 }}
            >
              packet {index + 1}
            </motion.div>
          ))}
          <p className="absolute inset-x-3 bottom-3 text-center text-xs text-[var(--color-text-dim)]">
            {qos === 0 && "เร็วที่สุด แต่อาจหาย เหมาะกับค่าที่ส่งถี่และพลาดได้"}
            {qos === 1 && "ส่งอย่างน้อยหนึ่งครั้ง อาจซ้ำ แต่เหมาะกับ telemetry ส่วนใหญ่"}
            {qos === 2 && "ส่งครั้งเดียวแน่นอน แต่ใช้ขั้นตอนและทรัพยากรมากที่สุด"}
          </p>
        </div>
      </Card>

      <Card className="lg:col-span-2">
        <h3 className="text-lg font-semibold">วงจรชีวิตไม่ได้จบวันที่ติดตั้ง</h3>
        <div className="mt-6 overflow-x-auto">
          <div className="relative flex min-w-[720px] justify-between">
            <div className="absolute left-12 right-12 top-7 h-px bg-[var(--color-border)]" />
            {LIFECYCLE.map((item, index) => (
              <div key={item.name} className="relative z-10 w-32 text-center">
                <motion.div
                  className="mx-auto grid h-14 w-14 place-items-center rounded-full border border-[var(--color-cyan)] bg-[var(--color-surface-2)] text-xl"
                  whileInView={{ scale: [0.8, 1.1, 1] }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.12 }}
                >
                  {item.icon}
                </motion.div>
                <div className="mt-2 text-sm font-semibold text-[var(--color-cyan)]">{item.name}</div>
                <div className="text-xs text-[var(--color-text-dim)]">{item.text}</div>
              </div>
            ))}
          </div>
        </div>
      </Card>
    </div>
  );
}

function Legend({ color, label }: { color: string; label: string }) {
  return <span className="flex items-center gap-2 text-[var(--color-text-soft)]"><i className="h-2 w-2 rounded-full" style={{ background: color }} />{label}</span>;
}
