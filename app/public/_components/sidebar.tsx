"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useTransition } from "react";
import {
  Home,
  Phone,
  BookOpen,
  Info,
  LogOut,
  ChevronRight,
  Ticket,
  Wallet,
} from "lucide-react";
import { handleLogout } from "@/lib/actions/auth-action";

type MenuItem = {
  name: string;
  href: string;
  icon: React.ElementType;
};

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const menuItems: MenuItem[] = [
    { name: "Home", href: "/home", icon: Home },
    { name: "My Tickets", href: "/tickets", icon: Ticket },
    { name: "Wallet", href: "/wallet", icon: Wallet },
    { name: "Contact us", href: "/contact", icon: Phone },
    { name: "Booking", href: "/booking", icon: BookOpen },
    { name: "About Us", href: "/about", icon: Info },
  ];

  return (
    <aside className="fixed top-0 left-0 h-screen w-64 bg-[#E13434] text-white flex flex-col z-50">
      {/* Header */}
      <div className="p-5 border-b border-white/15">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-white text-[#E13434] flex items-center justify-center font-bold">
            HB
          </div>

          <div className="leading-tight">
            <p className="text-sm font-semibold">Hari Bahadur</p>
            <p className="text-[11px] text-white/80">Select your destination</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-4 overflow-y-auto">
        <p className="px-2 pb-3 text-[11px] uppercase tracking-widest text-white/70">
          Library
        </p>

        <ul className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              pathname === item.href || pathname.startsWith(item.href + "/");

            return (
              <li key={item.name}>
                <Link
                  href={item.href}
                  className={[
                    "group flex items-center justify-between rounded-xl px-3 py-2.5 transition",
                    isActive ? "bg-white text-[#E13434]" : "hover:bg-white/10",
                  ].join(" ")}
                >
                  <span className="flex items-center gap-3">
                    <span
                      className={[
                        "grid place-items-center h-9 w-9 rounded-lg transition",
                        isActive
                          ? "bg-[#E13434]/10"
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
          <li>
            <button
              disabled={isPending}
              onClick={() =>
                startTransition(async () => {
                  await handleLogout();
                  router.push("/login");
                })
              }
              className="group flex w-full items-center justify-between rounded-xl px-3 py-2.5 transition hover:bg-white/10 disabled:opacity-60"
            >
              <span className="flex items-center gap-3">
                <span className="grid place-items-center h-9 w-9 rounded-lg transition bg-white/10 group-hover:bg-white/15">
                  <LogOut size={18} />
                </span>
                <span className="text-sm font-medium">
                  {isPending ? "Logging out..." : "Logout"}
                </span>
              </span>
              <ChevronRight
                size={16}
                className="opacity-0 group-hover:opacity-60 transition"
              />
            </button>
          </li>
        </ul>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-white/15">
        <div className="rounded-xl bg-white/10 p-3">
          <p className="text-xs font-semibold">NextDestination</p>
          <p className="text-[11px] text-white/80">
            Book flights & buses easily
          </p>
        </div>
      </div>
    </aside>
  );
}
