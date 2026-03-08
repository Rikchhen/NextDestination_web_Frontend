import BusinessLoginForm from "../_components/BusinessLoginForm";

export default function BusinessLoginPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-[#0B1220] via-[#111827] to-[#1f2937] px-4 py-10">
      <div className="mx-auto flex min-h-[85vh] max-w-6xl items-center justify-center">
        <div className="grid w-full overflow-hidden rounded-[2rem] border border-white/10 bg-white/5 shadow-2xl backdrop-blur lg:grid-cols-2">
          {/* Left side */}
          <div className="hidden flex-col justify-center bg-gradient-to-br from-[#0B1220] to-[#111827] p-10 text-white lg:flex">
            <div className="max-w-md">
              <p className="mb-3 inline-block rounded-full bg-white/10 px-3 py-1 text-xs font-semibold tracking-wider text-white/80">
                NEXTDESTINATION BUSINESS
              </p>

              <h1 className="text-4xl font-extrabold leading-tight">
                Manage tickets,
                <br />
                approvals, and revenue
              </h1>

              <p className="mt-4 text-sm leading-6 text-white/75">
                Sign in to access your business dashboard, create transport
                tickets, review bookings, and track transactions in one place.
              </p>
            </div>
          </div>

          {/* Right side */}
          <div className="flex items-center justify-center bg-[#fff7f7] p-6 sm:p-10">
            <BusinessLoginForm />
          </div>
        </div>
      </div>
    </main>
  );
}
