"use client";

import { useCallback, useEffect, useRef, useState, type FormEvent } from "react";
import { CheckCircle2, FileText, Loader2, Upload } from "lucide-react";
import { SOURCE_TYPES, SOURCE_TYPE_LABELS, type SourceDocumentSummary } from "../types";

type Status = "idle" | "submitting" | "success" | "error";

export function SourceUploadForm() {
  const [sourceName, setSourceName] = useState("VECO");
  const [sourceType, setSourceType] = useState<string>("UTILITY");
  const [sourceUrl, setSourceUrl] = useState("");
  const [rawText, setRawText] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [documents, setDocuments] = useState<SourceDocumentSummary[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const loadDocuments = useCallback(async () => {
    const res = await fetch("/api/admin/sources");
    if (!res.ok) return;
    const json = await res.json();
    setDocuments(json.documents ?? []);
  }, []);

  useEffect(() => {
    loadDocuments();
  }, [loadDocuments]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("submitting");
    setErrorMessage(null);

    const form = event.currentTarget;
    const formData = new FormData();
    formData.set("sourceName", sourceName);
    formData.set("sourceType", sourceType);
    formData.set("sourceUrl", sourceUrl);
    formData.set("rawText", rawText);
    const file = fileInputRef.current?.files?.[0];
    if (file) formData.set("file", file);

    try {
      const res = await fetch("/api/admin/sources", { method: "POST", body: formData });
      const json = await res.json();

      if (!res.ok) {
        setErrorMessage(json.error ?? "Upload failed.");
        setStatus("error");
        return;
      }

      setStatus("success");
      setRawText("");
      setSourceUrl("");
      form.reset();
      if (fileInputRef.current) fileInputRef.current.value = "";
      loadDocuments();
    } catch {
      setErrorMessage("Upload failed. Check your connection and try again.");
      setStatus("error");
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 rounded-panel border border-border-subtle bg-bg-1 p-5">
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block text-sm font-medium">
            Source
            <input
              type="text"
              required
              value={sourceName}
              onChange={(event) => setSourceName(event.target.value)}
              className="mt-2 min-h-11 w-full rounded-control border border-border-subtle bg-bg-0 px-3 text-text-primary outline-none transition-colors focus:border-brand-cyan"
            />
          </label>
          <label className="block text-sm font-medium">
            Source type
            <select
              value={sourceType}
              onChange={(event) => setSourceType(event.target.value)}
              className="mt-2 min-h-11 w-full rounded-control border border-border-subtle bg-bg-0 px-3 text-text-primary outline-none transition-colors focus:border-brand-cyan"
            >
              {SOURCE_TYPES.map((type) => (
                <option key={type} value={type}>
                  {SOURCE_TYPE_LABELS[type]}
                </option>
              ))}
            </select>
          </label>
        </div>

        <label className="block text-sm font-medium">
          Source URL (optional)
          <input
            type="url"
            value={sourceUrl}
            onChange={(event) => setSourceUrl(event.target.value)}
            placeholder="https://www.veco.com.ph/..."
            className="mt-2 min-h-11 w-full rounded-control border border-border-subtle bg-bg-0 px-3 text-text-primary outline-none transition-colors placeholder:text-text-secondary focus:border-brand-cyan"
          />
        </label>

        <label className="block text-sm font-medium">
          Advisory text
          <textarea
            value={rawText}
            onChange={(event) => setRawText(event.target.value)}
            rows={6}
            placeholder="Paste the VECO advisory exactly as published — affected areas, schedule, dates and times."
            className="mt-2 w-full rounded-control border border-border-subtle bg-bg-0 px-3 py-2 text-text-primary outline-none transition-colors placeholder:text-text-secondary focus:border-brand-cyan"
          />
        </label>

        <label className="block text-sm font-medium">
          Attach file (optional — PDF, PNG, JPEG, WEBP, up to 15MB)
          <input
            ref={fileInputRef}
            type="file"
            accept="application/pdf,image/png,image/jpeg,image/webp"
            className="mt-2 block w-full text-sm text-text-secondary file:mr-3 file:rounded-control file:border-0 file:bg-brand-cyan file:px-3 file:py-2 file:text-sm file:font-semibold file:text-text-on-accent"
          />
        </label>

        {errorMessage && (
          <p role="alert" className="rounded-control border border-status-critical/40 bg-status-critical/10 px-3 py-2 text-sm text-status-critical">
            {errorMessage}
          </p>
        )}

        {status === "success" && (
          <p className="flex items-center gap-2 rounded-control border border-status-stable/40 bg-status-stable/10 px-3 py-2 text-sm text-status-stable">
            <CheckCircle2 className="h-4 w-4 shrink-0" aria-hidden="true" />
            Saved as raw evidence. It is not shown to residents until it goes through review and publishing.
          </p>
        )}

        <button
          type="submit"
          disabled={status === "submitting"}
          className="flex min-h-12 items-center justify-center gap-2 rounded-control bg-brand-cyan px-4 text-sm font-bold text-text-on-accent transition-colors hover:bg-brand-cyan-light disabled:cursor-not-allowed disabled:opacity-60"
        >
          {status === "submitting" ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> Uploading…
            </>
          ) : (
            <>
              <Upload className="h-4 w-4" aria-hidden="true" /> Upload advisory
            </>
          )}
        </button>
      </form>

      <div>
        <h2 className="text-xs font-semibold uppercase tracking-[0.14em] text-text-secondary">Recently captured</h2>
        {documents.length === 0 ? (
          <p className="mt-3 rounded-panel border border-border-subtle bg-bg-1/60 px-4 py-6 text-center text-sm text-text-secondary">
            Nothing uploaded yet.
          </p>
        ) : (
          <ul className="mt-3 flex flex-col gap-2">
            {documents.map((doc) => (
              <li key={doc.id} className="rounded-control border border-border-subtle bg-bg-1 p-3 text-sm">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-semibold text-text-primary">{doc.sourceName}</span>
                  <span className="shrink-0 text-xs text-text-secondary">
                    {new Date(doc.capturedAt).toLocaleString("en-PH", { timeZone: "Asia/Manila" })}
                  </span>
                </div>
                {doc.rawText && <p className="mt-1 line-clamp-2 text-text-secondary">{doc.rawText}</p>}
                {doc.fileUrl && (
                  <a
                    href={doc.fileUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-1 inline-flex items-center gap-1 text-brand-cyan hover:underline"
                  >
                    <FileText className="h-3.5 w-3.5" aria-hidden="true" /> View attached file
                  </a>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
