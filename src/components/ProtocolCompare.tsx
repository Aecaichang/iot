import { PROTOCOLS } from "@/lib/standards";
import { Reveal } from "./ui/Reveal";

export function ProtocolCompare() {
  return (
    <div className="grid gap-5 md:grid-cols-3">
      {PROTOCOLS.map((p, i) => (
        <Reveal key={p.id} delay={i * 0.1}>
          <article
            className="flex h-full flex-col rounded-[var(--radius)] border bg-[var(--color-surface)] p-6"
            style={{ borderColor: `color-mix(in oklch, ${p.color} 40%, var(--color-border))` }}
          >
            <div className="flex items-baseline justify-between">
              <h3 className="text-xl font-bold" style={{ color: p.color }}>
                {p.name}
              </h3>
              <span className="mono rounded-full border border-[var(--color-border)] px-2.5 py-0.5 text-[10px] text-[var(--color-text-soft)]">
                {p.transport}
              </span>
            </div>
            <p className="mono mt-1 text-xs text-[var(--color-text-dim)]">{p.pattern}</p>
            <p className="mt-4 flex-1 text-sm text-[var(--color-text-soft)]">{p.summary}</p>

            <div className="mt-5 space-y-3">
              <ul className="space-y-1.5">
                {p.pros.map((pro) => (
                  <li key={pro} className="flex gap-2 text-sm text-[var(--color-text)]">
                    <span style={{ color: p.color }}>+</span>
                    {pro}
                  </li>
                ))}
              </ul>
              <ul className="space-y-1.5 border-t border-[var(--color-border)] pt-3">
                {p.cons.map((con) => (
                  <li key={con} className="flex gap-2 text-sm text-[var(--color-text-dim)]">
                    <span>−</span>
                    {con}
                  </li>
                ))}
              </ul>
            </div>
          </article>
        </Reveal>
      ))}
    </div>
  );
}
