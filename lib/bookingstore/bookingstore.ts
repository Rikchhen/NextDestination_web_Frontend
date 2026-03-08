export type Mode = "plane" | "bus";

export type StoredPassenger = {
  fullName: string;
};

export type StoredBooking = {
  bookingRef: string;
  status: "pending" | "confirmed" | "cancelled";
  mode: Mode;

  // transport
  title: string; // airline/operator
  number: string; // flightNumber/busId
  type?: string; // planeType/busType
  from: string;
  to: string;
  date: string;
  departTime: string;
  arriveTime: string;
  duration: string;

  // pricing & contact
  price: number;
  totalAmount: number;
  passengers: StoredPassenger[];
  contactEmail: string;
  contactPhone: string;

  createdAt: string; // ISO
};

const KEY = "nextdestination_bookings_v1";

export function getBookings(): StoredBooking[] {
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

export function saveBooking(b: StoredBooking) {
  if (typeof window === "undefined") return;
  const all = getBookings();
  const withoutSame = all.filter((x) => x.bookingRef !== b.bookingRef);
  localStorage.setItem(KEY, JSON.stringify([b, ...withoutSame]));
}

export function getBookingByRef(ref: string): StoredBooking | null {
  const all = getBookings();
  return all.find((x) => x.bookingRef === ref) ?? null;
}

export function deleteBooking(ref: string) {
  if (typeof window === "undefined") return;
  const all = getBookings().filter((x) => x.bookingRef !== ref);
  localStorage.setItem(KEY, JSON.stringify(all));
}
