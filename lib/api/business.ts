import axios from "./axios";
import { API } from "./endpoints";

export type BusinessProfile = {
  _id: string;
  businessName: string;
  email: string;
  phoneNumber: string;
  address?: string;
  role: string;
  profilePicture?: string;
  businessDocument?: string;
  businessVerified: boolean;
  businessStatus: "Pending" | "Approved" | "Rejected";
  rejectionReason?: string;
  createdAt?: string;
  updatedAt?: string;
};

type BusinessLoginResponse = {
  success: boolean;
  token?: string;
  business?: BusinessProfile;
  message?: string;
};

type BusinessRegisterResponse = {
  success: boolean;
  message?: string;
  tempToken?: string;
  business?: BusinessProfile;
};

type BusinessProfileEditResponse = {
  message?: string;
  business?: BusinessProfile;
};

export const loginBusiness = async (payload: {
  email: string;
  password: string;
}): Promise<{ token: string; business: BusinessProfile; message?: string }> => {
  const response = await axios.post<BusinessLoginResponse>(
    API.BUSINESS.LOGIN,
    payload,
  );

  if (!response.data?.success || !response.data?.token || !response.data.business) {
    throw new Error(response.data?.message || "Business login failed");
  }

  return {
    token: response.data.token,
    business: response.data.business,
    message: response.data.message,
  };
};

export const registerBusiness = async (
  formData: FormData,
): Promise<BusinessRegisterResponse> => {
  const response = await axios.post<BusinessRegisterResponse>(
    API.BUSINESS.REGISTER,
    formData,
    { headers: { "Content-Type": "multipart/form-data" } },
  );

  if (!response.data?.success) {
    throw new Error(response.data?.message || "Business registration failed");
  }
  return response.data;
};

export const getBusinessProfile = async (): Promise<BusinessProfile> => {
  const response = await axios.get<BusinessProfile>(API.BUSINESS.PROFILE);
  return response.data;
};

export const editBusinessProfile = async (payload: {
  businessName?: string;
  phoneNumber?: string;
  address?: string;
  profilePicture?: string;
}): Promise<{ message?: string; business: BusinessProfile }> => {
  const response = await axios.put<BusinessProfileEditResponse>(
    API.BUSINESS.EDIT_PROFILE,
    payload,
  );
  if (!response.data?.business) {
    throw new Error(response.data?.message || "Profile update failed");
  }
  return { message: response.data.message, business: response.data.business };
};

export const uploadBusinessDocument = async (
  file: File,
): Promise<{ success: boolean; message?: string; document?: string }> => {
  const formData = new FormData();
  formData.append("document", file);

  const response = await axios.post(API.BUSINESS.UPLOAD_DOCUMENT, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};
