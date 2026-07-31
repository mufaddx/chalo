import { api, apiUpload } from "./client";

export interface RegisterAgencyPayload {
  owner_name: string;
  owner_email: string;
  owner_password: string;
  agency_name: string;
  phone: string;
  office_address: string;
  city: string;
  years_experience?: number;
  document_type: "gst_certificate" | "pan_card" | "trade_license" | "other";
  document_path: string;
}

/** Uploads the verification document first — registration itself is guest,
 *  so this happens before any account/token exists (see UploadController). */
export async function uploadVerificationDocument(file: File) {
  const formData = new FormData();
  formData.append("file", file);
  const result = await apiUpload<{ path: string }>("/uploads/document", formData);
  return result.path;
}

export function registerAgency(payload: RegisterAgencyPayload) {
  return api.post<{ message: string; agency: unknown }>("/agencies/register", payload, { skipAuth: true });
}
