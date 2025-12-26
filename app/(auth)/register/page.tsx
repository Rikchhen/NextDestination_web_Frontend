import RegisterForm from "../_components/RegisterForm";

export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-[#FDE2E2] flex flex-col">
       <nav className="bg-[#D32F2F] p-4 flex justify-between items-center text-white px-10">
        <h1 className="text-xl font-bold">NextDestination</h1>
        <div className="flex gap-6 text-sm">
           <span>Home</span><span>Booking</span><span>Login</span><span>Contact us</span>
        </div>
      </nav>
      <div className="flex-1 flex items-center justify-center p-4">
        <RegisterForm />
      </div>
    </div>
  );
}