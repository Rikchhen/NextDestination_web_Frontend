import axios from "./axios";
import { API } from "./endpoints";

export type AdminUser = {
  _id: string;
  name?: string;
  fullName?: string;
  email: string;
  phoneNumber?: string;
  role: string;
  profilePicture?: string;
};

type AdminApiResponse<T> = {
  success: boolean;
  message?: string;
  user?: T;
  users?: T[];
};

export const getAllUsers = async (): Promise<AdminUser[]> => {
  const response = await axios.get(API.ADMIN.USERS);
  return response.data?.users ?? response.data?.data ?? [];
};

export const getUserById = async (userId: string): Promise<AdminUser> => {
  const response = await axios.get<AdminApiResponse<AdminUser>>(
    API.ADMIN.USER_BY_ID(userId),
  );
  if (!response.data?.user) {
    throw new Error("User not found");
  }
  return response.data.user;
};

export const getUserByPhone = async (
  phoneNumber: string,
): Promise<AdminUser> => {
  const response = await axios.get<AdminApiResponse<AdminUser>>(
    API.ADMIN.USER_BY_PHONE(phoneNumber),
  );
  if (!response.data?.user) {
    throw new Error("User not found");
  }
  return response.data.user;
};

export const deleteUser = async (userId: string): Promise<{ success: boolean; message?: string }> => {
  const response = await axios.delete(API.ADMIN.DELETE_ONE_USER(userId));
  return response.data;
};

export const editUser = async (
  userId: string,
  updateData: Record<string, unknown> | FormData,
): Promise<AdminUser> => {
  const response = await axios.patch(API.ADMIN.EDIT_USER(userId), updateData);
  if (!response.data?.user) {
    throw new Error(response.data?.message || "Failed to update user");
  }
  return response.data.user;
};

export const deleteAllUsers = async (): Promise<{ success: boolean; message?: string }> => {
  const response = await axios.delete(API.ADMIN.DELETE_ALL_USERS);
  return response.data;
};
