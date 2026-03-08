"use client";

import React, { useEffect, useState } from "react";
import { Ticket, BadgeCheck, CreditCard, TrendingUp } from "lucide-react";
import { getBusinessWalletBalance } from "@/lib/api/wallet";

function StatCard({
  title,
  value,
  icon,
  hint,
}: {
  title: string;
  value: string;
  icon: React.ReactNode;
  hint: string;
}) {
  return (
    <div className="bg-white rounded-3xl border border-black/5 shadow-sm p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-widest text-gray-500">
            {title}
          </p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
          <p className="text-sm text-gray-600 mt-2">{hint}</p>
        </div>
        <div className="h-11 w-11 rounded-2xl bg-black/5 grid place-items-center text-gray-800">
          {icon}
        </div>
      </div>
    </div>
  );
}

export default function BusinessHomePage() {
  const [walletBalance, setWalletBalance] = useState("NPR 0");

  useEffect(() => {
    const load = async () => {
      try {
        const wallet = await getBusinessWalletBalance();
        setWalletBalance(`${wallet.currency} ${wallet.balance}`);
      } catch {
        setWalletBalance("NPR 0");
      }
    };
    void load();
  }, []);

  return (
    <main className="ml-72 min-h-screen bg-pink-50/30 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-sm text-gray-600 mt-1">
            Overview of your tickets, approvals, and wallet.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          <StatCard
            title="Active Tickets"
            value="--"
            hint="Connect ticket APIs to show live count."
            icon={<Ticket size={18} />}
          />
          <StatCard
            title="Pending Approvals"
            value="--"
            hint="Connect booking APIs for approval counts."
            icon={<BadgeCheck size={18} />}
          />
          <StatCard
            title="Wallet Balance"
            value={walletBalance}
            hint="Live balance from business wallet."
            icon={<CreditCard size={18} />}
          />
          <StatCard
            title="Trend"
            value="--"
            hint="Compute after analytics endpoints are ready."
            icon={<TrendingUp size={18} />}
          />
        </div>

        <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2 bg-white rounded-3xl border border-black/5 shadow-sm p-5">
            <p className="text-sm font-semibold text-gray-900">
              Wallet Activity
            </p>
            <p className="text-xs text-gray-500 mt-1">
              View detailed wallet transaction history in Transactions.
            </p>

            <div className="mt-4 rounded-2xl border border-black/5 bg-gray-50 p-4 flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-bold text-gray-900">
                  Current Balance
                </p>
                <p className="text-xs text-gray-600 mt-1">
                  Updated from `/api/wallet/business/balance`
                </p>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold text-gray-900">{walletBalance}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-3xl border border-black/5 shadow-sm p-5">
            <p className="text-sm font-semibold text-gray-900">Quick Actions</p>
            <p className="text-xs text-gray-500 mt-1">Common tasks</p>

            <div className="mt-4 space-y-3">
              <a
                href="/business/tickets/create"
                className="block rounded-2xl bg-[#E13434] text-white px-4 py-3 text-sm font-semibold hover:opacity-95"
              >
                Create New Ticket
              </a>
              <a
                href="/business/approvals"
                className="block rounded-2xl bg-black text-white px-4 py-3 text-sm font-semibold hover:opacity-95"
              >
                Review Approvals
              </a>
              <a
                href="/business/transactions"
                className="block rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm font-semibold text-gray-900 hover:bg-gray-50"
              >
                View Transactions
              </a>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
