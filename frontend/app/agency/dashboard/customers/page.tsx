"use client";

import { useState } from "react";
import { ChevronDown, Mail, MapPin, Phone } from "lucide-react";
import { agencyBookings, agencyCustomers } from "@/lib/agency-dashboard-data";
import { formatINR } from "@/lib/utils";
import { AgencyBookingStatusBadge } from "@/components/agency-dashboard/status-badge";
import { cn } from "@/lib/utils";

export default function CustomersPage() {
  const customers = agencyCustomers();
  const [expanded, setExpanded] = useState<string | null>(null);

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-ink">Customers</h1>
      <p className="mt-1 text-sm text-slate">{customers.length} unique customers across all your tours</p>

      <div className="mt-5 flex flex-col gap-3">
        {customers.map((c) => {
          const open = expanded === c.email;
          const history = agencyBookings.filter((b) => b.customerEmail === c.email);

          return (
            <div key={c.email} className="rounded-[var(--radius-lg)] border border-line bg-white">
              <button
                onClick={() => setExpanded(open ? null : c.email)}
                className="flex w-full flex-col gap-3 p-4 text-left sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <p className="font-display text-[15px] font-semibold text-ink">{c.name}</p>
                  <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-[12.5px] text-slate">
                    <span className="inline-flex items-center gap-1"><Mail size={12} /> {c.email}</span>
                    <span className="inline-flex items-center gap-1"><Phone size={12} /> {c.phone}</span>
                    <span className="inline-flex items-center gap-1"><MapPin size={12} /> {c.city}</span>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-[12px] text-slate">{c.totalBookings} booking{c.totalBookings > 1 ? "s" : ""}</p>
                    <p className="font-mono text-sm font-semibold text-ink">{formatINR(c.totalSpent)}</p>
                  </div>
                  <ChevronDown size={16} className={cn("text-slate transition-transform", open && "rotate-180")} />
                </div>
              </button>

              {open && (
                <div className="border-t border-line p-4">
                  <p className="mb-2 text-[12px] font-medium text-slate">Booking history</p>
                  <div className="flex flex-col divide-y divide-line">
                    {history.map((b) => (
                      <div key={b.id} className="flex items-center justify-between py-2.5 text-[13px]">
                        <div>
                          <p className="text-ink">{b.tour.title}</p>
                          <p className="text-slate">{b.bookingNumber} &middot; {b.travelDate}</p>
                        </div>
                        <AgencyBookingStatusBadge status={b.status} />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
