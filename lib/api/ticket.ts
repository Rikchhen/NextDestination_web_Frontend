import axios from "./axios";
import { API } from "./endpoints";

export type TicketStatus = "issued" | "used" | "void" | "expired";

export type TicketRecord = {
  _id: string;
  booking: string;
  trip: string;
  bookedBy: string;
  passengerName: string;
  seatNumber: string;
  qrToken: string;
  status: TicketStatus;
  issuedAt?: string;
  usedAt?: string;
  expiresAt?: string;
  voidReason?: string;
  createdAt?: string;
  updatedAt?: string;
};

type TicketByIdResponse = {
  success: boolean;
  ticket?: TicketRecord;
  message?: string;
};

type TicketsByBookingResponse = {
  success: boolean;
  tickets?: TicketRecord[];
  message?: string;
};

type ScanTicketResponse = {
  success: boolean;
  message?: string;
  ticket?: TicketRecord;
};

type VoidTicketResponse = {
  success: boolean;
  message?: string;
  ticket?: TicketRecord;
};

export const getTicketById = async (id: string): Promise<TicketRecord> => {
  const response = await axios.get<TicketByIdResponse>(API.TICKET.BY_ID(id));
  if (!response.data?.success || !response.data.ticket) {
    throw new Error(response.data?.message || "Ticket not found");
  }
  return response.data.ticket;
};

export const getTicketsByBooking = async (
  bookingId: string,
): Promise<TicketRecord[]> => {
  const response = await axios.get<TicketsByBookingResponse>(
    API.TICKET.BY_BOOKING(bookingId),
  );
  if (!response.data?.success) {
    throw new Error(response.data?.message || "Failed to fetch tickets");
  }
  return response.data.tickets ?? [];
};

export const scanTicket = async (qrToken: string): Promise<TicketRecord> => {
  const response = await axios.post<ScanTicketResponse>(API.TICKET.SCAN, {
    qrToken,
  });
  if (!response.data?.success || !response.data.ticket) {
    throw new Error(response.data?.message || "Ticket scan failed");
  }
  return response.data.ticket;
};

export const voidTicket = async (
  id: string,
  reason?: string,
): Promise<TicketRecord> => {
  const response = await axios.patch<VoidTicketResponse>(API.TICKET.VOID(id), {
    reason,
  });
  if (!response.data?.success || !response.data.ticket) {
    throw new Error(response.data?.message || "Failed to void ticket");
  }
  return response.data.ticket;
};
