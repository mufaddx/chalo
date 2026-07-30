import { api } from "./client";
import type { Paginated } from "./types";

export interface ApiTicketReply {
  id: number;
  message: string;
  created_at: string;
  user?: { name: string };
}

export interface ApiSupportTicket {
  id: number;
  subject: string;
  message: string;
  category: string;
  status: "open" | "in_progress" | "resolved" | "closed";
  priority: "low" | "medium" | "high";
  created_at: string;
  user?: { name: string; email: string };
  assignee?: { name: string } | null;
  replies?: ApiTicketReply[];
}

// -- Customer -------------------------------------------------------------
export const fetchMyTickets = () => api.get<Paginated<ApiSupportTicket>>("/me/support-tickets");

export const createTicket = (data: { subject: string; message: string; category: string }) =>
  api.post<ApiSupportTicket>("/me/support-tickets", data);

export const replyToTicket = (ticketId: number, message: string) =>
  api.post<ApiTicketReply>(`/me/support-tickets/${ticketId}/replies`, { message });

// -- Admin -------------------------------------------------------------
export const fetchAdminTickets = (status?: string) =>
  api.get<Paginated<ApiSupportTicket>>(`/admin/support-tickets${status ? `?status=${status}` : ""}`);

export const updateTicketStatus = (ticketId: number, status: ApiSupportTicket["status"]) =>
  api.patch<ApiSupportTicket>(`/admin/support-tickets/${ticketId}/status`, { status });

export const adminReplyToTicket = (ticketId: number, message: string) =>
  api.post<ApiTicketReply>(`/admin/support-tickets/${ticketId}/replies`, { message });
