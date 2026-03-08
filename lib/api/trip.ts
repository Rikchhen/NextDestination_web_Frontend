import axios from "./axios";
import { API } from "./endpoints";

export type TripStatus = "active" | "cancelled" | "delayed";
export type TripType = "bus" | "plane";

export type TripRecord = {
  _id: string;
  business: string;
  type: TripType;
  from: string;
  to: string;
  departureAt: string;
  arrivalAt?: string;
  price: number;
  totalSeats: number;
  availableSeats: number;
  status: TripStatus;
  createdAt?: string;
  updatedAt?: string;
};

type SearchTripsResponse = {
  success: boolean;
  items?: TripRecord[];
  total?: number;
  page?: number;
  limit?: number;
  pages?: number;
  message?: string;
};

type BusinessTripsResponse = {
  success: boolean;
  trips?: TripRecord[];
  message?: string;
};

type TripResponse = {
  success: boolean;
  trip?: TripRecord;
  message?: string;
};

type DeleteTripResponse = {
  success: boolean;
  message?: string;
};

export const searchTrips = async (params: {
  type?: TripType;
  from?: string;
  to?: string;
  status?: TripStatus;
  departureFrom?: string;
  departureTo?: string;
  page?: number;
  limit?: number;
}) => {
  const response = await axios.get<SearchTripsResponse>(API.TRIP.SEARCH, {
    params,
  });
  if (!response.data?.success) {
    throw new Error(response.data?.message || "Trip search failed");
  }
  return {
    items: response.data.items ?? [],
    total: response.data.total ?? 0,
    page: response.data.page ?? params.page ?? 1,
    limit: response.data.limit ?? params.limit ?? 10,
    pages: response.data.pages ?? 1,
  };
};

export const getTripById = async (id: string): Promise<TripRecord> => {
  const response = await axios.get<TripResponse>(API.TRIP.BY_ID(id));
  if (!response.data?.success || !response.data.trip) {
    throw new Error(response.data?.message || "Trip not found");
  }
  return response.data.trip;
};

export const getBusinessTrips = async (
  page = 1,
  limit = 50,
): Promise<TripRecord[]> => {
  const response = await axios.get<BusinessTripsResponse>(API.TRIP.BUSINESS_MINE, {
    params: { page, limit },
  });
  if (!response.data?.success) {
    throw new Error(response.data?.message || "Failed to fetch trips");
  }
  return response.data.trips ?? [];
};

export const createTrip = async (payload: {
  type: TripType;
  from: string;
  to: string;
  departureAt: string;
  arrivalAt?: string;
  price: number;
  totalSeats: number;
  status?: TripStatus;
}): Promise<TripRecord> => {
  const response = await axios.post<TripResponse>(API.TRIP.CREATE, payload);
  if (!response.data?.success || !response.data.trip) {
    throw new Error(response.data?.message || "Trip creation failed");
  }
  return response.data.trip;
};

export const updateTrip = async (
  id: string,
  payload: Partial<{
    from: string;
    to: string;
    departureAt: string;
    arrivalAt: string;
    price: number;
    totalSeats: number;
    status: TripStatus;
  }>,
): Promise<TripRecord> => {
  const response = await axios.patch<TripResponse>(API.TRIP.EDIT(id), payload);
  if (!response.data?.success || !response.data.trip) {
    throw new Error(response.data?.message || "Trip update failed");
  }
  return response.data.trip;
};

export const deleteTrip = async (id: string): Promise<string> => {
  const response = await axios.delete<DeleteTripResponse>(API.TRIP.DELETE(id));
  if (!response.data?.success) {
    throw new Error(response.data?.message || "Trip delete failed");
  }
  return response.data.message || "Trip deleted";
};
