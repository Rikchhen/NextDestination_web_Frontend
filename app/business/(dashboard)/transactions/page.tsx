"use client";

import React, { useEffect, useMemo, useState } from "react";
import { CreditCard, Search, ArrowUpDown } from "lucide-react";
import {
  BusinessTransaction,
  getTransactions,
} from "@/lib/businessStore/transactionStote";

type SortMode = "newest" | "oldest";

export default function BusinessTransactionsPage() {
  const [items, setItems] = useState<BusinessTransaction[]>([]);
  const [q, setQ] = useState("");
  const [sort, setSort] = useState<SortMode>("newest");

  useEffect(() => {
    setItems(getTransactions());
  }, []);

  const list = useMemo(() => {
    const query = q.trim().toLowerCase();
    let out = [...items];

    if (query) {
      out = out.filter((t) =>
        [t.bookingRef, t.title, t.from, t.to, t.mode, t.method, t.status]
          .join(" ")
          .toLowerCase()
          .includes(query),
      );
    }

    out.sort((a, b) => {
      const ta = Date.parse(a.createdAt) || 0;
      const tb = Date.parse(b.createdAt) || 0;
      return sort === "newest" ? tb - ta : ta - tb;
    });

    return out;
  }, [items, q, sort]);

  const totalApproved = useMemo(() => {
    return list
      .filter((x) => x.status === "approved")
      .reduce((sum, x) => sum + x.amount, 0);
  }, [list]);

  return (
    <main className="ml-72 min-h-screen bg-pink-50/30 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <span className="h-10 w-10 rounded-2xl bg-white border border-black/5 shadow-sm grid place-items-center">
                <CreditCard size={18} className="text-[#E13434]" />
              </span>
              Transactions
            </h1>
            <p className="text-sm text-gray-600 mt-1">
              Payment activity created from approvals.
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-black/5 shadow-sm px-4 py-3 text-right">
            <p className="text-[11px] uppercase tracking-widest text-gray-500">
              Approved Total
            </p>
            <p className="text-lg font-bold text-gray-900">
              NPR {totalApproved}
            </p>
          </div>
        </div>

        <div className="bg-white rounded-3xl border border-black/5 shadow-sm p-5 mb-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-end">
            <div className="lg:col-span-9">
              <label className="text-xs font-semibold text-gray-700">
                Search
              </label>
              <div className="mt-1 flex items-center gap-2 rounded-2xl border border-black/10 bg-gray-50 px-3 py-2">
                <Search size={16} className="text-gray-500" />
                <input
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder="Search by booking ref, route, method..."
                  className="w-full bg-transparent outline-none text-sm"
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

        {list.length === 0 ? (
          <div className="bg-white rounded-3xl border border-black/5 shadow-sm p-12 text-center">
            <h3 className="text-lg font-bold text-gray-900">
              No transactions yet
            </h3>
            <p className="text-sm text-gray-600 mt-1">
              Approve a booking to generate a transaction.
            </p>
          </div>
        ) : (
          <div className="bg-white rounded-3xl border border-black/5 shadow-sm overflow-hidden">
            <div className="grid grid-cols-12 bg-gray-50 border-b border-black/5 text-xs font-semibold text-gray-600 px-5 py-3">
              <div className="col-span-3">Booking Ref</div>
              <div className="col-span-4">Route</div>
              <div className="col-span-2">Method</div>
              <div className="col-span-1">Mode</div>
              <div className="col-span-2 text-right">Amount</div>
            </div>

            {list.map((t) => (
              <div
                key={t.id}
                className="grid grid-cols-12 px-5 py-4 border-b border-black/5 last:border-b-0 text-sm"
              >
                <div className="col-span-3">
                  <p className="font-semibold text-gray-900">{t.bookingRef}</p>
                  <p className="text-xs text-gray-500">
                    {t.status.toUpperCase()}
                  </p>
                </div>
                <div className="col-span-4">
                  <p className="font-semibold text-gray-900">
                    {t.from} → {t.to}
                  </p>
                  <p className="text-xs text-gray-500">{t.title}</p>
                </div>
                <div className="col-span-2 text-gray-700">
                  {t.method.toUpperCase()}
                </div>
                <div className="col-span-1 text-gray-700">
                  {t.mode.toUpperCase()}
                </div>
                <div className="col-span-2 text-right font-bold text-gray-900">
                  NPR {t.amount}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
