// lib/api/admin.ts (or wherever you store API calls)
import axios from "./axios";
import { API } from "./endpoints";

export const getAllUsers = async () => {
  const response = await axios.get(API.ADMIN.USERS);
  return response.data; // Assuming backend returns { success: true, users: [] }
};

export const deleteUser = async (userId: string) => {
  const response = await axios.delete(API.ADMIN.DELETE_ONE_USER(userId));
  return response.data;
};

export const editUser = async (userId: string, updateData: any) => {
  // Pass updateData as the second argument for the PATCH body
  const response = await axios.patch(API.ADMIN.EDIT_USER(userId), updateData);
  return response.data;
};