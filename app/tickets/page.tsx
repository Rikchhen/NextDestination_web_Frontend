"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Sidebar from "../public/_components/sidebar";
import { getBookings, deleteBooking } from "@/lib/bookingstore/bookingstore";
import type { StoredBooking } from "@/lib/bookingstore/bookingstore";

import {
  Ticket,
  Plane,
  Bus,
  Search,
  ArrowRight,
  Trash2,
  Filter,
  ArrowUpDown,
} from "lucide-react";

function formatDatePretty(yyyyMmDd: string) {
  if (!yyyyMmDd) return "N/A";
  const [y, m, d] = yyyyMmDd.split("-").map(Number);
  const dt = new Date(y, m - 1, d);
  return dt.toLocaleDateString(undefined, {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "2-digit",
  });
}

type ModeFilter = "all" | "plane" | "bus";
type SortMode = "newest" | "oldest";

export default function MyTicketsPage() {
  const [items, setItems] = useState<StoredBooking[]>([]);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<ModeFilter>("all");
  const [sort, setSort] = useState<SortMode>("newest");

  const refresh = () => setItems(getBookings());

  useEffect(() => {
    refresh();
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();

    let list = [...items];

    if (filter !== "all") {
      list = list.filter((b) => b.mode === filter);
    }

    if (q) {
      list = list.filter((b) => {
        const hay = [
          b.bookingRef,
          b.title,
          b.number,
          b.from,
          b.to,
          b.date,
          b.mode,
          b.status,
        ]
          .join(" ")
          .toLowerCase();

        return hay.includes(q);
      });
    }

    list.sort((a, b) => {
      const ta = Date.parse(a.createdAt) || 0;
      const tb = Date.parse(b.createdAt) || 0;
      return sort === "newest" ? tb - ta : ta - tb;
    });

    return list;
  }, [items, query, filter, sort]);

  return (
    <div className="min-h-screen bg-pink-50/30">
      <Sidebar />

      <main className="ml-64 min-h-screen p-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex items-start justify-between gap-4 mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-white shadow-sm border border-black/5">
                  <Ticket size={18} className="text-[#E13434]" />
                </span>
                My Tickets
              </h1>
              <p className="text-sm text-gray-600 mt-1">
                All your plane and bus bookings in one place.
              </p>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-black/5 px-4 py-3 text-right">
              <p className="text-[11px] uppercase tracking-widest text-gray-500">
                Total Tickets
              </p>
              <p className="text-lg font-bold text-gray-900">
                {filtered.length}
              </p>
            </div>
          </div>

          {/* Controls */}
          <div className="bg-white rounded-3xl shadow-sm border border-black/5 p-5 mb-6">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-end">
              {/* Search */}
              <div className="lg:col-span-7">
                <label className="text-xs font-semibold text-gray-700">
                  Search
                </label>
                <div className="mt-1 flex items-center gap-2 rounded-2xl border border-black/10 bg-gray-50 px-3 py-2">
                  <Search size={16} className="text-gray-500" />
                  <input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search by booking ref, route, airline/operator, flight/bus id..."
                    className="w-full bg-transparent outline-none text-sm text-gray-800 placeholder:text-gray-400"
                  />
                </div>
              </div>

              {/* Filter */}
              <div className="lg:col-span-3">
                <label className="text-xs font-semibold text-gray-700 flex items-center gap-2">
                  <Filter size={14} /> Filter
                </label>
                <select
                  value={filter}
                  onChange={(e) => setFilter(e.target.value as ModeFilter)}
                  className="mt-1 w-full rounded-2xl border border-black/10 bg-white px-3 py-2 text-sm outline-none"
                >
                  <option value="all">All</option>
                  <option value="plane">Plane</option>
                  <option value="bus">Bus</option>
                </select>
              </div>

              {/* Sort */}
              <div className="lg:col-span-2">
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

          {/* List */}
          {filtered.length === 0 ? (
            <div className="bg-white rounded-3xl shadow-sm border border-black/5 p-12 text-center">
              <div className="mx-auto h-12 w-12 rounded-2xl bg-[#E13434]/10 text-[#E13434] flex items-center justify-center">
                <Ticket size={20} />
              </div>
              <h3 className="mt-4 text-lg font-bold text-gray-900">
                No tickets found
              </h3>
              <p className="mt-1 text-sm text-gray-600">
                Book a plane or bus ticket and it will appear here.
              </p>
              <Link
                href="/"
                className="inline-flex mt-5 rounded-2xl bg-[#E13434] text-white px-6 py-3 text-sm font-semibold hover:opacity-95 active:opacity-90"
              >
                Go Home
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {filtered.map((b) => (
                <TicketCard
                  key={b.bookingRef}
                  booking={b}
                  onDelete={() => {
                    deleteBooking(b.bookingRef);
                    refresh();
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
  onDelete,
}: {
  booking: StoredBooking;
  onDelete: () => void;
}) {
  const Icon = booking.mode === "plane" ? Plane : Bus;

  const pill =
    booking.status === "confirmed"
      ? "bg-green-50 text-green-700 border-green-200"
      : booking.status === "cancelled"
        ? "bg-red-50 text-red-700 border-red-200"
        : "bg-amber-50 text-amber-800 border-amber-200";

  return (
    <div className="bg-white rounded-3xl shadow-sm border border-black/5 p-5 hover:shadow-md transition">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-2xl bg-[#E13434]/10 text-[#E13434] flex items-center justify-center">
            <Icon size={18} />
          </div>
          <div className="leading-tight">
            <p className="text-sm font-bold text-gray-900">{booking.title}</p>
            <p className="text-xs text-gray-500">
              {booking.mode === "plane" ? "Flight" : "Service"}{" "}
              <span className="font-semibold text-gray-700">
                {booking.number}
              </span>
              {booking.type ? ` • ${booking.type}` : ""}
            </p>
          </div>
        </div>

        <span
          className={`text-xs font-semibold px-3 py-1 rounded-full border ${pill}`}
        >
          {booking.status.toUpperCase()}
        </span>
      </div>

      <div className="mt-4 rounded-2xl bg-gray-50 border border-black/5 p-4">
        <p className="text-sm font-bold text-gray-900">
          {booking.from} → {booking.to}
        </p>
        <p className="text-xs text-gray-600 mt-1">
          {formatDatePretty(booking.date)} • {booking.departTime} →{" "}
          {booking.arriveTime}
        </p>
        <p className="text-xs text-gray-600 mt-1">
          Booking Ref:{" "}
          <span className="font-semibold text-gray-800">
            {booking.bookingRef}
          </span>
        </p>
      </div>

      <div className="mt-4 flex items-center justify-between gap-3">
        <button
          onClick={onDelete}
          className="inline-flex items-center gap-2 text-sm font-semibold text-red-600 hover:underline"
        >
          <Trash2 size={16} /> Remove
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
