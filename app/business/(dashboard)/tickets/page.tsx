"use client";

import React, { useEffect, useMemo, useState } from "react";
import {
  Plane,
  Bus,
  Search,
  PlusCircle,
  ScanLine,
  Trash2,
  ToggleLeft,
  ToggleRight,
  Filter,
} from "lucide-react";
import Link from "next/link";
import { deleteTrip, getBusinessTrips, TripRecord, updateTrip } from "@/lib/api/trip";

type ModeFilter = "all" | "plane" | "bus";

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

export default function BusinessTicketsPage() {
  const [items, setItems] = useState<TripRecord[]>([]);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<ModeFilter>("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const refresh = async () => {
    try {
      setLoading(true);
      setError("");
      const trips = await getBusinessTrips(1, 100);
      setItems(trips);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to fetch trips");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void refresh();
  }, []);

  const list = useMemo(() => {
    const q = query.trim().toLowerCase();
    let out = [...items];
    if (filter !== "all") out = out.filter((x) => x.type === filter);
    if (q) {
      out = out.filter((x) =>
        [x.from, x.to, x._id, x.type, x.status].join(" ").toLowerCase().includes(q),
      );
    }
    out.sort(
      (a, b) =>
        (Date.parse(b.departureAt) || 0) - (Date.parse(a.departureAt) || 0),
    );
    return out;
  }, [items, query, filter]);

  return (
    <main className="ml-72 min-h-screen bg-pink-50/30 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-start justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">All Trips</h1>
            <p className="text-sm text-gray-600 mt-1">
              Manage your published bus and plane trips.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Link href="/business/tickets/scan" className="inline-flex items-center gap-2 rounded-2xl border border-black/10 bg-white px-5 py-3 text-sm font-semibold text-gray-900 hover:bg-gray-50">
              <ScanLine size={18} />
              Scan Ticket
            </Link>
            <Link href="/business/tickets/create" className="inline-flex items-center gap-2 rounded-2xl bg-[#E13434] text-white px-5 py-3 text-sm font-semibold hover:opacity-95">
              <PlusCircle size={18} />
              Create Trip
            </Link>
          </div>
        </div>

        {error && <div className="mb-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}

        <div className="bg-white rounded-3xl border border-black/5 shadow-sm p-5 mb-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-end">
            <div className="lg:col-span-8">
              <label className="text-xs font-semibold text-gray-700">Search</label>
              <div className="mt-1 flex items-center gap-2 rounded-2xl border border-black/10 bg-gray-50 px-3 py-2">
                <Search size={16} className="text-gray-500" />
                <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search by route, id, type, status..." className="w-full bg-transparent outline-none text-sm" />
              </div>
            </div>
            <div className="lg:col-span-4">
              <label className="text-xs font-semibold text-gray-700 flex items-center gap-2">
                <Filter size={14} /> Filter
              </label>
              <select value={filter} onChange={(e) => setFilter(e.target.value as ModeFilter)} className="mt-1 w-full rounded-2xl border border-black/10 bg-white px-3 py-2 text-sm outline-none">
                <option value="all">All</option>
                <option value="plane">Plane</option>
                <option value="bus">Bus</option>
              </select>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="bg-white rounded-3xl border border-black/5 shadow-sm p-12 text-center text-gray-600">
            Loading trips...
          </div>
        ) : list.length === 0 ? (
          <div className="bg-white rounded-3xl border border-black/5 shadow-sm p-12 text-center">
            <h3 className="text-lg font-bold text-gray-900">No trips yet</h3>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {list.map((t) => (
              <TripCard
                key={t._id}
                t={t}
                onToggle={async () => {
                  const nextStatus = t.status === "active" ? "cancelled" : "active";
                  try {
                    const updated = await updateTrip(t._id, { status: nextStatus });
                    setItems((prev) => prev.map((x) => (x._id === t._id ? updated : x)));
                  } catch (err: unknown) {
                    alert(err instanceof Error ? err.message : "Failed to update trip");
                  }
                }}
                onDelete={async () => {
                  if (!confirm("Delete this trip?")) return;
                  try {
                    await deleteTrip(t._id);
                    setItems((prev) => prev.filter((x) => x._id !== t._id));
                  } catch (err: unknown) {
                    alert(err instanceof Error ? err.message : "Failed to delete trip");
                  }
                }}
              />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}

function TripCard({
  t,
  onToggle,
  onDelete,
}: {
  t: TripRecord;
  onToggle: () => void;
  onDelete: () => void;
}) {
  const Icon = t.type === "plane" ? Plane : Bus;

  return (
    <div className="bg-white rounded-3xl border border-black/5 shadow-sm p-5">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-2xl bg-black/5 grid place-items-center">
            <Icon size={18} className="text-gray-900" />
          </div>
          <div className="leading-tight">
            <p className="text-sm font-bold text-gray-900">{t.type.toUpperCase()} Trip</p>
            <p className="text-xs text-gray-500">Trip ID: {t._id}</p>
          </div>
        </div>
        <span className={`text-xs font-semibold px-3 py-1 rounded-full border ${
          t.status === "active" ? "bg-green-50 text-green-700 border-green-200" :
          t.status === "cancelled" ? "bg-red-50 text-red-700 border-red-200" :
          "bg-amber-50 text-amber-700 border-amber-200"
        }`}>
          {t.status.toUpperCase()}
        </span>
      </div>

      <div className="mt-4 rounded-2xl bg-gray-50 border border-black/5 p-4">
        <p className="text-sm font-bold text-gray-900">{t.from} {" -> "} {t.to}</p>
        <p className="text-xs text-gray-600 mt-1">
          {formatDatePretty(t.departureAt)} • {formatTime(t.departureAt)}
          {t.arrivalAt ? ` -> ${formatTime(t.arrivalAt)}` : ""}
        </p>
        <div className="mt-3 flex items-center justify-between gap-3">
          <span className="text-sm font-bold text-gray-900">NPR {t.price}</span>
          <span className="text-xs text-gray-600">
            Seats: {t.availableSeats}/{t.totalSeats}
          </span>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between">
        <button onClick={onToggle} className="inline-flex items-center gap-2 text-sm font-semibold text-gray-800 hover:underline">
          {t.status === "active" ? <ToggleRight size={18} /> : <ToggleLeft size={18} />}
          {t.status === "active" ? "Disable" : "Enable"}
        </button>
        <button onClick={onDelete} className="inline-flex items-center gap-2 text-sm font-semibold text-red-600 hover:underline">
          <Trash2 size={16} />
          Delete
        </button>
      </div>
    </div>
  );
}
