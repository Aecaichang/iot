import type { ButtonHTMLAttributes, ReactNode } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  tone?: "default" | "cyan" | "green" | "orange";
  active?: boolean;
}

const TONES = {
  default: "var(--color-text)",
  cyan: "var(--color-cyan)",
  green: "var(--color-green)",
  orange: "var(--color-orange)",
};

export function Button({
  children,
  tone = "default",
  active = false,
  className = "",
  style,
  ...props
}: ButtonProps) {
  const color = TONES[tone];

  return (
    <button
      {...props}
      className={`rounded-full border px-4 py-2 text-sm font-semibold transition-[transform,background-color,border-color,color] duration-300 hover:scale-[1.02] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-45 ${className}`}
      style={{
        borderColor: active ? color : "var(--color-border)",
        background: active
          ? `color-mix(in oklch, ${color} 14%, var(--color-surface))`
          : "var(--color-surface)",
        color: active ? color : "var(--color-text-soft)",
        ...style,
      }}
    >
      {children}
    </button>
  );
}
