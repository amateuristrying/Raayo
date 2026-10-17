import { useEffect, useRef, type ReactNode } from "react";
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
export function Modal({
  open,
  onClose,
  label,
  children,
  className,
}: ModalProps) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef(onClose);
  closeRef.current = onClose;
  useEffect(() => {
    if (!open) return;
    const previous = document.activeElement as HTMLElement | null;
    const previousOverflow = document.body.style.overflow;
    const focusable = () =>
      Array.from(
        dialogRef.current?.querySelectorAll<HTMLElement>(
          'button:not(:disabled), a[href], input, select, textarea, [tabindex="0"]',
        ) ?? [],
      );
    focusable()[0]?.focus();
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeRef.current();
      if (event.key === "Tab") {
        const items = focusable();
        const first = items[0];
        const last = items.at(-1);
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last?.focus();
        }
        if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first?.focus();
        }
      }
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = previousOverflow;
      previous?.focus();
    };
  }, [open]);

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
      <div
        ref={dialogRef}
        className={cn(
          "animate-pop-in relative max-h-[90dvh] w-full max-w-md overflow-y-auto",
          className,
        )}
      >
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
