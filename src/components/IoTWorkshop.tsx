"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { Button } from "@/components/common/Button";
import { Card } from "@/components/common/Card";

const STEPS = [
  { icon: "🌡️", name: "Sensor", action: "อ่านค่า", detail: "ESP32 อ่านอุณหภูมิได้ 31.8°C", color: "#38bdf8" },
  { icon: "📡", name: "MQTT", action: "Publish", detail: "ส่งไป topic building/room-01/temperature", color: "#818cf8" },
  { icon: "☁️", name: "Broker", action: "Route", detail: "Broker ส่งต่อให้ทุกระบบที่ subscribe topic นี้", color: "#a78bfa" },
  { icon: "💾", name: "Database", action: "Store", detail: "บันทึกค่าและเวลาเพื่อดูแนวโน้มย้อนหลัง", color: "#34d399" },
  { icon: "🚨", name: "Alert", action: "Notify", detail: "31.8°C สูงกว่า threshold 30°C จึงแจ้งเตือน", color: "#fb7185" },
] as const;

export function IoTWorkshop() {
  const [step, setStep] = useState(0);
  const [online, setOnline] = useState(true);
  const active = STEPS[step];

  function next() {
    if (!online && step === 0) return;
    setStep((current) => (current + 1) % STEPS.length);
  }

  return (
    <Card>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 className="text-lg font-semibold">Workshop: จากอุณหภูมิหนึ่งค่า ไปถึงการแจ้งเตือน</h3>
          <p className="text-sm text-[var(--color-text-dim)]">กดส่ง packet ทีละขั้น แล้วลองตัดอินเทอร์เน็ต</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button tone={online ? "green" : "orange"} active onClick={() => setOnline((value) => !value)}>
            {online ? "● Online" : "● Offline"}
          </Button>
          <Button tone="cyan" active={online || step > 0} onClick={next}>
            ส่ง packet ต่อ →
          </Button>
        </div>
      </div>

      <div className="mt-7 overflow-x-auto pb-3">
        <div className="relative flex min-w-[760px] items-start justify-between px-3">
          <div className="absolute left-12 right-12 top-8 h-px bg-[var(--color-border)]" />
          <motion.div
            className="absolute top-[25px] z-20 h-3 w-3 rounded-full"
            style={{ background: online ? active.color : "#fb7185", left: `calc(${step * 25}% + 38px)` }}
            animate={{ scale: [1, 1.5, 1] }}
            transition={{ duration: 1.2, repeat: Infinity }}
          />
          {STEPS.map((item, index) => (
            <button key={item.name} onClick={() => setStep(index)} className="relative z-10 flex w-32 flex-col items-center text-center">
              <motion.span
                className="grid h-16 w-16 place-items-center rounded-2xl border bg-[var(--color-surface-2)] text-2xl"
                animate={{
                  borderColor: index === step ? item.color : "var(--color-border)",
                  scale: index === step ? 1.08 : 1,
                }}
              >
                {item.icon}
              </motion.span>
              <span className="mt-2 text-sm font-semibold" style={{ color: index === step ? item.color : "var(--color-text-soft)" }}>
                {item.name}
              </span>
              <span className="mono text-[10px] text-[var(--color-text-dim)]">{item.action}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="mt-5 grid gap-4 lg:grid-cols-[1fr_0.85fr]">
        <AnimatePresence mode="wait">
          <motion.div
            key={`${step}-${online}`}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="rounded-xl border bg-[var(--color-bg)]/50 p-4"
            style={{ borderColor: online ? active.color : "#fb7185" }}
          >
            <div className="flex items-center justify-between gap-3">
              <span className="font-semibold" style={{ color: online ? active.color : "#fb7185" }}>
                {online ? `ขั้นที่ ${step + 1}: ${active.action}` : "อินเทอร์เน็ตขาด"}
              </span>
              <span className="mono text-xs text-[var(--color-text-dim)]">{online ? "DELIVERING" : "BUFFERING"}</span>
            </div>
            <p className="mt-2 text-sm text-[var(--color-text-soft)]">
              {online ? active.detail : "Gateway เก็บ packet ไว้ใน local queue และจะ retry เมื่อกลับมา online"}
            </p>
          </motion.div>
        </AnimatePresence>

        <div className="rounded-xl border border-[var(--color-border)] bg-[#0b1020] p-4">
          <div className="mb-2 flex items-center justify-between text-[10px] uppercase tracking-wider text-[var(--color-text-dim)]">
            <span>MQTT payload</span>
            <span>{online ? "TLS encrypted" : "queued locally"}</span>
          </div>
          <pre className="mono overflow-x-auto text-xs leading-6 text-[var(--color-green)]">{`{
  "deviceId": "room-01",
  "temperature": 31.8,
  "unit": "celsius",
  "timestamp": "10:42:08"
}`}</pre>
        </div>
      </div>
    </Card>
  );
}
