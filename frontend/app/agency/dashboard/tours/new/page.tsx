import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import TourForm from "@/components/agency-dashboard/tour-form";

export default function CreateTourPage() {
  return (
    <div>
      <Link href="/agency/dashboard/tours" className="mb-4 inline-flex items-center gap-1.5 text-sm text-slate hover:text-ink">
        <ArrowLeft size={14} /> Back to my tours
      </Link>
      <h1 className="font-display text-2xl font-semibold text-ink">Create a new tour</h1>
      <p className="mt-1 text-sm text-slate">Fill in the details below. It'll go live once our team approves it.</p>
      <div className="mt-6">
        <TourForm mode="create" />
      </div>
    </div>
  );
}
