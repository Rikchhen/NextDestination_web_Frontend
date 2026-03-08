import axios from "./axios";
import { API } from "./endpoints";

export type BookingPassenger = {
  fullName: string;
  age: number;
  gender: "male" | "female";
  seatNumber: string;
};

export type BookingRecord = {
  _id: string;
  bookedBy: string;
  trip: string;
  bookingRef: string;
  status: "pending" | "confirmed" | "cancelled";
  passengers: BookingPassenger[];
  contactEmail: string;
  contactPhone: string;
  totalAmount: number;
  cancelReason?: string;
  createdAt?: string;
  updatedAt?: string;
};

export type TicketRecord = {
  _id: string;
  booking: string;
  trip: string;
  bookedBy: string;
  passengerName: string;
  seatNumber: string;
  qrToken: string;
  status: string;
  issuedAt?: string;
  expiresAt?: string;
};

export type CreateBookingPayload = {
  trip: string;
  passengers: BookingPassenger[];
  contactEmail: string;
  contactPhone: string;
};

type CreateBookingResponse = {
  success: boolean;
  message?: string;
  booking?: BookingRecord;
  tickets?: TicketRecord[];
};

type BookingWithTicketsResponse = {
  success: boolean;
  booking?: BookingRecord;
  tickets?: TicketRecord[];
  message?: string;
};

type MyBookingsResponse = {
  success: boolean;
  bookings?: BookingRecord[];
  message?: string;
};

type CancelBookingResponse = {
  success: boolean;
  message?: string;
  booking?: BookingRecord;
};

export const createBooking = async (
  payload: CreateBookingPayload,
): Promise<{ booking: BookingRecord; tickets: TicketRecord[] }> => {
  const response = await axios.post<CreateBookingResponse>(
    API.BOOKING.CREATE,
    payload,
  );
  if (!response.data?.success || !response.data.booking) {
    throw new Error(response.data?.message || "Booking failed");
  }
  return {
    booking: response.data.booking,
    tickets: response.data.tickets ?? [],
  };
};

export const getMyBookings = async (
  page = 1,
  limit = 20,
): Promise<BookingRecord[]> => {
  const response = await axios.get<MyBookingsResponse>(API.BOOKING.MINE, {
    params: { page, limit },
  });
  if (!response.data?.success) {
    throw new Error(response.data?.message || "Failed to fetch bookings");
  }
  return response.data.bookings ?? [];
};

export const getBookingByRef = async (
  ref: string,
): Promise<{ booking: BookingRecord; tickets: TicketRecord[] }> => {
  const response = await axios.get<BookingWithTicketsResponse>(
    API.BOOKING.BY_REF(ref),
  );
  if (!response.data?.success || !response.data.booking) {
    throw new Error(response.data?.message || "Booking not found");
  }
  return {
    booking: response.data.booking,
    tickets: response.data.tickets ?? [],
  };
};

export const cancelBooking = async (
  id: string,
  reason?: string,
): Promise<BookingRecord> => {
  const response = await axios.patch<CancelBookingResponse>(
    API.BOOKING.CANCEL(id),
    { reason },
  );
  if (!response.data?.success || !response.data.booking) {
    throw new Error(response.data?.message || "Cancellation failed");
  }
  return response.data.booking;
};
