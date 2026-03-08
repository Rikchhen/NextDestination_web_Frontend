"use client";

import React, { useEffect, useMemo, useState } from "react";
import Sidebar from "../public/_components/sidebar";
import {
  getUserWalletBalance,
  getUserWalletTransactions,
  WalletBalance,
  WalletTransaction,
} from "@/lib/api/wallet";
import { CreditCard, ArrowDownLeft, ArrowUpRight } from "lucide-react";

function formatDate(value: string) {
  const dt = new Date(value);
  if (Number.isNaN(dt.getTime())) return "N/A";
  return dt.toLocaleString();
}

export default function WalletPage() {
  const [balance, setBalance] = useState<WalletBalance | null>(null);
  const [transactions, setTransactions] = useState<WalletTransaction[]>([]);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = async (nextPage = 1) => {
    try {
      setLoading(true);
      setError("");
      const [balanceData, txData] = await Promise.all([
        getUserWalletBalance(),
        getUserWalletTransactions(nextPage, 10),
      ]);
      setBalance(balanceData);
      setTransactions(txData.transactions);
      setPage(txData.pagination.page);
      setPages(Math.max(1, txData.pagination.pages || 1));
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to load wallet");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load(1);
  }, []);

  const totals = useMemo(() => {
    const credited = transactions
      .filter((t) => t.type === "credit")
      .reduce((sum, t) => sum + t.amount, 0);
    const debited = transactions
      .filter((t) => t.type === "debit")
      .reduce((sum, t) => sum + t.amount, 0);
    return { credited, debited };
  }, [transactions]);

  return (
    <div className="min-h-screen bg-pink-50/30">
      <Sidebar />
      <main className="ml-64 min-h-screen p-8">
        <div className="max-w-6xl mx-auto space-y-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Wallet</h1>
              <p className="text-sm text-gray-600 mt-1">
                Your wallet balance and transaction history.
              </p>
            </div>
            <button
              onClick={() => void load(page)}
              className="rounded-2xl bg-white border border-black/10 px-4 py-2 text-sm font-semibold text-gray-800 hover:bg-gray-50"
            >
              Refresh
            </button>
          </div>

          {error && (
            <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card
              label="Current Balance"
              value={
                balance ? `${balance.currency} ${balance.balance}` : "Loading..."
              }
              icon={<CreditCard size={18} />}
            />
            <Card
              label="Credits (Page)"
              value={`${balance?.currency || "NPR"} ${totals.credited}`}
              icon={<ArrowDownLeft size={18} />}
            />
            <Card
              label="Debits (Page)"
              value={`${balance?.currency || "NPR"} ${totals.debited}`}
              icon={<ArrowUpRight size={18} />}
            />
          </div>

          <div className="bg-white rounded-3xl border border-black/5 shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-black/5">
              <p className="text-sm font-semibold text-gray-900">
                Transactions
              </p>
            </div>

            {loading ? (
              <div className="px-5 py-8 text-sm text-gray-600">Loading...</div>
            ) : transactions.length === 0 ? (
              <div className="px-5 py-8 text-sm text-gray-600">
                No transactions found.
              </div>
            ) : (
              <div>
                <div className="grid grid-cols-12 bg-gray-50 text-xs font-semibold text-gray-600 px-5 py-3 border-b border-black/5">
                  <div className="col-span-2">Type</div>
                  <div className="col-span-3">Reference</div>
                  <div className="col-span-3">Description</div>
                  <div className="col-span-2 text-right">Amount</div>
                  <div className="col-span-2 text-right">Balance</div>
                </div>
                {transactions.map((t) => (
                  <div
                    key={t._id}
                    className="grid grid-cols-12 px-5 py-4 border-b border-black/5 last:border-b-0 text-sm"
                  >
                    <div className="col-span-2">
                      <span
                        className={`rounded-full px-2 py-1 text-xs font-semibold ${
                          t.type === "credit"
                            ? "bg-green-50 text-green-700"
                            : "bg-red-50 text-red-700"
                        }`}
                      >
                        {t.type.toUpperCase()}
                      </span>
                      <p className="text-[11px] text-gray-500 mt-2">
                        {formatDate(t.createdAt)}
                      </p>
                    </div>
                    <div className="col-span-3 font-semibold text-gray-900">
                      {t.reference}
                    </div>
                    <div className="col-span-3 text-gray-700">{t.description}</div>
                    <div className="col-span-2 text-right font-semibold text-gray-900">
                      {balance?.currency || "NPR"} {t.amount}
                    </div>
                    <div className="col-span-2 text-right text-gray-700">
                      {balance?.currency || "NPR"} {t.balance}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex items-center justify-end gap-2">
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
    </div>
  );
}

function Card({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="bg-white rounded-3xl border border-black/5 shadow-sm p-5">
      <div className="flex items-center justify-between">
        <p className="text-xs uppercase tracking-widest text-gray-500">{label}</p>
        <div className="h-10 w-10 rounded-2xl bg-black/5 grid place-items-center text-gray-800">
          {icon}
        </div>
      </div>
      <p className="text-2xl font-bold text-gray-900 mt-3">{value}</p>
    </div>
  );
}
