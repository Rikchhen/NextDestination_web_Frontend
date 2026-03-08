import React from "react";
import { Plane, Bus, ChevronRight, Clock, Briefcase } from "lucide-react";
import Link from "next/link";
import Sidebar from "../public/_components/sidebar";

const TicketCard = ({
  airline,
  price,
  timeStart,
  duration,
  timeEnd,
  type,
  isRefundable,
  logo,
}: any) => (
  <div className="bg-white rounded-xl p-4 mb-3 shadow-sm">
    <div className="flex justify-between items-start mb-2">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center font-bold text-[10px] text-blue-800">
          {logo || "LOGO"}
        </div>
        <span className="font-bold text-gray-700">{airline}</span>
      </div>
      <span className="text-orange-500 font-bold text-lg">NPR {price}</span>
    </div>

    <div className="flex justify-between text-xs text-gray-500 mb-4">
      <div>
        <p className="font-semibold text-gray-800">
          {timeStart}{" "}
          <span className="font-normal text-gray-400">{duration}</span>{" "}
          {timeEnd}
        </p>
        <p className="mt-1 flex gap-2 items-center">
          {type} | <Briefcase size={12} /> 25KG
        </p>
      </div>
      <div className="text-right">
        <p className="text-gray-400">{duration}</p>
      </div>
    </div>

    <div className="flex justify-between items-center border-t pt-2">
      <button className="text-green-500 text-xs font-semibold uppercase tracking-wider">
        Flight Details
      </button>
      {isRefundable && (
        <span className="text-red-300 text-[10px]">Refundable</span>
      )}
    </div>
  </div>
);

export default function HomePage() {
  return (
    <div className="min-h-screen bg-pink-50/30">
      <Sidebar />

      <main className="ml-64 min-h-screen p-8 overflow-y-auto">
        <div className="max-w-5xl mx-auto">
          <div className="bg-white rounded-full py-3 px-10 shadow-sm mb-10 text-center">
            <h1 className="text-[#E13434] text-xl font-bold tracking-wide">
              Select Your Destination
            </h1>
          </div>

          <div className="grid grid-cols-2 gap-6 mb-10">
            <Link href="/plane">
              <div className="bg-[#E13434] rounded-2xl h-40 flex items-center justify-center cursor-pointer hover:scale-[1.02] transition-transform">
                <Plane size={80} color="white" strokeWidth={1} />
              </div>
            </Link>

            <Link href="/bus">
              <div className="bg-[#E13434] rounded-2xl h-40 flex items-center justify-center cursor-pointer hover:scale-[1.02] transition-transform">
                <Bus size={80} color="white" strokeWidth={1} />
              </div>
            </Link>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="bg-[#E13434] rounded-3xl p-5">
              <div className="flex justify-between items-center text-white mb-6 px-2">
                <div className="flex items-center gap-2">
                  <span className="font-bold">Airplane Tickets</span>
                  <Plane size={20} />
                </div>
                <button className="text-xs flex items-center">
                  See all <ChevronRight size={14} />
                </button>
              </div>

              <TicketCard
                airline="Buddha Air"
                price="6647"
                timeStart="NPT 07:30"
                duration="25Min"
                timeEnd="NPT 07:55"
                type="Class Y | ATR"
                isRefundable={true}
              />
              <TicketCard
                airline="Yeti Airlines"
                price="7452"
                timeStart="NPT 07:30"
                duration="25Min"
                timeEnd="NPT 07:55"
                type="Class Y | ATR"
                isRefundable={true}
              />
            </div>

            <div className="bg-[#E13434] rounded-3xl p-5">
              <div className="flex justify-between items-center text-white mb-6 px-2">
                <div className="flex items-center gap-2">
                  <span className="font-bold">Bus Tickets</span>
                  <Bus size={20} />
                </div>
                <button className="text-xs flex items-center">
                  See all <ChevronRight size={14} />
                </button>
              </div>

              <div className="bg-white rounded-xl p-4 mb-3 shadow-sm min-h-[140px]">
                <div className="flex justify-between items-start mb-1">
                  <span className="font-bold text-gray-500 text-sm">
                    Golden Super Delux
                  </span>
                  <span className="text-orange-500 font-bold">NPR 1200</span>
                </div>
                <p className="text-[10px] text-gray-400 mb-4">
                  A/C Sleeper (2+2)
                </p>
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-gray-800">
                    9:00 AM — 9:45 AM
                  </span>
                  <span className="text-[10px] text-gray-400">45 Min</span>
                </div>
                <div className="flex justify-between items-center mt-6 border-t pt-2">
                  <span className="text-green-500 text-[10px] font-bold">
                    15 Seats left
                  </span>
                  <div className="flex gap-1 opacity-40 grayscale">
                    <Bus size={12} />
                    <Clock size={12} />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl p-4 shadow-sm min-h-[140px]">
                <div className="flex justify-between items-start mb-1">
                  <span className="font-bold text-gray-500 text-sm">
                    Nepal Travels
                  </span>
                  <span className="text-orange-500 font-bold">NPR 1400</span>
                </div>
                <p className="text-[10px] text-gray-400 mb-4">
                  A/C Sleeper (2+2)
                </p>
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-gray-800">
                    9:00 AM — 9:20 AM
                  </span>
                  <span className="text-[10px] text-gray-400">20 Min</span>
                </div>
                <div className="flex justify-between items-center mt-6 border-t pt-2">
                  <span className="text-red-500 text-[10px] font-bold">
                    2 Seats left
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
