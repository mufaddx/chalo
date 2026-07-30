import { tours } from "@/lib/data";
import type { Tour } from "@/types";

export type BookingStatus = "pending" | "confirmed" | "cancelled" | "completed";
export type PaymentStatus = "unpaid" | "partial" | "paid" | "refunded";

export interface DashboardBooking {
  id: string;
  bookingNumber: string;
  tour: Tour;
  bookingDate: string;
  travelDate: string;
  status: BookingStatus;
  paymentStatus: PaymentStatus;
  travellers: number;
  totalAmount: number;
  pickupPoint: string;
  dropPoint: string;
  timeline: { label: string; date: string; done: boolean }[];
}

const t = (slug: string) => tours.find((x) => x.slug === slug)!;

export const currentCustomer = {
  name: "Ananya Krishnan",
  email: "ananya.krishnan@example.com",
  phone: "+91 98111 22334",
  avatar: "https://picsum.photos/seed/customer-avatar/200/200",
  dateOfBirth: "1994-03-12",
  gender: "Female",
  address: "402, Palm Residency, Koramangala, Bengaluru, Karnataka 560034",
  emergencyContactName: "Rahul Krishnan",
  emergencyContactPhone: "+91 98111 99887",
  memberSince: "March 2024",
};

export const bookings: DashboardBooking[] = [
  {
    id: "bk1",
    bookingNumber: "VYG-482913",
    tour: t("goa-beach-and-heritage-escape"),
    bookingDate: "12 Jul 2026",
    travelDate: "22 Aug 2026",
    status: "confirmed",
    paymentStatus: "paid",
    travellers: 2,
    totalAmount: 24998,
    pickupPoint: "Goa Dabolim Airport, Arrivals Gate 2",
    dropPoint: "Goa Dabolim Airport, Departures",
    timeline: [
      { label: "Booking placed", date: "12 Jul 2026", done: true },
      { label: "Payment received", date: "12 Jul 2026", done: true },
      { label: "Confirmed by agency", date: "13 Jul 2026", done: true },
      { label: "Trip reminder sent", date: "20 Aug 2026", done: false },
      { label: "Trip completed", date: "26 Aug 2026", done: false },
    ],
  },
  {
    id: "bk2",
    bookingNumber: "VYG-317605",
    tour: t("ladakh-monasteries-and-passes"),
    bookingDate: "02 Jun 2026",
    travelDate: "12 Aug 2026",
    status: "pending",
    paymentStatus: "unpaid",
    travellers: 1,
    totalAmount: 34999,
    pickupPoint: "Kushok Bakula Rimpochee Airport, Leh",
    dropPoint: "Kushok Bakula Rimpochee Airport, Leh",
    timeline: [
      { label: "Booking placed", date: "02 Jun 2026", done: true },
      { label: "Awaiting agency confirmation", date: "—", done: false },
    ],
  },
  {
    id: "bk3",
    bookingNumber: "VYG-108224",
    tour: t("kerala-houseboat-and-hills"),
    bookingDate: "18 Feb 2026",
    travelDate: "05 Mar 2026",
    status: "completed",
    paymentStatus: "paid",
    travellers: 2,
    totalAmount: 43998,
    pickupPoint: "Cochin International Airport",
    dropPoint: "Cochin International Airport",
    timeline: [
      { label: "Booking placed", date: "18 Feb 2026", done: true },
      { label: "Payment received", date: "18 Feb 2026", done: true },
      { label: "Confirmed by agency", date: "19 Feb 2026", done: true },
      { label: "Trip completed", date: "09 Mar 2026", done: true },
    ],
  },
  {
    id: "bk4",
    bookingNumber: "VYG-296117",
    tour: t("royal-rajasthan-palace-circuit"),
    bookingDate: "04 Jan 2026",
    travelDate: "20 Jan 2026",
    status: "cancelled",
    paymentStatus: "refunded",
    travellers: 4,
    totalAmount: 187996,
    pickupPoint: "Jaipur International Airport",
    dropPoint: "Udaipur Airport",
    timeline: [
      { label: "Booking placed", date: "04 Jan 2026", done: true },
      { label: "Payment received", date: "04 Jan 2026", done: true },
      { label: "Cancelled by customer", date: "10 Jan 2026", done: true },
      { label: "Refund processed", date: "14 Jan 2026", done: true },
    ],
  },
];

export const wishlistTourSlugs = [
  "bali-island-hopping",
  "santorini-aegean-dream",
  "vietnam-north-to-south",
];

export const compareTourSlugs = ["goa-beach-and-heritage-escape", "kerala-houseboat-and-hills"];

export interface SavedTraveller {
  id: string;
  name: string;
  relation: string;
  age: number;
  gender: string;
  passportNumber?: string;
}

export const savedTravellers: SavedTraveller[] = [
  { id: "tv1", name: "Ananya Krishnan", relation: "Self", age: 31, gender: "Female", passportNumber: "P8342190" },
  { id: "tv2", name: "Rahul Krishnan", relation: "Spouse", age: 33, gender: "Male", passportNumber: "P8342191" },
  { id: "tv3", name: "Meera Krishnan", relation: "Daughter", age: 6, gender: "Female" },
];

export interface DashboardNotification {
  id: string;
  type: "booking" | "offer" | "agency" | "announcement";
  title: string;
  body: string;
  date: string;
  read: boolean;
}

export const notifications: DashboardNotification[] = [
  { id: "n1", type: "booking", title: "Booking confirmed", body: "Your Goa Beach & Heritage Escape booking (VYG-482913) is confirmed.", date: "13 Jul 2026", read: false },
  { id: "n2", type: "agency", title: "Message from High Altitude Expeditions", body: "Carry warm layers — night temperatures at Pangong Tso are near freezing even in August.", date: "10 Jul 2026", read: false },
  { id: "n3", type: "offer", title: "Price drop on Vietnam North to South", body: "A tour on your wishlist dropped by ₹4,000 for departures in September.", date: "05 Jul 2026", read: true },
  { id: "n4", type: "announcement", title: "New: Free cancellation filter", body: "You can now filter search results to only show tours with free cancellation.", date: "28 Jun 2026", read: true },
  { id: "n5", type: "booking", title: "Refund processed", body: "₹1,87,996 for booking VYG-296117 has been refunded to your original payment method.", date: "14 Jan 2026", read: true },
];

export interface SupportTicket {
  id: string;
  subject: string;
  category: string;
  status: "open" | "in_progress" | "resolved" | "closed";
  priority: "low" | "medium" | "high";
  createdAt: string;
  messages: { author: "You" | "Voyagr Support"; text: string; date: string }[];
}

export const supportTickets: SupportTicket[] = [
  {
    id: "tk1",
    subject: "Refund not received for VYG-296117",
    category: "Payment",
    status: "resolved",
    priority: "high",
    createdAt: "11 Jan 2026",
    messages: [
      { author: "You", text: "Cancelled this booking 3 days ago, refund hasn't shown up yet.", date: "11 Jan 2026" },
      { author: "Voyagr Support", text: "Refunds take 5-7 business days to reflect. We've confirmed it was processed on our end on 14 Jan.", date: "12 Jan 2026" },
      { author: "You", text: "Got it, thank you!", date: "15 Jan 2026" },
    ],
  },
  {
    id: "tk2",
    subject: "Can I change the travel date on VYG-317605?",
    category: "Booking",
    status: "open",
    priority: "medium",
    createdAt: "20 Jul 2026",
    messages: [
      { author: "You", text: "I might need to push this Ladakh trip back by a week — is that possible once it's confirmed?", date: "20 Jul 2026" },
    ],
  },
];

export function dashboardStats() {
  const upcoming = bookings.filter((b) => b.status === "confirmed" || b.status === "pending").length;
  const completed = bookings.filter((b) => b.status === "completed").length;
  const cancelled = bookings.filter((b) => b.status === "cancelled").length;
  const totalSpent = bookings
    .filter((b) => b.paymentStatus === "paid")
    .reduce((sum, b) => sum + b.totalAmount, 0);
  const destinationCounts = bookings.reduce<Record<string, number>>((acc, b) => {
    acc[b.tour.destination] = (acc[b.tour.destination] ?? 0) + 1;
    return acc;
  }, {});
  const favouriteDestination = Object.entries(destinationCounts).sort((a, b) => b[1] - a[1])[0]?.[0] ?? "—";
  const lastBooking = [...bookings].sort((a, b) => (a.bookingDate < b.bookingDate ? 1 : -1))[0];

  return {
    totalBookings: bookings.length,
    upcoming,
    completed,
    cancelled,
    totalSpent,
    favouriteDestination,
    lastBookingDate: lastBooking?.bookingDate ?? "—",
  };
}
