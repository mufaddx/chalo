import { api } from "./client";

export interface ContactFormPayload {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export function submitContactForm(payload: ContactFormPayload) {
  return api.post<{ message: string }>("/contact", payload, { skipAuth: true });
}
