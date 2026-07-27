import { createStore } from "./store";

/*
 * Wallet engine (client-side stand-in). Beta accounts trade virtual points;
 * the ledger is intentionally transaction-based so a future INR/Razorpay
 * backend can map onto the same shape.
 */

export interface WalletTransaction {
  id: string;
  label: string;
  /** Signed amount in points; positive = credit. */
  amount: number;
  at: number;
}

export interface WalletState {
  balance: number;
  transactions: WalletTransaction[];
}

const HOUR = 3_600_000;
const now = Date.now();

/** Seeds sum to the design's 12,840 point balance. */
const seedState: WalletState = {
  balance: 12840,
  transactions: [
    { id: "tx-seed-4", label: "Prediction placed · Sensex above 80,000", amount: -500, at: now - 5 * HOUR },
    { id: "tx-seed-3", label: "Prediction won · CSK to qualify for IPL Playoffs", amount: 840, at: now - 26 * HOUR },
    { id: "tx-seed-2", label: "Beta tester grant", amount: 10000, at: now - 72 * HOUR },
    { id: "tx-seed-1", label: "Welcome bonus", amount: 2500, at: now - 72 * HOUR },
  ],
};

export const walletStore = createStore<WalletState>(seedState, "raayo:wallet");

function transaction(label: string, amount: number): WalletTransaction {
  return { id: crypto.randomUUID(), label, amount, at: Date.now() };
}

/** Debits the balance; returns false (and does nothing) if funds are short. */
export function spendPoints(amount: number, label: string): boolean {
  let ok = false;
  walletStore.set((prev) => {
    if (amount <= 0 || prev.balance < amount) return prev;
    ok = true;
    return {
      balance: prev.balance - amount,
      transactions: [transaction(label, -amount), ...prev.transactions].slice(0, 30),
    };
  });
  return ok;
}

export function addPoints(amount: number, label: string): void {
  if (amount <= 0) return;
  walletStore.set((prev) => ({
    balance: prev.balance + amount,
    transactions: [transaction(label, amount), ...prev.transactions].slice(0, 30),
  }));
}
