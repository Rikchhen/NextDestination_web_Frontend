// lib/api/admin.ts (or wherever you store API calls)
import axios from "./axios";
import { API } from "./endpoints";

export const getAllUsers = async () => {
  const response = await axios.get(API.ADMIN.USERS);
  return response.data; // Assuming backend returns { success: true, users: [] }
};

export const deleteUser = async (userId: string) => {
  const response = await axios.delete(API.ADMIN.USER_BY_ID(userId));
  return response.data;
};