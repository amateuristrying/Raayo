import { useEffect, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import { cn } from "@/lib/cn";
import { Card } from "@/components/ui/Card";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  /** Small-caps label shown in the header row. */
  label: string;
  children: ReactNode;
  className?: string;
}

/** Centered dialog on a dimmed backdrop; closes on Esc or backdrop click. */
export function Modal({ open, onClose, label, children, className }: ModalProps) {
  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open) return null;

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-label={label}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
    >
      <div
        className="animate-fade-in absolute inset-0 bg-brand-950/40 backdrop-blur-[2px]"
        onClick={onClose}
      />
      <div className={cn("animate-pop-in relative w-full max-w-md", className)}>
        <Card className="p-5 shadow-card-hover">
          <div className="flex items-center justify-between">
            <p className="text-[11px] font-bold tracking-[0.1em] text-slate-400 uppercase">
              {label}
            </p>
            <button
              type="button"
              aria-label="Close dialog"
              onClick={onClose}
              className="flex size-7 cursor-pointer items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
            >
              <X className="size-4" />
            </button>
          </div>
          {children}
        </Card>
      </div>
    </div>,
    document.body,
  );
}
