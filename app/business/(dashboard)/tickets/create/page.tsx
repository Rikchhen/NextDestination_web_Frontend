"use client";

import React, { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Bus, Plane, PlusCircle, Save } from "lucide-react";
import { createTrip } from "@/lib/api/trip";

type Mode = "plane" | "bus";

export default function CreateBusinessTicketPage() {
  const router = useRouter();
  const [mode, setMode] = useState<Mode>("plane");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    from: "",
    to: "",
    departureDate: "",
    departureTime: "",
    arrivalDate: "",
    arrivalTime: "",
    price: "",
    totalSeats: "",
    status: "active" as "active" | "cancelled" | "delayed",
  });

  const canSave = useMemo(() => {
    return (
      form.from.trim().length >= 2 &&
      form.to.trim().length >= 2 &&
      form.departureDate &&
      form.departureTime &&
      form.price &&
      form.totalSeats
    );
  }, [form]);

  const update = (k: string, v: string) =>
    setForm((p) => ({ ...p, [k]: v }));

  const handleSave = async () => {
    try {
      setSaving(true);
      setError("");
      const departureAt = new Date(
        `${form.departureDate}T${form.departureTime}:00`,
      ).toISOString();
      const arrivalAt =
        form.arrivalDate && form.arrivalTime
          ? new Date(`${form.arrivalDate}T${form.arrivalTime}:00`).toISOString()
          : undefined;

      await createTrip({
        type: mode,
        from: form.from.trim(),
        to: form.to.trim(),
        departureAt,
        arrivalAt,
        price: Number(form.price),
        totalSeats: Number(form.totalSeats),
        status: form.status,
      });

      router.push("/business/tickets");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to create trip");
    } finally {
      setSaving(false);
    }
  };

  const Icon = mode === "plane" ? Plane : Bus;

  return (
    <main className="ml-72 min-h-screen bg-pink-50/30 p-8">
      <div className="max-w-5xl mx-auto">
        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <span className="h-10 w-10 rounded-2xl bg-white border border-black/5 shadow-sm grid place-items-center">
                <PlusCircle size={18} className="text-[#E13434]" />
              </span>
              Create Trip
            </h1>
            <p className="text-sm text-gray-600 mt-1">
              Create a bus/plane trip for customers.
            </p>
          </div>
          <button
            onClick={handleSave}
            disabled={!canSave || saving}
            className="inline-flex items-center gap-2 rounded-2xl bg-[#E13434] px-5 py-3 text-sm font-semibold text-white disabled:opacity-60"
          >
            <Save size={18} />
            {saving ? "Saving..." : "Save Trip"}
          </button>
        </div>

        {error && (
          <div className="mb-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <div className="bg-white rounded-3xl border border-black/5 shadow-sm p-5">
          <div className="mb-4 grid grid-cols-2 gap-3">
            <button
              onClick={() => setMode("plane")}
              className={`rounded-2xl border px-4 py-3 text-left ${mode === "plane" ? "border-[#E13434] bg-[#E13434]/10" : "border-black/10"}`}
            >
              <div className="flex items-center gap-2 font-semibold text-gray-900">
                <Plane size={18} className="text-[#E13434]" /> Plane
              </div>
            </button>
            <button
              onClick={() => setMode("bus")}
              className={`rounded-2xl border px-4 py-3 text-left ${mode === "bus" ? "border-[#E13434] bg-[#E13434]/10" : "border-black/10"}`}
            >
              <div className="flex items-center gap-2 font-semibold text-gray-900">
                <Bus size={18} className="text-[#E13434]" /> Bus
              </div>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <Field label="From" value={form.from} onChange={(v) => update("from", v)} />
            <Field label="To" value={form.to} onChange={(v) => update("to", v)} />
            <Field label="Departure Date" type="date" value={form.departureDate} onChange={(v) => update("departureDate", v)} />
            <Field label="Departure Time" type="time" value={form.departureTime} onChange={(v) => update("departureTime", v)} />
            <Field label="Arrival Date (optional)" type="date" value={form.arrivalDate} onChange={(v) => update("arrivalDate", v)} />
            <Field label="Arrival Time (optional)" type="time" value={form.arrivalTime} onChange={(v) => update("arrivalTime", v)} />
            <Field label="Price (NPR)" type="number" value={form.price} onChange={(v) => update("price", v)} />
            <Field label="Total Seats" type="number" value={form.totalSeats} onChange={(v) => update("totalSeats", v)} />
            <div className="md:col-span-2">
              <label className="text-xs font-semibold text-gray-700">Status</label>
              <select
                value={form.status}
                onChange={(e) => update("status", e.target.value)}
                className="mt-1 w-full rounded-2xl border border-black/10 bg-white px-3 py-2 text-sm outline-none"
              >
                <option value="active">active</option>
                <option value="delayed">delayed</option>
                <option value="cancelled">cancelled</option>
              </select>
            </div>
          </div>

          <div className="mt-4 text-sm text-gray-600 flex items-center gap-2">
            <Icon size={16} className="text-[#E13434]" />
            Trip type: {mode}
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
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
}) {
  return (
    <div>
      <label className="text-xs font-semibold text-gray-700">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1 w-full rounded-2xl border border-black/10 bg-white px-3 py-2 text-sm outline-none"
      />
    </div>
  );
}
