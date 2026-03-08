"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Sidebar from "../../public/_components/sidebar";
import { BookingRecord, getBookingByRef } from "@/lib/api/booking";
import {
  TicketRecord,
  getTicketsByBooking,
  voidTicket,
} from "@/lib/api/ticket";

import {
  ArrowLeft,
  CalendarDays,
  Ticket as TicketIcon,
  ShieldCheck,
  User,
  Printer,
} from "lucide-react";

function formatDatePretty(value?: string) {
  if (!value) return "N/A";
  const dt = new Date(value);
  if (Number.isNaN(dt.getTime())) return "N/A";
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
  const [booking, setBooking] = useState<BookingRecord | null>(null);
  const [tickets, setTickets] = useState<TicketRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setError("");
        const result = await getBookingByRef(params.bookingRef);
        setBooking(result.booking);
        const bookingTickets = await getTicketsByBooking(result.booking._id);
        setTickets(bookingTickets);
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : "Ticket not found");
      } finally {
        setLoading(false);
      }
    };

    void load();
  }, [params.bookingRef]);

  if (loading) {
    return (
      <div className="min-h-screen bg-pink-50/30">
        <Sidebar />
        <main className="ml-64 min-h-screen p-8 text-center text-gray-600">
          Loading ticket...
        </main>
      </div>
    );
  }

  if (error || !booking) {
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
            <p className="mt-1 text-sm text-gray-600">{error || "No booking."}</p>
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
            </div>

            <button
              onClick={() => window.print()}
              className="inline-flex items-center gap-2 rounded-2xl bg-white border border-black/10 px-4 py-2 text-sm font-semibold text-gray-800 hover:bg-gray-50"
            >
              <Printer size={16} /> Print
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-8">
              <div className="bg-white rounded-3xl shadow-sm border border-black/5 overflow-hidden">
                <div className="p-5 bg-gradient-to-r from-[#E13434] to-[#c82d2d] text-white">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-sm font-semibold opacity-95">
                        Booking Reference
                      </p>
                      <p className="text-lg font-bold tracking-wide">
                        {booking.bookingRef}
                      </p>
                    </div>

                    <span
                      className={`inline-flex items-center gap-2 text-xs font-semibold px-3 py-1 rounded-full border ${statusPill}`}
                    >
                      <ShieldCheck size={14} />
                      {booking.status.toUpperCase()}
                    </span>
                  </div>
                </div>

                <div className="p-5">
                  <div className="rounded-2xl border border-black/5 bg-gray-50 p-4 space-y-2">
                    <p className="text-sm text-gray-700">Trip ID: {booking.trip}</p>
                    <p className="text-sm text-gray-700">
                      Contact: {booking.contactEmail} | {booking.contactPhone}
                    </p>
                    <p className="text-sm text-gray-700">
                      Created: {formatDatePretty(booking.createdAt)}
                    </p>
                    <p className="text-sm font-semibold text-gray-900">
                      Total Amount: NPR {booking.totalAmount}
                    </p>
                  </div>

                  <div className="mt-5">
                    <h2 className="text-sm font-bold text-gray-900 mb-3">
                      Passengers
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {booking.passengers.map((p, idx) => (
                        <div
                          key={`${p.seatNumber}-${idx}`}
                          className="rounded-2xl border border-black/5 bg-white p-4"
                        >
                          <p className="text-xs text-gray-500">
                            Passenger {idx + 1}
                          </p>
                          <p className="text-sm font-semibold text-gray-900 flex items-center gap-2 mt-1">
                            <User size={16} className="text-[#E13434]" />
                            {p.fullName}
                          </p>
                          <p className="text-xs text-gray-600 mt-1">
                            {p.gender}, {p.age} yrs, Seat {p.seatNumber}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {tickets.length > 0 && (
                    <div className="mt-5">
                      <h2 className="text-sm font-bold text-gray-900 mb-3">
                        Issued Tickets
                      </h2>
                      <div className="space-y-2">
                        {tickets.map((t) => (
                          <div
                            key={t._id}
                            className="rounded-2xl border border-black/5 bg-gray-50 p-3 text-xs text-gray-700 flex items-center justify-between gap-3"
                          >
                            <span>
                              {t.passengerName} | Seat {t.seatNumber} | Status{" "}
                              {t.status}
                            </span>
                            {t.status === "issued" && (
                              <button
                                onClick={async () => {
                                  const reason = prompt(
                                    "Void reason (optional):",
                                  ) || undefined;
                                  try {
                                    const updated = await voidTicket(
                                      t._id,
                                      reason,
                                    );
                                    setTickets((prev) =>
                                      prev.map((x) =>
                                        x._id === updated._id ? updated : x,
                                      ),
                                    );
                                  } catch (err: unknown) {
                                    alert(
                                      err instanceof Error
                                        ? err.message
                                        : "Failed to void ticket",
                                    );
                                  }
                                }}
                                className="rounded-lg bg-red-100 px-2 py-1 font-semibold text-red-700 hover:bg-red-200"
                              >
                                Void
                              </button>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="lg:col-span-4">
              <div className="bg-white rounded-3xl shadow-sm border border-black/5 p-5 sticky top-6">
                <p className="text-[#E13434] font-semibold">Quick Summary</p>
                <div className="mt-4 space-y-3 text-sm">
                  <Row label="Booking Ref" value={booking.bookingRef} />
                  <Row label="Status" value={booking.status.toUpperCase()} />
                  <Row label="Trip" value={booking.trip} />
                  <Row label="Passengers" value={`${booking.passengers.length}`} />
                  <Row label="Date" value={formatDatePretty(booking.createdAt)} />
                  <Row label="Amount" value={`NPR ${booking.totalAmount}`} />
                </div>

                <div className="mt-5 rounded-2xl bg-gray-50 border border-black/5 p-4">
                  <p className="text-xs text-gray-500 flex items-center gap-2">
                    <CalendarDays size={14} /> Issued on
                  </p>
                  <p className="text-sm font-semibold text-gray-900 mt-1">
                    {formatDatePretty(booking.createdAt)}
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

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span className="text-gray-600">{label}</span>
      <span className="text-gray-900 font-semibold text-right">{value}</span>
    </div>
  );
}
