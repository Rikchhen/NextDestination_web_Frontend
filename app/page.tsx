import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#D32F2F] text-white">
      <h1 className="text-5xl font-bold mb-4">NextDestination</h1>
      <p className="text-xl mb-8 opacity-90">Your journey begins with a single click.</p>
      
      <div className="flex gap-4">
        <Link href="/login" className="bg-white text-[#D32F2F] px-8 py-3 rounded-full font-bold hover:bg-gray-100 transition">
          Login
        </Link>
        <Link href="/register" className="border-2 border-white px-8 py-3 rounded-full font-bold hover:bg-white hover:text-[#D32F2F] transition">
          Sign Up
        </Link>
      </div>
    </div>
  );
}