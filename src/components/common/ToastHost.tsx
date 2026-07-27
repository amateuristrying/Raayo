import { CircleAlert, CircleCheck, Info, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/cn";
import { useStore } from "@/engine/store";
import { toastsStore, type ToastTone } from "@/engine/toasts";

const toneStyles: Record<ToastTone, { icon: LucideIcon; classes: string }> = {
  success: { icon: CircleCheck, classes: "text-emerald-400" },
  info: { icon: Info, classes: "text-sky-300" },
  error: { icon: CircleAlert, classes: "text-red-400" },
};

/** Bottom-right stack of transient action confirmations. */
export function ToastHost() {
  const toasts = useStore(toastsStore);
  if (toasts.length === 0) return null;

  return (
    <div className="fixed right-6 bottom-6 z-[60] flex w-80 flex-col gap-2">
      {toasts.map((toast) => {
        const { icon: Icon, classes } = toneStyles[toast.tone];
        return (
          <div
            key={toast.id}
            role="status"
            className="animate-toast-in flex items-start gap-2.5 rounded-xl bg-brand-950 px-4 py-3 shadow-card-hover"
          >
            <Icon className={cn("mt-0.5 size-4 shrink-0", classes)} />
            <p className="text-[13px] leading-snug font-medium text-white">
              {toast.message}
            </p>
          </div>
        );
      })}
    </div>
  );
}
