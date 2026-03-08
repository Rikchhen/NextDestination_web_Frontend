"use client";

import React, { useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import Sidebar from "../../public/_components/sidebar";

import {
  Plane,
  Bus,
  ArrowLeft,
  CalendarDays,
  Clock,
  MapPin,
  Ticket as TicketIcon,
  ShieldCheck,
  User,
  Printer,
} from "lucide-react";
import { getBookingByRef } from "@/lib/bookingstore/bookingstore";

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

export default function TicketDetailsPage() {
  const router = useRouter();
  const params = useParams<{ bookingRef: string }>();

  const booking = useMemo(() => {
    return getBookingByRef(params.bookingRef);
  }, [params.bookingRef]);

  if (!booking) {
    return (
      <div className="min-h-screen bg-pink-50/30">
        <Sidebar />
        <main className="ml-64 min-h-screen p-8">
          <div className="max-w-4xl mx-auto bg-white rounded-3xl border border-black/5 p-10 text-center">
            <div className="mx-auto h-12 w-12 rounded-2xl bg-[#E13434]/10 text-[#E13434] flex items-center justify-center">
              <TicketIcon size={20} />
            </div>
            <h1 className="mt-4 text-lg font-bold text-gray-900">
              Ticket not found
            </h1>
            <p className="mt-1 text-sm text-gray-600">
              This booking reference doesn’t exist on this device.
            </p>
            <button
              onClick={() => router.push("/tickets")}
              className="mt-5 rounded-2xl bg-[#E13434] text-white px-6 py-3 text-sm font-semibold"
            >
              Go to My Tickets
            </button>
          </div>
        </main>
      </div>
    );
  }

  const TransportIcon = booking.mode === "plane" ? Plane : Bus;

  const statusPill =
    booking.status === "confirmed"
      ? "bg-green-50 text-green-700 border-green-200"
      : booking.status === "cancelled"
        ? "bg-red-50 text-red-700 border-red-200"
        : "bg-amber-50 text-amber-800 border-amber-200";

  return (
    <div className="min-h-screen bg-pink-50/30">
      <Sidebar />

      <main className="ml-64 min-h-screen p-8">
        <div className="max-w-6xl mx-auto">
          {/* Top bar */}
          <div className="flex items-start justify-between gap-4 mb-6">
            <div>
              <button
                onClick={() => router.back()}
                className="inline-flex items-center gap-2 text-sm font-semibold text-gray-700 hover:text-gray-900"
              >
                <ArrowLeft size={16} /> Back
              </button>

              <h1 className="mt-2 text-2xl font-bold text-gray-900 flex items-center gap-2">
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-white shadow-sm border border-black/5">
                  <TicketIcon size={18} className="text-[#E13434]" />
                </span>
                E-Ticket
              </h1>

              <p className="text-sm text-gray-600 mt-1">
                You can print this ticket anytime.
              </p>
            </div>

            <button
              onClick={() => window.print()}
              className="inline-flex items-center gap-2 rounded-2xl bg-white border border-black/10 px-4 py-2 text-sm font-semibold text-gray-800 hover:bg-gray-50"
            >
              <Printer size={16} /> Print
            </button>
          </div>

          {/* Ticket */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-8">
              <div className="bg-white rounded-3xl shadow-sm border border-black/5 overflow-hidden">
                {/* Header */}
                <div className="p-5 bg-gradient-to-r from-[#E13434] to-[#c82d2d] text-white">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="h-11 w-11 rounded-2xl bg-white/15 flex items-center justify-center">
                        <TransportIcon size={20} />
                      </div>
                      <div className="leading-tight">
                        <p className="text-sm font-semibold opacity-95">
                          {booking.title}
                        </p>
                        <p className="text-xs opacity-80">
                          {booking.mode === "plane" ? "Flight" : "Service"}{" "}
                          <span className="font-semibold">
                            {booking.number}
                          </span>
                          {booking.type ? ` • ${booking.type}` : ""}
                        </p>
                      </div>
                    </div>

                    <div className="text-right">
                      <p className="text-xs opacity-80">Booking Ref</p>
                      <p className="text-lg font-bold tracking-wide">
                        {booking.bookingRef}
                      </p>

                      <span
                        className={`inline-flex mt-2 items-center gap-2 text-xs font-semibold px-3 py-1 rounded-full border ${statusPill}`}
                      >
                        <ShieldCheck size={14} />
                        {booking.status.toUpperCase()}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Body */}
                <div className="p-5">
                  <div className="rounded-2xl border border-black/5 bg-gray-50 p-4">
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <p className="text-xs text-gray-500 flex items-center gap-2">
                          <MapPin size={14} /> From
                        </p>
                        <p className="text-lg font-bold text-gray-900">
                          {booking.from}
                        </p>
                        <p className="text-sm text-gray-600 mt-1">
                          Departs: {booking.departTime}
                        </p>
                      </div>

                      <div className="flex flex-col items-center text-gray-400">
                        <div className="w-20 h-[1px] bg-gray-200" />
                        <p className="text-xs mt-2 flex items-center gap-1">
                          <Clock size={14} /> {booking.duration}
                        </p>
                      </div>

                      <div className="text-right">
                        <p className="text-xs text-gray-500 flex items-center justify-end gap-2">
                          To <MapPin size={14} />
                        </p>
                        <p className="text-lg font-bold text-gray-900">
                          {booking.to}
                        </p>
                        <p className="text-sm text-gray-600 mt-1">
                          Arrives: {booking.arriveTime}
                        </p>
                      </div>
                    </div>

                    <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-3">
                      <Chip
                        icon={<CalendarDays size={14} />}
                        label="Date"
                        value={formatDatePretty(booking.date)}
                      />
                      <Chip
                        icon={<TicketIcon size={14} />}
                        label="Fare / pax"
                        value={`NPR ${booking.price}`}
                      />
                      <Chip
                        icon={<ShieldCheck size={14} />}
                        label="Total"
                        value={`NPR ${booking.totalAmount}`}
                      />
                    </div>
                  </div>

                  <div className="mt-5">
                    <h2 className="text-sm font-bold text-gray-900 mb-3">
                      Passengers
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {booking.passengers.map((p, idx) => (
                        <div
                          key={idx}
                          className="rounded-2xl border border-black/5 bg-white p-4"
                        >
                          <p className="text-xs text-gray-500">
                            Passenger {idx + 1}
                          </p>
                          <p className="text-sm font-semibold text-gray-900 flex items-center gap-2 mt-1">
                            <User size={16} className="text-[#E13434]" />
                            {p.fullName}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mt-5 rounded-2xl bg-[#E13434]/10 border border-[#E13434]/20 p-4">
                    <p className="text-sm font-semibold text-[#E13434]">
                      Contact
                    </p>
                    <p className="text-xs text-gray-700 mt-1">
                      {booking.contactEmail} • {booking.contactPhone}
                    </p>
                  </div>
                </div>

                {/* Perforation look */}
                <div className="relative">
                  <div className="h-px bg-black/10" />
                  <div className="absolute -left-3 top-1/2 -translate-y-1/2 h-6 w-6 rounded-full bg-pink-50/30 border border-black/10" />
                  <div className="absolute -right-3 top-1/2 -translate-y-1/2 h-6 w-6 rounded-full bg-pink-50/30 border border-black/10" />
                </div>

                {/* QR placeholder */}
                <div className="p-5 flex items-center justify-between gap-4">
                  <div>
                    <p className="text-xs text-gray-500">Scan at check-in</p>
                    <p className="text-sm font-semibold text-gray-900 mt-1">
                      Ticket ID: {booking.bookingRef}
                    </p>
                  </div>
                  <div className="h-24 w-24 rounded-2xl bg-gray-100 border border-black/5 grid place-items-center">
                    <span className="text-xs font-semibold text-gray-500">
                      QR
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right summary */}
            <div className="lg:col-span-4">
              <div className="bg-white rounded-3xl shadow-sm border border-black/5 p-5 sticky top-6">
                <p className="text-[#E13434] font-semibold">Quick Summary</p>

                <div className="mt-4 space-y-3 text-sm">
                  <Row label="Type" value={booking.mode.toUpperCase()} />
                  <Row
                    label={booking.mode === "plane" ? "Airline" : "Operator"}
                    value={booking.title}
                  />
                  <Row
                    label={booking.mode === "plane" ? "Flight" : "Service"}
                    value={booking.number}
                  />
                  <Row label="Date" value={formatDatePretty(booking.date)} />
                  <Row
                    label="Route"
                    value={`${booking.from} → ${booking.to}`}
                  />
                  <Row
                    label="Passengers"
                    value={`${booking.passengers.length}`}
                  />
                </div>

                <div className="mt-5 rounded-2xl bg-gray-50 border border-black/5 p-4">
                  <p className="text-xs text-gray-500">Total Amount</p>
                  <p className="text-lg font-bold text-gray-900">
                    NPR {booking.totalAmount}
                  </p>
                </div>

                <button
                  onClick={() => router.push("/tickets")}
                  className="mt-5 w-full rounded-2xl bg-[#E13434] text-white py-3 text-sm font-semibold hover:opacity-95 active:opacity-90"
                >
                  Back to My Tickets
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

function Chip({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl bg-white border border-black/5 p-3">
      <p className="text-xs text-gray-500 flex items-center gap-2">
        {icon} {label}
      </p>
      <p className="text-sm font-semibold text-gray-900 mt-1">{value}</p>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span className="text-gray-600">{label}</span>
      <span className="text-gray-900 font-semibold text-right">{value}</span>
    </div>
  );
}
