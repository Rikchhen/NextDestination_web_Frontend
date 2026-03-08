"use server";

import {
  loginUser,
  registerUser,
  requestPasswordReset,
  resetPassword,
} from "../api/auth";
import { loginBusiness } from "../api/business";
import { clearAuthCookies, setUserData, setAuthToken } from "../cookie";

type ActionResponse = {
  success: boolean;
  message: string;
  data?: unknown;
};

type AuthApiResponse = {
  success?: boolean;
  message?: string;
  token?: string;
  user?: unknown;
  data?: unknown;
};

const getErrorMessage = (err: unknown, fallback: string) => {
  if (err instanceof Error) return err.message;
  return fallback;
};

export const handleRegister = async (
  formData: Record<string, unknown>,
): Promise<ActionResponse> => {
  try {
    const result = (await registerUser(formData)) as AuthApiResponse;
    if (result.success) {
      return {
        success: true,
        message: "Registration Successful",
        data: result.user || result.data,
      };
    }
    return {
      success: false,
      message: result.message || "Registration Failed",
    };
  } catch (err: unknown) {
    return {
      success: false,
      message: getErrorMessage(err, "Registration Failed"),
    };
  }
};

export const handleLogin = async (
  formData: Record<string, unknown>,
): Promise<ActionResponse> => {
  try {
    const result = (await loginUser(formData)) as AuthApiResponse;
    if (result.success) {
      if (result.token) await setAuthToken(result.token);
      const userData = result.user || result.data;
      if (userData) await setUserData(userData);
      return {
        success: true,
        message: "Login Successful",
        data: result.data,
      };
    }
    return {
      success: false,
      message: result.message || "Login Failed",
    };
  } catch (err: unknown) {
    return {
      success: false,
      message: getErrorMessage(err, "Login Failed"),
    };
  }
};

export const handleRequestPasswordReset = async (email: string) => {
  try {
    const response = await requestPasswordReset(email);
    if (response.success) {
      return {
        success: true,
        message: "Password reset email sent successfully",
      };
    }
    return {
      success: false,
      message: response.message || "Request password reset failed",
    };
  } catch (error: unknown) {
    return {
      success: false,
      message: getErrorMessage(error, "Request password reset action failed"),
    };
  }
};

export const handleResetPassword = async (
  token: string,
  newPassword: string,
) => {
  try {
    const response = await resetPassword(token, newPassword);
    return {
      success: Boolean(response?.success),
      message:
        response?.message ??
        (response?.success ? "Password reset" : "Reset failed"),
    };
  } catch (err: unknown) {
    return {
      success: false,
      message: getErrorMessage(err, "Reset password action failed"),
    };
  }
};

export const handleBusinessLogin = async (formData: {
  email: string;
  password: string;
}) => {
  try {
    const result = await loginBusiness(formData);
    await setAuthToken(result.token);
    await setUserData(result.business);
    return {
      success: true,
      message: result.message || "Business Login Successful",
    };
  } catch (err: unknown) {
    return {
      success: false,
      message: getErrorMessage(err, "Business Login Failed"),
    };
  }
};

export const handleLogout = async () => {
  await clearAuthCookies();
  return { success: true };
};
