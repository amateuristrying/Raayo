import { useState } from "react";
import { cn } from "@/lib/cn";
import { Button } from "@/components/ui/Button";
import {
  MIN_STAKE,
  placePrediction,
  potentialPayout,
  sharePrice,
  type PredictionSide,
  type PredictionTarget,
} from "@/engine/predictions";
import { marketsStore } from "@/engine/markets";
import { useStore } from "@/engine/store";
import { showToast } from "@/engine/toasts";
import { closePrediction, uiStore } from "@/engine/ui";
import { walletStore } from "@/engine/wallet";
import { Modal } from "./Modal";

const QUICK_STAKES = [100, 250, 500, 1000];

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between text-[13px]">
      <span className="font-medium text-slate-500">{label}</span>
      <span className="font-bold text-slate-900">{value}</span>
    </div>
  );
}

function PredictionForm({ target }: { target: PredictionTarget }) {
  const markets = useStore(marketsStore);
  const wallet = useStore(walletStore);
  const [side, setSide] = useState<PredictionSide>("yes");
  const [stake, setStake] = useState(250);

  const probability = markets[target.id]?.probability ?? target.probability;
  const price = sharePrice(probability, side);
  const payout = potentialPayout(stake, probability, side);
  const insufficient = stake > wallet.balance;
  const invalid = !Number.isFinite(stake) || stake < MIN_STAKE || insufficient;

  const confirm = () => {
    if (placePrediction({ ...target, probability }, side, stake)) {
      showToast(
        `Prediction placed — ${side === "yes" ? "YES" : "NO"} for ${stake.toLocaleString("en-IN")} pts`,
      );
      closePrediction();
    } else {
      showToast("Could not place prediction — check your balance.", "error");
    }
  };

  return (
    <>
      <h2 className="mt-3 text-[15px] leading-snug font-bold text-slate-900">
        {target.title}
      </h2>
      {target.category && (
        <p className="mt-0.5 text-xs font-medium text-slate-400">
          {target.category}
        </p>
      )}

      <div className="mt-4 grid grid-cols-2 gap-2.5">
        <button
          type="button"
          onClick={() => setSide("yes")}
          aria-pressed={side === "yes"}
          className={cn(
            "flex h-12 cursor-pointer flex-col items-center justify-center rounded-xl border text-sm font-bold transition-all",
            side === "yes"
              ? "border-emerald-500 bg-emerald-500 text-white shadow-sm"
              : "border-slate-200 bg-white text-slate-700 hover:border-emerald-300",
          )}
        >
          Yes
          <span
            className={cn(
              "text-[11px] font-semibold",
              side === "yes" ? "text-white/80" : "text-slate-400",
            )}
          >
            {probability}%
          </span>
        </button>
        <button
          type="button"
          onClick={() => setSide("no")}
          aria-pressed={side === "no"}
          className={cn(
            "flex h-12 cursor-pointer flex-col items-center justify-center rounded-xl border text-sm font-bold transition-all",
            side === "no"
              ? "border-red-500 bg-red-500 text-white shadow-sm"
              : "border-slate-200 bg-white text-slate-700 hover:border-red-300",
          )}
        >
          No
          <span
            className={cn(
              "text-[11px] font-semibold",
              side === "no" ? "text-white/80" : "text-slate-400",
            )}
          >
            {100 - probability}%
          </span>
        </button>
      </div>

      <p className="mt-4 text-[10px] font-bold tracking-[0.08em] text-slate-400 uppercase">
        Stake
      </p>
      <div className="mt-1.5 flex h-11 items-center gap-2 rounded-xl border border-slate-200 bg-slate-50/80 px-3.5 transition-all focus-within:border-brand-300 focus-within:bg-white focus-within:ring-4 focus-within:ring-brand-100">
        <input
          type="number"
          min={MIN_STAKE}
          value={Number.isFinite(stake) ? stake : ""}
          onChange={(event) => setStake(parseInt(event.target.value, 10))}
          className="w-full bg-transparent text-sm font-bold text-slate-900 outline-none"
          aria-label="Stake in points"
        />
        <span className="text-xs font-semibold text-slate-400">pts</span>
      </div>
      <div className="mt-2 flex gap-2">
        {QUICK_STAKES.map((amount) => (
          <button
            key={amount}
            type="button"
            onClick={() => setStake(amount)}
            className={cn(
              "flex-1 cursor-pointer rounded-lg border px-2 py-1.5 text-xs font-semibold transition-colors",
              stake === amount
                ? "border-brand-700 bg-brand-700 text-white"
                : "border-slate-200 bg-white text-slate-600 hover:border-brand-200",
            )}
          >
            {amount.toLocaleString("en-IN")}
          </button>
        ))}
      </div>

      <div className="mt-4 flex flex-col gap-1.5 rounded-xl bg-slate-50 px-3.5 py-3">
        <SummaryRow
          label="Avg. price"
          value={`${(price * 100).toFixed(0)} pts / 100 shares`}
        />
        <SummaryRow
          label="Potential payout"
          value={invalid ? "—" : `${payout.toLocaleString("en-IN")} pts`}
        />
        <SummaryRow
          label="Potential profit"
          value={invalid ? "—" : `+${(payout - stake).toLocaleString("en-IN")} pts`}
        />
      </div>

      <p
        className={cn(
          "mt-3 text-xs font-medium",
          insufficient ? "text-red-500" : "text-slate-400",
        )}
      >
        Balance: {wallet.balance.toLocaleString("en-IN")} pts
        {insufficient && " — not enough for this stake"}
      </p>

      <Button className="mt-3 w-full" disabled={invalid} onClick={confirm}>
        Place Prediction
      </Button>
    </>
  );
}

/** Global prediction dialog, opened from any market in the app. */
export function PredictionModal() {
  const { predictionTarget } = useStore(uiStore);

  return (
    <Modal
      open={predictionTarget !== null}
      onClose={closePrediction}
      label="Place Prediction"
    >
      {predictionTarget && (
        <PredictionForm key={predictionTarget.id} target={predictionTarget} />
      )}
    </Modal>
  );
}
