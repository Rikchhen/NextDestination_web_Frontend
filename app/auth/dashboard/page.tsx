import Sidebar from "@/app/public/_components/sidebar";

export default function DashboardPage() {
  return (
    <div className="flex min-h-screen bg-[#FDE2E2]">
      <Sidebar />
      <main className="flex-1 p-8">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white rounded-full py-4 px-10 shadow-sm mb-8 text-center">
            <h1 className="text-2xl font-bold text-[#D32F2F]">Select Your Destination</h1>
          </div>
          <div className="grid grid-cols-3 gap-6 mb-10">
            {['✈️', '🚌', '🚐'].map((icon, i) => (
              <div key={i} className="bg-[#D32F2F] rounded-2xl h-40 flex items-center justify-center hover:scale-105 transition cursor-pointer">
                 <span className="text-white text-6xl">{icon}</span>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <TicketSection title="Airplane Tickets" />
            <TicketSection title="Bus Tickets" isBus />
          </div>
        </div>
      </main>
    </div>
  );
}

function TicketSection({ title, isBus }: any) {
  return (
    <div className="bg-[#D32F2F] p-6 rounded-3xl">
      <h2 className="text-white font-bold mb-4">{title}</h2>
      <div className="bg-white rounded-2xl p-4 mb-4">
        <div className="flex justify-between font-bold">
          <span>{isBus ? "Golden Super Delux" : "Buddha Air"}</span>
          <span className="text-orange-500">NPR {isBus ? "1200" : "6647"}</span>
        </div>
        <p className="text-xs text-gray-400 mt-2 font-medium">07:30 AM — 07:55 AM</p>
      </div>
    </div>
  );
}