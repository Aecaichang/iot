"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { Button } from "@/components/common/Button";

type Direction = "up" | "down";

interface Stage {
  icon: string;
  title: string;
  desc: string;
  color: string;
  protocolUp: string;
  protocolDown: string;
  up: InspectorData;
  down: InspectorData;
}

interface InspectorData {
  label: string;
  input: string;
  process: string;
  output: string;
  payload: string;
}

const STAGES: Stage[] = [
  {
    icon: "🌡️",
    title: "อุปกรณ์ / เซนเซอร์",
    desc: "วัดค่า เช่น อุณหภูมิ ความชื้น แล้วแปลงเป็นข้อมูลดิจิทัล",
    color: "var(--color-cyan)",
    protocolUp: "I²C / ADC",
    protocolDown: "GPIO / Relay",
    up: {
      label: "เปลี่ยนสิ่งที่วัดได้ ให้กลายเป็นตัวเลข",
      input: "อุณหภูมิจริงในห้อง",
      process: "Sensor วัดและแปลงสัญญาณ",
      output: "31.8 °C",
      payload: `temperature = 31.8`,
    },
    down: {
      label: "รับคำสั่งแล้วลงมือทำกับโลกจริง",
      input: `command = "fan_on"`,
      process: "Microcontroller สั่ง GPIO",
      output: "Relay เปิดพัดลม",
      payload: `GPIO_12 = HIGH`,
    },
  },
  {
    icon: "📡",
    title: "เกตเวย์ / เครือข่าย",
    desc: "รวบรวมสัญญาณจากอุปกรณ์หลายตัว ส่งต่อผ่านอินเทอร์เน็ต",
    color: "var(--color-violet)",
    protocolUp: "Zigbee → MQTT",
    protocolDown: "MQTT → Zigbee",
    up: {
      label: "รวมข้อมูลและแปลงภาษาให้ส่งผ่านอินเทอร์เน็ตได้",
      input: "31.8 °C จาก Sensor",
      process: "เติม device ID และ timestamp",
      output: "MQTT message",
      payload: `topic: room/01/temp\npayload: {"value":31.8}`,
    },
    down: {
      label: "แปลงคำสั่งจาก Cloud ให้เป็นภาษาของอุปกรณ์",
      input: "MQTT command",
      process: "ตรวจ device ID แล้ว route คำสั่ง",
      output: "Zigbee command",
      payload: `topic: room/01/fan/set\npayload: {"state":"on"}`,
    },
  },
  {
    icon: "☁️",
    title: "คลาวด์ / เซิร์ฟเวอร์",
    desc: "เก็บ ประมวลผล และวิเคราะห์ข้อมูลจำนวนมาก",
    color: "var(--color-green)",
    protocolUp: "MQTT / HTTPS",
    protocolDown: "API / MQTT",
    up: {
      label: "เก็บข้อมูล วิเคราะห์ และตัดสินใจตามกฎ",
      input: "MQTT message",
      process: "บันทึกค่า + ตรวจ threshold 30°C",
      output: "สร้าง Alert อุณหภูมิสูง",
      payload: `if temperature > 30:\n  alert("High temperature")`,
    },
    down: {
      label: "ตรวจสิทธิ์และส่งคำสั่งไปยังอุปกรณ์เป้าหมาย",
      input: "คำสั่งเปิดพัดลมจาก App",
      process: "Authorize + publish command",
      output: "MQTT command",
      payload: `publish("room/01/fan/set",\n  {"state":"on"})`,
    },
  },
  {
    icon: "📱",
    title: "แอป / แดชบอร์ด",
    desc: "ผู้ใช้ดูข้อมูลและสั่งงานกลับไปยังอุปกรณ์ได้",
    color: "var(--color-orange)",
    protocolUp: "API / WebSocket",
    protocolDown: "HTTPS API",
    up: {
      label: "เปลี่ยนข้อมูลให้ผู้ใช้เข้าใจและตัดสินใจได้",
      input: "ข้อมูลล่าสุด + Alert",
      process: "แสดงกราฟและแจ้งเตือน",
      output: "อุณหภูมิสูง 31.8°C",
      payload: `🔔 ห้อง 01 อุณหภูมิสูง\n31.8°C · เมื่อสักครู่`,
    },
    down: {
      label: "เปลี่ยนการกดของผู้ใช้ให้เป็นคำสั่งระบบ",
      input: 'ผู้ใช้กด "เปิดพัดลม"',
      process: "สร้างและส่ง API request",
      output: "คำสั่งไป Cloud",
      payload: `POST /devices/room-01/fan\n{"state":"on"}`,
    },
  },
];

export function ArchitectureFlow() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [direction, setDirection] = useState<Direction>("up");
  const active = STAGES[activeIndex];
  const inspector = active[direction];

  return (
    <div className="rounded-[var(--radius)] border border-[var(--color-border)] bg-[var(--color-bg-soft)]/60 p-6 backdrop-blur-sm sm:p-10">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="font-semibold">เลือกดูข้อมูลในแต่ละชั้น</h3>
          <p className="text-sm text-[var(--color-text-dim)]">คลิกการ์ดเพื่อเปิด Packet Inspector</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button tone="cyan" active={direction === "up"} onClick={() => setDirection("up")}>
            ↑ ส่งข้อมูลขึ้น Cloud
          </Button>
          <Button tone="orange" active={direction === "down"} onClick={() => setDirection("down")}>
            ↓ สั่งงานกลับอุปกรณ์
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-y-2 md:grid-cols-[1fr_auto_1fr_auto_1fr_auto_1fr] md:items-stretch md:gap-x-2">
        {STAGES.map((stage, index) => {
          const activeStage = index === activeIndex;
          return (
            <div key={stage.title} className="contents">
              <motion.button
                onClick={() => setActiveIndex(index)}
                aria-pressed={activeStage}
                className="relative flex flex-col rounded-2xl border bg-[var(--color-surface)] p-5 text-left"
                style={{
                  borderColor: activeStage ? stage.color : "var(--color-border)",
                  boxShadow: activeStage ? `0 0 22px color-mix(in oklch, ${stage.color} 22%, transparent)` : "none",
                }}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                whileHover={{ y: -3 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
              >
                <motion.div
                  className="mb-3 grid h-14 w-14 place-items-center rounded-xl text-2xl"
                  style={{ background: `color-mix(in oklch, ${stage.color} 22%, transparent)` }}
                  animate={activeStage ? { scale: [1, 1.08, 1] } : { scale: 1 }}
                  transition={{ duration: 2.4, repeat: activeStage ? Infinity : 0 }}
                >
                  {stage.icon}
                </motion.div>
                <h3 className="text-base font-semibold" style={{ color: stage.color }}>{stage.title}</h3>
                <p className="mt-1 text-sm text-[var(--color-text-soft)]">{stage.desc}</p>
                <span className="mono mt-4 text-[10px] uppercase tracking-wider text-[var(--color-text-dim)]">
                  {direction === "up" ? stage.protocolUp : stage.protocolDown}
                </span>
                {activeStage && (
                  <motion.span
                    layoutId="architecture-active"
                    className="absolute right-3 top-3 rounded-full px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider"
                    style={{ color: stage.color, background: `color-mix(in oklch, ${stage.color} 15%, var(--color-bg))` }}
                  >
                    Inspecting
                  </motion.span>
                )}
              </motion.button>

              {index < STAGES.length - 1 && <FlowConnector index={index} direction={direction} />}
            </div>
          );
        })}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={`${direction}-${activeIndex}`}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.3 }}
          className="mt-8 grid gap-4 rounded-2xl border bg-[var(--color-bg)]/55 p-4 sm:p-5 lg:grid-cols-[1.2fr_0.8fr]"
          style={{ borderColor: `color-mix(in oklch, ${active.color} 50%, var(--color-border))` }}
        >
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <span className="text-2xl">{active.icon}</span>
              <div>
                <p className="mono text-[10px] uppercase tracking-[0.2em]" style={{ color: active.color }}>Packet Inspector · {active.title}</p>
                <p className="mt-1 font-semibold">{inspector.label}</p>
              </div>
            </div>
            <div className="mt-5 grid gap-2 sm:grid-cols-[1fr_auto_1fr_auto_1fr] sm:items-center">
              <InspectorStep label="Input" value={inspector.input} color={active.color} />
              <span className="hidden text-[var(--color-text-dim)] sm:block">→</span>
              <InspectorStep label="Process" value={inspector.process} color={active.color} />
              <span className="hidden text-[var(--color-text-dim)] sm:block">→</span>
              <InspectorStep label="Output" value={inspector.output} color={active.color} />
            </div>
          </div>
          <div className="rounded-xl border border-[var(--color-border)] bg-[#0b1020] p-4">
            <p className="mono mb-3 text-[10px] uppercase tracking-wider text-[var(--color-text-dim)]">ข้อมูลที่ชั้นนี้มองเห็น</p>
            <pre className="mono whitespace-pre-wrap text-xs leading-6" style={{ color: active.color }}>{inspector.payload}</pre>
          </div>
        </motion.div>
      </AnimatePresence>

      <p className="mono mt-5 text-center text-xs text-[var(--color-text-dim)]">
        จุดแสง = แพ็กเก็ตข้อมูล · เปลี่ยนทิศทางเพื่อดูว่าคำสั่งเดินทางกลับอย่างไร
      </p>
    </div>
  );
}

function InspectorStep({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-3">
      <p className="mono text-[9px] uppercase tracking-wider text-[var(--color-text-dim)]">{label}</p>
      <p className="mt-1 text-xs font-medium" style={{ color }}>{value}</p>
    </div>
  );
}

function FlowConnector({ index, direction }: { index: number; direction: Direction }) {
  const isUp = direction === "up";
  return (
    <div className="relative flex items-center justify-center py-3 md:py-0">
      <div className="hidden h-[2px] w-full min-w-[28px] bg-[var(--color-border)] md:block">
        <motion.div
          key={direction}
          className="h-full w-3 rounded-full"
          animate={{ x: isUp ? ["-12px", "100%"] : ["100%", "-12px"] }}
          transition={{ duration: 1.4, repeat: Infinity, delay: index * 0.35, ease: "easeInOut" }}
          style={{ background: isUp ? "var(--color-cyan)" : "var(--color-orange)", boxShadow: `0 0 12px ${isUp ? "var(--color-cyan)" : "var(--color-orange)"}` }}
        />
      </div>
      <div className="relative h-7 w-[2px] bg-[var(--color-border)] md:hidden">
        <motion.div
          key={direction}
          className="absolute h-3 w-3 -translate-x-1/2 rounded-full"
          style={{ left: "50%", background: isUp ? "var(--color-cyan)" : "var(--color-orange)", boxShadow: `0 0 12px ${isUp ? "var(--color-cyan)" : "var(--color-orange)"}` }}
          animate={{ y: isUp ? ["-12px", "28px"] : ["28px", "-12px"] }}
          transition={{ duration: 1.4, repeat: Infinity, delay: index * 0.35 }}
        />
      </div>
    </div>
  );
}
