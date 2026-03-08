"use client";

import React, { useMemo, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import {
  Plane,
  Bus,
  User,
  Users,
  Mail,
  Phone,
  CreditCard,
  ShieldCheck,
  AlertTriangle,
  Plus,
  Trash2,
  ArrowLeft,
  CheckCircle2,
  Ticket,
  CalendarDays,
  MapPin,
  Clock,
  Sparkles,
} from "lucide-react";

import Sidebar from "../public/_components/sidebar";
import { createBooking } from "@/lib/api/booking";

type Passenger = {
  fullName: string;
  age?: number;
  gender?: "male" | "female";
  seatNumber?: string;
  nationality?: string;
  idType?: "Citizenship" | "Passport" | "Other";
  idNumber?: string;
};

type Mode = "plane" | "bus";

type BookingTransport = {
  mode: Mode;
  id: string;
  title: string;
  number: string;
  type?: string;
  from: string;
  to: string;
  date: string;
  departTime: string;
  arriveTime: string;
  duration: string;
  price: number;
  refundable: boolean;
  seatsLeft?: number;
};

function safeNum(v: string | null, fallback = 0) {
  const n = Number(v);
  return Number.isFinite(n) ? n : fallback;
}

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

export default function BookingPage() {
  const sp = useSearchParams();
  const router = useRouter();

  const mode = (sp.get("mode") ?? "plane") as Mode;

  const ticket: BookingTransport = useMemo(() => {
    if (mode === "bus") {
      return {
        mode,
        id: sp.get("id") ?? "",
        title: sp.get("operator") ?? "N/A",
        number: sp.get("busId") ?? sp.get("id") ?? "N/A",
        type: sp.get("busType") || undefined,
        from: sp.get("from") ?? "N/A",
        to: sp.get("to") ?? "N/A",
        date: sp.get("date") ?? "",
        departTime: sp.get("departTime") ?? "N/A",
        arriveTime: sp.get("arriveTime") ?? "N/A",
        duration: sp.get("duration") ?? "N/A",
        price: safeNum(sp.get("price"), 0),
        refundable: sp.get("refundable") === "true",
        seatsLeft: sp.get("seatsLeft")
          ? safeNum(sp.get("seatsLeft"), 0)
          : undefined,
      };
    }

    return {
      mode,
      id: sp.get("id") ?? "",
      title: sp.get("airline") ?? "N/A",
      number: sp.get("flightNumber") ?? "N/A",
      type: sp.get("planeType") || undefined,
      from: sp.get("from") ?? "N/A",
      to: sp.get("to") ?? "N/A",
      date: sp.get("date") ?? "",
      departTime: sp.get("departTime") ?? "N/A",
      arriveTime: sp.get("arriveTime") ?? "N/A",
      duration: sp.get("duration") ?? "N/A",
      price: safeNum(sp.get("price"), 0),
      refundable: sp.get("refundable") === "true",
      seatsLeft: sp.get("seatsLeft")
        ? safeNum(sp.get("seatsLeft"), 0)
        : undefined,
    };
  }, [sp, mode]);

  const [passengers, setPassengers] = useState<Passenger[]>([
    {
      fullName: "",
      age: undefined,
      gender: "male",
      seatNumber: "",
      nationality: "Nepal",
      idType: "Citizenship",
    },
  ]);

  const [contactEmail, setContactEmail] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const serviceFee = 120;
  const passengersCount = passengers.length;
  const subtotal = ticket.price * passengersCount;
  const totalAmount = subtotal + serviceFee;

  const canSubmit = useMemo(() => {
    const hasValidPassengers = passengers.every(
      (p) =>
        p.fullName.trim().length >= 2 &&
        typeof p.age === "number" &&
        p.age >= 0 &&
        p.gender &&
        p.seatNumber?.trim(),
    );
    const hasContact = contactEmail.trim() && contactPhone.trim().length >= 7;
    const hasTicket = Boolean(ticket.id) && ticket.title !== "N/A";

    return hasTicket && hasValidPassengers && Boolean(hasContact);
  }, [passengers, contactEmail, contactPhone, ticket.id, ticket.title]);

  const addPassenger = () => {
    setPassengers((prev) => [
      ...prev,
      {
        fullName: "",
        gender: "male",
        seatNumber: "",
        nationality: "Nepal",
        idType: "Citizenship",
      },
    ]);
  };

  const removePassenger = (index: number) => {
    setPassengers((prev) => prev.filter((_, i) => i !== index));
  };

  const updatePassenger = (index: number, patch: Partial<Passenger>) => {
    setPassengers((prev) =>
      prev.map((p, i) => (i === index ? { ...p, ...patch } : p)),
    );
  };

  const handleSubmit = async () => {
    try {
      setSubmitting(true);
      setSubmitError("");

      const result = await createBooking({
        trip: ticket.id,
        passengers: passengers.map((p) => ({
          fullName: p.fullName.trim(),
          age: Number(p.age),
          gender: (p.gender || "male") as "male" | "female",
          seatNumber: (p.seatNumber || "").trim(),
        })),
        contactEmail: contactEmail.trim(),
        contactPhone: contactPhone.trim(),
      });

      router.push(`/ticket/${result.booking.bookingRef}`);
    } catch (error: unknown) {
      setSubmitError(error instanceof Error ? error.message : "Booking failed");
    } finally {
      setSubmitting(false);
    }
  };

  const TransportIcon = mode === "bus" ? Bus : Plane;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#fff7f7] via-[#fffafa] to-[#fdf2f8]">
      <Sidebar />

      <main className="ml-64 min-h-screen p-8">
        <div className="mx-auto max-w-7xl">
          {/* Hero */}
          <div className="mb-8 overflow-hidden rounded-[2rem] border border-black/5 bg-white shadow-sm">
            <div className="relative bg-gradient-to-r from-[#E13434] via-[#d63131] to-[#f06262] px-8 py-8 text-white">
              <div className="absolute right-0 top-0 h-40 w-40 rounded-full bg-white/10 blur-3xl" />
              <div className="absolute bottom-0 left-10 h-24 w-24 rounded-full bg-white/10 blur-2xl" />

              <div className="relative flex items-start justify-between gap-4">
                <div>
                  <button
                    onClick={() => router.back()}
                    className="mb-4 inline-flex items-center gap-2 rounded-xl bg-white/15 px-3 py-2 text-sm font-semibold text-white backdrop-blur hover:bg-white/20"
                  >
                    <ArrowLeft size={16} /> Back
                  </button>

                  <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold backdrop-blur">
                    <Sparkles size={14} />
                    Secure booking flow
                  </div>

                  <h1 className="flex items-center gap-3 text-3xl font-extrabold tracking-tight">
                    <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-[#E13434] shadow-sm">
                      <Ticket size={20} />
                    </span>
                    Booking Form
                  </h1>

                  <p className="mt-3 max-w-2xl text-sm text-white/90">
                    Review transport details, add passengers, and confirm your
                    booking in one clean flow.
                  </p>
                </div>

                <div className="rounded-2xl bg-white/15 px-5 py-4 text-right backdrop-blur">
                  <p className="text-[11px] uppercase tracking-[0.2em] text-white/80">
                    Booking Ref
                  </p>
                  <p className="mt-1 text-xl font-extrabold">Auto-generated</p>
                  <p className="mt-2 flex items-center justify-end gap-1 text-xs text-white/90">
                    <ShieldCheck size={14} />
                    Status: <span className="font-semibold">pending</span>
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
            {/* LEFT */}
            <div className="space-y-6 lg:col-span-8">
              {/* Transport Details */}
              <section className="rounded-[2rem] border border-black/5 bg-white p-6 shadow-sm">
                <div className="mb-5 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2 text-sm font-bold text-[#E13434]">
                    <TransportIcon size={18} />
                    Transport Details
                  </div>

                  <span className="rounded-full bg-[#E13434]/10 px-3 py-1 text-xs font-semibold text-[#E13434]">
                    {mode === "bus" ? "Bus Ticket" : "Plane Ticket"}
                  </span>
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <InfoField
                    label={mode === "bus" ? "Operator" : "Airline"}
                    value={ticket.title}
                    icon={<TransportIcon size={16} />}
                  />
                  <InfoField
                    label={mode === "bus" ? "Bus ID" : "Flight Number"}
                    value={ticket.number}
                    icon={<Ticket size={16} />}
                  />
                  <InfoField
                    label="From"
                    value={ticket.from}
                    icon={<MapPin size={16} />}
                  />
                  <InfoField
                    label="To"
                    value={ticket.to}
                    icon={<MapPin size={16} />}
                  />
                  <InfoField
                    label="Date"
                    value={ticket.date ? formatDatePretty(ticket.date) : "N/A"}
                    icon={<CalendarDays size={16} />}
                  />
                  <InfoField
                    label="Time"
                    value={`${ticket.departTime} → ${ticket.arriveTime}`}
                    icon={<Clock size={16} />}
                  />
                  <InfoField
                    label="Duration"
                    value={ticket.duration}
                    icon={<Clock size={16} />}
                  />
                  <InfoField
                    label={mode === "bus" ? "Bus Type" : "Plane Type"}
                    value={ticket.type ?? "—"}
                    icon={<TransportIcon size={16} />}
                  />
                </div>

                <div className="mt-5 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-black/5 bg-gradient-to-r from-gray-50 to-white p-4">
                  <div>
                    <p className="text-xs text-gray-500">Fare per passenger</p>
                    <p className="text-xl font-extrabold text-gray-900">
                      NPR {ticket.price}
                    </p>
                  </div>

                  <div className="text-right">
                    <p className="text-xs text-gray-500">Policy</p>
                    <p
                      className={`text-sm font-semibold ${
                        ticket.refundable ? "text-green-600" : "text-gray-700"
                      }`}
                    >
                      {ticket.refundable
                        ? mode === "bus"
                          ? "Cancelable"
                          : "Refundable"
                        : mode === "bus"
                          ? "Non-cancelable"
                          : "Non-refundable"}
                    </p>
                  </div>
                </div>

                {!ticket.id && (
                  <div className="mt-5 flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-4">
                    <AlertTriangle
                      size={18}
                      className="mt-0.5 text-amber-600"
                    />
                    <div>
                      <p className="text-sm font-semibold text-amber-900">
                        Missing ticket details
                      </p>
                      <p className="mt-1 text-sm text-amber-800">
                        Open a ticket from the{" "}
                        {mode === "bus" ? "Bus" : "Plane"} page and click{" "}
                        <b>View Details</b> to auto-fill this booking form.
                      </p>
                    </div>
                  </div>
                )}
              </section>

              {/* Passengers */}
              <section className="rounded-[2rem] border border-black/5 bg-white p-6 shadow-sm">
                <div className="mb-5 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2 text-sm font-bold text-[#E13434]">
                    <Users size={18} />
                    Passengers
                  </div>

                  <button
                    onClick={addPassenger}
                    className="inline-flex items-center gap-2 rounded-2xl bg-[#E13434] px-4 py-2.5 text-sm font-semibold text-white transition hover:scale-[1.02] hover:shadow-lg active:scale-[0.99]"
                  >
                    <Plus size={16} /> Add Passenger
                  </button>
                </div>

                <div className="space-y-4">
                  {passengers.map((p, idx) => (
                    <div
                      key={idx}
                      className="rounded-3xl border border-black/5 bg-gradient-to-br from-gray-50 to-white p-5"
                    >
                      <div className="mb-4 flex items-center justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-black/5 bg-white text-[#E13434]">
                            <User size={16} />
                          </div>
                          <div>
                            <p className="text-sm font-bold text-gray-900">
                              Passenger {idx + 1}
                            </p>
                            <p className="text-xs text-gray-500">
                              Enter passenger identity details
                            </p>
                          </div>
                        </div>

                        {passengers.length > 1 && (
                          <button
                            onClick={() => removePassenger(idx)}
                            className="inline-flex items-center gap-2 text-sm font-semibold text-red-600 hover:underline"
                          >
                            <Trash2 size={16} /> Remove
                          </button>
                        )}
                      </div>

                      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <Field
                          label="Full Name"
                          placeholder="e.g. Hari Bahadur Thapa"
                          value={p.fullName}
                          onChange={(v) =>
                            updatePassenger(idx, { fullName: v })
                          }
                        />

                        <Field
                          label="Nationality"
                          placeholder="e.g. Nepal"
                          value={p.nationality ?? ""}
                          onChange={(v) =>
                            updatePassenger(idx, { nationality: v })
                          }
                        />

                        <SelectField
                          label="Gender"
                          value={p.gender ?? "male"}
                          onChange={(v) =>
                            updatePassenger(idx, {
                              gender: v as Passenger["gender"],
                            })
                          }
                          options={[
                            { label: "Male", value: "male" },
                            { label: "Female", value: "female" },
                          ]}
                        />

                        <Field
                          label="Age"
                          type="number"
                          placeholder="e.g. 24"
                          value={p.age?.toString() ?? ""}
                          onChange={(v) =>
                            updatePassenger(idx, {
                              age: v ? Number(v) : undefined,
                            })
                          }
                        />

                        <Field
                          label="Seat Number"
                          placeholder="e.g. A1"
                          value={p.seatNumber ?? ""}
                          onChange={(v) =>
                            updatePassenger(idx, { seatNumber: v })
                          }
                        />

                        <SelectField
                          label="ID Type"
                          value={p.idType ?? "Citizenship"}
                          onChange={(v) =>
                            updatePassenger(idx, {
                              idType: v as Passenger["idType"],
                            })
                          }
                          options={[
                            { label: "Citizenship", value: "Citizenship" },
                            { label: "Passport", value: "Passport" },
                            { label: "Other", value: "Other" },
                          ]}
                        />

                        <Field
                          label="ID Number (optional)"
                          placeholder="e.g. 01-02-12345"
                          value={p.idNumber ?? ""}
                          onChange={(v) =>
                            updatePassenger(idx, { idNumber: v })
                          }
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* Contact */}
              <section className="rounded-[2rem] border border-black/5 bg-white p-6 shadow-sm">
                <div className="mb-5 flex items-center gap-2 text-sm font-bold text-[#E13434]">
                  <Mail size={18} />
                  Contact Details
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <Field
                    label="Contact Email"
                    placeholder="example@gmail.com"
                    value={contactEmail}
                    onChange={setContactEmail}
                    icon={<Mail size={16} className="text-gray-500" />}
                  />

                  <Field
                    label="Contact Phone"
                    placeholder="98XXXXXXXX"
                    value={contactPhone}
                    onChange={setContactPhone}
                    icon={<Phone size={16} className="text-gray-500" />}
                  />
                </div>
              </section>

              {/* Submit */}
              <section className="rounded-[2rem] border border-black/5 bg-white p-6 shadow-sm">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="flex items-center gap-2 text-sm font-bold text-gray-900">
                      <CheckCircle2 size={18} className="text-green-600" />
                      Ready to confirm?
                    </p>
                    <p className="mt-1 text-sm text-gray-600">
                      Submit to create a booking with <b>pending</b> status.
                    </p>
                  </div>

                  <button
                    disabled={!canSubmit}
                    onClick={handleSubmit}
                    className={`inline-flex items-center gap-2 rounded-2xl px-5 py-3 text-sm font-semibold transition ${
                      canSubmit && !submitting
                        ? "bg-[#E13434] text-white hover:scale-[1.02] hover:shadow-lg active:scale-[0.99]"
                        : "cursor-not-allowed bg-gray-200 text-gray-500"
                    }`}
                  >
                    <CreditCard size={18} />
                    {submitting ? "Creating..." : "Create Booking"}
                  </button>
                </div>

                {!canSubmit && (
                  <p className="mt-3 text-xs text-gray-500">
                    Fill name, age, gender, seat number, and contact email/phone
                    to enable booking.
                  </p>
                )}
                {submitError && (
                  <p className="mt-3 text-xs text-red-600">{submitError}</p>
                )}
              </section>
            </div>

            {/* RIGHT */}
            <div className="space-y-6 lg:col-span-4">
              <div className="sticky top-6 rounded-[2rem] border border-black/5 bg-white p-6 shadow-sm">
                <div className="mb-5 flex items-center justify-between gap-3">
                  <p className="font-semibold text-[#E13434]">
                    Booking Summary
                  </p>
                  <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-700">
                    {passengersCount} Passenger{passengersCount > 1 ? "s" : ""}
                  </span>
                </div>

                <div className="rounded-2xl border border-black/5 bg-gradient-to-br from-gray-50 to-white p-4">
                  <p className="text-sm font-bold text-gray-900">
                    {ticket.from} → {ticket.to}
                  </p>
                  <p className="mt-1 text-xs text-gray-600">
                    {ticket.title} • {ticket.number}
                    {ticket.type ? ` • ${ticket.type}` : ""}
                  </p>
                  <p className="mt-1 text-xs text-gray-600">
                    {ticket.date ? formatDatePretty(ticket.date) : "N/A"} •{" "}
                    {ticket.departTime} → {ticket.arriveTime}
                  </p>
                </div>

                <div className="mt-5 space-y-3 text-sm">
                  <Row
                    label={`Fare x ${passengersCount}`}
                    value={`NPR ${subtotal}`}
                  />
                  <Row label="Service fee" value={`NPR ${serviceFee}`} />
                  <div className="h-px bg-black/10" />
                  <Row
                    label={
                      <span className="font-bold text-gray-900">Total</span>
                    }
                    value={
                      <span className="font-bold text-gray-900">
                        NPR {totalAmount}
                      </span>
                    }
                  />
                </div>

                <div className="mt-5 rounded-2xl border border-[#E13434]/20 bg-[#E13434]/10 p-4">
                  <p className="text-sm font-semibold text-[#E13434]">
                    Status: Pending
                  </p>
                  <p className="mt-1 text-xs text-gray-700">
                    You can confirm payment later. Cancellation or refund
                    depends on ticket policy.
                  </p>
                </div>

                <div className="mt-4 text-xs text-gray-500">
                  By continuing, you agree to our booking and refund policies.
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

/* ---------- UI helpers ---------- */

function Row({
  label,
  value,
}: {
  label: React.ReactNode;
  value: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between gap-4">
      <div className="text-gray-600">{label}</div>
      <div className="font-semibold text-gray-900">{value}</div>
    </div>
  );
}

function InfoField({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon?: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-black/5 bg-gradient-to-br from-gray-50 to-white p-4">
      <p className="flex items-center gap-2 text-xs font-medium text-gray-500">
        {icon}
        {label}
      </p>
      <p className="mt-1 text-sm font-semibold text-gray-900">{value}</p>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  icon,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
  icon?: React.ReactNode;
}) {
  return (
    <div>
      <label className="text-xs font-bold tracking-wide text-gray-700">
        {label}
      </label>
      <div className="mt-2 flex items-center gap-2 rounded-2xl border border-black/10 bg-gray-50 px-4 py-3 transition focus-within:ring-2 focus-within:ring-[#E13434]/20">
        {icon}
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full bg-transparent text-sm text-gray-900 outline-none placeholder:text-gray-400"
        />
      </div>
    </div>
  );
}

function SelectField({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: { label: string; value: string }[];
}) {
  return (
    <div>
      <label className="text-xs font-bold tracking-wide text-gray-700">
        {label}
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-2 w-full rounded-2xl border border-black/10 bg-gray-50 px-4 py-3 text-sm outline-none transition focus:ring-2 focus:ring-[#E13434]/20"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </div>
  );
}
