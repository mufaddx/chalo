import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { agencyTours } from "@/lib/agency-dashboard-data";
import TourForm from "@/components/agency-dashboard/tour-form";

export function generateStaticParams() {
  return agencyTours.map((t) => ({ id: t.slug }));
}

export default async function EditTourPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const tour = agencyTours.find((t) => t.slug === id);
  if (!tour) notFound();

  return (
    <div>
      <Link href="/agency/dashboard/tours" className="mb-4 inline-flex items-center gap-1.5 text-sm text-slate hover:text-ink">
        <ArrowLeft size={14} /> Back to my tours
      </Link>
      <h1 className="font-display text-2xl font-semibold text-ink">Edit tour</h1>
      <p className="mt-1 text-sm text-slate">{tour.title}</p>
      <div className="mt-6">
        <TourForm mode="edit" tour={tour} />
      </div>
    </div>
  );
}
