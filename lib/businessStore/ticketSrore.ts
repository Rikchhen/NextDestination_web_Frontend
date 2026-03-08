export type TransportMode = "plane" | "bus";

export type BusinessTicket = {
  id: string; // unique
  mode: TransportMode;

  title: string; // airline/operator
  number: string; // flight number / bus id
  type?: string;

  from: string;
  to: string;

  date: string; // YYYY-MM-DD
  departTime: string;
  arriveTime: string;
  duration?: string;

  price: number;
  refundable: boolean;
  seatsLeft?: number;

  isActive: boolean;

  createdAt: string; // ISO
};

const KEY = "nextdestination_business_tickets_v1";

export function getBusinessTickets(): BusinessTicket[] {
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

export function saveBusinessTicket(t: BusinessTicket) {
  if (typeof window === "undefined") return;
  const all = getBusinessTickets();
  const withoutSame = all.filter((x) => x.id !== t.id);
  localStorage.setItem(KEY, JSON.stringify([t, ...withoutSame]));
}

export function deleteBusinessTicket(id: string) {
  if (typeof window === "undefined") return;
  const all = getBusinessTickets().filter((x) => x.id !== id);
  localStorage.setItem(KEY, JSON.stringify(all));
}

export function toggleBusinessTicketActive(id: string) {
  if (typeof window === "undefined") return;
  const all = getBusinessTickets().map((x) =>
    x.id === id ? { ...x, isActive: !x.isActive } : x,
  );
  localStorage.setItem(KEY, JSON.stringify(all));
}

export function getBusinessTicketById(id: string): BusinessTicket | null {
  const all = getBusinessTickets();
  return all.find((x) => x.id === id) ?? null;
}
