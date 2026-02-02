import { z } from "zod";

export const loginSchema = z.object({
  phoneNumber: z.string().min(10, "Phone number must be at least 10 digits"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});
export type LoginFormData=z.infer<typeof loginSchema>

export const registerSchema = z.object({
  fullName: z.string().min(2, "Name is required"),
  phoneNumber: z.string().min(5, "Enter a phone number"),
  email: z.email(),
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string().min(6, "Password must be at least 6 characters"),
}).refine(
  (v) => v.password === v.confirmPassword, {
    path: ['confirmPassword'],
    message: "Passwords do not match"
  }
);
export type RegisterFormData = z.infer<typeof registerSchema>;