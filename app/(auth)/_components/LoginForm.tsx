"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema } from "../register/schema";
import { Eye } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginForm() {
  const router = useRouter();
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = (data: any) => {
    console.log(data);
    router.push("/auth/dashboard");
  };

  return (
    <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md">
      <h2 className="text-2xl font-bold text-center text-[#1a2b4b]">Login</h2>
      <p className="text-[#d32f2f] text-center text-sm mb-6">Welcome back to the app</p>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-sm text-black font-semibold mb-1">Enter your Phone Number</label>
          <input {...register("phone")} placeholder="9********9"  
          className=" w-full p-3 border border-red-200 rounded-xl text-black focus:ring-2 focus:ring-red-500 outline-none" />
          {errors.phone && <p className="text-black-500 text-xs mt-1">{errors.phone.message as string}</p>}
        </div>
        <div className="relative">
          <label className="block text-sm text-black font-semibold mb-1">Password</label>
          <input {...register("password")} type="password" placeholder="........" 
          className="w-full p-3 border border-red-200 rounded-xl text-black focus:ring-2 focus:ring-red-500 outline-none" />
          <Eye className="absolute right-4 top-10 text-gray-400" size={20} />
          {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message as string}</p>}
        </div>
        <button className="w-full bg-[#d32f2f] text-white py-3 rounded-full font-bold hover:bg-red-700 transition">Login</button>
      </form>
      <Link href="/register" className="text-red-600 font-bold text-sm block mt-4 text-center">Create an account</Link>
    </div>
  );
}