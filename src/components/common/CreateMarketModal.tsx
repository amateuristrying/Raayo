import { useState, type ReactNode } from "react";
import { Button } from "@/components/ui/Button";
import { categories } from "@/data";
import { useStore } from "@/engine/store";
import { showToast } from "@/engine/toasts";
import { closeCreateMarket, uiStore } from "@/engine/ui";
import { submitMarketDraft } from "@/engine/userMarkets";
import { Modal } from "./Modal";

const inputClasses =
  "h-10 w-full rounded-xl border border-slate-200 bg-slate-50/80 px-3 text-sm text-slate-800 outline-none transition-all placeholder:text-slate-400 focus:border-brand-300 focus:bg-white focus:ring-4 focus:ring-brand-100";

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-[10px] font-bold tracking-[0.08em] text-slate-400 uppercase">
        {label}
      </span>
      {children}
    </label>
  );
}

const marketCategories = categories.filter(
  (category) => category.id !== "all" && category.id !== "following",
);

function CreateMarketForm() {
  const [question, setQuestion] = useState("");
  const [category, setCategory] = useState(marketCategories[0]?.name ?? "");
  const [event, setEvent] = useState("");
  const [closesOn, setClosesOn] = useState("");
  const [resolutionSource, setResolutionSource] = useState("");

  const invalid =
    question.trim().length < 10 ||
    event.trim().length === 0 ||
    closesOn <= new Date().toLocaleDateString("en-CA") ||
    resolutionSource.trim().length === 0;

  const submit = () => {
    submitMarketDraft({
      question: question.trim(),
      category,
      event: event.trim(),
      closesOn,
      resolutionSource: resolutionSource.trim(),
    });
    showToast("Draft saved locally. View it in Portfolio > My markets.");
    closeCreateMarket();
  };

  return (
    <div className="mt-4 flex flex-col gap-3.5">
      <Field label="Question">
        <input
          className={inputClasses}
          placeholder="Will India win the 2027 World Cup?"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
        />
      </Field>
      <div className="grid grid-cols-2 gap-3">
        <Field label="Category">
          <select
            className={inputClasses}
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            {marketCategories.map((c) => (
              <option key={c.id} value={c.name}>
                {c.name}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Closes on">
          <input
            type="date"
            className={inputClasses}
            value={closesOn}
            onChange={(e) => setClosesOn(e.target.value)}
          />
        </Field>
      </div>
      <Field label="Event">
        <input
          className={inputClasses}
          placeholder="ICC World Cup 2027"
          value={event}
          onChange={(e) => setEvent(e.target.value)}
        />
      </Field>
      <Field label="Resolution source">
        <input
          className={inputClasses}
          placeholder="ICC, RBI, Election Commission of India…"
          value={resolutionSource}
          onChange={(e) => setResolutionSource(e.target.value)}
        />
      </Field>
      <p className="text-[11px] leading-relaxed text-slate-400">
        Saved on this device only. No reviewer or settlement service is connected in this preview.
      </p>
      <Button className="w-full" disabled={invalid} onClick={submit}>
        Submit for Review
      </Button>
    </div>
  );
}

/** Global create-market dialog, opened from the navbar. */
export function CreateMarketModal() {
  const { createMarketOpen } = useStore(uiStore);
  return (
    <Modal
      open={createMarketOpen}
      onClose={closeCreateMarket}
      label="Create Market"
    >
      {createMarketOpen && <CreateMarketForm />}
    </Modal>
  );
}
