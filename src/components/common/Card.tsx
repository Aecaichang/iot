import type { HTMLAttributes, ReactNode } from "react";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  accent?: string;
}

export function Card({ children, accent, className = "", style, ...props }: CardProps) {
  return (
    <div
      {...props}
      className={`rounded-[var(--radius)] border border-[var(--color-border)] bg-[var(--color-surface)] p-5 sm:p-7 ${className}`}
      style={{
        ...(accent ? { borderColor: `color-mix(in oklch, ${accent} 42%, var(--color-border))` } : {}),
        ...style,
      }}
    >
      {children}
    </div>
  );
}
