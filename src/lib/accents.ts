import type { Accent } from "@/types";

/** Soft tinted backgrounds for lightweight icon tiles. */
export const accentSoftBackgrounds: Record<Accent, string> = {
  emerald: "bg-emerald-50",
  violet: "bg-violet-50",
  rose: "bg-rose-50",
  amber: "bg-amber-50",
  sky: "bg-sky-50",
  indigo: "bg-indigo-50",
  orange: "bg-orange-50",
  slate: "bg-slate-100",
};

/** Shared gradient palette for editorial covers, tiles and avatars. */
export const accentGradients: Record<Accent, string> = {
  emerald: "from-emerald-500 via-emerald-600 to-teal-800",
  violet: "from-violet-500 via-purple-700 to-brand-800",
  rose: "from-rose-500 via-red-600 to-rose-900",
  amber: "from-amber-400 via-amber-500 to-orange-700",
  sky: "from-sky-400 via-sky-600 to-blue-800",
  indigo: "from-indigo-400 via-indigo-600 to-brand-900",
  orange: "from-orange-400 via-orange-600 to-red-800",
  slate: "from-slate-500 via-slate-600 to-slate-800",
};
