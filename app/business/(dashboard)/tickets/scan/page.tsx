"use client";

import React, { useState } from "react";
import { scanTicket, TicketRecord } from "@/lib/api/ticket";
import { ScanLine } from "lucide-react";

export default function ScanTicketPage() {
  const [qrToken, setQrToken] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<TicketRecord | null>(null);

  const onScan = async () => {
    if (!qrToken.trim()) return;
    try {
      setLoading(true);
      setError("");
      const ticket = await scanTicket(qrToken.trim());
      setResult(ticket);
    } catch (err: unknown) {
      setResult(null);
      setError(err instanceof Error ? err.message : "Ticket scan failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="ml-72 min-h-screen bg-pink-50/30 p-8">
      <div className="max-w-3xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <span className="h-10 w-10 rounded-2xl bg-white border border-black/5 shadow-sm grid place-items-center">
              <ScanLine size={18} className="text-[#E13434]" />
            </span>
            Scan Ticket
          </h1>
          <p className="text-sm text-gray-600 mt-1">
            Validate ticket by QR token and mark it as used.
          </p>
        </div>

        <div className="bg-white rounded-3xl border border-black/5 shadow-sm p-5">
          <label className="text-xs font-semibold text-gray-700">QR Token</label>
          <input
            value={qrToken}
            onChange={(e) => setQrToken(e.target.value)}
            placeholder="Paste qrToken here..."
            className="mt-1 w-full rounded-2xl border border-black/10 bg-white px-3 py-2 text-sm outline-none"
          />
          <button
            onClick={onScan}
            disabled={loading || !qrToken.trim()}
            className="mt-4 rounded-2xl bg-[#E13434] px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-60"
          >
            {loading ? "Scanning..." : "Scan Ticket"}
          </button>
        </div>

        {error && (
          <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {result && (
          <div className="bg-white rounded-3xl border border-black/5 shadow-sm p-5">
            <p className="text-sm font-semibold text-gray-900">Scan Result</p>
            <div className="mt-3 space-y-1 text-sm text-gray-700">
              <p>
                Passenger: <b>{result.passengerName}</b>
              </p>
              <p>
                Seat: <b>{result.seatNumber}</b>
              </p>
              <p>
                Status: <b>{result.status}</b>
              </p>
              <p>
                Ticket ID: <b>{result._id}</b>
              </p>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
