import * as Icons from "lucide-react";
import Link from "next/link";
import { categories } from "@/lib/data";
import SectionHeading from "@/components/shared/section-heading";

export default function Categories() {
  return (
    <section className="container-page py-16 sm:py-20">
      <SectionHeading eyebrow="Browse by trip type" title="What kind of trip are you after?" />
      <div className="mt-8 grid grid-cols-3 gap-3 sm:grid-cols-4 lg:grid-cols-7">
        {categories.map((cat) => {
          const Icon = (Icons as unknown as Record<string, Icons.LucideIcon>)[cat.icon] ?? Icons.Compass;
          return (
            <Link
              key={cat.slug}
              href={`/search?category=${cat.slug}`}
              className="group flex flex-col items-center gap-3 rounded-[var(--radius-md)] border border-line bg-white p-4 text-center transition-all hover:-translate-y-0.5 hover:border-ink hover:shadow-[0_16px_30px_-18px_rgba(14,20,32,0.25)]"
            >
              <span className="grid h-11 w-11 place-items-center rounded-full bg-paper-soft text-ink transition-colors group-hover:bg-ink group-hover:text-gold">
                <Icon size={19} />
              </span>
              <span className="text-[13px] font-medium text-ink">{cat.label}</span>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
