import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { User, Transaction, AuditLog, KYCCase } from "../types";
import Cookies from "js-cookie";
import type {
  TransactionStatsResponse,
  KYCVerificationResponse,
  TransactionResponse
} from "../types";
import { AuditLogResponse } from "../types";
import type { KYCVerificationRaw } from '@/types';

// Custom baseQuery to attach token from cookies
const rawBaseQuery = fetchBaseQuery({
  baseUrl: "http://localhost:5000/api/",
  
  prepareHeaders: (headers) => {
    const token = Cookies.get("accessToken");
    if (token) {
      headers.set("authorization", `Bearer ${token}`);
    }
    return headers;
  },
});

// Wrapper to handle 401
const baseQuery: typeof rawBaseQuery = async (args, api, extraOptions) => {
  const result = await rawBaseQuery(args, api, extraOptions);
  if (result.error && result.error.status === 401) {
    Cookies.remove("accessToken");
    window.location.href = "/login"; // Redirect to login page
  }
  return result;
};

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery,
  tagTypes: ["User", "Transaction", "AuditLog", "KYCVerification", "KYCNote"],
  endpoints: (builder) => ({
    login: builder.mutation<
      { accessToken: string; role: string },
      { email: string; password: string }
    >({
      query: (body) => ({
        url: "auth/login",
        method: "POST",
        body,
      }),
    }),
    getMe: builder.query<User, void>({
      query: () => "auth/me",
      providesTags: ["User"],
    }),
    getRates: builder.query<
      { rate: number; from: string; to: string; timestamp: string },
      { from: string; to: string }
    >({
      query: ({ from, to }) => `rates?from=${from}&to=${to}`,
    }),
    getDashboardData: builder.query<TransactionStatsResponse, void>({
      query: () => "transactions/stats",
    }),

    getTransactions: builder.query<
      TransactionResponse[],
      { status: string; filter: string }
    >({
      providesTags: ["Transaction"],
      query: ({ status, filter }) =>
        `transactions?status=${status}&filter=${filter}`,
    }),
    getAuditLogs: builder.query<
      AuditLogResponse[],
      { status: string; filter: string }
    >({
      query: ({ status, filter }) =>
        `audit-logs?status=${status}&filter=${filter}`,
    }),
    getKYCCases: builder.query<
      KYCVerificationResponse[],
      { status: string; region: string; filter: string }
      >({
      providesTags: ["KYCVerification"],
      query: ({ status, region, filter }) =>
        `kyc?status=${status}&region=${region}&filter=${filter}`,
    }),
    getKYCCase: builder.query<KYCVerificationRaw, string>({
      providesTags: (result, error, id) => [{ type: "KYCVerification", id }],
      query: (id) => `kyc/${id}`,
    }),
    updateKYCStatus: builder.mutation<
      KYCVerificationRaw,
      { id: string; status: KYCVerificationRaw["status"]; reason?: string }
    >({
      invalidatesTags: ["KYCVerification"],
      query: ({ id, status, reason }) => ({
        url: `kyc/${id}`,
        method: "PATCH",
        body: { action: status, reason: reason },
      }),
    }),
    addKYCNote: builder.mutation<
      KYCCase,
      { id: string; content: string; isInternal?: boolean }
    >({
      invalidatesTags: ["KYCVerification"],
      query: ({ id, content, isInternal }) => ({
        url: `kyc/${id}/note`,
        method: "POST",
        body: { content, isInternal },
      }),
    }),
  }),
});

export const {
  useLoginMutation,
  useGetRatesQuery,
  useGetTransactionsQuery,
  useGetAuditLogsQuery,
  useGetKYCCasesQuery,
  useGetKYCCaseQuery,
  useUpdateKYCStatusMutation,
  useAddKYCNoteMutation,
  useGetDashboardDataQuery,
  useGetMeQuery,
} = apiSlice;
