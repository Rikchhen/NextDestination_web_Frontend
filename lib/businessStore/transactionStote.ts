export type BusinessTransaction = {
  id: string;
  bookingRef: string;

  mode: "plane" | "bus";
  title: string; // airline/operator
  from: string;
  to: string;

  amount: number;
  method: "cash" | "bank" | "esewa" | "khalti" | "card" | "other";
  status: "pending" | "approved" | "rejected";

  createdAt: string; // ISO
};

const KEY = "nextdestination_business_transactions_v1";

export function getTransactions(): BusinessTransaction[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveTransaction(t: BusinessTransaction) {
  if (typeof window === "undefined") return;
  const all = getTransactions();
  const withoutSame = all.filter((x) => x.id !== t.id);
  localStorage.setItem(KEY, JSON.stringify([t, ...withoutSame]));
}
