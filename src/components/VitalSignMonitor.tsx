"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

// ponytail: ค่าสัญญาณชีพจำลองด้วยฟังก์ชัน + jitter เล็กน้อย — ของจริงอ่านจากเซนเซอร์
// ปรับช่วงค่าปกติได้ที่ตารางนี้ (ปุ่ม knob เดียวสำหรับ tuning)
const VITAL_BANDS = {
  pr: { min: 68, max: 88 }, // bpm
  spo2: { min: 96, max: 99 }, // %
  temp: { min: 36.5, max: 37.2 }, // °C
  sys: { min: 112, max: 126 }, // mmHg
  dia: { min: 72, max: 82 }, // mmHg
} as const;

const WAVE_LEN = 160; // จำนวนจุดบนกราฟ
const TICK_MS = 40; // อัตรารีเฟรชกราฟ
const VITAL_REFRESH_MS = 1400; // อัปเดตตัวเลข
const NIBP_INTERVAL_MS = 8000; // วัดความดันเป็นรอบ (เหมือนของจริง)

type Vitals = { pr: number; spo2: number; temp: number; sys: number; dia: number };

function rand(min: number, max: number) {
  return min + Math.random() * (max - min);
}

// คลื่น plethysmograph (SpO2): ขึ้นเร็ว มี dicrotic notch แล้วค่อยลดลง
function plethAt(phase: number): number {
  const p = phase % 1;
  const main = Math.exp(-Math.pow((p - 0.18) / 0.12, 2)); // ยอดหลัก
  const notch = 0.35 * Math.exp(-Math.pow((p - 0.45) / 0.13, 2)); // ยอดรอง
  return main + notch;
}

const STAGES = [
  { icon: "🩺", label: "Vital Sign Monitor", sub: "Northern Aquarius", color: "var(--color-green)" },
  { icon: "🖧", label: "Gateway", sub: "HL7 / MLLP · LAN-WAN", color: "var(--color-cyan)" },
  { icon: "🗄️", label: "HIS Database", sub: "โรงพยาบาล", color: "var(--color-violet)" },
  { icon: "🖥️", label: "BMS HOSxP V.4", sub: "แสดงผลเรียลไทม์", color: "var(--color-orange)" },
] as const;

function buildHL7(v: Vitals, seq: number): string {
  // ponytail: ORU^R01 แบบย่อพอให้เห็นโครงสร้าง field จริง — ของจริงมี field มากกว่านี้
  const ts = "20260616" + String(100000 + seq).slice(-6);
  return [
    `MSH|^~\\&|AQUARIUS|NORTHERN|HIS|HOSPITAL|${ts}||ORU^R01|MSG${seq}|P|2.5`,
    `PID|1||HN0000123^^^HOSP||ผู้ป่วย^ทดสอบ||19850101|M`,
    `OBR|1||OBS${seq}|VITALS^Vital Signs|||${ts}`,
    `OBX|1|NM|8867-4^Heart rate^LN||${v.pr}|/min|${VITAL_BANDS.pr.min}-${VITAL_BANDS.pr.max}|N|||F`,
    `OBX|2|NM|2708-6^SpO2^LN||${v.spo2}|%|95-100|N|||F`,
    `OBX|3|NM|8310-5^Body temperature^LN||${v.temp.toFixed(1)}|Cel|36.0-37.5|N|||F`,
    `OBX|4|NM|8480-6^Systolic BP^LN||${v.sys}|mm[Hg]|90-130|N|||F`,
    `OBX|5|NM|8462-4^Diastolic BP^LN||${v.dia}|mm[Hg]|60-85|N|||F`,
  ].join("\n");
}

export function VitalSignMonitor() {
  const [connected, setConnected] = useState(false);
  const [vitals, setVitals] = useState<Vitals>({ pr: 76, spo2: 98, temp: 36.8, sys: 118, dia: 78 });
  const [wave, setWave] = useState<number[]>(() => Array(WAVE_LEN).fill(0));
  const [hl7, setHl7] = useState("");
  const [seq, setSeq] = useState(0);
  const [activeStage, setActiveStage] = useState(-1);
  const phaseRef = useRef(0);

  // วาดคลื่น plethysmograph แบบเลื่อน
  useEffect(() => {
    if (!connected) return;
    const t = setInterval(() => {
      phaseRef.current += (vitals.pr / 60) * (TICK_MS / 1000);
      setWave((w) => {
        const next = w.slice(1);
        next.push(plethAt(phaseRef.current));
        return next;
      });
    }, TICK_MS);
    return () => clearInterval(t);
  }, [connected, vitals.pr]);

  // อัปเดตค่าตัวเลข (PR/SpO2/Temp ทุกรอบ)
  useEffect(() => {
    if (!connected) return;
    const t = setInterval(() => {
      setVitals((v) => ({
        ...v,
        pr: Math.round(rand(VITAL_BANDS.pr.min, VITAL_BANDS.pr.max)),
        spo2: Math.round(rand(VITAL_BANDS.spo2.min, VITAL_BANDS.spo2.max)),
        temp: rand(VITAL_BANDS.temp.min, VITAL_BANDS.temp.max),
      }));
    }, VITAL_REFRESH_MS);
    return () => clearInterval(t);
  }, [connected]);

  // วัด NIBP เป็นรอบ + ส่ง HL7 ผ่าน pipeline
  useEffect(() => {
    if (!connected) return;
    let stageTimers: ReturnType<typeof setTimeout>[] = [];
    const fire = () => {
      setVitals((v) => {
        const sys = Math.round(rand(VITAL_BANDS.sys.min, VITAL_BANDS.sys.max));
        const dia = Math.round(rand(VITAL_BANDS.dia.min, VITAL_BANDS.dia.max));
        const next = { ...v, sys, dia };
        setSeq((s) => {
          const ns = s + 1;
          setHl7(buildHL7(next, ns));
          return ns;
        });
        return next;
      });
      // ส่ง packet วิ่งผ่าน 4 สเตจ
      STAGES.forEach((_, i) => {
        stageTimers.push(setTimeout(() => setActiveStage(i), i * 550));
      });
      stageTimers.push(setTimeout(() => setActiveStage(-1), STAGES.length * 550 + 400));
    };
    fire();
    const t = setInterval(fire, NIBP_INTERVAL_MS);
    return () => {
      clearInterval(t);
      stageTimers.forEach(clearTimeout);
    };
  }, [connected]);

  function toggle() {
    if (connected) {
      setConnected(false);
      setActiveStage(-1);
      setWave(Array(WAVE_LEN).fill(0));
    } else {
      setConnected(true);
    }
  }

  // สร้าง path ของกราฟ
  const W = 600;
  const H = 120;
  const points = wave
    .map((y, i) => `${(i / (WAVE_LEN - 1)) * W},${H - 10 - y * (H - 24)}`)
    .join(" ");

  return (
    <div className="rounded-[var(--radius)] border border-[var(--color-border)] bg-[var(--color-surface)] p-5 sm:p-7">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="text-lg font-semibold">Northern Aquarius — Vital Sign Monitor</h3>
          <p className="text-sm text-[var(--color-text-dim)]">
            จำลองอุปกรณ์ส่งสัญญาณชีพเข้าระบบโรงพยาบาล (HIS) ผ่าน HL7 บน LAN/WAN
          </p>
        </div>
        <button
          onClick={toggle}
          className="rounded-full border px-4 py-2 text-sm font-semibold transition-colors hover:bg-[var(--color-surface-2)]"
          style={{
            borderColor: connected ? "var(--color-green)" : "var(--color-border)",
            color: connected ? "var(--color-green)" : "var(--color-text-soft)",
          }}
        >
          {connected ? "⏹ ตัดการเชื่อมต่อ" : "▶ เชื่อมต่ออุปกรณ์"}
        </button>
      </div>

      {/* จอมอนิเตอร์ */}
      <div className="grid gap-4 lg:grid-cols-[1.4fr_1fr]">
        <div className="rounded-xl border border-[var(--color-border)] bg-black/40 p-4">
          <div className="mb-2 flex items-center justify-between text-xs">
            <span className="mono text-[var(--color-text-dim)]">SpO₂ Pleth</span>
            <span className="flex items-center gap-1.5 font-semibold" style={{ color: connected ? "var(--color-green)" : "var(--color-text-dim)" }}>
              <span
                className="inline-block h-2 w-2 rounded-full"
                style={{
                  background: connected ? "var(--color-green)" : "var(--color-text-dim)",
                  boxShadow: connected ? "0 0 8px var(--color-green)" : "none",
                  animation: connected ? "pulse 1s ease-in-out infinite" : "none",
                }}
              />
              {connected ? "MONITORING" : "OFFLINE"}
            </span>
          </div>
          <svg viewBox={`0 0 ${W} ${H}`} className="h-32 w-full" preserveAspectRatio="none">
            <polyline
              points={points}
              fill="none"
              stroke="var(--color-cyan)"
              strokeWidth={2}
              strokeLinejoin="round"
              opacity={connected ? 1 : 0.2}
            />
          </svg>

          <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
            <Metric label="PR" unit="bpm" value={connected ? vitals.pr : "--"} color="var(--color-green)" />
            <Metric label="SpO₂" unit="%" value={connected ? vitals.spo2 : "--"} color="var(--color-cyan)" />
            <Metric label="Temp" unit="°C" value={connected ? vitals.temp.toFixed(1) : "--"} color="var(--color-orange)" />
            <Metric
              label="NIBP"
              unit="mmHg"
              value={connected ? `${vitals.sys}/${vitals.dia}` : "--"}
              color="var(--color-violet)"
            />
          </div>
        </div>

        {/* HL7 payload */}
        <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-bg)]/60 p-4">
          <div className="mb-2 flex items-center justify-between text-xs">
            <span className="mono text-[var(--color-text-dim)]">HL7 v2.5 · ORU^R01</span>
            {seq > 0 && <span className="mono text-[var(--color-text-dim)]">#{seq}</span>}
          </div>
          <pre className="mono max-h-44 overflow-auto whitespace-pre-wrap break-all text-[10px] leading-relaxed text-[var(--color-text-soft)]">
            {hl7 || "// กดเชื่อมต่ออุปกรณ์เพื่อเริ่มส่งข้อมูล\n// ระบบจะวัด NIBP และส่ง HL7 ทุก 8 วินาที"}
          </pre>
        </div>
      </div>

      {/* Pipeline: Hardware → Gateway → DB → HOSxP */}
      <div className="mt-5 grid grid-cols-[1fr_auto_1fr_auto_1fr_auto_1fr] items-center gap-1 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg)]/40 p-3 sm:gap-2 sm:p-4">
        {STAGES.map((s, i) => (
          <Stage key={s.label} stage={s} active={activeStage === i} last={i === STAGES.length - 1} />
        ))}
      </div>
      <p className="mt-3 text-center text-xs text-[var(--color-text-dim)]">
        Hardware → Gateway → Database รพ. → BMS HOSxP V.4 · ข้อมูลเป็นค่าจำลองเพื่อการเรียนรู้
      </p>
    </div>
  );
}

function Metric({
  label,
  unit,
  value,
  color,
}: {
  label: string;
  unit: string;
  value: string | number;
  color: string;
}) {
  return (
    <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)]/60 px-3 py-2">
      <div className="mono text-[10px] uppercase tracking-wide text-[var(--color-text-dim)]">{label}</div>
      <div className="flex items-baseline gap-1">
        <AnimatePresence mode="popLayout">
          <motion.span
            key={String(value)}
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 6 }}
            transition={{ duration: 0.2 }}
            className="mono text-2xl font-bold tabular-nums"
            style={{ color }}
          >
            {value}
          </motion.span>
        </AnimatePresence>
        <span className="text-[10px] text-[var(--color-text-dim)]">{unit}</span>
      </div>
    </div>
  );
}

function Stage({
  stage,
  active,
  last,
}: {
  stage: (typeof STAGES)[number];
  active: boolean;
  last: boolean;
}) {
  return (
    <>
      <motion.div
        animate={{
          borderColor: active ? stage.color : "var(--color-border)",
          scale: active ? 1.04 : 1,
        }}
        className="flex flex-col items-center gap-1 rounded-lg border bg-[var(--color-surface)] px-2 py-3 text-center"
        style={{ boxShadow: active ? `0 0 16px -4px ${stage.color}` : "none" }}
      >
        <span className="text-2xl">{stage.icon}</span>
        <span className="text-[11px] font-semibold leading-tight" style={{ color: active ? stage.color : "var(--color-text-soft)" }}>
          {stage.label}
        </span>
        <span className="text-[9px] text-[var(--color-text-dim)]">{stage.sub}</span>
      </motion.div>
      {!last && (
        <div className="relative h-px w-full bg-[var(--color-border)]">
          <motion.span
            className="absolute top-1/2 h-2 w-2 -translate-y-1/2 rounded-full"
            style={{ background: stage.color }}
            animate={active ? { left: ["0%", "100%"], opacity: [0, 1, 0] } : { opacity: 0 }}
            transition={{ duration: 0.5 }}
          />
        </div>
      )}
    </>
  );
}
