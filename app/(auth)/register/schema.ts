import { z } from "zod";

export const loginSchema = z.object({
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const registerSchema = z.object({
  name: z.string().min(2, "Name is required"),
  phoneOrEmail: z.string().min(5, "Enter a valid email or phone number"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});