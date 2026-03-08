import axios from "./axios";
import { API } from "./endpoints";

export type WalletBalance = {
  balance: number;
  currency: string;
};

export type WalletTransaction = {
  _id: string;
  wallet: string;
  type: "credit" | "debit";
  amount: number;
  balance: number;
  reference: string;
  description: string;
  metadata?: Record<string, unknown>;
  ownerId: string;
  ownerType: "User" | "Business";
  createdAt: string;
  updatedAt: string;
};

export type WalletPagination = {
  page: number;
  limit: number;
  total: number;
  pages: number;
};

type WalletBalanceApiResponse = {
  success: boolean;
  data?: WalletBalance;
  message?: string;
};

type WalletTransactionsApiResponse = {
  success: boolean;
  data?: WalletTransaction[];
  pagination?: WalletPagination;
  message?: string;
};

const getBalance = async (url: string): Promise<WalletBalance> => {
  const response = await axios.get<WalletBalanceApiResponse>(url);
  if (!response.data?.success || !response.data.data) {
    throw new Error(response.data?.message || "Failed to fetch wallet balance");
  }
  return response.data.data;
};

const getTransactions = async (
  url: string,
  page = 1,
  limit = 10,
): Promise<{ transactions: WalletTransaction[]; pagination: WalletPagination }> => {
  const response = await axios.get<WalletTransactionsApiResponse>(url, {
    params: { page, limit },
  });
  if (!response.data?.success) {
    throw new Error(response.data?.message || "Failed to fetch transactions");
  }
  return {
    transactions: response.data.data ?? [],
    pagination: response.data.pagination ?? {
      page,
      limit,
      total: 0,
      pages: 0,
    },
  };
};

export const getUserWalletBalance = async () =>
  getBalance(API.WALLET.USER_BALANCE);

export const getUserWalletTransactions = async (page = 1, limit = 10) =>
  getTransactions(API.WALLET.USER_TRANSACTIONS, page, limit);

export const getBusinessWalletBalance = async () =>
  getBalance(API.WALLET.BUSINESS_BALANCE);

export const getBusinessWalletTransactions = async (page = 1, limit = 10) =>
  getTransactions(API.WALLET.BUSINESS_TRANSACTIONS, page, limit);
