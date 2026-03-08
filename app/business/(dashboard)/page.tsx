import React from "react";
import { Ticket, BadgeCheck, CreditCard, TrendingUp } from "lucide-react";

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
  return (
    <main className="ml-72 min-h-screen bg-pink-50/30 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-sm text-gray-600 mt-1">
            Overview of your tickets, approvals, and revenue.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          <StatCard
            title="Active Tickets"
            value="28"
            hint="Tickets currently available for booking."
            icon={<Ticket size={18} />}
          />
          <StatCard
            title="Pending Approvals"
            value="7"
            hint="Bookings awaiting payment approval."
            icon={<BadgeCheck size={18} />}
          />
          <StatCard
            title="Today’s Revenue"
            value="NPR 42,350"
            hint="Approved payments captured today."
            icon={<CreditCard size={18} />}
          />
          <StatCard
            title="Trend"
            value="+12%"
            hint="Compared to yesterday’s sales."
            icon={<TrendingUp size={18} />}
          />
        </div>

        <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2 bg-white rounded-3xl border border-black/5 shadow-sm p-5">
            <p className="text-sm font-semibold text-gray-900">
              Recent Approvals
            </p>
            <p className="text-xs text-gray-500 mt-1">
              Latest bookings requiring action.
            </p>

            <div className="mt-4 space-y-3">
              {[
                {
                  ref: "ND-92BAD0",
                  route: "KTM → PKR",
                  amount: 13294,
                  status: "pending",
                },
                {
                  ref: "ND-1A23F0",
                  route: "KTM → BIR",
                  amount: 8900,
                  status: "pending",
                },
                {
                  ref: "ND-77CC10",
                  route: "KTM → POK",
                  amount: 1400,
                  status: "pending",
                },
              ].map((x) => (
                <div
                  key={x.ref}
                  className="rounded-2xl border border-black/5 bg-gray-50 p-4 flex items-center justify-between gap-4"
                >
                  <div>
                    <p className="text-sm font-bold text-gray-900">{x.route}</p>
                    <p className="text-xs text-gray-600 mt-1">Ref: {x.ref}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-gray-900">
                      NPR {x.amount}
                    </p>
                    <p className="text-xs text-amber-700 mt-1">Pending</p>
                  </div>
                </div>
              ))}
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
