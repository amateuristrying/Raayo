import type { ReactNode } from "react";

interface SidebarSectionProps {
  title: string;
  children: ReactNode;
}

export function SidebarSection({ title, children }: SidebarSectionProps) {
  return (
    <div className="mb-5">
      <p className="mb-1.5 px-3 text-[11px] font-semibold tracking-[0.1em] text-slate-400 uppercase">
        {title}
      </p>
      <nav className="flex flex-col gap-0.5">{children}</nav>
    </div>
  );
}
