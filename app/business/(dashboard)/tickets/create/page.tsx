"use client";

import React, { useMemo, useState } from "react";

import {
  Plane,
  Bus,
  PlusCircle,
  Save,
  CalendarDays,
  MapPin,
  Clock,
  Ticket,
} from "lucide-react";
import { saveBusinessTicket } from "@/lib/businessStore/ticketSrore";

type Mode = "plane" | "bus";

export default function CreateBusinessTicketPage() {
  const [mode, setMode] = useState<Mode>("plane");

  const [form, setForm] = useState({
    title: "",
    number: "",
    type: "",
    from: "",
    to: "",
    date: "",
    departTime: "",
    arriveTime: "",
    duration: "",
    price: "",
    refundable: true,
    seatsLeft: "",
  });

  const canSave = useMemo(() => {
    const required = [
      "title",
      "number",
      "from",
      "to",
      "date",
      "departTime",
      "arriveTime",
      "price",
    ];
    return required.every(
      (k) => (form as any)[k]?.toString().trim().length > 0,
    );
  }, [form]);

  const TransportIcon = mode === "plane" ? Plane : Bus;

  const update = (k: string, v: any) => setForm((p) => ({ ...p, [k]: v }));

  const handleSave = () => {
    const id = `BT-${Date.now().toString(16).toUpperCase()}`;

    saveBusinessTicket({
      id,
      mode,
      title: form.title.trim(),
      number: form.number.trim(),
      type: form.type.trim() || undefined,
      from: form.from.trim(),
      to: form.to.trim(),
      date: form.date,
      departTime: form.departTime,
      arriveTime: form.arriveTime,
      duration: form.duration.trim() || undefined,
      price: Number(form.price),
      refundable: Boolean(form.refundable),
      seatsLeft: form.seatsLeft ? Number(form.seatsLeft) : undefined,
      isActive: true,
      createdAt: new Date().toISOString(),
    });

    alert("Ticket created!");
    window.location.href = "/business/tickets";
  };

  return (
    <main className="ml-72 min-h-screen bg-pink-50/30 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <span className="h-10 w-10 rounded-2xl bg-white border border-black/5 shadow-sm grid place-items-center">
                <PlusCircle size={18} className="text-[#E13434]" />
              </span>
              Create Ticket
            </h1>
            <p className="text-sm text-gray-600 mt-1">
              Add new plane or bus tickets for customers to book.
            </p>
          </div>

          <button
            onClick={handleSave}
            disabled={!canSave}
            className={[
              "inline-flex items-center gap-2 rounded-2xl px-5 py-3 text-sm font-semibold transition",
              canSave
                ? "bg-[#E13434] text-white hover:opacity-95"
                : "bg-gray-200 text-gray-500 cursor-not-allowed",
            ].join(" ")}
          >
            <Save size={18} />
            Save Ticket
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left form */}
          <div className="lg:col-span-8 space-y-6">
            <div className="bg-white rounded-3xl border border-black/5 shadow-sm p-5">
              <p className="text-sm font-semibold text-gray-900">Ticket Type</p>
              <p className="text-xs text-gray-500 mt-1">
                Choose transport category
              </p>

              <div className="mt-4 grid grid-cols-2 gap-3">
                <button
                  onClick={() => setMode("plane")}
                  className={[
                    "rounded-2xl border px-4 py-4 text-left transition",
                    mode === "plane"
                      ? "border-[#E13434] bg-[#E13434]/10"
                      : "border-black/10 bg-white hover:bg-gray-50",
                  ].join(" ")}
                >
                  <div className="flex items-center gap-2 font-semibold text-gray-900">
                    <Plane size={18} className="text-[#E13434]" /> Plane Ticket
                  </div>
                  <p className="text-xs text-gray-600 mt-1">
                    Airlines, flight number, aircraft
                  </p>
                </button>

                <button
                  onClick={() => setMode("bus")}
                  className={[
                    "rounded-2xl border px-4 py-4 text-left transition",
                    mode === "bus"
                      ? "border-[#E13434] bg-[#E13434]/10"
                      : "border-black/10 bg-white hover:bg-gray-50",
                  ].join(" ")}
                >
                  <div className="flex items-center gap-2 font-semibold text-gray-900">
                    <Bus size={18} className="text-[#E13434]" /> Bus Ticket
                  </div>
                  <p className="text-xs text-gray-600 mt-1">
                    Operators, route, service type
                  </p>
                </button>
              </div>
            </div>

            <div className="bg-white rounded-3xl border border-black/5 shadow-sm p-5">
              <p className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                <TransportIcon size={18} className="text-[#E13434]" />
                Ticket Details
              </p>

              <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3">
                <Field
                  label={mode === "plane" ? "Airline" : "Operator"}
                  value={form.title}
                  onChange={(v) => update("title", v)}
                  placeholder={
                    mode === "plane"
                      ? "e.g. Buddha Air"
                      : "e.g. Golden Super Deluxe"
                  }
                  icon={<TransportIcon size={16} className="text-gray-500" />}
                />

                <Field
                  label={mode === "plane" ? "Flight Number" : "Bus ID"}
                  value={form.number}
                  onChange={(v) => update("number", v)}
                  placeholder={mode === "plane" ? "e.g. U4 612" : "e.g. BS-201"}
                  icon={<Ticket size={16} className="text-gray-500" />}
                />

                <Field
                  label={
                    mode === "plane"
                      ? "Plane Type (optional)"
                      : "Bus Type (optional)"
                  }
                  value={form.type}
                  onChange={(v) => update("type", v)}
                  placeholder={
                    mode === "plane" ? "e.g. ATR 72" : "e.g. A/C Sleeper (2+2)"
                  }
                />

                <Field
                  label="Price (NPR)"
                  value={form.price}
                  onChange={(v) => update("price", v)}
                  placeholder="e.g. 6647"
                  type="number"
                />

                <Field
                  label="From"
                  value={form.from}
                  onChange={(v) => update("from", v)}
                  placeholder="e.g. Kathmandu (KTM)"
                  icon={<MapPin size={16} className="text-gray-500" />}
                />
                <Field
                  label="To"
                  value={form.to}
                  onChange={(v) => update("to", v)}
                  placeholder="e.g. Pokhara (PKR)"
                  icon={<MapPin size={16} className="text-gray-500" />}
                />

                <Field
                  label="Date"
                  value={form.date}
                  onChange={(v) => update("date", v)}
                  type="date"
                  icon={<CalendarDays size={16} className="text-gray-500" />}
                />

                <div className="grid grid-cols-2 gap-3">
                  <Field
                    label="Depart Time"
                    value={form.departTime}
                    onChange={(v) => update("departTime", v)}
                    placeholder="07:30"
                    icon={<Clock size={16} className="text-gray-500" />}
                  />
                  <Field
                    label="Arrive Time"
                    value={form.arriveTime}
                    onChange={(v) => update("arriveTime", v)}
                    placeholder="08:05"
                    icon={<Clock size={16} className="text-gray-500" />}
                  />
                </div>

                <Field
                  label="Duration (optional)"
                  value={form.duration}
                  onChange={(v) => update("duration", v)}
                  placeholder="e.g. 35m"
                />

                <Field
                  label="Seats Left (optional)"
                  value={form.seatsLeft}
                  onChange={(v) => update("seatsLeft", v)}
                  placeholder="e.g. 9"
                  type="number"
                />

                <div className="rounded-2xl border border-black/10 bg-gray-50 p-4 md:col-span-2">
                  <label className="text-xs font-semibold text-gray-700">
                    Refund / Cancel Policy
                  </label>
                  <div className="mt-3 flex items-center gap-3">
                    <button
                      onClick={() => update("refundable", true)}
                      className={[
                        "rounded-xl px-4 py-2 text-sm font-semibold border transition",
                        form.refundable
                          ? "bg-[#E13434] text-white border-[#E13434]"
                          : "bg-white border-black/10 hover:bg-gray-50",
                      ].join(" ")}
                    >
                      {mode === "bus" ? "Cancelable" : "Refundable"}
                    </button>
                    <button
                      onClick={() => update("refundable", false)}
                      className={[
                        "rounded-xl px-4 py-2 text-sm font-semibold border transition",
                        !form.refundable
                          ? "bg-[#0B1220] text-white border-[#0B1220]"
                          : "bg-white border-black/10 hover:bg-gray-50",
                      ].join(" ")}
                    >
                      {mode === "bus" ? "Non-cancelable" : "Non-refundable"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right preview */}
          <div className="lg:col-span-4">
            <div className="bg-white rounded-3xl border border-black/5 shadow-sm p-5 sticky top-6">
              <p className="text-sm font-semibold text-gray-900">Preview</p>
              <p className="text-xs text-gray-500 mt-1">
                How customers will see it
              </p>

              <div className="mt-4 rounded-2xl border border-black/5 bg-gray-50 p-4">
                <p className="text-xs text-gray-500">
                  {mode === "plane" ? "Airline" : "Operator"}
                </p>
                <p className="text-sm font-bold text-gray-900 mt-1">
                  {form.title || "—"}
                </p>

                <p className="text-xs text-gray-500 mt-3">
                  {mode === "plane" ? "Flight" : "Bus"} Number
                </p>
                <p className="text-sm font-semibold text-gray-900 mt-1">
                  {form.number || "—"}
                </p>

                <p className="text-xs text-gray-500 mt-3">Route</p>
                <p className="text-sm font-semibold text-gray-900 mt-1">
                  {(form.from || "—") + " → " + (form.to || "—")}
                </p>

                <p className="text-xs text-gray-500 mt-3">Schedule</p>
                <p className="text-sm text-gray-900 mt-1">
                  {form.date || "—"} • {form.departTime || "—"} →{" "}
                  {form.arriveTime || "—"}
                </p>

                <div className="mt-4 flex items-center justify-between">
                  <span className="text-xs font-semibold px-3 py-1 rounded-full bg-[#E13434]/10 text-[#E13434]">
                    {form.refundable
                      ? mode === "bus"
                        ? "Cancelable"
                        : "Refundable"
                      : mode === "bus"
                        ? "Non-cancelable"
                        : "Non-refundable"}
                  </span>
                  <span className="text-sm font-bold text-gray-900">
                    NPR {form.price || "—"}
                  </span>
                </div>
              </div>

              <p className="text-xs text-gray-500 mt-4">
                Tip: Keep routes consistent (KTM → PKR) and flight/bus numbers
                unique.
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
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
      <label className="text-xs font-semibold text-gray-700">{label}</label>
      <div className="mt-1 flex items-center gap-2 rounded-2xl border border-black/10 bg-white px-3 py-2">
        {icon}
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full outline-none text-sm text-gray-900 placeholder:text-gray-400"
        />
      </div>
    </div>
  );
}
