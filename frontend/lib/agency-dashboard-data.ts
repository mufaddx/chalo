import { agencies, tours } from "@/lib/data";
import type { Tour } from "@/types";

// The agency dashboard is scoped to a single logged-in agency for this demo.
export const currentAgency = agencies[0]; // High Altitude Expeditions

export const agencyTours = tours.filter((t) => t.agency.slug === currentAgency.slug);

export type AgencyBookingStatus = "new" | "pending" | "confirmed" | "cancelled" | "completed";
export type PaymentStatus = "unpaid" | "partial" | "paid" | "refunded";

export interface AgencyBooking {
  id: string;
  bookingNumber: string;
  tour: Tour;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  customerCity: string;
  bookingDate: string;
  travelDate: string;
  travellers: number;
  totalAmount: number;
  status: AgencyBookingStatus;
  paymentStatus: PaymentStatus;
  specialRequest?: string;
  agencyNotes: { text: string; date: string }[];
}

const t = (slug: string) => agencyTours.find((x) => x.slug === slug) ?? tours.find((x) => x.slug === slug)!;

export const agencyBookings: AgencyBooking[] = [
  {
    id: "ab1",
    bookingNumber: "VYG-618203",
    tour: t("ladakh-monasteries-and-passes"),
    customerName: "Karan Bedi",
    customerEmail: "karan.bedi@example.com",
    customerPhone: "+91 98230 11234",
    customerCity: "Delhi",
    bookingDate: "27 Jul 2026",
    travelDate: "12 Aug 2026",
    travellers: 2,
    totalAmount: 69998,
    status: "new",
    paymentStatus: "unpaid",
    specialRequest: "One traveller has a mild knee injury — please advise on the Khardung La stop.",
    agencyNotes: [],
  },
  {
    id: "ab2",
    bookingNumber: "VYG-482913",
    tour: t("ladakh-monasteries-and-passes"),
    customerName: "Ananya Krishnan",
    customerEmail: "ananya.krishnan@example.com",
    customerPhone: "+91 98111 22334",
    customerCity: "Bengaluru",
    bookingDate: "12 Jul 2026",
    travelDate: "19 Aug 2026",
    travellers: 1,
    totalAmount: 34999,
    status: "pending",
    paymentStatus: "unpaid",
    agencyNotes: [{ text: "Called customer, confirmed she wants the Aug 19 batch.", date: "13 Jul 2026" }],
  },
  {
    id: "ab3",
    bookingNumber: "VYG-317605",
    tour: t("ladakh-monasteries-and-passes"),
    customerName: "Rohan Malhotra",
    customerEmail: "rohan.m@example.com",
    customerPhone: "+91 90210 44556",
    customerCity: "Mumbai",
    bookingDate: "02 Jun 2026",
    travelDate: "12 Aug 2026",
    travellers: 3,
    totalAmount: 104997,
    status: "confirmed",
    paymentStatus: "paid",
    agencyNotes: [],
  },
  {
    id: "ab4",
    bookingNumber: "VYG-108224",
    tour: t("ladakh-monasteries-and-passes"),
    customerName: "Simran Kaur",
    customerEmail: "simran.kaur@example.com",
    customerPhone: "+91 87654 33221",
    customerCity: "Chandigarh",
    bookingDate: "18 Feb 2026",
    travelDate: "05 Mar 2026",
    travellers: 2,
    totalAmount: 69998,
    status: "completed",
    paymentStatus: "paid",
    agencyNotes: [{ text: "Great group, left a 5-star review.", date: "12 Mar 2026" }],
  },
  {
    id: "ab5",
    bookingNumber: "VYG-296117",
    tour: t("ladakh-monasteries-and-passes"),
    customerName: "Aditya Rao",
    customerEmail: "aditya.rao@example.com",
    customerPhone: "+91 99876 54321",
    customerCity: "Pune",
    bookingDate: "04 Jan 2026",
    travelDate: "20 Jan 2026",
    travellers: 4,
    totalAmount: 139996,
    status: "cancelled",
    paymentStatus: "refunded",
    agencyNotes: [{ text: "Customer cancelled due to a family emergency; refunded in full.", date: "10 Jan 2026" }],
  },
];

export function agencyStats() {
  const today = agencyBookings.filter((b) => b.status === "new").length;
  const upcoming = agencyBookings.filter((b) => b.status === "confirmed" || b.status === "pending").length;
  const revenue = agencyBookings
    .filter((b) => b.paymentStatus === "paid")
    .reduce((sum, b) => sum + b.totalAmount, 0);
  const revenueLastMonth = Math.round(revenue * 0.82); // mock comparison baseline
  const pendingCount = agencyBookings.filter((b) => b.status === "pending" || b.status === "new").length;

  return { today, upcoming, revenue, revenueLastMonth, pendingCount };
}

export const revenueByMonth = [
  { month: "Feb", value: 82000 },
  { month: "Mar", value: 104000 },
  { month: "Apr", value: 91000 },
  { month: "May", value: 118000 },
  { month: "Jun", value: 96000 },
  { month: "Jul", value: 139000 },
];

// -- Customers (derived view, one row per unique customer) -------------------
export interface AgencyCustomer {
  name: string;
  email: string;
  phone: string;
  city: string;
  totalBookings: number;
  totalSpent: number;
  lastBookingDate: string;
}

export function agencyCustomers(): AgencyCustomer[] {
  const map = new Map<string, AgencyCustomer>();
  for (const b of agencyBookings) {
    const existing = map.get(b.customerEmail);
    if (existing) {
      existing.totalBookings += 1;
      existing.totalSpent += b.paymentStatus === "paid" ? b.totalAmount : 0;
      if (b.bookingDate > existing.lastBookingDate) existing.lastBookingDate = b.bookingDate;
    } else {
      map.set(b.customerEmail, {
        name: b.customerName,
        email: b.customerEmail,
        phone: b.customerPhone,
        city: b.customerCity,
        totalBookings: 1,
        totalSpent: b.paymentStatus === "paid" ? b.totalAmount : 0,
        lastBookingDate: b.bookingDate,
      });
    }
  }
  return Array.from(map.values());
}

// -- Reviews (agency reply / hide) -------------------------------------------
export interface AgencyReview {
  id: string;
  tourTitle: string;
  author: string;
  rating: number;
  date: string;
  text: string;
  hidden: boolean;
  reply?: string;
}

export const agencyReviews: AgencyReview[] = agencyTours.flatMap((tour) =>
  tour.reviews.map((r) => ({
    id: r.id + "-" + tour.slug,
    tourTitle: tour.title,
    author: r.author,
    rating: r.rating,
    date: r.date,
    text: r.text,
    hidden: false,
    reply: r.agencyReply,
  }))
);
