import { api } from "./client";

export interface PaymentOrder {
  checkout_url: string;
  booking_number: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
}

export function createPaymentOrder(bookingId: number) {
  return api.post<PaymentOrder>(`/bookings/${bookingId}/payment/create-order`, undefined, { skipAuth: true });
}

export interface VerifyPaymentResult {
  message: string;
  booking_id: number;
  payment_status: string;
  payment_id: string | null;
}

export function verifyPayment(bookingId: number) {
  return api.post<VerifyPaymentResult>(`/bookings/${bookingId}/payment/verify`, undefined, { skipAuth: true });
}
