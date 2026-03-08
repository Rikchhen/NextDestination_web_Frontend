"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import {
  Bus,
  Search,
  MapPin,
  CalendarDays,
  Ticket,
  ArrowRight,
  Filter,
  Clock,
  Armchair,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import Sidebar from "../public/_components/sidebar";

type BusTicket = {
  id: string;
  operator: string;
  busType?: string;
  from: string;
  to: string;
  date: string;
  departTime: string;
  arriveTime: string;
  duration: string;
  price: number;
  seatsLeft?: number;
  refundable?: boolean;
};

const SAMPLE_BUS: BusTicket[] = [
  {
    id: "BUS2001",
    operator: "Golden Super Deluxe",
    busType: "A/C Sleeper (2+2)",
    from: "Kathmandu (KTM)",
    to: "Pokhara (PKR)",
    date: "2026-03-02",
    departTime: "09:00",
    arriveTime: "15:30",
    duration: "6h 30m",
    price: 1200,
    seatsLeft: 15,
    refundable: true,
  },
  {
    id: "BUS2002",
    operator: "Nepal Travels",
    busType: "A/C Deluxe (2+2)",
    from: "Kathmandu (KTM)",
    to: "Pokhara (PKR)",
    date: "2026-03-02",
    departTime: "10:15",
    arriveTime: "16:30",
    duration: "6h 15m",
    price: 1400,
    seatsLeft: 2,
    refundable: false,
  },
  {
    id: "BUS2003",
    operator: "Mountain Express",
    busType: "Non A/C (2+2)",
    from: "Kathmandu (KTM)",
    to: "Chitwan (Sauraha)",
    date: "2026-03-03",
    departTime: "07:00",
    arriveTime: "12:30",
    duration: "5h 30m",
    price: 950,
    seatsLeft: 8,
    refundable: true,
  },
  {
    id: "BUS2004",
    operator: "Lumbini Tour Bus",
    busType: "A/C Deluxe (2+2)",
    from: "Kathmandu (KTM)",
    to: "Bhairahawa (BWA)",
    date: "2026-03-03",
    departTime: "08:00",
    arriveTime: "17:00",
    duration: "9h",
    price: 1600,
    seatsLeft: 5,
    refundable: true,
  },
];

function formatDatePretty(yyyyMmDd: string) {
  const [y, m, d] = yyyyMmDd.split("-").map(Number);
  const dt = new Date(y, m - 1, d);
  return dt.toLocaleDateString(undefined, {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "2-digit",
  });
}

function buildBookingHref(ticket: BusTicket) {
  const params = new URLSearchParams({
    mode: "bus",
    id: ticket.id,
    operator: ticket.operator,
    busType: ticket.busType ?? "",
    from: ticket.from,
    to: ticket.to,
    date: ticket.date,
    departTime: ticket.departTime,
    arriveTime: ticket.arriveTime,
    duration: ticket.duration,
    price: String(ticket.price),
    refundable: String(Boolean(ticket.refundable)),
    seatsLeft: String(ticket.seatsLeft ?? ""),
  });

  return `/booking?${params.toString()}`;
}

function BusTicketCard({ ticket }: { ticket: BusTicket }) {
  return (
    <div className="group overflow-hidden rounded-3xl border border-black/5 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
      <div className="border-b border-black/5 bg-gradient-to-r from-white to-[#fff5f5] p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#E13434]/10 text-[#E13434] ring-1 ring-[#E13434]/10">
              <Bus size={20} />
            </div>

            <div className="leading-tight">
              <p className="text-base font-bold text-gray-900">
                {ticket.operator}
              </p>
              <p className="mt-1 text-xs text-gray-500">
                {ticket.busType ? (
                  <span className="font-semibold text-gray-700">
                    {ticket.busType}
                  </span>
                ) : (
                  "Standard Service"
                )}
              </p>
            </div>
          </div>

          <div className="text-right">
            <p className="text-2xl font-extrabold tracking-tight text-[#E13434]">
              NPR {ticket.price}
            </p>
            <p className="mt-1 text-[11px] font-medium text-gray-500">
              {ticket.refundable ? "Cancelable" : "Non-cancelable"}
            </p>
          </div>
        </div>
      </div>

      <div className="p-5">
        <div className="rounded-2xl border border-black/5 bg-gradient-to-br from-gray-50 to-white p-4">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="flex items-center gap-2 text-xs font-medium text-gray-500">
                <MapPin size={14} /> From
              </p>
              <p className="mt-1 text-sm font-bold text-gray-900">
                {ticket.from}
              </p>
            </div>

            <div className="flex min-w-[90px] flex-col items-center text-gray-400">
              <div className="h-[1px] w-20 bg-gray-300" />
              <p className="mt-2 flex items-center gap-1 text-[11px] font-medium">
                <Clock size={12} /> {ticket.duration}
              </p>
            </div>

            <div className="text-right">
              <p className="flex items-center justify-end gap-2 text-xs font-medium text-gray-500">
                To <MapPin size={14} />
              </p>
              <p className="mt-1 text-sm font-bold text-gray-900">
                {ticket.to}
              </p>
            </div>
          </div>

          <div className="mt-4 flex items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-xl border border-black/5 bg-white px-3 py-1.5 text-xs font-semibold text-gray-700 shadow-sm">
                Dep {ticket.departTime}
              </span>
              <span className="rounded-xl border border-black/5 bg-white px-3 py-1.5 text-xs font-semibold text-gray-700 shadow-sm">
                Arr {ticket.arriveTime}
              </span>
            </div>

            {typeof ticket.seatsLeft === "number" && (
              <span
                className={[
                  "inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-bold",
                  ticket.seatsLeft <= 3
                    ? "bg-red-50 text-red-600"
                    : "bg-green-50 text-green-600",
                ].join(" ")}
              >
                <Armchair size={13} /> {ticket.seatsLeft} seats left
              </span>
            )}
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2 text-xs text-gray-700">
            <div className="flex items-center gap-2 rounded-xl bg-gray-50 px-3 py-2">
              <CalendarDays size={14} className="text-[#E13434]" />
              <span className="font-semibold">
                {formatDatePretty(ticket.date)}
              </span>
            </div>

            <div className="flex items-center gap-1 rounded-xl bg-green-50 px-3 py-2 text-green-700">
              <ShieldCheck size={14} />
              <span className="font-semibold">Verified operator</span>
            </div>
          </div>

          <Link
            href={buildBookingHref(ticket)}
            className="inline-flex items-center gap-2 rounded-2xl bg-[#E13434] px-5 py-2.5 text-sm font-semibold text-white transition hover:scale-[1.02] hover:shadow-lg active:scale-[0.99]"
          >
            View Details <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function BusPage() {
  const [query, setQuery] = useState("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [date, setDate] = useState("");
  const [cancelOnly, setCancelOnly] = useState(false);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();

    return SAMPLE_BUS.filter((t) => {
      const matchesQuery =
        !q ||
        t.operator.toLowerCase().includes(q) ||
        (t.busType ?? "").toLowerCase().includes(q) ||
        t.from.toLowerCase().includes(q) ||
        t.to.toLowerCase().includes(q);

      const matchesFrom =
        !from || t.from.toLowerCase().includes(from.toLowerCase());
      const matchesTo = !to || t.to.toLowerCase().includes(to.toLowerCase());
      const matchesDate = !date || t.date === date;
      const matchesCancelable = !cancelOnly || Boolean(t.refundable);

      return (
        matchesQuery &&
        matchesFrom &&
        matchesTo &&
        matchesDate &&
        matchesCancelable
      );
    });
  }, [query, from, to, date, cancelOnly]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#fff7f7] via-[#fffafa] to-[#fdf2f8]">
      <Sidebar />

      <main className="ml-64 min-h-screen p-8">
        <div className="mx-auto max-w-7xl">
          {/* Hero */}
          <div className="mb-8 overflow-hidden rounded-[2rem] border border-black/5 bg-white shadow-sm">
            <div className="relative bg-gradient-to-r from-[#E13434] via-[#d63131] to-[#f06262] px-8 py-8 text-white">
              <div className="absolute right-0 top-0 h-40 w-40 rounded-full bg-white/10 blur-3xl" />
              <div className="absolute bottom-0 left-10 h-24 w-24 rounded-full bg-white/10 blur-2xl" />

              <div className="relative flex items-start justify-between gap-4">
                <div>
                  <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold backdrop-blur">
                    <Sparkles size={14} />
                    Easy route browsing
                  </div>

                  <h1 className="flex items-center gap-3 text-3xl font-extrabold tracking-tight">
                    <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-[#E13434] shadow-sm">
                      <Ticket size={20} />
                    </span>
                    Bus Tickets
                  </h1>

                  <p className="mt-3 max-w-2xl text-sm text-white/90">
                    Search routes, compare seat availability, and continue
                    booking with a cleaner and smoother experience.
                  </p>
                </div>

                <div className="rounded-2xl bg-white/15 px-5 py-4 text-right backdrop-blur">
                  <p className="text-[11px] uppercase tracking-[0.2em] text-white/80">
                    Results
                  </p>
                  <p className="mt-1 text-3xl font-extrabold">
                    {filtered.length}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="mb-8 rounded-[2rem] border border-black/5 bg-white p-6 shadow-sm">
            <div className="mb-5 flex items-center gap-2 text-sm font-bold text-[#E13434]">
              <Filter size={18} />
              Search & Filters
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-12">
              <div className="md:col-span-4">
                <label className="text-xs font-bold tracking-wide text-gray-700">
                  Search
                </label>
                <div className="mt-2 flex items-center gap-2 rounded-2xl border border-black/10 bg-gray-50 px-4 py-3 transition focus-within:ring-2 focus-within:ring-[#E13434]/20">
                  <Search size={16} className="text-gray-500" />
                  <input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Golden, A/C Sleeper, Pokhara..."
                    className="w-full bg-transparent text-sm text-gray-800 outline-none placeholder:text-gray-400"
                  />
                </div>
              </div>

              <div className="md:col-span-3">
                <label className="text-xs font-bold tracking-wide text-gray-700">
                  From
                </label>
                <input
                  value={from}
                  onChange={(e) => setFrom(e.target.value)}
                  placeholder="Kathmandu (KTM)"
                  className="mt-2 w-full rounded-2xl border border-black/10 bg-gray-50 px-4 py-3 text-sm outline-none transition focus:ring-2 focus:ring-[#E13434]/20"
                />
              </div>

              <div className="md:col-span-3">
                <label className="text-xs font-bold tracking-wide text-gray-700">
                  To
                </label>
                <input
                  value={to}
                  onChange={(e) => setTo(e.target.value)}
                  placeholder="Pokhara (PKR)"
                  className="mt-2 w-full rounded-2xl border border-black/10 bg-gray-50 px-4 py-3 text-sm outline-none transition focus:ring-2 focus:ring-[#E13434]/20"
                />
              </div>

              <div className="md:col-span-2">
                <label className="text-xs font-bold tracking-wide text-gray-700">
                  Date
                </label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="mt-2 w-full rounded-2xl border border-black/10 bg-gray-50 px-4 py-3 text-sm outline-none transition focus:ring-2 focus:ring-[#E13434]/20"
                />
              </div>

              <div className="md:col-span-12 mt-1 flex flex-wrap items-center justify-between gap-3 border-t border-black/5 pt-4">
                <label className="inline-flex cursor-pointer items-center gap-2 rounded-xl bg-gray-50 px-3 py-2 text-sm font-medium text-gray-700">
                  <input
                    type="checkbox"
                    checked={cancelOnly}
                    onChange={(e) => setCancelOnly(e.target.checked)}
                    className="h-4 w-4 accent-[#E13434]"
                  />
                  Cancelable only
                </label>

                <button
                  onClick={() => {
                    setQuery("");
                    setFrom("");
                    setTo("");
                    setDate("");
                    setCancelOnly(false);
                  }}
                  className="rounded-xl px-3 py-2 text-sm font-bold text-[#E13434] transition hover:bg-[#E13434]/5"
                >
                  Clear filters
                </button>
              </div>
            </div>
          </div>

          {/* Results */}
          <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
            {filtered.map((ticket) => (
              <BusTicketCard key={ticket.id} ticket={ticket} />
            ))}
          </div>

          {/* Empty */}
          {filtered.length === 0 && (
            <div className="mt-10 rounded-[2rem] border border-dashed border-[#E13434]/20 bg-white p-12 text-center shadow-sm">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#E13434]/10 text-[#E13434]">
                <Bus size={22} />
              </div>
              <h3 className="mt-4 text-xl font-bold text-gray-900">
                No buses found
              </h3>
              <p className="mt-2 text-sm text-gray-600">
                Try adjusting route, date, or clearing filters.
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
