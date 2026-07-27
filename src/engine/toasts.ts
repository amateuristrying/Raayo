import { createStore } from "./store";

/* Ephemeral toast queue for action feedback. */

export type ToastTone = "success" | "info" | "error";

export interface Toast {
  id: number;
  message: string;
  tone: ToastTone;
}

export const toastsStore = createStore<Toast[]>([]);

let nextToastId = 1;

export function showToast(message: string, tone: ToastTone = "success"): void {
  const id = nextToastId++;
  toastsStore.set((prev) => [...prev, { id, message, tone }]);
  setTimeout(() => {
    toastsStore.set((prev) => prev.filter((toast) => toast.id !== id));
  }, 3800);
}
