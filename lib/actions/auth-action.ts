// server side processing
"use server";

import {
  loginUser,
  registerUser,
  requestPasswordReset,
  resetPassword,
} from "../api/auth";
import { setUserData, setAuthToken } from "../cookie";

export const handleRegister = async (formData: any) => {
  console.log(formData);
  try {
    // handle data from component file
    const result: any = await registerUser(formData);
    // handle how to send data back to component
    if (result.success) {
      return {
        success: true,
        message: "Registration Successful",
        data: result.data,
      };
    }
    return {
      success: false,
      message: result.message || "Registration Failed",
    };
  } catch (err: Error | any) {
    console.log("Register Error:", err.response?.data);

    return {
      success: false,
      message: err.message || "Registration Failed",
    };
  }
};

export const handleLogin = async (formData: any) => {
  try {
    // handle data from component file
    const result: any = await loginUser(formData);
    // handle how to send data back to component
    if (result.success) {
      await setAuthToken(result.token);
      const userData = result.user || result.data;
      await setUserData(userData);
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
  } catch (err: Error | any) {
    return {
      success: false,
      message: err.message || "Login Failed",
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
  } catch (error: Error | any) {
    return {
      success: false,
      message: error.message || "Request password reset action failed",
    };
  }
};

export const handleResetPassword = async (
  token: string,
  newPassword: string,
) => {
  console.log("✅ handleResetPassword server action called");

  try {
    const response = await resetPassword(token, newPassword);
    console.log("✅ resetPassword API response:", response);

    // GUARANTEE plain object
    return {
      success: Boolean(response?.success),
      message:
        response?.message ??
        (response?.success ? "Password reset" : "Reset failed"),
    };
  } catch (err: any) {
    console.error("❌ handleResetPassword error:", err?.message ?? err);
    return {
      success: false,
      message: err?.message ?? "Reset password action failed",
    };
  }
};
