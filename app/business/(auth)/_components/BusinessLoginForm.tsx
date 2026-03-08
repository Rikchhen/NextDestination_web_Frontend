"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, type LoginFormData } from "@/app/(auth)/schema";
import { Eye, Building2 } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useState, useTransition } from "react";
import { handleLogin } from "@/lib/actions/auth-action";

export default function BusinessLoginForm() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [isPending, setTransition] = useTransition();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    setError("");

    try {
      const res = await handleLogin(data);

      if (!res.success) {
        throw new Error(res.message || "Login Failed");
      }

      setTransition(() => {
        router.push("/business");
      });
    } catch (err: any) {
      setError(err.message || "Login Failed");
    }
  };

  return (
    <div className="w-full max-w-md rounded-3xl border border-white/10 bg-white p-8 shadow-2xl">
      <div className="mb-6 text-center">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#0B1220] text-white shadow-sm">
          <Building2 size={24} />
        </div>

        <h2 className="text-2xl font-bold text-[#0B1220]">Business Login</h2>
        <p className="mt-1 text-sm text-[#E13434]">
          Access your business dashboard
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="mb-1 block text-sm font-semibold text-black">
            Enter your Email
          </label>
          <input
            {...register("email")}
            placeholder="business@example.com"
            className="w-full rounded-xl border border-slate-200 p-3 text-black outline-none focus:ring-2 focus:ring-[#0B1220]"
          />
          {errors.email && (
            <p className="mt-1 text-xs text-red-500">
              {errors.email.message as string}
            </p>
          )}
        </div>

        <div className="relative">
          <label className="mb-1 block text-sm font-semibold text-black">
            Password
          </label>
          <input
            {...register("password")}
            type="password"
            placeholder="........"
            className="w-full rounded-xl border border-slate-200 p-3 text-black outline-none focus:ring-2 focus:ring-[#0B1220]"
          />
          <Eye className="absolute right-4 top-10 text-gray-400" size={20} />
          {errors.password && (
            <p className="mt-1 text-xs text-red-500">
              {errors.password.message as string}
            </p>
          )}
        </div>

        {error && (
          <p className="text-center text-sm font-medium text-red-500">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={isPending}
          className="w-full rounded-full bg-[#0B1220] py-3 font-bold text-white transition hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isPending ? "Logging in..." : "Login as Business"}
        </button>
      </form>

      <Link
        href="/login"
        className="mt-4 block text-center text-sm font-bold text-[#E13434]"
      >
        Back to User Login
      </Link>
    </div>
  );
}
