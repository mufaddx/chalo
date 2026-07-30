import Image from "next/image";
import Link from "next/link";
import { blogPosts } from "@/lib/data";
import SectionHeading from "@/components/shared/section-heading";

export default function BlogPreview() {
  return (
    <section id="blog" className="container-page py-16 sm:py-20">
      <SectionHeading eyebrow="Read before you book" title="From the travel blog" href="/#blog" />
      <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-3">
        {blogPosts.map((post) => (
          <Link key={post.slug} href={`/#blog`} className="group flex flex-col overflow-hidden rounded-[var(--radius-lg)] border border-line bg-white">
            <div className="relative aspect-[16/10] overflow-hidden">
              <Image src={post.image} alt={post.title} fill className="object-cover transition-transform duration-700 group-hover:scale-105" />
            </div>
            <div className="flex flex-1 flex-col p-5">
              <span className="font-mono text-[10.5px] uppercase tracking-wide text-gold-deep">{post.category} · {post.readTime}</span>
              <h3 className="mt-2 font-display text-[16px] font-semibold leading-snug text-ink group-hover:text-teal">{post.title}</h3>
              <p className="mt-2 text-[13.5px] leading-relaxed text-slate">{post.excerpt}</p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
