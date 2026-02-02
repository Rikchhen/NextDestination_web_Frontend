"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { RegisterFormData, registerSchema } from "../schema";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { handleRegister } from "@/lib/actions/auth-action";

export default function RegisterForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    mode: "onSubmit",
  });

  const router = useRouter();
  const [error, setError] = useState("");
  const [isPending, setTransition] = useTransition();

    const onSubmit = async (data: RegisterFormData) => {
    setError("");
    console.log("Triggered");

    try {
      const res = await handleRegister(data);

      console.log({ res });

      if (!res.success) {
          throw new Error(res.message || "Registration failed");
      }

      setTransition(() => {
        router.push("/login");
      });
    } catch (err: Error | any) {
      console.log("error occured", err);

      setError(err.message || "Registration failed");
    }
  };

  return (
    <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md">
      <h2 className="text-2xl font-bold text-center text-[#1a2b4b] mb-6">
        Create an account
      </h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-sm font-semibold text-[#1a2b4b] mb-1">
            Name
          </label>
          <input
            {...register("fullName")}
            placeholder="Full Name"
            className="w-full p-3 border border-red-300 text-black rounded-xl focus:ring-2 focus:ring-red-500 outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-[#1a2b4b] mb-1">
            Phone Number
          </label>
          <input
            {...register("phoneNumber")}
            placeholder="9********9"
            className="w-full p-3 border border-red-300  text-black rounded-xl focus:ring-2 focus:ring-red-500 outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-[#1a2b4b] mb-1">
            Email
          </label>
          <input
            {...register("email")}
            type="email"
            placeholder="abc@gmail.com"
            className="w-full p-3 border border-red-300  text-black rounded-xl focus:ring-2 focus:ring-red-500 outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-[#1a2b4b] mb-1">
            Password
          </label>
          <input
            {...register("password")}
            type="password"
            placeholder="........"
            className="w-full p-3 border border-red-300  text-black rounded-xl focus:ring-2 focus:ring-red-500 outline-none"
          />
        </div>

         <div>
          <label className="block text-sm font-semibold text-[#1a2b4b] mb-1">
            Confirm Password
          </label>
          <input
            {...register("confirmPassword")}
            type="password"
            placeholder="........"
            className="w-full p-3 border border-red-300  text-black rounded-xl focus:ring-2 focus:ring-red-500 outline-none"
          />
        </div>

        <p className="text-[10px] text-center text-gray-500">
          By continuing, you agree to our{" "}
          <span className="text-red-400">terms of service.</span>
        </p>

        <button type="submit" className="w-full bg-[#d32f2f] text-white py-3 rounded-full font-bold">
          Sign up
        </button>
      </form>

      <div className="mt-6 text-center">
        <Link href="/login" className="text-sm text-black">
          Already have an account?{" "}
          <span className="text-red-600 font-bold">Sign in here</span>
        </Link>
      </div>
    </div>
  );
}
