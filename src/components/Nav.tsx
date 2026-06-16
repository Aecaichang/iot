"use client";

const LINKS = [
  { href: "#architecture", label: "ภาพรวมระบบ" },
  { href: "#standards", label: "มาตรฐาน" },
  { href: "#planner", label: "ตัวช่วยเลือก" },
  { href: "#workshop", label: "Workshop" },
  { href: "#security", label: "Security" },
  { href: "#microgrid", label: "พลังงาน" },
  { href: "#operations", label: "ดูแลระบบ" },
  { href: "#quiz", label: "Quiz" },
];

export function Nav() {
  return (
    <nav
      aria-label="เมนูหลัก"
      className="sticky top-0 z-50 border-b border-[var(--color-border)] bg-[var(--color-bg)]/70 backdrop-blur-md"
    >
      <div className="mx-auto flex w-full max-w-6xl items-center gap-4 px-4 py-3 sm:px-8">
        <a href="#top" className="flex shrink-0 items-center gap-2 font-bold">
          <span className="grid h-7 w-7 place-items-center rounded-lg bg-gradient-to-br from-[var(--color-cyan)] to-[var(--color-violet)] text-sm">
            📡
          </span>
          IoT Connect
        </a>
        <ul className="flex min-w-0 flex-1 gap-1 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {LINKS.map((l) => (
            <li key={l.href}>
              <a
                href={l.href}
                className="block whitespace-nowrap rounded-full px-3 py-2 text-xs text-[var(--color-text-soft)] transition-colors hover:bg-[var(--color-surface)] hover:text-[var(--color-text)] sm:px-4 sm:text-sm"
              >
                {l.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}
