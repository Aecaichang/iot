"use client";

import { motion } from "framer-motion";

interface Stage {
  icon: string;
  title: string;
  desc: string;
  color: string;
}

const STAGES: Stage[] = [
  {
    icon: "🌡️",
    title: "อุปกรณ์ / เซนเซอร์",
    desc: "วัดค่า เช่น อุณหภูมิ ความชื้น แล้วแปลงเป็นข้อมูลดิจิทัล",
    color: "var(--color-cyan)",
  },
  {
    icon: "📡",
    title: "เกตเวย์ / เครือข่าย",
    desc: "รวบรวมสัญญาณจากอุปกรณ์หลายตัว ส่งต่อผ่านอินเทอร์เน็ต",
    color: "var(--color-violet)",
  },
  {
    icon: "☁️",
    title: "คลาวด์ / เซิร์ฟเวอร์",
    desc: "เก็บ ประมวลผล และวิเคราะห์ข้อมูลจำนวนมาก",
    color: "var(--color-green)",
  },
  {
    icon: "📱",
    title: "แอป / แดชบอร์ด",
    desc: "ผู้ใช้ดูข้อมูลและสั่งงานกลับไปยังอุปกรณ์ได้",
    color: "var(--color-orange)",
  },
];

export function ArchitectureFlow() {
  return (
    <div className="rounded-[var(--radius)] border border-[var(--color-border)] bg-[var(--color-bg-soft)]/60 p-6 backdrop-blur-sm sm:p-10">
      <div className="grid grid-cols-1 gap-y-2 md:grid-cols-[1fr_auto_1fr_auto_1fr_auto_1fr] md:items-stretch md:gap-x-2">
        {STAGES.map((stage, i) => (
          <div key={stage.title} className="contents">
            <motion.div
              className="relative flex flex-col rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.15 }}
            >
              <motion.div
                className="mb-3 grid h-14 w-14 place-items-center rounded-xl text-2xl"
                style={{ background: `color-mix(in oklch, ${stage.color} 22%, transparent)` }}
                animate={{ scale: [1, 1.08, 1] }}
                transition={{ duration: 2.4, repeat: Infinity, delay: i * 0.6 }}
              >
                {stage.icon}
              </motion.div>
              <h3 className="text-base font-semibold" style={{ color: stage.color }}>
                {stage.title}
              </h3>
              <p className="mt-1 text-sm text-[var(--color-text-soft)]">{stage.desc}</p>
            </motion.div>

            {/* ตัวเชื่อม + แพ็กเก็ตวิ่ง (ซ่อนหลังตัวสุดท้าย) */}
            {i < STAGES.length - 1 && <FlowConnector index={i} />}
          </div>
        ))}
      </div>

      <p className="mono mt-8 text-center text-xs text-[var(--color-text-dim)]">
        จุดแสง = แพ็กเก็ตข้อมูลที่กำลังเดินทางในระบบ
      </p>
    </div>
  );
}

function FlowConnector({ index }: { index: number }) {
  return (
    <div className="relative flex items-center justify-center py-3 md:py-0">
      {/* แนวนอนบนจอใหญ่ */}
      <div className="hidden h-[2px] w-full min-w-[28px] bg-[var(--color-border)] md:block">
        <motion.div
          className="h-full w-3 rounded-full bg-[var(--color-cyan)]"
          animate={{ x: ["-12px", "100%"] }}
          transition={{
            duration: 1.4,
            repeat: Infinity,
            delay: index * 0.4,
            ease: "easeInOut",
          }}
          style={{ boxShadow: "0 0 12px var(--color-cyan)" }}
        />
      </div>
      {/* แนวตั้งบนมือถือ */}
      <div className="relative h-7 w-[2px] bg-[var(--color-border)] md:hidden">
        <motion.div
          className="absolute h-3 w-3 -translate-x-1/2 rounded-full bg-[var(--color-cyan)]"
          style={{ left: "50%", boxShadow: "0 0 12px var(--color-cyan)" }}
          animate={{ y: ["-12px", "28px"] }}
          transition={{ duration: 1.4, repeat: Infinity, delay: index * 0.4 }}
        />
      </div>
    </div>
  );
}
