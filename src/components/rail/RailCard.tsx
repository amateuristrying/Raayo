import type { ReactNode } from "react";
import { Card } from "@/components/ui/Card";
import { SectionHeader } from "@/components/ui/SectionHeader";

interface RailCardProps {
  title: string;
  /** Header style; Home rail uses "caps", Explore rail uses "title". */
  variant?: "caps" | "title";
  leading?: ReactNode;
  meta?: ReactNode;
  actionLabel?: string;
  children: ReactNode;
}

/** Right-rail panel: white card with a compact header. */
export function RailCard({
  title,
  variant = "caps",
  leading,
  meta,
  actionLabel,
  children,
}: RailCardProps) {
  return (
    <Card className="p-4">
      <SectionHeader
        title={title}
        variant={variant}
        leading={leading}
        meta={meta}
        actionLabel={actionLabel}
      />
      <div className="mt-3.5">{children}</div>
    </Card>
  );
}
