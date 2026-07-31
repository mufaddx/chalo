"use client";

import { useEffect, useState } from "react";
import { Clapperboard, Loader2, Play, Plus, Trash2, X } from "lucide-react";
import { fetchAgencyVideos, uploadAgencyVideo, deleteAgencyVideo } from "@/lib/api/agency";
import { ApiError } from "@/lib/api/client";
import type { ApiVideo } from "@/lib/api/types";

export default function AgencyVideosPage() {
  const [videos, setVideos] = useState<ApiVideo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [preview, setPreview] = useState<ApiVideo | null>(null);

  useEffect(() => {
    fetchAgencyVideos()
      .then((res) => setVideos(res.data))
      .catch((err) => setError(err instanceof ApiError ? err.message : "Couldn't load videos."))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-semibold text-ink">Videos</h1>
          <p className="mt-1 text-sm text-slate">Share short clips of your tours — travellers see these in the Voyagr app's video feed.</p>
        </div>
        <button
          onClick={() => setOpen(true)}
          className="inline-flex items-center gap-1.5 rounded-full bg-ink px-4 py-2.5 text-sm font-medium text-white hover:bg-teal"
        >
          <Plus size={15} /> Upload video
        </button>
      </div>

      {loading ? (
        <div className="mt-10 flex justify-center text-slate"><Loader2 size={22} className="animate-spin" /></div>
      ) : error ? (
        <p className="mt-6 text-sm text-danger">{error}</p>
      ) : videos.length === 0 ? (
        <div className="mt-10 flex flex-col items-center gap-2 py-16 text-center">
          <Clapperboard size={28} className="text-slate-soft" />
          <h3 className="font-display text-lg font-semibold text-ink">No videos yet</h3>
          <p className="text-sm text-slate">Upload your first clip to show up in the app's video feed.</p>
        </div>
      ) : (
        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {videos.map((v) => (
            <div key={v.id} className="group relative aspect-[9/16] overflow-hidden rounded-[var(--radius-md)] border border-line bg-ink">
              {v.thumbnail_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={v.thumbnail_url} alt={v.title} className="h-full w-full object-cover opacity-90" />
              ) : (
                <div className="grid h-full w-full place-items-center text-slate-soft"><Clapperboard size={22} /></div>
              )}
              <button
                onClick={() => setPreview(v)}
                className="absolute inset-0 grid place-items-center bg-ink/20 opacity-0 transition-opacity group-hover:opacity-100"
              >
                <span className="grid h-10 w-10 place-items-center rounded-full bg-white/90 text-ink"><Play size={16} /></span>
              </button>
              <button
                onClick={async () => {
                  if (!confirm("Delete this video?")) return;
                  await deleteAgencyVideo(v.id);
                  setVideos((prev) => prev.filter((x) => x.id !== v.id));
                }}
                className="absolute right-2 top-2 grid h-7 w-7 place-items-center rounded-full bg-black/50 text-white opacity-0 transition-opacity group-hover:opacity-100"
                aria-label="Delete video"
              >
                <Trash2 size={13} />
              </button>
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-2.5">
                <p className="truncate text-[12px] font-medium text-white">{v.title}</p>
                <p className="text-[10.5px] text-white/70">{v.views_count.toLocaleString("en-IN")} views</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {open && (
        <UploadModal
          onClose={() => setOpen(false)}
          onUploaded={(video) => {
            setVideos((prev) => [video, ...prev]);
            setOpen(false);
          }}
        />
      )}

      {preview && (
        <div className="fixed inset-0 z-[70] grid place-items-center bg-black/80 p-4" onClick={() => setPreview(null)}>
          <div className="relative aspect-[9/16] w-full max-w-sm" onClick={(e) => e.stopPropagation()}>
            <button onClick={() => setPreview(null)} className="absolute -top-10 right-0 text-white"><X size={22} /></button>
            {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
            <video src={preview.video_url} controls autoPlay className="h-full w-full rounded-lg bg-black" />
          </div>
        </div>
      )}
    </div>
  );
}

function UploadModal({ onClose, onUploaded }: { onClose: () => void; onUploaded: (v: ApiVideo) => void }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async () => {
    if (!title.trim() || !videoFile) {
      setError("Title and a video file are required.");
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      const video = await uploadAgencyVideo({ title: title.trim(), description: description.trim() || undefined, video: videoFile, thumbnail: thumbnailFile ?? undefined });
      onUploaded(video);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Upload failed — please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[70] grid place-items-center bg-ink/50 p-4" onClick={onClose}>
      <div className="w-full max-w-md rounded-[var(--radius-lg)] bg-white p-6" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between">
          <h2 className="font-display text-lg font-semibold text-ink">Upload video</h2>
          <button onClick={onClose} className="text-slate hover:text-ink"><X size={18} /></button>
        </div>

        <div className="mt-4 flex flex-col gap-3">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Title"
            className="rounded-xl border border-line px-3.5 py-2.5 text-sm focus:outline-none focus:border-ink"
          />
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Description (optional)"
            rows={3}
            className="rounded-xl border border-line px-3.5 py-2.5 text-sm focus:outline-none focus:border-ink"
          />
          <label className="text-sm font-medium text-ink">
            Video file <span className="text-slate">(MP4/MOV, max 50MB)</span>
            <input type="file" accept="video/mp4,video/quicktime" onChange={(e) => setVideoFile(e.target.files?.[0] ?? null)} className="mt-1.5 block w-full text-sm" />
          </label>
          <label className="text-sm font-medium text-ink">
            Thumbnail image <span className="text-slate">(optional)</span>
            <input type="file" accept="image/*" onChange={(e) => setThumbnailFile(e.target.files?.[0] ?? null)} className="mt-1.5 block w-full text-sm" />
          </label>

          {error && <p className="text-sm text-danger">{error}</p>}

          <button
            onClick={submit}
            disabled={submitting}
            className="mt-1 inline-flex items-center justify-center gap-1.5 rounded-full bg-ink px-5 py-2.5 text-sm font-medium text-white hover:bg-teal disabled:opacity-60"
          >
            {submitting ? <Loader2 size={15} className="animate-spin" /> : "Upload"}
          </button>
        </div>
      </div>
    </div>
  );
}
