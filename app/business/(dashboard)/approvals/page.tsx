"use client";

import React, { useEffect, useMemo, useState } from "react";
import { BadgeCheck, Check, X, Search, CreditCard } from "lucide-react";
import {
  getBookings,
  saveBooking,
  type StoredBooking,
} from "@/lib/bookingstore/bookingstore";
import { saveTransaction } from "@/lib/businessStore/transactionStote";

export default function ApprovalsPage() {
  const [items, setItems] = useState<StoredBooking[]>([]);
  const [q, setQ] = useState("");

  const refresh = () => setItems(getBookings());

  useEffect(() => {
    refresh();
  }, []);

  const pending = useMemo(() => {
    const query = q.trim().toLowerCase();
    let list = items.filter((b) => b.status === "pending");

    if (query) {
      list = list.filter((b) =>
        [
          b.bookingRef,
          b.title,
          b.number,
          b.from,
          b.to,
          b.mode,
          b.contactEmail,
          b.contactPhone,
        ]
          .join(" ")
          .toLowerCase()
          .includes(query),
      );
    }

    list.sort(
      (a, b) => (Date.parse(b.createdAt) || 0) - (Date.parse(a.createdAt) || 0),
    );
    return list;
  }, [items, q]);

  const approve = (b: StoredBooking) => {
    const updated: StoredBooking = { ...b, status: "confirmed" };
    saveBooking(updated);

    saveTransaction({
      id: `TX-${Date.now().toString(16).toUpperCase()}`,
      bookingRef: b.bookingRef,
      mode: b.mode,
      title: b.title,
      from: b.from,
      to: b.to,
      amount: b.totalAmount,
      method: "other",
      status: "approved",
      createdAt: new Date().toISOString(),
    });

    refresh();
  };

  const reject = (b: StoredBooking) => {
    const updated: StoredBooking = {
      ...b,
      status: "cancelled",
      cancelReason: "Rejected by business",
    } as any;
    saveBooking(updated);
    refresh();
  };

  return (
    <main className="ml-72 min-h-screen bg-pink-50/30 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <span className="h-10 w-10 rounded-2xl bg-white border border-black/5 shadow-sm grid place-items-center">
                <BadgeCheck size={18} className="text-[#E13434]" />
              </span>
              Approvals
            </h1>
            <p className="text-sm text-gray-600 mt-1">
              Approve or reject pending bookings.
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-black/5 shadow-sm px-4 py-3 text-right">
            <p className="text-[11px] uppercase tracking-widest text-gray-500">
              Pending
            </p>
            <p className="text-lg font-bold text-gray-900">{pending.length}</p>
          </div>
        </div>

        <div className="bg-white rounded-3xl border border-black/5 shadow-sm p-5 mb-6">
          <label className="text-xs font-semibold text-gray-700">Search</label>
          <div className="mt-1 flex items-center gap-2 rounded-2xl border border-black/10 bg-gray-50 px-3 py-2">
            <Search size={16} className="text-gray-500" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search by booking ref, route, customer contact..."
              className="w-full bg-transparent outline-none text-sm"
            />
          </div>
        </div>

        {pending.length === 0 ? (
          <div className="bg-white rounded-3xl border border-black/5 shadow-sm p-12 text-center">
            <h3 className="text-lg font-bold text-gray-900">
              No pending bookings
            </h3>
            <p className="text-sm text-gray-600 mt-1">
              All good — nothing to approve right now.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {pending.map((b) => (
              <div
                key={b.bookingRef}
                className="bg-white rounded-3xl border border-black/5 shadow-sm p-5"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm font-bold text-gray-900">
                      {b.from} → {b.to}
                    </p>
                    <p className="text-xs text-gray-600 mt-1">
                      {b.mode.toUpperCase()} • {b.title} • {b.number}
                    </p>
                    <p className="text-xs text-gray-600 mt-1">
                      Ref: <span className="font-semibold">{b.bookingRef}</span>
                    </p>
                    <p className="text-xs text-gray-500 mt-2">
                      {b.contactEmail} • {b.contactPhone}
                    </p>
                  </div>

                  <div className="text-right">
                    <p className="text-xs text-gray-500 flex items-center justify-end gap-2">
                      <CreditCard size={14} /> Total
                    </p>
                    <p className="text-lg font-bold text-gray-900">
                      NPR {b.totalAmount}
                    </p>
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-end gap-3">
                  <button
                    onClick={() => reject(b)}
                    className="inline-flex items-center gap-2 rounded-2xl border border-black/10 bg-white px-4 py-2 text-sm font-semibold text-gray-900 hover:bg-gray-50"
                  >
                    <X size={16} /> Reject
                  </button>

                  <button
                    onClick={() => approve(b)}
                    className="inline-flex items-center gap-2 rounded-2xl bg-[#E13434] text-white px-4 py-2 text-sm font-semibold hover:opacity-95"
                  >
                    <Check size={16} /> Approve
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
