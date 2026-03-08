"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  Plane,
  Search,
  MapPin,
  CalendarDays,
  Ticket,
  ArrowRight,
  Filter,
  Clock,
  Sparkles,
} from "lucide-react";
import Sidebar from "../public/_components/sidebar";
import { TripRecord, searchTrips } from "@/lib/api/trip";

function formatDatePretty(value: string) {
  const dt = new Date(value);
  if (Number.isNaN(dt.getTime())) return "N/A";
  return dt.toLocaleDateString(undefined, {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "2-digit",
  });
}

function formatTime(value: string) {
  const dt = new Date(value);
  if (Number.isNaN(dt.getTime())) return "N/A";
  return dt.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

function durationText(departureAt: string, arrivalAt?: string) {
  if (!arrivalAt) return "N/A";
  const d1 = new Date(departureAt).getTime();
  const d2 = new Date(arrivalAt).getTime();
  if (!Number.isFinite(d1) || !Number.isFinite(d2) || d2 <= d1) return "N/A";
  const mins = Math.floor((d2 - d1) / 60000);
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return h > 0 ? `${h}h ${m}m` : `${m}m`;
}

function buildBookingHref(trip: TripRecord) {
  const params = new URLSearchParams({
    mode: "plane",
    id: trip._id,
    airline: "Flight Service",
    flightNumber: `TR-${trip._id.slice(-6).toUpperCase()}`,
    planeType: "",
    from: trip.from,
    to: trip.to,
    date: new Date(trip.departureAt).toISOString().slice(0, 10),
    departTime: formatTime(trip.departureAt),
    arriveTime: trip.arrivalAt ? formatTime(trip.arrivalAt) : "N/A",
    duration: durationText(trip.departureAt, trip.arrivalAt),
    price: String(trip.price),
    refundable: "false",
    seatsLeft: String(trip.availableSeats),
  });
  return `/booking?${params.toString()}`;
}

export default function PlanePage() {
  const [items, setItems] = useState<TripRecord[]>([]);
  const [query, setQuery] = useState("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [date, setDate] = useState("");
  const [activeOnly, setActiveOnly] = useState(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setError("");
        const result = await searchTrips({
          type: "plane",
          from: from || undefined,
          to: to || undefined,
          status: activeOnly ? "active" : undefined,
          departureFrom: date ? `${date}T00:00:00.000Z` : undefined,
          departureTo: date ? `${date}T23:59:59.999Z` : undefined,
          page: 1,
          limit: 50,
        });

        const q = query.trim().toLowerCase();
        const filtered = q
          ? result.items.filter((t) =>
              [t.from, t.to, t._id, t.status].join(" ").toLowerCase().includes(q),
            )
          : result.items;

        setItems(filtered);
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : "Failed to fetch trips");
      } finally {
        setLoading(false);
      }
    };
    void load();
  }, [query, from, to, date, activeOnly]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#fff7f7] via-[#fffafa] to-[#fdf2f8]">
      <Sidebar />
      <main className="ml-64 min-h-screen p-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8 overflow-hidden rounded-[2rem] border border-black/5 bg-white shadow-sm">
            <div className="relative bg-gradient-to-r from-[#E13434] via-[#d63131] to-[#f06262] px-8 py-8 text-white">
              <div className="relative flex items-start justify-between gap-4">
                <div>
                  <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold backdrop-blur">
                    <Sparkles size={14} />
                    Smart flight search
                  </div>
                  <h1 className="flex items-center gap-3 text-3xl font-extrabold tracking-tight">
                    <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-[#E13434] shadow-sm">
                      <Ticket size={20} />
                    </span>
                    Plane Trips
                  </h1>
                </div>
                <div className="rounded-2xl bg-white/15 px-5 py-4 text-right backdrop-blur">
                  <p className="text-[11px] uppercase tracking-[0.2em] text-white/80">
                    Results
                  </p>
                  <p className="mt-1 text-3xl font-extrabold">{items.length}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="mb-8 rounded-[2rem] border border-black/5 bg-white p-6 shadow-sm">
            <div className="mb-5 flex items-center gap-2 text-sm font-bold text-[#E13434]">
              <Filter size={18} />
              Search & Filters
            </div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-12">
              <div className="md:col-span-4">
                <label className="text-xs font-bold tracking-wide text-gray-700">Search</label>
                <div className="mt-2 flex items-center gap-2 rounded-2xl border border-black/10 bg-gray-50 px-4 py-3">
                  <Search size={16} className="text-gray-500" />
                  <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Route, id, status..." className="w-full bg-transparent text-sm text-gray-800 outline-none" />
                </div>
              </div>
              <div className="md:col-span-3">
                <label className="text-xs font-bold tracking-wide text-gray-700">From</label>
                <input value={from} onChange={(e) => setFrom(e.target.value)} className="mt-2 w-full rounded-2xl border border-black/10 bg-gray-50 px-4 py-3 text-sm outline-none" />
              </div>
              <div className="md:col-span-3">
                <label className="text-xs font-bold tracking-wide text-gray-700">To</label>
                <input value={to} onChange={(e) => setTo(e.target.value)} className="mt-2 w-full rounded-2xl border border-black/10 bg-gray-50 px-4 py-3 text-sm outline-none" />
              </div>
              <div className="md:col-span-2">
                <label className="text-xs font-bold tracking-wide text-gray-700">Date</label>
                <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="mt-2 w-full rounded-2xl border border-black/10 bg-gray-50 px-4 py-3 text-sm outline-none" />
              </div>
              <div className="md:col-span-12 mt-1 flex items-center justify-between gap-3 border-t border-black/5 pt-4">
                <label className="inline-flex cursor-pointer items-center gap-2 rounded-xl bg-gray-50 px-3 py-2 text-sm font-medium text-gray-700">
                  <input type="checkbox" checked={activeOnly} onChange={(e) => setActiveOnly(e.target.checked)} className="h-4 w-4 accent-[#E13434]" />
                  Active only
                </label>
              </div>
            </div>
          </div>

          {error && <div className="mb-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}
          {loading ? (
            <div className="rounded-[2rem] bg-white p-8 text-center text-gray-600">Loading trips...</div>
          ) : items.length === 0 ? (
            <div className="rounded-[2rem] border border-dashed border-[#E13434]/20 bg-white p-12 text-center shadow-sm">
              <Plane size={22} className="mx-auto text-[#E13434]" />
              <h3 className="mt-4 text-xl font-bold text-gray-900">No flights found</h3>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
              {items.map((trip) => (
                <div key={trip._id} className="group overflow-hidden rounded-3xl border border-black/5 bg-white shadow-sm">
                  <div className="border-b border-black/5 p-5">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-base font-bold text-gray-900">Flight Service</p>
                        <p className="mt-1 text-xs text-gray-500">Trip ID: {trip._id}</p>
                      </div>
                      <p className="text-2xl font-extrabold tracking-tight text-[#E13434]">NPR {trip.price}</p>
                    </div>
                  </div>
                  <div className="p-5">
                    <div className="rounded-2xl border border-black/5 bg-gradient-to-br from-gray-50 to-white p-4">
                      <p className="text-sm font-bold text-gray-900 flex items-center gap-2"><MapPin size={14} /> {trip.from} {" -> "} {trip.to}</p>
                      <p className="mt-2 text-xs text-gray-600 flex items-center gap-2"><CalendarDays size={14} /> {formatDatePretty(trip.departureAt)}</p>
                      <p className="mt-1 text-xs text-gray-600 flex items-center gap-2"><Clock size={14} /> {formatTime(trip.departureAt)} {" -> "} {trip.arrivalAt ? formatTime(trip.arrivalAt) : "N/A"} ({durationText(trip.departureAt, trip.arrivalAt)})</p>
                      <p className="mt-1 text-xs text-gray-600">Seats left: {trip.availableSeats}</p>
                    </div>
                    <div className="mt-4 flex justify-end">
                      <Link href={buildBookingHref(trip)} className="inline-flex items-center gap-2 rounded-2xl bg-[#E13434] px-5 py-2.5 text-sm font-semibold text-white">
                        View Details <ArrowRight size={16} />
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
