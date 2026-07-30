import { agencies, categories as siteCategories, destinations as siteDestinations, tours } from "@/lib/data";

// ---------------------------------------------------------------------------
// Agencies awaiting approval (in addition to the already-verified ones in
// lib/data.ts, which represent agencies that already passed this process).
// ---------------------------------------------------------------------------
export interface PendingAgency {
  slug: string;
  name: string;
  city: string;
  submittedAt: string;
  documentType: string;
  documentName: string;
  ownerEmail: string;
  yearsExperience: number;
}

export const pendingAgencies: PendingAgency[] = [
  {
    slug: "himalayan-drift",
    name: "Himalayan Drift Tours",
    city: "Manali, Himachal Pradesh",
    submittedAt: "26 Jul 2026",
    documentType: "GST Certificate",
    documentName: "gst_certificate_himalayan_drift.pdf",
    ownerEmail: "owner@himalayandrift.in",
    yearsExperience: 4,
  },
  {
    slug: "coastal-karnataka-trails",
    name: "Coastal Karnataka Trails",
    city: "Gokarna, Karnataka",
    submittedAt: "24 Jul 2026",
    documentType: "Trade License",
    documentName: "trade_license_cnkt.pdf",
    ownerEmail: "hello@ckntrails.com",
    yearsExperience: 6,
  },
];

export const suspendedAgencies = [
  { slug: "budget-bharat-tours", name: "Budget Bharat Tours", city: "Varanasi, UP", suspendedAt: "15 Jun 2026", reason: "Multiple customer complaints about undisclosed fees, unresolved after two warnings." },
];

// ---------------------------------------------------------------------------
// Tours awaiting approval — new submissions and edits to already-live tours.
// ---------------------------------------------------------------------------
export interface PendingTour {
  id: string;
  title: string;
  agencyName: string;
  destination: string;
  price: number;
  submittedAt: string;
  type: "new" | "edit";
}

export const pendingTours: PendingTour[] = [
  { id: "pt1", title: "Spiti Valley Winter Expedition", agencyName: "High Altitude Expeditions", destination: "Spiti Valley", price: 41999, submittedAt: "27 Jul 2026", type: "new" },
  { id: "pt2", title: "Goa Beach & Heritage Escape", agencyName: "Sunseeker Holidays", destination: "Goa", price: 13499, submittedAt: "25 Jul 2026", type: "edit" },
  { id: "pt3", title: "Munnar Tea Trails Weekend", agencyName: "Backwater Trails", destination: "Munnar", price: 15999, submittedAt: "23 Jul 2026", type: "new" },
];

// ---------------------------------------------------------------------------
// Global bookings across every agency (admin sees everything).
// ---------------------------------------------------------------------------
export interface AdminBooking {
  id: string;
  bookingNumber: string;
  tourTitle: string;
  agencyName: string;
  customerName: string;
  bookingDate: string;
  travelDate: string;
  amount: number;
  status: "pending" | "confirmed" | "cancelled" | "completed";
}

export const adminBookings: AdminBooking[] = [
  { id: "gb1", bookingNumber: "VYG-618203", tourTitle: "Ladakh: Monasteries & High Mountain Passes", agencyName: "High Altitude Expeditions", customerName: "Karan Bedi", bookingDate: "27 Jul 2026", travelDate: "12 Aug 2026", amount: 69998, status: "pending" },
  { id: "gb2", bookingNumber: "VYG-482913", tourTitle: "Goa Beach & Heritage Escape", agencyName: "Sunseeker Holidays", customerName: "Ananya Krishnan", bookingDate: "12 Jul 2026", travelDate: "22 Aug 2026", amount: 24998, status: "confirmed" },
  { id: "gb3", bookingNumber: "VYG-317605", tourTitle: "Ladakh: Monasteries & High Mountain Passes", agencyName: "High Altitude Expeditions", customerName: "Rohan Malhotra", bookingDate: "02 Jun 2026", travelDate: "12 Aug 2026", amount: 104997, status: "confirmed" },
  { id: "gb4", bookingNumber: "VYG-108224", tourTitle: "Kerala Houseboat & Spice Hills", agencyName: "Backwater Trails", customerName: "Simran Kaur", bookingDate: "18 Feb 2026", travelDate: "05 Mar 2026", amount: 43998, status: "completed" },
  { id: "gb5", bookingNumber: "VYG-296117", tourTitle: "Royal Rajasthan: Palaces & Desert Forts", agencyName: "Royal Rajasthan Tours", customerName: "Aditya Rao", bookingDate: "04 Jan 2026", travelDate: "20 Jan 2026", amount: 187996, status: "cancelled" },
  { id: "gb6", bookingNumber: "VYG-772841", tourTitle: "Bali Island Hopping: Ubud to Nusa Penida", agencyName: "Meridian Getaways", customerName: "Nisha Verma", bookingDate: "20 Jul 2026", travelDate: "14 Aug 2026", amount: 137998, status: "pending" },
  { id: "gb7", bookingNumber: "VYG-905512", tourTitle: "Vietnam North to South Explorer", agencyName: "Meridian Getaways", customerName: "Farah Sheikh", bookingDate: "01 Jul 2026", travelDate: "11 Aug 2026", amount: 58999, status: "confirmed" },
];

// ---------------------------------------------------------------------------
// Users (customers)
// ---------------------------------------------------------------------------
export interface AdminUser {
  id: string;
  name: string;
  email: string;
  city: string;
  joinedAt: string;
  totalBookings: number;
  status: "active" | "deactivated";
}

export const adminUsers: AdminUser[] = [
  { id: "u1", name: "Ananya Krishnan", email: "ananya.krishnan@example.com", city: "Bengaluru", joinedAt: "Mar 2024", totalBookings: 4, status: "active" },
  { id: "u2", name: "Karan Bedi", email: "karan.bedi@example.com", city: "Delhi", joinedAt: "Jan 2025", totalBookings: 2, status: "active" },
  { id: "u3", name: "Rohan Malhotra", email: "rohan.m@example.com", city: "Mumbai", joinedAt: "Nov 2024", totalBookings: 6, status: "active" },
  { id: "u4", name: "Simran Kaur", email: "simran.kaur@example.com", city: "Chandigarh", joinedAt: "Jun 2025", totalBookings: 1, status: "active" },
  { id: "u5", name: "Aditya Rao", email: "aditya.rao@example.com", city: "Pune", joinedAt: "Feb 2025", totalBookings: 3, status: "deactivated" },
];

// ---------------------------------------------------------------------------
// Coupons
// ---------------------------------------------------------------------------
export interface AdminCoupon {
  id: string;
  code: string;
  type: "flat" | "percent";
  value: number;
  scope: string; // "Platform-wide" or agency name
  usageLimit: number;
  used: number;
  validUntil: string;
  active: boolean;
}

export const adminCoupons: AdminCoupon[] = [
  { id: "c1", code: "MONSOON500", type: "flat", value: 500, scope: "Platform-wide", usageLimit: 500, used: 214, validUntil: "31 Aug 2026", active: true },
  { id: "c2", code: "LADAKH10", type: "percent", value: 10, scope: "High Altitude Expeditions", usageLimit: 100, used: 38, validUntil: "30 Sep 2026", active: true },
  { id: "c3", code: "WELCOME15", type: "percent", value: 15, scope: "Platform-wide", usageLimit: 1000, used: 967, validUntil: "31 Dec 2026", active: true },
  { id: "c4", code: "SUMMER22", type: "flat", value: 2000, scope: "Platform-wide", usageLimit: 300, used: 300, validUntil: "30 Jun 2026", active: false },
];

// ---------------------------------------------------------------------------
// Banners
// ---------------------------------------------------------------------------
export interface AdminBanner {
  id: string;
  title: string;
  position: "Homepage hero" | "Homepage secondary" | "Category page";
  image: string;
  active: boolean;
}

export const adminBanners: AdminBanner[] = [
  { id: "bn1", title: "Independence Day sale — up to 25% off", position: "Homepage hero", image: "https://picsum.photos/seed/banner-1/800/300", active: true },
  { id: "bn2", title: "New: Bali packages with visa assistance", position: "Homepage secondary", image: "https://picsum.photos/seed/banner-2/800/300", active: true },
  { id: "bn3", title: "Monsoon in Kerala — houseboats from ₹18,999", position: "Category page", image: "https://picsum.photos/seed/banner-3/800/300", active: false },
];

// ---------------------------------------------------------------------------
// Blogs & Pages
// ---------------------------------------------------------------------------
export interface AdminBlog {
  id: string;
  title: string;
  category: string;
  author: string;
  status: "draft" | "published";
  publishedAt: string;
}

export const adminBlogs: AdminBlog[] = [
  { id: "bl1", title: "The Best Time to Visit Ladakh (And When to Avoid It)", category: "Destination Guide", author: "Voyagr Editorial", status: "published", publishedAt: "18 Jun 2026" },
  { id: "bl2", title: "Goa vs Gokarna: Which Beach Trip Actually Fits You", category: "Travel Tips", author: "Voyagr Editorial", status: "published", publishedAt: "02 Jul 2026" },
  { id: "bl3", title: "Vietnam E-Visa: A No-Nonsense Application Guide", category: "Visa Articles", author: "Voyagr Editorial", status: "published", publishedAt: "14 Jul 2026" },
  { id: "bl4", title: "Solo Female Travel in Rajasthan: A Practical Guide", category: "Travel Tips", author: "Voyagr Editorial", status: "draft", publishedAt: "—" },
];

export interface AdminPage {
  id: string;
  title: string;
  slug: string;
  status: "draft" | "published";
  updatedAt: string;
}

export const adminPages: AdminPage[] = [
  { id: "pg1", title: "About Voyagr", slug: "about", status: "published", updatedAt: "10 May 2026" },
  { id: "pg2", title: "Terms of Service", slug: "terms", status: "published", updatedAt: "01 Jan 2026" },
  { id: "pg3", title: "Privacy Policy", slug: "privacy", status: "published", updatedAt: "01 Jan 2026" },
  { id: "pg4", title: "Cancellation & Refund Policy", slug: "cancellation-policy", status: "published", updatedAt: "22 Mar 2026" },
];

// ---------------------------------------------------------------------------
// Support tickets (global queue, across all users)
// ---------------------------------------------------------------------------
export interface AdminTicket {
  id: string;
  subject: string;
  from: string;
  category: string;
  status: "open" | "in_progress" | "resolved" | "closed";
  priority: "low" | "medium" | "high";
  createdAt: string;
}

export const adminTickets: AdminTicket[] = [
  { id: "at1", subject: "Refund not received for VYG-296117", from: "Aditya Rao", category: "Payment", status: "resolved", priority: "high", createdAt: "11 Jan 2026" },
  { id: "at2", subject: "Can I change the travel date on VYG-317605?", from: "Rohan Malhotra", category: "Booking", status: "open", priority: "medium", createdAt: "20 Jul 2026" },
  { id: "at3", subject: "Agency isn't responding to my messages", from: "Nisha Verma", category: "Agency", status: "in_progress", priority: "high", createdAt: "24 Jul 2026" },
  { id: "at4", subject: "Website showing wrong currency", from: "Farah Sheikh", category: "Technical", status: "open", priority: "low", createdAt: "26 Jul 2026" },
];

// ---------------------------------------------------------------------------
// Dashboard stats
// ---------------------------------------------------------------------------
export function adminStats() {
  const totalRevenue = adminBookings.filter((b) => b.status !== "cancelled").reduce((s, b) => s + b.amount, 0);
  return {
    totalAgencies: agencies.length + pendingAgencies.length,
    pendingAgencies: pendingAgencies.length,
    verifiedAgencies: agencies.length,
    totalTours: tours.length,
    pendingTours: pendingTours.length,
    publishedTours: tours.length,
    totalBookings: adminBookings.length,
    pendingBookings: adminBookings.filter((b) => b.status === "pending").length,
    totalRevenue,
    totalCustomers: adminUsers.length,
    openTickets: adminTickets.filter((t) => t.status === "open" || t.status === "in_progress").length,
  };
}

export const revenueByMonth = [
  { month: "Feb", value: 612000 },
  { month: "Mar", value: 748000 },
  { month: "Apr", value: 693000 },
  { month: "May", value: 821000 },
  { month: "Jun", value: 776000 },
  { month: "Jul", value: 942000 },
];

export const categories = siteCategories;
export const destinations = siteDestinations;
