import Link from "next/link";
import { ArrowLeft, Construction } from "lucide-react";

export default function ComingSoon({ title, description }: { title: string; description: string }) {
  return (
    <div className="container-page flex min-h-[60vh] flex-col items-center justify-center py-24 text-center">
      <span className="grid h-14 w-14 place-items-center rounded-full bg-paper-soft text-gold-deep">
        <Construction size={24} />
      </span>
      <h1 className="mt-5 font-display text-2xl font-semibold text-ink">{title}</h1>
      <p className="mt-2 max-w-md text-sm leading-relaxed text-slate">{description}</p>
      <Link href="/" className="mt-6 inline-flex items-center gap-1.5 rounded-full bg-ink px-5 py-2.5 text-sm font-medium text-white hover:bg-teal">
        <ArrowLeft size={15} /> Back to home
      </Link>
    </div>
  );
}
