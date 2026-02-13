"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-toastify";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";

import { resetPasswordSchema, ResetPasswordData } from "../schema";
import { handleResetPassword } from "@/lib/actions/auth-action";

type Props = { token: string };

export default function ResetPasswordForm({ token }: Props) {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<ResetPasswordData>({
    mode: "onSubmit",
    resolver: zodResolver(resetPasswordSchema),
  });

  // Optional: simple UX check (schema should already validate, but this gives instant button disable)
  const newPassword = watch("newPassword");
  const confirmNewPassword = watch("confirmNewPassword");
  const passwordsMatch = useMemo(() => {
    if (!newPassword || !confirmNewPassword) return false;
    return newPassword === confirmNewPassword;
  }, [newPassword, confirmNewPassword]);

  const onSubmit = async (values: ResetPasswordData) => {
    setSubmitting(true);

    try {
      // Call server action (must return plain JSON object)
      const result = await handleResetPassword(token, values.newPassword);

      // Debug (browser console)
      console.log("RESET RESULT:", result);

      if (result?.success) {
        toast.success(
          result.message ?? "Password has been reset successfully.",
        );
        router.push("/login");
        return;
      }

      toast.error(result?.message ?? "Failed to reset password");
    } catch (err: unknown) {
      console.error("RESET ACTION ERROR:", err);
      const msg =
        err instanceof Error ? err.message : "Failed to reset password";
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-1">
        <label className="text-sm font-medium" htmlFor="password">
          Password
        </label>
        <input
          id="password"
          type="password"
          autoComplete="new-password"
          className="h-10 w-full rounded-md border border-black/10 dark:border-white/15 bg-background px-3 text-sm outline-none focus:border-foreground/40"
          placeholder="••••••"
          {...register("newPassword")}
        />
        {errors.newPassword?.message && (
          <p className="text-xs text-red-600">{errors.newPassword.message}</p>
        )}
      </div>

      <div className="space-y-1">
        <label className="text-sm font-medium" htmlFor="confirmPassword">
          Confirm password
        </label>
        <input
          id="confirmPassword"
          type="password"
          autoComplete="new-password"
          className="h-10 w-full rounded-md border border-black/10 dark:border-white/15 bg-background px-3 text-sm outline-none focus:border-foreground/40"
          placeholder="••••••"
          {...register("confirmNewPassword")}
        />
        {errors.confirmNewPassword?.message && (
          <p className="text-xs text-red-600">
            {errors.confirmNewPassword.message}
          </p>
        )}
        {/* Optional extra hint if schema doesn't already enforce equality */}
        {newPassword &&
          confirmNewPassword &&
          !passwordsMatch &&
          !errors.confirmNewPassword?.message && (
            <p className="text-xs text-red-600">Passwords do not match</p>
          )}
      </div>

      <button
        type="submit"
        disabled={submitting}
        className="h-10 w-full rounded-md bg-foreground text-background text-sm font-semibold hover:opacity-90 disabled:opacity-60"
      >
        {submitting ? "Resetting password..." : "Reset password"}
      </button>

      <div className="mt-1 text-center text-sm">
        Want to log in?{" "}
        <Link href="/login" className="font-semibold hover:underline">
          Log in
        </Link>
      </div>
    </form>
  );
}
