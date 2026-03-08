"use client";

import React, { useEffect, useMemo, useState } from "react";
import {
  Plane,
  Bus,
  Search,
  PlusCircle,
  Trash2,
  ToggleLeft,
  ToggleRight,
  Filter,
} from "lucide-react";
import Link from "next/link";
import {
  BusinessTicket,
  deleteBusinessTicket,
  getBusinessTickets,
  toggleBusinessTicketActive,
} from "@/lib/businessStore/ticketSrore";

type ModeFilter = "all" | "plane" | "bus";

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

export default function BusinessTicketsPage() {
  const [items, setItems] = useState<BusinessTicket[]>([]);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<ModeFilter>("all");

  const refresh = () => setItems(getBusinessTickets());

  useEffect(() => {
    refresh();
  }, []);

  const list = useMemo(() => {
    const q = query.trim().toLowerCase();
    let out = [...items];

    if (filter !== "all") out = out.filter((x) => x.mode === filter);

    if (q) {
      out = out.filter((x) =>
        [
          x.title,
          x.number,
          x.from,
          x.to,
          x.date,
          x.mode,
          x.type ?? "",
          x.isActive ? "active" : "inactive",
        ]
          .join(" ")
          .toLowerCase()
          .includes(q),
      );
    }

    out.sort(
      (a, b) => (Date.parse(b.createdAt) || 0) - (Date.parse(a.createdAt) || 0),
    );
    return out;
  }, [items, query, filter]);

  return (
    <main className="ml-72 min-h-screen bg-pink-50/30 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">All Tickets</h1>
            <p className="text-sm text-gray-600 mt-1">
              Manage your published plane and bus tickets.
            </p>
          </div>

          <Link
            href="/business/tickets/create"
            className="inline-flex items-center gap-2 rounded-2xl bg-[#E13434] text-white px-5 py-3 text-sm font-semibold hover:opacity-95"
          >
            <PlusCircle size={18} />
            Create Ticket
          </Link>
        </div>

        {/* Controls */}
        <div className="bg-white rounded-3xl border border-black/5 shadow-sm p-5 mb-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-end">
            <div className="lg:col-span-8">
              <label className="text-xs font-semibold text-gray-700">
                Search
              </label>
              <div className="mt-1 flex items-center gap-2 rounded-2xl border border-black/10 bg-gray-50 px-3 py-2">
                <Search size={16} className="text-gray-500" />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search by route, airline/operator, number..."
                  className="w-full bg-transparent outline-none text-sm"
                />
              </div>
            </div>

            <div className="lg:col-span-4">
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
          </div>
        </div>

        {/* List */}
        {list.length === 0 ? (
          <div className="bg-white rounded-3xl border border-black/5 shadow-sm p-12 text-center">
            <h3 className="text-lg font-bold text-gray-900">No tickets yet</h3>
            <p className="text-sm text-gray-600 mt-1">
              Create your first ticket to start selling.
            </p>
            <Link
              href="/business/tickets/create"
              className="inline-flex mt-5 rounded-2xl bg-[#E13434] text-white px-6 py-3 text-sm font-semibold hover:opacity-95"
            >
              Create Ticket
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {list.map((t) => (
              <TicketCard
                key={t.id}
                t={t}
                onToggle={() => {
                  toggleBusinessTicketActive(t.id);
                  refresh();
                }}
                onDelete={() => {
                  if (confirm("Delete this ticket?")) {
                    deleteBusinessTicket(t.id);
                    refresh();
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

function TicketCard({
  t,
  onToggle,
  onDelete,
}: {
  t: BusinessTicket;
  onToggle: () => void;
  onDelete: () => void;
}) {
  const Icon = t.mode === "plane" ? Plane : Bus;

  return (
    <div className="bg-white rounded-3xl border border-black/5 shadow-sm p-5">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-2xl bg-black/5 grid place-items-center">
            <Icon size={18} className="text-gray-900" />
          </div>
          <div className="leading-tight">
            <p className="text-sm font-bold text-gray-900">{t.title}</p>
            <p className="text-xs text-gray-500">
              {t.mode === "plane" ? "Flight" : "Service"}{" "}
              <span className="font-semibold text-gray-700">{t.number}</span>
              {t.type ? ` • ${t.type}` : ""}
            </p>
          </div>
        </div>

        <span
          className={[
            "text-xs font-semibold px-3 py-1 rounded-full border",
            t.isActive
              ? "bg-green-50 text-green-700 border-green-200"
              : "bg-gray-50 text-gray-700 border-gray-200",
          ].join(" ")}
        >
          {t.isActive ? "ACTIVE" : "INACTIVE"}
        </span>
      </div>

      <div className="mt-4 rounded-2xl bg-gray-50 border border-black/5 p-4">
        <p className="text-sm font-bold text-gray-900">
          {t.from} → {t.to}
        </p>
        <p className="text-xs text-gray-600 mt-1">
          {formatDatePretty(t.date)} • {t.departTime} → {t.arriveTime}
          {t.duration ? ` • ${t.duration}` : ""}
        </p>

        <div className="mt-3 flex items-center justify-between gap-3">
          <span className="text-sm font-bold text-gray-900">NPR {t.price}</span>
          <span className="text-xs font-semibold px-3 py-1 rounded-full bg-[#E13434]/10 text-[#E13434]">
            {t.refundable
              ? t.mode === "bus"
                ? "Cancelable"
                : "Refundable"
              : t.mode === "bus"
                ? "Non-cancelable"
                : "Non-refundable"}
          </span>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between">
        <button
          onClick={onToggle}
          className="inline-flex items-center gap-2 text-sm font-semibold text-gray-800 hover:underline"
        >
          {t.isActive ? <ToggleRight size={18} /> : <ToggleLeft size={18} />}
          {t.isActive ? "Disable" : "Enable"}
        </button>

        <button
          onClick={onDelete}
          className="inline-flex items-center gap-2 text-sm font-semibold text-red-600 hover:underline"
        >
          <Trash2 size={16} />
          Delete
        </button>
      </div>
    </div>
  );
}
