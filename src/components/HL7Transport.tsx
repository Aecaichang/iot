"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

// การ์ดเปรียบเทียบ 3 ชั้น: เนื้อใน / ซอง / ถนน
const LAYERS = [
  {
    icon: "📄",
    name: "HL7",
    role: "เนื้อจดหมาย",
    color: "var(--color-green)",
    desc: "มาตรฐานรูปแบบข้อความ — กำหนดว่าบรรทัดไหนคือชื่อคนไข้ บรรทัดไหนคือค่าชีพจร ให้ระบบต่างค่ายอ่านรู้เรื่อง",
    detail: "ORU^R01 = ผลตรวจ · ADT = ลงทะเบียน · ORM = คำสั่งตรวจ",
  },
  {
    icon: "✉️",
    name: "MLLP",
    role: "ซองจดหมาย",
    color: "var(--color-cyan)",
    desc: "ห่อข้อความ HL7 ด้วย byte พิเศษหัว-ท้าย แล้วส่งบน TCP พร้อมรอ ACK ตอบรับ — ไม่ได้ตอบ = ส่งซ้ำ ข้อมูลไม่หาย",
    detail: "เปิด 0x0B … ปิด 0x1C 0x0D · port นิยม 2575",
  },
  {
    icon: "🛣️",
    name: "LAN / WAN",
    role: "ถนน",
    color: "var(--color-violet)",
    desc: "เครือข่ายที่รถวิ่ง — LAN = ในตึกเดียว (เร็ว ปิด), WAN = ข้ามจังหวัด/สาขา (ต้องห่อ VPN/TLS เพราะ HL7 เป็น plaintext)",
    detail: "LAN ในรพ. · WAN รพ.สาขา → รพ.ศูนย์",
  },
] as const;

// ลำดับ handshake ของ MLLP (วนซ้ำ)
type Step = { id: number; dir: "down" | "up" | "note"; label: string; detail: string; color: string };
const STEPS: Step[] = [
  { id: 0, dir: "down", label: "0x0B  MSH|...ORU^R01...  0x1C 0x0D", detail: "เครื่องห่อ HL7 ด้วย byte หัว-ท้าย แล้วส่งผ่าน TCP", color: "var(--color-cyan)" },
  { id: 1, dir: "note", label: "บันทึกลง HIS Database", detail: "เซิร์ฟเวอร์อ่านจน byte ปิด → รู้ว่าข้อความจบ → เขียนค่าลงฐานข้อมูล", color: "var(--color-violet)" },
  { id: 2, dir: "up", label: "0x0B  MSA|AA|MSG123  0x1C 0x0D", detail: "ตอบ ACK กลับ — AA = สำเร็จ (AE = error, AR = ปฏิเสธ)", color: "var(--color-green)" },
  { id: 3, dir: "note", label: "เครื่องได้รับ ACK ✓", detail: "ถ้าไม่ได้ ACK ภายใน timeout เครื่องจะส่งข้อความเดิมซ้ำ", color: "var(--color-green)" },
];

const STEP_MS = 2600;

export function HL7Transport() {
  const [idx, setIdx] = useState(0);
  const [playing, setPlaying] = useState(true);

  useEffect(() => {
    if (!playing) return;
    const t = setInterval(() => setIdx((i) => (i + 1) % STEPS.length), STEP_MS);
    return () => clearInterval(t);
  }, [playing]);

  const step = STEPS[idx];

  return (
    <div className="space-y-6">
      {/* การ์ด 3 ชั้น */}
      <div className="grid gap-3 sm:grid-cols-3">
        {LAYERS.map((l) => (
          <div
            key={l.name}
            className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4"
            style={{ borderTop: `3px solid ${l.color}` }}
          >
            <div className="flex items-center gap-2">
              <span className="text-2xl">{l.icon}</span>
              <div>
                <div className="mono text-sm font-bold" style={{ color: l.color }}>
                  {l.name}
                </div>
                <div className="text-xs text-[var(--color-text-dim)]">{l.role}</div>
              </div>
            </div>
            <p className="mt-3 text-sm text-[var(--color-text-soft)]">{l.desc}</p>
            <p className="mono mt-3 text-[10px] leading-relaxed text-[var(--color-text-dim)]">{l.detail}</p>
          </div>
        ))}
      </div>

      {/* MLLP handshake */}
      <div className="rounded-[var(--radius)] border border-[var(--color-border)] bg-[var(--color-surface)] p-5 sm:p-7">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="text-lg font-semibold">MLLP Handshake — ส่งแล้วต้องได้รับ ACK</h3>
            <p className="text-sm text-[var(--color-text-dim)]">
              ต่างจาก &quot;ส่งแล้วลืม&quot; — ทุกข้อความมีการตอบรับ จึงการันตีว่าข้อมูลคนไข้ไม่หาย
            </p>
          </div>
          <button
            onClick={() => setPlaying((p) => !p)}
            className="rounded-full border border-[var(--color-border)] px-4 py-2 text-sm font-semibold text-[var(--color-cyan)] transition-colors hover:bg-[var(--color-surface-2)]"
          >
            {playing ? "⏸ หยุด" : "▶ เล่น"}
          </button>
        </div>

        {/* เวที: เครื่อง ↔ เซิร์ฟเวอร์ */}
        <div className="relative mb-5 grid grid-cols-[1fr_2.2fr_1fr] items-center gap-2 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg)]/50 px-3 py-7">
          <Pole emoji="🩺" label="Aquarius" sub="Client" active={step.dir === "down"} />

          <div className="relative h-14">
            <div className="absolute left-0 right-0 top-1/2 h-px -translate-y-1/2 bg-[var(--color-border)]" />
            <AnimatePresence mode="wait">
              <motion.div
                key={step.id}
                initial={{ opacity: 0, x: step.dir === "up" ? 40 : step.dir === "down" ? -40 : 0, y: step.dir === "note" ? 12 : 0 }}
                animate={{ opacity: 1, x: 0, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4 }}
                className="absolute left-1/2 top-1/2 w-max max-w-full -translate-x-1/2 -translate-y-1/2"
              >
                <div
                  className="mono flex items-center gap-2 rounded-full border px-3 py-1.5 text-[11px] font-semibold"
                  style={{
                    borderColor: step.color,
                    color: step.color,
                    background: `color-mix(in oklch, ${step.color} 12%, var(--color-bg))`,
                  }}
                >
                  <span>{step.dir === "up" ? "←" : step.dir === "down" ? "→" : "↓"}</span>
                  {step.label}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          <Pole emoji="🗄️" label="HIS" sub="Server" active={step.dir === "up" || step.dir === "note"} />
        </div>

        {/* รายละเอียดสเต็ป */}
        <AnimatePresence mode="wait">
          <motion.div
            key={step.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.3 }}
            className="mb-5 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg)]/40 p-4"
            style={{ borderLeft: `3px solid ${step.color}` }}
          >
            <p className="text-[var(--color-text-soft)]">{step.detail}</p>
          </motion.div>
        </AnimatePresence>

        {/* ไทม์ไลน์คลิกได้ */}
        <ol className="flex flex-wrap gap-1.5">
          {STEPS.map((s, i) => (
            <li key={s.id}>
              <button
                onClick={() => {
                  setPlaying(false);
                  setIdx(i);
                }}
                className="mono rounded-lg border px-2.5 py-1 text-xs transition-all"
                style={{
                  borderColor: i === idx ? s.color : "var(--color-border)",
                  color: i === idx ? s.color : "var(--color-text-dim)",
                  background: i === idx ? `color-mix(in oklch, ${s.color} 12%, transparent)` : "transparent",
                }}
              >
                {i + 1}. {s.dir === "down" ? "ส่ง HL7" : s.dir === "up" ? "ตอบ ACK" : s.id === 1 ? "บันทึก DB" : "ได้ ACK"}
              </button>
            </li>
          ))}
        </ol>

        <div className="mt-5 rounded-lg border border-[var(--color-orange)]/40 bg-[var(--color-orange)]/10 p-3 text-sm text-[var(--color-text-soft)]">
          <span className="font-semibold text-[var(--color-orange)]">⚠️ HL7 เป็น plaintext</span> — อ่านชื่อ-HN
          คนไข้ได้ตรง ๆ บน LAN ในตึกพอรับได้ แต่ส่งข้าม WAN ต้องห่อ VPN/TLS เสมอ (กฎหมาย PDPA คุ้มครองข้อมูลสุขภาพ)
        </div>
      </div>
    </div>
  );
}

function Pole({ emoji, label, sub, active }: { emoji: string; label: string; sub: string; active: boolean }) {
  return (
    <motion.div
      animate={{ scale: active ? 1.05 : 1, opacity: active ? 1 : 0.6 }}
      className="flex flex-col items-center gap-1 text-center"
    >
      <span className="text-3xl">{emoji}</span>
      <span className="text-sm font-semibold text-[var(--color-text-soft)]">{label}</span>
      <span className="mono text-[10px] text-[var(--color-text-dim)]">{sub}</span>
    </motion.div>
  );
}
