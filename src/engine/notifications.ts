import { createStore } from "./store";

/* Notification engine (client-side stand-in). */

export type NotificationTone = "up" | "down" | "spike" | "info" | "win";

export interface AppNotification {
  id: string;
  tone: NotificationTone;
  text: string;
  time: string;
  read: boolean;
}

/** Eight unread seeds — matches the design's badge count. */
const seedNotifications: AppNotification[] = [
  { id: "n-1", tone: "up", text: "“India to win today's ODI” moved up 8%", time: "2m ago", read: false },
  { id: "n-2", tone: "down", text: "“RBI cut repo rate in June?” dropped 11%", time: "5m ago", read: false },
  { id: "n-3", tone: "spike", text: "High volume spike in 3 markets", time: "7m ago", read: false },
  { id: "n-4", tone: "up", text: "“Kalki 2898 AD crosses ₹1000 cr?” surged 15%", time: "12m ago", read: false },
  { id: "n-5", tone: "info", text: "“Sensex above 80,000 this week?” closes in 2h 15m", time: "26m ago", read: false },
  { id: "n-6", tone: "win", text: "You won 840 points on “CSK to qualify for IPL Playoffs”", time: "1h ago", read: false },
  { id: "n-7", tone: "info", text: "New event added: 2029 Lok Sabha Elections", time: "2h ago", read: false },
  { id: "n-8", tone: "up", text: "Virat Kohli has 3 new markets this week", time: "3h ago", read: false },
];

export const notificationsStore = createStore<AppNotification[]>(
  seedNotifications,
  "raayo:notifications",
);

export function unreadCount(notifications: AppNotification[]): number {
  return notifications.filter((n) => !n.read).length;
}

export function markAllRead(): void {
  notificationsStore.set((prev) => prev.map((n) => ({ ...n, read: true })));
}

export function pushNotification(tone: NotificationTone, text: string): void {
  notificationsStore.set((prev) =>
    [
      { id: crypto.randomUUID(), tone, text, time: "Just now", read: false },
      ...prev,
    ].slice(0, 20),
  );
}
