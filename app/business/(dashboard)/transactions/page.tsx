"use client";

import React, { useEffect, useMemo, useState } from "react";
import { CreditCard, Search, ArrowUpDown } from "lucide-react";
import {
  getBusinessWalletBalance,
  getBusinessWalletTransactions,
  WalletBalance,
  WalletTransaction,
} from "@/lib/api/wallet";

type SortMode = "newest" | "oldest";

function formatDate(value: string) {
  const dt = new Date(value);
  if (Number.isNaN(dt.getTime())) return "N/A";
  return dt.toLocaleString();
}

export default function BusinessTransactionsPage() {
  const [items, setItems] = useState<WalletTransaction[]>([]);
  const [wallet, setWallet] = useState<WalletBalance | null>(null);
  const [q, setQ] = useState("");
  const [sort, setSort] = useState<SortMode>("newest");
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = async (nextPage = 1) => {
    try {
      setLoading(true);
      setError("");
      const [balanceData, txData] = await Promise.all([
        getBusinessWalletBalance(),
        getBusinessWalletTransactions(nextPage, 15),
      ]);
      setWallet(balanceData);
      setItems(txData.transactions);
      setPage(txData.pagination.page);
      setPages(Math.max(1, txData.pagination.pages || 1));
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to fetch transactions");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load(1);
  }, []);

  const list = useMemo(() => {
    const query = q.trim().toLowerCase();
    let out = [...items];

    if (query) {
      out = out.filter((t) =>
        [t.reference, t.description, t.type, t.ownerType]
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

  const totalCredits = useMemo(
    () =>
      list
        .filter((x) => x.type === "credit")
        .reduce((sum, x) => sum + x.amount, 0),
    [list],
  );

  return (
    <main className="ml-72 min-h-screen bg-pink-50/30 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <span className="h-10 w-10 rounded-2xl bg-white border border-black/5 shadow-sm grid place-items-center">
                <CreditCard size={18} className="text-[#E13434]" />
              </span>
              Wallet Transactions
            </h1>
            <p className="text-sm text-gray-600 mt-1">
              Live wallet activity for your business account.
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-black/5 shadow-sm px-4 py-3 text-right">
            <p className="text-[11px] uppercase tracking-widest text-gray-500">
              Wallet Balance
            </p>
            <p className="text-lg font-bold text-gray-900">
              {wallet ? `${wallet.currency} ${wallet.balance}` : "NPR 0"}
            </p>
          </div>
        </div>

        {error && (
          <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 mb-4">
            {error}
          </div>
        )}

        <div className="bg-white rounded-3xl border border-black/5 shadow-sm p-5 mb-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-end">
            <div className="lg:col-span-9">
              <label className="text-xs font-semibold text-gray-700">Search</label>
              <div className="mt-1 flex items-center gap-2 rounded-2xl border border-black/10 bg-gray-50 px-3 py-2">
                <Search size={16} className="text-gray-500" />
                <input
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder="Search by reference, description, type..."
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

        <div className="bg-white rounded-2xl border border-black/5 shadow-sm px-4 py-3 text-right mb-4">
          <p className="text-[11px] uppercase tracking-widest text-gray-500">
            Credits (Current Page)
          </p>
          <p className="text-lg font-bold text-gray-900">
            {(wallet?.currency || "NPR")} {totalCredits}
          </p>
        </div>

        {loading ? (
          <div className="bg-white rounded-3xl border border-black/5 shadow-sm p-12 text-center text-gray-600">
            Loading transactions...
          </div>
        ) : list.length === 0 ? (
          <div className="bg-white rounded-3xl border border-black/5 shadow-sm p-12 text-center">
            <h3 className="text-lg font-bold text-gray-900">No transactions yet</h3>
            <p className="text-sm text-gray-600 mt-1">
              Wallet transactions will appear here.
            </p>
          </div>
        ) : (
          <div className="bg-white rounded-3xl border border-black/5 shadow-sm overflow-hidden">
            <div className="grid grid-cols-12 bg-gray-50 border-b border-black/5 text-xs font-semibold text-gray-600 px-5 py-3">
              <div className="col-span-2">Type</div>
              <div className="col-span-3">Reference</div>
              <div className="col-span-3">Description</div>
              <div className="col-span-2 text-right">Amount</div>
              <div className="col-span-2 text-right">Balance</div>
            </div>

            {list.map((t) => (
              <div
                key={t._id}
                className="grid grid-cols-12 px-5 py-4 border-b border-black/5 last:border-b-0 text-sm"
              >
                <div className="col-span-2">
                  <p
                    className={`font-semibold ${
                      t.type === "credit" ? "text-green-700" : "text-red-700"
                    }`}
                  >
                    {t.type.toUpperCase()}
                  </p>
                  <p className="text-xs text-gray-500">{formatDate(t.createdAt)}</p>
                </div>
                <div className="col-span-3 font-semibold text-gray-900">
                  {t.reference}
                </div>
                <div className="col-span-3 text-gray-700">{t.description}</div>
                <div className="col-span-2 text-right font-bold text-gray-900">
                  {(wallet?.currency || "NPR")} {t.amount}
                </div>
                <div className="col-span-2 text-right text-gray-700">
                  {(wallet?.currency || "NPR")} {t.balance}
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-4 flex items-center justify-end gap-2">
          <button
            disabled={page <= 1 || loading}
            onClick={() => void load(page - 1)}
            className="rounded-xl border border-black/10 bg-white px-3 py-1.5 text-sm disabled:opacity-50"
          >
            Prev
          </button>
          <span className="text-sm text-gray-600">
            Page {page} / {pages}
          </span>
          <button
            disabled={page >= pages || loading}
            onClick={() => void load(page + 1)}
            className="rounded-xl border border-black/10 bg-white px-3 py-1.5 text-sm disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </main>
  );
}
