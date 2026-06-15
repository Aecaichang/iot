"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ENERGY_DEVICES, ENERGY_PROTOCOLS, type EnergyDevice } from "@/lib/energy";
import { EnergyScene } from "./scenes/EnergyScene";
import { Reveal } from "./ui/Reveal";

export function EnergyIoT() {
  const [activeId, setActiveId] = useState(ENERGY_DEVICES[0].id);
  const active = ENERGY_DEVICES.find((d) => d.id === activeId)!;

  return (
    <div className="space-y-10">
      {/* แท็บเลือกอุปกรณ์ */}
      <div className="flex flex-wrap gap-3">
        {ENERGY_DEVICES.map((d) => (
          <button
            key={d.id}
            onClick={() => setActiveId(d.id)}
            aria-pressed={d.id === activeId}
            className="flex items-center gap-2.5 rounded-full border px-5 py-2.5 text-sm font-semibold transition-all"
            style={{
              borderColor: d.id === activeId ? d.color : "var(--color-border)",
              background:
                d.id === activeId
                  ? `color-mix(in oklch, ${d.color} 16%, var(--color-surface))`
                  : "var(--color-surface)",
              color: d.id === activeId ? d.color : "var(--color-text-soft)",
            }}
          >
            <span className="text-lg">{d.emoji}</span>
            {d.name}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={active.id}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -16 }}
          transition={{ duration: 0.35 }}
        >
          <DeviceDetail device={active} />
        </motion.div>
      </AnimatePresence>

      {/* ตารางโปรโตคอลพลังงาน */}
      <Reveal>
        <div className="rounded-[var(--radius)] border border-[var(--color-border)] bg-[var(--color-surface)] p-5 sm:p-7">
          <h3 className="mb-4 text-lg font-semibold">โปรโตคอลในงานพลังงานที่ควรรู้จัก</h3>
          <div className="grid gap-3 sm:grid-cols-2">
            {ENERGY_PROTOCOLS.map((p) => (
              <div
                key={p.name}
                className="rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-soft)]/60 p-4"
                style={{ borderLeft: `3px solid ${p.color}` }}
              >
                <div className="flex items-baseline justify-between gap-2">
                  <span className="font-semibold" style={{ color: p.color }}>
                    {p.name}
                  </span>
                  <span className="mono text-[10px] text-[var(--color-text-dim)]">{p.full}</span>
                </div>
                <p className="mt-1 text-sm text-[var(--color-text)]">{p.usedBy}</p>
                <p className="mt-1 text-xs text-[var(--color-text-dim)]">{p.note}</p>
              </div>
            ))}
          </div>
        </div>
      </Reveal>
    </div>
  );
}

function DeviceDetail({ device }: { device: EnergyDevice }) {
  return (
    <div className="grid gap-6 lg:grid-cols-[1.1fr_1fr] lg:items-start">
      <EnergyScene id={device.id} color={device.color} />

      <div className="rounded-[var(--radius)] border border-[var(--color-border)] bg-[var(--color-bg-soft)]/70 p-5 backdrop-blur-sm sm:p-7">
        <div className="mb-3 flex items-center gap-3">
          <span className="text-3xl">{device.emoji}</span>
          <div>
            <h3 className="text-xl font-bold" style={{ color: device.color }}>
              {device.name}
            </h3>
            <p className="text-sm text-[var(--color-text-soft)]">{device.tagline}</p>
          </div>
        </div>

        <div className="mb-4 flex flex-wrap gap-2">
          <Tag label="โปรโตคอล" value={device.protocol} color={device.color} />
          <Tag label="Transport" value={device.transport} color={device.color} />
        </div>

        <p className="text-[var(--color-text-soft)]">{device.howItWorks}</p>

        <p className="mb-2 mt-5 text-xs uppercase tracking-wider text-[var(--color-text-dim)]">
          ระบบ IoT อ่าน/สั่งอะไรได้บ้าง
        </p>
        <ul className="space-y-1.5">
          {device.signals.map((s) => (
            <li key={s} className="flex gap-2 text-sm">
              <span style={{ color: device.color }}>▸</span>
              {s}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function Tag({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <span className="rounded-full border border-[var(--color-border)] px-3 py-1 text-xs">
      <span className="text-[var(--color-text-dim)]">{label}: </span>
      <span style={{ color }}>{value}</span>
    </span>
  );
}
