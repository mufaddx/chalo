"use client";

import { useEffect, useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { adminBlogs as mockInitial, type AdminBlog } from "@/lib/admin-data";
import { fetchAdminBlogs, createBlog, updateBlog, deleteBlog, type ApiBlog } from "@/lib/api/admin-cms";
import { cn } from "@/lib/utils";
import CrudFormModal, { type CrudField } from "@/components/admin-dashboard/crud-form-modal";
import { DemoDataBanner, LiveDataBanner } from "@/components/dashboard/data-source-banner";

const FIELDS: CrudField[] = [
  { name: "title", label: "Post title", placeholder: "e.g. 10 Things to Pack for a Himalayan Trek" },
  { name: "excerpt", label: "Excerpt", type: "textarea", placeholder: "Short summary" },
  { name: "content", label: "Content", type: "textarea", placeholder: "Full post body" },
  { name: "category", label: "Category", type: "select", options: ["travel_tips", "destination_guide", "visa_articles", "adventure"] },
];

export default function AdminBlogsPage() {
  const [source, setSource] = useState<"loading" | "live" | "offline">("loading");
  const [liveBlogs, setLiveBlogs] = useState<ApiBlog[]>([]);
  const [mockBlogs, setMockBlogs] = useState<AdminBlog[]>(mockInitial);
  const [modalOpen, setModalOpen] = useState(false);

  const load = () => {
    fetchAdminBlogs()
      .then((res) => { setLiveBlogs(res.data); setSource("live"); })
      .catch(() => setSource("offline"));
  };
  useEffect(() => { load(); }, []);
  const usingLive = source === "live";

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-semibold text-ink">Blogs</h1>
          <p className="mt-1 text-sm text-slate">Travel tips, destination guides, and visa articles.</p>
        </div>
        <button onClick={() => setModalOpen(true)} className="inline-flex items-center gap-1.5 rounded-full bg-ink px-4 py-2.5 text-sm font-medium text-white hover:bg-teal">
          <Plus size={15} /> New post
        </button>
      </div>

      {source === "live" && <LiveDataBanner />}
      {source === "offline" && <DemoDataBanner reason="offline" />}

      <div className="mt-5 overflow-x-auto rounded-[var(--radius-lg)] border border-line bg-white">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead>
            <tr className="border-b border-line text-[12px] text-slate">
              <th className="px-4 py-3 font-medium">Title</th>
              <th className="px-4 py-3 font-medium">Category</th>
              <th className="px-4 py-3 font-medium">Published</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {usingLive
              ? liveBlogs.map((b) => (
                  <tr key={b.id}>
                    <td className="px-4 py-3 font-medium text-ink">{b.title}</td>
                    <td className="px-4 py-3 text-ink/80">{b.category}</td>
                    <td className="px-4 py-3 text-ink/80">{b.published_at?.slice(0, 10) ?? "—"}</td>
                    <td className="px-4 py-3">
                      <button
                        onClick={async () => { try { await updateBlog(b.id, { status: b.status === "published" ? "draft" : "published" }); load(); } catch { /* no-op */ } }}
                        className={cn("rounded-full px-2.5 py-1 text-[11px] font-semibold capitalize", b.status === "published" ? "bg-teal-soft text-teal" : "bg-gold-pale text-gold-deep")}
                      >
                        {b.status}
                      </button>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button onClick={async () => { try { await deleteBlog(b.id); load(); } catch { /* no-op */ } }} aria-label="Delete" className="text-slate hover:text-danger">
                        <Trash2 size={14} />
                      </button>
                    </td>
                  </tr>
                ))
              : mockBlogs.map((b) => (
                  <tr key={b.id}>
                    <td className="px-4 py-3 font-medium text-ink">{b.title}</td>
                    <td className="px-4 py-3 text-ink/80">{b.category}</td>
                    <td className="px-4 py-3 text-ink/80">{b.publishedAt}</td>
                    <td className="px-4 py-3">
                      <button onClick={() => setMockBlogs((prev) => prev.map((x) => x.id === b.id ? { ...x, status: x.status === "published" ? "draft" : "published" } : x))} className={cn("rounded-full px-2.5 py-1 text-[11px] font-semibold capitalize", b.status === "published" ? "bg-teal-soft text-teal" : "bg-gold-pale text-gold-deep")}>
                        {b.status}
                      </button>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button onClick={() => setMockBlogs((prev) => prev.filter((x) => x.id !== b.id))} aria-label="Delete" className="text-slate hover:text-danger">
                        <Trash2 size={14} />
                      </button>
                    </td>
                  </tr>
                ))}
          </tbody>
        </table>
      </div>

      {modalOpen && (
        <CrudFormModal
          title="New blog post"
          fields={FIELDS}
          onCancel={() => setModalOpen(false)}
          onSubmit={async (v) => {
            if (usingLive) {
              try {
                await createBlog({ title: v.title, excerpt: v.excerpt, content: v.content, category: v.category, status: "draft" });
                load();
              } catch { /* no-op */ }
            } else {
              setMockBlogs((prev) => [...prev, { id: String(Date.now()), title: String(v.title), category: String(v.category), author: "Voyagr Editorial", status: "draft", publishedAt: "—" }]);
            }
            setModalOpen(false);
          }}
        />
      )}
    </div>
  );
}
