// server side processing
"use server";

import { loginUser, registerUser } from "../api/auth";
import { setUserData, setAuthToken } from "../cookie";

export const handleRegister = async (formData: any) => {
  console.log(formData);
  try {
    // handle data from component file
    const result: any = await registerUser(formData);
    // handle how to send data back to component
    if(result.success) {
      return {
        success: true,
        message: "Registration Successful",
        data: result.data
      };
    }
    return {
      success: false,
      message: result.message || "Registration Failed"
    }
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
    const result:any = await loginUser(formData);
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