import axios from "axios";
import { getAuthToken } from "../cookie";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Using 'any' here allows the async/await pattern without the overload error
axiosInstance.interceptors.request.use(
  async (config: any) => {
    try {
      const token = await getAuthToken();
      if (token) {
        // Ensure headers object exists before assignment
        config.headers = {
          ...config.headers,
          Authorization: `Bearer ${token}`,
        };
      }
    } catch (error) {
      console.error("Token retrieval failed:", error);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosInstance;