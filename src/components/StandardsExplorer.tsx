"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { STANDARDS, CATEGORY_LABELS, type ConnectivityStandard } from "@/lib/standards";
import { StandardScene } from "./scenes/StandardScene";

export function StandardsExplorer() {
  const [activeId, setActiveId] = useState(STANDARDS[0].id);
  const active = STANDARDS.find((s) => s.id === activeId)!;

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_1.15fr] lg:items-start">
      {/* รายการมาตรฐานให้เลือก */}
      <div className="flex flex-col gap-2">
        {STANDARDS.map((s) => (
          <StandardButton
            key={s.id}
            standard={s}
            active={s.id === activeId}
            onSelect={() => setActiveId(s.id)}
          />
        ))}
      </div>

      {/* ฉากอนิเมชั่น + รายละเอียดของตัวที่เลือก */}
      <div className="lg:sticky lg:top-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={active.id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.35 }}
          >
            <Detail standard={active} />
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

function StandardButton({
  standard,
  active,
  onSelect,
}: {
  standard: ConnectivityStandard;
  active: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      onClick={onSelect}
      aria-pressed={active}
      className="group relative flex items-center gap-4 rounded-2xl border px-5 py-4 text-left transition-all"
      style={{
        borderColor: active ? standard.color : "var(--color-border)",
        background: active
          ? `color-mix(in oklch, ${standard.color} 12%, var(--color-surface))`
          : "var(--color-surface)",
      }}
    >
      <span
        className="h-2.5 w-2.5 shrink-0 rounded-full transition-transform group-hover:scale-150"
        style={{ background: standard.color, boxShadow: active ? `0 0 12px ${standard.color}` : "none" }}
      />
      <span className="flex-1">
        <span className="block font-semibold">{standard.name}</span>
        <span className="block text-sm text-[var(--color-text-soft)]">{standard.tagline}</span>
      </span>
      <span className="mono text-[10px] uppercase tracking-wider text-[var(--color-text-dim)]">
        {CATEGORY_LABELS[standard.category].split(" ")[0]}
      </span>
    </button>
  );
}

function Detail({ standard }: { standard: ConnectivityStandard }) {
  return (
    <div className="rounded-[var(--radius)] border border-[var(--color-border)] bg-[var(--color-bg-soft)]/70 p-5 backdrop-blur-sm sm:p-7">
      <div className="mb-5 flex items-baseline justify-between gap-3">
        <div>
          <h3 className="text-2xl font-bold" style={{ color: standard.color }}>
            {standard.name}
          </h3>
          <p className="mono text-xs text-[var(--color-text-dim)]">{standard.fullName}</p>
        </div>
        <span className="rounded-full border border-[var(--color-border)] px-3 py-1 text-xs text-[var(--color-text-soft)]">
          {CATEGORY_LABELS[standard.category]}
        </span>
      </div>

      <StandardScene id={standard.id} color={standard.color} />

      <p className="mt-5 text-[var(--color-text-soft)]">{standard.howItWorks}</p>

      <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Stat label="ระยะทำการ" value={standard.rangeLabel} color={standard.color} />
        <Stat label="ความเร็ว" value={standard.dataRateLabel} color={standard.color} />
        <Stat label="พลังงาน" value={standard.powerLabel} color={standard.color} />
        <Stat label="ความถี่" value={standard.frequency} color={standard.color} />
      </div>

      <div className="mt-5">
        <p className="mb-2 text-xs uppercase tracking-wider text-[var(--color-text-dim)]">
          เหมาะกับ
        </p>
        <div className="flex flex-wrap gap-2">
          {standard.bestFor.map((b) => (
            <span
              key={b}
              className="rounded-full px-3 py-1 text-sm"
              style={{
                background: `color-mix(in oklch, ${standard.color} 14%, transparent)`,
                color: standard.color,
              }}
            >
              {b}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

function Stat({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-3">
      <p className="text-[10px] uppercase tracking-wider text-[var(--color-text-dim)]">{label}</p>
      <p className="mt-1 text-sm font-medium" style={{ color }}>
        {value}
      </p>
    </div>
  );
}
