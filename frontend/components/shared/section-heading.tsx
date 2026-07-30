import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

export default function SectionHeading({
  eyebrow,
  title,
  description,
  href,
  hrefLabel = "View all",
  align = "left",
  className,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  href?: string;
  hrefLabel?: string;
  align?: "left" | "center";
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between",
        align === "center" && "sm:flex-col sm:items-center sm:text-center",
        className
      )}
    >
      <div className={cn("max-w-xl", align === "center" && "max-w-2xl")}>
        {eyebrow && (
          <span className="mb-2 inline-block font-mono text-[11px] uppercase tracking-[0.14em] text-gold-deep">
            {eyebrow}
          </span>
        )}
        <h2 className="font-display text-[28px] font-semibold leading-tight text-ink sm:text-[34px]">
          {title}
        </h2>
        {description && <p className="mt-2 text-[15px] leading-relaxed text-slate">{description}</p>}
      </div>
      {href && (
        <Link
          href={href}
          className="inline-flex shrink-0 items-center gap-1.5 text-sm font-medium text-ink hover:text-teal"
        >
          {hrefLabel} <ArrowRight size={15} />
        </Link>
      )}
    </div>
  );
}
