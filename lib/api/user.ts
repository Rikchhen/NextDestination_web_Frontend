import axios from "./axios";
import { API } from "./endpoints";

export type UserProfile = {
  _id: string;
  fullName: string;
  email: string;
  phoneNumber?: string;
  role: "user" | "admin";
  profilePicture?: string;
};

type UserProfileResponse = {
  success: boolean;
  user?: UserProfile;
  message?: string;
};

export const getMyProfile = async (): Promise<UserProfile> => {
  const response = await axios.get<UserProfileResponse>(API.USER.ME);
  if (!response.data?.success || !response.data.user) {
    throw new Error(response.data?.message || "Failed to fetch profile");
  }
  return response.data.user;
};

export const editMyProfile = async (
  payload: FormData | Partial<Pick<UserProfile, "fullName" | "email" | "phoneNumber">>,
): Promise<UserProfile> => {
  const isFormData = payload instanceof FormData;
  const response = await axios.patch<UserProfileResponse>(API.USER.EDIT_ME, payload, {
    headers: isFormData ? { "Content-Type": "multipart/form-data" } : undefined,
  });
  if (!response.data?.success || !response.data.user) {
    throw new Error(response.data?.message || "Failed to update profile");
  }
  return response.data.user;
};

export const deleteMyAccount = async (): Promise<{ success: boolean; message?: string }> => {
  const response = await axios.delete<{ success: boolean; message?: string }>(
    API.USER.ME,
  );
  if (!response.data?.success) {
    throw new Error(response.data?.message || "Failed to delete account");
  }
  return response.data;
};
