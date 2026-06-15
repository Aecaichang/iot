import type { ReactNode } from "react";
import { Reveal } from "./Reveal";

interface SectionProps {
  id: string;
  eyebrow: string;
  title: ReactNode;
  intro?: ReactNode;
  children: ReactNode;
}

export function Section({ id, eyebrow, title, intro, children }: SectionProps) {
  return (
    <section
      id={id}
      className="relative mx-auto w-full max-w-6xl px-5 py-[var(--space-section)] sm:px-8"
    >
      <Reveal>
        <p className="mono mb-3 text-xs uppercase tracking-[0.25em] text-[var(--color-cyan)]">
          {eyebrow}
        </p>
        <h2 className="max-w-3xl text-[length:var(--text-section)] font-bold leading-[1.1] tracking-tight">
          {title}
        </h2>
        {intro && (
          <p className="mt-4 max-w-2xl text-base text-[var(--color-text-soft)] sm:text-lg">
            {intro}
          </p>
        )}
      </Reveal>
      <div className="mt-12">{children}</div>
    </section>
  );
}
