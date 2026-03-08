"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Ticket,
  PlusCircle,
  BadgeCheck,
  CreditCard,
  Settings,
  LogOut,
  ChevronRight,
  Building2,
} from "lucide-react";

type MenuItem = {
  name: string;
  href: string;
  icon: React.ElementType;
};

export default function BusinessSidebar() {
  const pathname = usePathname();

  const menuItems: MenuItem[] = [
    { name: "Dashboard", href: "/business", icon: LayoutDashboard },
    { name: "All Tickets", href: "/business/tickets", icon: Ticket },
    {
      name: "Create Ticket",
      href: "/business/tickets/create",
      icon: PlusCircle,
    },
    { name: "Approvals", href: "/business/approvals", icon: BadgeCheck },
    { name: "Transactions", href: "/business/transactions", icon: CreditCard },
    { name: "Settings", href: "/business/settings", icon: Settings },
    { name: "Logout", href: "/login", icon: LogOut },
  ];

  const isItemActive = (href: string) => {
    if (href === "/business") {
      return pathname === "/business";
    }

    return pathname === href || pathname.startsWith(href + "/");
  };

  return (
    <aside className="fixed top-0 left-0 z-50 h-screen w-72 overflow-hidden bg-[#0B1220] text-white flex flex-col">
      {/* Header */}
      <div className="p-5 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="h-11 w-11 rounded-2xl bg-white/10 flex items-center justify-center">
            <Building2 size={18} className="text-white" />
          </div>

          <div className="leading-tight">
            <p className="text-sm font-semibold">Business Panel</p>
            <p className="text-[11px] text-white/70">
              Manage tickets & bookings
            </p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto p-4">
        <p className="px-2 pb-3 text-[11px] uppercase tracking-widest text-white/60">
          Management
        </p>

        <ul className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = isItemActive(item.href);

            return (
              <li key={item.name}>
                <Link
                  href={item.href}
                  className={[
                    "group flex items-center justify-between rounded-xl px-3 py-2.5 transition",
                    isActive ? "bg-white text-[#0B1220]" : "hover:bg-white/10",
                  ].join(" ")}
                >
                  <span className="flex items-center gap-3">
                    <span
                      className={[
                        "grid place-items-center h-9 w-9 rounded-lg transition",
                        isActive
                          ? "bg-[#0B1220]/10"
                          : "bg-white/10 group-hover:bg-white/15",
                      ].join(" ")}
                    >
                      <Icon size={18} />
                    </span>

                    <span className="text-sm font-medium">{item.name}</span>
                  </span>

                  <ChevronRight
                    size={16}
                    className={[
                      "transition",
                      isActive
                        ? "opacity-100"
                        : "opacity-0 group-hover:opacity-60",
                    ].join(" ")}
                  />
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-white/10">
        <div className="rounded-xl bg-white/10 p-3">
          <p className="text-xs font-semibold">NextDestination • Business</p>
          <p className="text-[11px] text-white/70">
            Track sales, manage inventory
          </p>
        </div>
      </div>
    </aside>
  );
}
