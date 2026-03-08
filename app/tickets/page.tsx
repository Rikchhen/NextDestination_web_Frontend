"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Sidebar from "../public/_components/sidebar";
import {
  BookingRecord,
  cancelBooking,
  getMyBookings,
} from "@/lib/api/booking";

import { Ticket, Search, ArrowRight, Ban, ArrowUpDown } from "lucide-react";

function formatDatePretty(value?: string) {
  if (!value) return "N/A";
  const dt = new Date(value);
  if (Number.isNaN(dt.getTime())) return "N/A";
  return dt.toLocaleDateString(undefined, {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "2-digit",
  });
}

type SortMode = "newest" | "oldest";

export default function MyTicketsPage() {
  const [items, setItems] = useState<BookingRecord[]>([]);
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<SortMode>("newest");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const refresh = async () => {
    try {
      setLoading(true);
      setError("");
      const list = await getMyBookings(1, 50);
      setItems(list);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to fetch bookings");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void refresh();
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const list = q
      ? items.filter((b) =>
          [b.bookingRef, b.status, b.contactEmail, b.contactPhone, b.trip]
            .join(" ")
            .toLowerCase()
            .includes(q),
        )
      : [...items];

    list.sort((a, b) => {
      const ta = Date.parse(a.createdAt || "") || 0;
      const tb = Date.parse(b.createdAt || "") || 0;
      return sort === "newest" ? tb - ta : ta - tb;
    });

    return list;
  }, [items, query, sort]);

  return (
    <div className="min-h-screen bg-pink-50/30">
      <Sidebar />

      <main className="ml-64 min-h-screen p-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-start justify-between gap-4 mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-white shadow-sm border border-black/5">
                  <Ticket size={18} className="text-[#E13434]" />
                </span>
                My Bookings
              </h1>
              <p className="text-sm text-gray-600 mt-1">
                Your backend bookings from the authenticated account.
              </p>
            </div>

            <button
              onClick={() => void refresh()}
              className="rounded-2xl bg-white border border-black/10 px-4 py-2 text-sm font-semibold text-gray-800 hover:bg-gray-50"
            >
              Refresh
            </button>
          </div>

          <div className="bg-white rounded-3xl shadow-sm border border-black/5 p-5 mb-6">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-end">
              <div className="lg:col-span-9">
                <label className="text-xs font-semibold text-gray-700">
                  Search
                </label>
                <div className="mt-1 flex items-center gap-2 rounded-2xl border border-black/10 bg-gray-50 px-3 py-2">
                  <Search size={16} className="text-gray-500" />
                  <input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search by booking ref, contact, trip, status..."
                    className="w-full bg-transparent outline-none text-sm text-gray-800 placeholder:text-gray-400"
                  />
                </div>
              </div>

              <div className="lg:col-span-3">
                <label className="text-xs font-semibold text-gray-700 flex items-center gap-2">
                  <ArrowUpDown size={14} /> Sort
                </label>
                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value as SortMode)}
                  className="mt-1 w-full rounded-2xl border border-black/10 bg-white px-3 py-2 text-sm outline-none"
                >
                  <option value="newest">Newest</option>
                  <option value="oldest">Oldest</option>
                </select>
              </div>
            </div>
          </div>

          {loading ? (
            <div className="bg-white rounded-3xl shadow-sm border border-black/5 p-12 text-center text-gray-600">
              Loading bookings...
            </div>
          ) : error ? (
            <div className="bg-white rounded-3xl shadow-sm border border-red-200 p-8 text-center text-red-600">
              {error}
            </div>
          ) : filtered.length === 0 ? (
            <div className="bg-white rounded-3xl shadow-sm border border-black/5 p-12 text-center">
              <h3 className="text-lg font-bold text-gray-900">
                No bookings found
              </h3>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {filtered.map((b) => (
                <TicketCard
                  key={b._id}
                  booking={b}
                  onCancel={async () => {
                    if (b.status === "cancelled") return;
                    if (!confirm("Cancel this booking?")) return;
                    try {
                      const updated = await cancelBooking(b._id);
                      setItems((prev) =>
                        prev.map((x) => (x._id === b._id ? updated : x)),
                      );
                    } catch (err: unknown) {
                      alert(
                        err instanceof Error ? err.message : "Cancel failed",
                      );
                    }
                  }}
                />
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

function TicketCard({
  booking,
  onCancel,
}: {
  booking: BookingRecord;
  onCancel: () => void;
}) {
  const pill =
    booking.status === "confirmed"
      ? "bg-green-50 text-green-700 border-green-200"
      : booking.status === "cancelled"
        ? "bg-red-50 text-red-700 border-red-200"
        : "bg-amber-50 text-amber-800 border-amber-200";

  return (
    <div className="bg-white rounded-3xl shadow-sm border border-black/5 p-5 hover:shadow-md transition">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-bold text-gray-900">{booking.bookingRef}</p>
          <p className="text-xs text-gray-500">Trip: {booking.trip}</p>
        </div>
        <span
          className={`text-xs font-semibold px-3 py-1 rounded-full border ${pill}`}
        >
          {booking.status.toUpperCase()}
        </span>
      </div>

      <div className="mt-4 rounded-2xl bg-gray-50 border border-black/5 p-4 space-y-1">
        <p className="text-xs text-gray-600">Passengers: {booking.passengers.length}</p>
        <p className="text-xs text-gray-600">Contact: {booking.contactEmail}</p>
        <p className="text-xs text-gray-600">Phone: {booking.contactPhone}</p>
        <p className="text-xs text-gray-600">Created: {formatDatePretty(booking.createdAt)}</p>
      </div>

      <div className="mt-4 flex items-center justify-between gap-3">
        <button
          onClick={onCancel}
          disabled={booking.status === "cancelled"}
          className="inline-flex items-center gap-2 text-sm font-semibold text-red-600 hover:underline disabled:opacity-40 disabled:no-underline"
        >
          <Ban size={16} /> Cancel
        </button>

        <Link
          href={`/ticket/${booking.bookingRef}`}
          className="inline-flex items-center gap-2 rounded-2xl bg-[#E13434] text-white px-4 py-2 text-sm font-semibold hover:opacity-95 active:opacity-90"
        >
          View Ticket <ArrowRight size={16} />
        </Link>
      </div>
    </div>
  );
}
