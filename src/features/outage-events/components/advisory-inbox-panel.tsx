"use client";

import { useCallback, useEffect, useState } from "react";
import { AlertTriangle, CheckCircle2, ChevronDown, ChevronUp, FileText, Loader2, MapPin, Sparkles } from "lucide-react";
import type { SourceDocumentSummary } from "@/features/sources/types";
import { CEBU_MUNICIPALITIES } from "@/config/cebu-municipalities";
import { COVERAGE_TYPES, EVENT_TYPE_LABELS, EVENT_TYPES, OUTAGE_STATUSES } from "../types";
import type { AdvisoryExtractionResult, ResolvedArea } from "../schemas/advisory-extraction.schema";

const COVERAGE_TYPE_LABELS: Record<string, string> = {
  FULL: "Full area",
  PARTIAL: "Partial area",
  STREET: "Street",
  SITIO: "Sitio",
  LANDMARK_AREA: "Landmark area",
  POINT: "Point",
  POLYGON: "Polygon",
  UNKNOWN_EXTENT: "Unknown extent",
};

interface FormState {
  eventType: string;
  status: string;
  municipality: string;
  coverageType: string;
  coverageDescription: string;
  startAt: string;
  endAt: string;
  reason: string;
  latitude: string;
  longitude: string;
  notes: string;
}

const DEFAULT_FORM: FormState = {
  eventType: "SCHEDULED_SERVICE_INTERRUPTION",
  status: "SCHEDULED",
  municipality: "Cebu City",
  coverageType: "PARTIAL",
  coverageDescription: "",
  startAt: "",
  endAt: "",
  reason: "",
  latitude: "",
  longitude: "",
  notes: "",
};

export function AdvisoryInboxPanel() {
  const [documents, setDocuments] = useState<SourceDocumentSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [openId, setOpenId] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>(DEFAULT_FORM);
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [analyzeError, setAnalyzeError] = useState<string | null>(null);
  const [extraction, setExtraction] = useState<AdvisoryExtractionResult | null>(null);

  const loadDocuments = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/admin/sources");
    if (res.ok) {
      const json = await res.json();
      setDocuments(json.documents ?? []);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    loadDocuments();
  }, [loadDocuments]);

  function toggleOpen(id: string) {
    setErrorMessage(null);
    setAnalyzeError(null);
    setExtraction(null);
    if (openId === id) {
      setOpenId(null);
      return;
    }
    setOpenId(id);
    setForm(DEFAULT_FORM);
  }

  // "Pull New Data" — the AI reads the captured caption and proposes
  // structured fields; the location resolver (server-side, real boundary
  // data) says where those areas actually are. Nothing is written yet —
  // this only pre-fills the same form the admin reviews and edits below.
  async function handleAnalyze(documentId: string) {
    setAnalyzing(true);
    setAnalyzeError(null);

    try {
      const res = await fetch("/api/admin/advisories/extract", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sourceDocumentId: documentId }),
      });
      const json = await res.json();

      if (!res.ok) {
        setAnalyzeError(json.error ?? "AI extraction failed.");
        setAnalyzing(false);
        return;
      }

      const result = json as AdvisoryExtractionResult;
      setExtraction(result);

      const bestArea =
        result.resolvedAreas.find((a) => a.resolvedType === "barangay" && a.point) ??
        result.resolvedAreas.find((a) => a.point);
      const municipality = bestArea?.municipality ?? result.resolvedAreas.find((a) => a.municipality)?.municipality;

      const areaSummary = result.resolvedAreas.map((a) => a.mentionedAs).join(", ");

      setForm((f) => ({
        ...f,
        status: result.extraction.status,
        municipality: municipality && CEBU_MUNICIPALITIES.includes(municipality as (typeof CEBU_MUNICIPALITIES)[number]) ? municipality : f.municipality,
        coverageType: result.extraction.coverage,
        coverageDescription: areaSummary || f.coverageDescription,
        startAt:
          result.extraction.effectiveDate && result.extraction.startTime
            ? `${result.extraction.effectiveDate}T${result.extraction.startTime}`
            : f.startAt,
        endAt:
          result.extraction.effectiveDate && result.extraction.endTime
            ? `${result.extraction.effectiveDate}T${result.extraction.endTime}`
            : f.endAt,
        reason: result.extraction.reason ?? f.reason,
        latitude: bestArea?.point ? String(bestArea.point.lat) : f.latitude,
        longitude: bestArea?.point ? String(bestArea.point.lng) : f.longitude,
      }));
    } catch {
      setAnalyzeError("AI extraction failed. Check your connection and try again.");
    } finally {
      setAnalyzing(false);
    }
  }

  async function handlePublish(documentId: string) {
    setSubmitting(true);
    setErrorMessage(null);

    try {
      const res = await fetch("/api/admin/outage-events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sourceDocumentId: documentId,
          eventType: form.eventType,
          status: form.status,
          municipality: form.municipality,
          coverageType: form.coverageType,
          coverageDescription: form.coverageDescription || undefined,
          startAt: form.startAt || undefined,
          endAt: form.endAt || undefined,
          reason: form.reason || undefined,
          latitude: form.latitude ? Number(form.latitude) : undefined,
          longitude: form.longitude ? Number(form.longitude) : undefined,
          notes: form.notes || undefined,
        }),
      });
      const json = await res.json();

      if (!res.ok) {
        setErrorMessage(json.error ?? "Could not publish this event.");
        setSubmitting(false);
        return;
      }

      setOpenId(null);
      setDocuments((prev) => prev.map((d) => (d.id === documentId ? { ...d, published: true } : d)));
    } catch {
      setErrorMessage("Publish failed. Check your connection and try again.");
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <div className="flex h-32 items-center justify-center rounded-panel border border-border-subtle bg-bg-1/60">
        <Loader2 className="h-5 w-5 animate-spin text-text-secondary" aria-hidden="true" />
      </div>
    );
  }

  if (documents.length === 0) {
    return (
      <p className="rounded-panel border border-border-subtle bg-bg-1/60 px-4 py-6 text-center text-sm text-text-secondary">
        Nothing captured yet.{" "}
        <a href="/admin/sources" className="text-brand-cyan hover:underline">
          Upload a source
        </a>{" "}
        first.
      </p>
    );
  }

  return (
    <ul className="flex flex-col gap-3">
      {documents.map((doc) => {
        const isOpen = openId === doc.id;
        return (
          <li key={doc.id} className="rounded-panel border border-border-subtle bg-bg-1">
            <button
              type="button"
              onClick={() => toggleOpen(doc.id)}
              className="flex w-full items-start justify-between gap-3 p-4 text-left"
            >
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-text-primary">{doc.sourceName}</span>
                  {doc.published && (
                    <span className="inline-flex items-center gap-1 rounded-full border border-status-stable/40 bg-status-stable/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-status-stable">
                      <CheckCircle2 className="h-3 w-3" aria-hidden="true" /> Published
                    </span>
                  )}
                </div>
                <p className="mt-0.5 text-xs text-text-secondary">
                  {new Date(doc.capturedAt).toLocaleString("en-PH", { timeZone: "Asia/Manila" })}
                </p>
                {doc.rawText && <p className="mt-1.5 line-clamp-2 text-sm text-text-secondary">{doc.rawText}</p>}
                {doc.fileUrl && (
                  <a
                    href={doc.fileUrl}
                    target="_blank"
                    rel="noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="mt-1 inline-flex items-center gap-1 text-sm text-brand-cyan hover:underline"
                  >
                    <FileText className="h-3.5 w-3.5" aria-hidden="true" /> View attached file
                  </a>
                )}
              </div>
              {isOpen ? (
                <ChevronUp className="h-4 w-4 shrink-0 text-text-secondary" aria-hidden="true" />
              ) : (
                <ChevronDown className="h-4 w-4 shrink-0 text-text-secondary" aria-hidden="true" />
              )}
            </button>

            {isOpen && (
              <div className="border-t border-border-subtle p-4">
                {doc.rawText && (
                  <div className="mb-5">
                    <button
                      type="button"
                      disabled={analyzing}
                      onClick={() => handleAnalyze(doc.id)}
                      className="flex min-h-11 w-full items-center justify-center gap-2 rounded-control border border-brand-cyan/40 bg-brand-cyan/10 px-4 text-sm font-semibold text-brand-cyan transition-colors hover:bg-brand-cyan/15 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {analyzing ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> Analyzing…
                        </>
                      ) : (
                        <>
                          <Sparkles className="h-4 w-4" aria-hidden="true" /> Pull New Data (AI-assist)
                        </>
                      )}
                    </button>

                    {analyzeError && (
                      <p role="alert" className="mt-3 rounded-control border border-status-critical/40 bg-status-critical/10 px-3 py-2 text-sm text-status-critical">
                        {analyzeError}
                      </p>
                    )}

                    {extraction && (
                      <div className="mt-3 rounded-control border border-border-subtle bg-bg-0/50 p-3">
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-xs font-semibold uppercase tracking-wide text-text-secondary">AI extraction applied below</span>
                          <span
                            className={`rounded-full border px-2 py-0.5 text-[10px] font-semibold ${
                              extraction.extraction.confidence >= 70
                                ? "border-status-stable/40 text-status-stable"
                                : extraction.extraction.confidence >= 40
                                  ? "border-status-scheduled/40 text-status-scheduled"
                                  : "border-status-critical/40 text-status-critical"
                            }`}
                          >
                            {extraction.extraction.confidence}% confidence
                          </span>
                        </div>
                        {extraction.resolvedAreas.length > 0 && (
                          <ul className="mt-2 flex flex-wrap gap-1.5">
                            {extraction.resolvedAreas.map((area: ResolvedArea) => (
                              <li
                                key={area.mentionedAs}
                                className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] ${
                                  area.resolvedType === "unresolved"
                                    ? "border-status-critical/40 text-status-critical"
                                    : "border-status-stable/40 text-status-stable"
                                }`}
                              >
                                {area.resolvedType === "unresolved" ? (
                                  <AlertTriangle className="h-3 w-3" aria-hidden="true" />
                                ) : (
                                  <MapPin className="h-3 w-3" aria-hidden="true" />
                                )}
                                {area.mentionedAs}
                                {area.resolvedType === "barangay" && area.municipality ? ` (${area.municipality})` : ""}
                              </li>
                            ))}
                          </ul>
                        )}
                        <p className="mt-2 text-[11px] leading-relaxed text-text-secondary">
                          Review every field below — the AI reads only what's written and never invents a
                          location's boundary. Areas marked unresolved need a manual location pick.
                        </p>
                      </div>
                    )}
                  </div>
                )}

                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="block text-sm font-medium">
                    Event type
                    <select
                      value={form.eventType}
                      onChange={(e) => setForm((f) => ({ ...f, eventType: e.target.value }))}
                      className="mt-2 min-h-11 w-full rounded-control border border-border-subtle bg-bg-0 px-3 text-text-primary outline-none focus:border-brand-cyan"
                    >
                      {EVENT_TYPES.map((type) => (
                        <option key={type} value={type}>
                          {EVENT_TYPE_LABELS[type]}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label className="block text-sm font-medium">
                    Status
                    <select
                      value={form.status}
                      onChange={(e) => setForm((f) => ({ ...f, status: e.target.value }))}
                      className="mt-2 min-h-11 w-full rounded-control border border-border-subtle bg-bg-0 px-3 text-text-primary outline-none focus:border-brand-cyan"
                    >
                      {OUTAGE_STATUSES.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </label>
                </div>

                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  <label className="block text-sm font-medium">
                    Municipality / city
                    <select
                      value={form.municipality}
                      onChange={(e) => setForm((f) => ({ ...f, municipality: e.target.value }))}
                      className="mt-2 min-h-11 w-full rounded-control border border-border-subtle bg-bg-0 px-3 text-text-primary outline-none focus:border-brand-cyan"
                    >
                      {CEBU_MUNICIPALITIES.map((name) => (
                        <option key={name} value={name}>
                          {name}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label className="block text-sm font-medium">
                    Coverage
                    <select
                      value={form.coverageType}
                      onChange={(e) => setForm((f) => ({ ...f, coverageType: e.target.value }))}
                      className="mt-2 min-h-11 w-full rounded-control border border-border-subtle bg-bg-0 px-3 text-text-primary outline-none focus:border-brand-cyan"
                    >
                      {COVERAGE_TYPES.map((type) => (
                        <option key={type} value={type}>
                          {COVERAGE_TYPE_LABELS[type]}
                        </option>
                      ))}
                    </select>
                  </label>
                </div>

                <label className="mt-4 block text-sm font-medium">
                  Coverage description (optional)
                  <input
                    type="text"
                    value={form.coverageDescription}
                    onChange={(e) => setForm((f) => ({ ...f, coverageDescription: e.target.value }))}
                    placeholder="e.g. Portion of Lahug near IT Park"
                    className="mt-2 min-h-11 w-full rounded-control border border-border-subtle bg-bg-0 px-3 text-text-primary outline-none placeholder:text-text-secondary focus:border-brand-cyan"
                  />
                </label>

                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  <label className="block text-sm font-medium">
                    Start (Asia/Manila, optional)
                    <input
                      type="datetime-local"
                      value={form.startAt}
                      onChange={(e) => setForm((f) => ({ ...f, startAt: e.target.value }))}
                      className="mt-2 min-h-11 w-full rounded-control border border-border-subtle bg-bg-0 px-3 text-text-primary outline-none focus:border-brand-cyan"
                    />
                  </label>
                  <label className="block text-sm font-medium">
                    End (Asia/Manila, optional)
                    <input
                      type="datetime-local"
                      value={form.endAt}
                      onChange={(e) => setForm((f) => ({ ...f, endAt: e.target.value }))}
                      className="mt-2 min-h-11 w-full rounded-control border border-border-subtle bg-bg-0 px-3 text-text-primary outline-none focus:border-brand-cyan"
                    />
                  </label>
                </div>

                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  <label className="block text-sm font-medium">
                    Latitude (optional)
                    <input
                      type="number"
                      step="any"
                      value={form.latitude}
                      onChange={(e) => setForm((f) => ({ ...f, latitude: e.target.value }))}
                      placeholder="10.3277"
                      className="mt-2 min-h-11 w-full rounded-control border border-border-subtle bg-bg-0 px-3 text-text-primary outline-none placeholder:text-text-secondary focus:border-brand-cyan"
                    />
                  </label>
                  <label className="block text-sm font-medium">
                    Longitude (optional)
                    <input
                      type="number"
                      step="any"
                      value={form.longitude}
                      onChange={(e) => setForm((f) => ({ ...f, longitude: e.target.value }))}
                      placeholder="123.8917"
                      className="mt-2 min-h-11 w-full rounded-control border border-border-subtle bg-bg-0 px-3 text-text-primary outline-none placeholder:text-text-secondary focus:border-brand-cyan"
                    />
                  </label>
                </div>

                <label className="mt-4 block text-sm font-medium">
                  Reason (optional)
                  <input
                    type="text"
                    value={form.reason}
                    onChange={(e) => setForm((f) => ({ ...f, reason: e.target.value }))}
                    placeholder="e.g. Feeder maintenance"
                    className="mt-2 min-h-11 w-full rounded-control border border-border-subtle bg-bg-0 px-3 text-text-primary outline-none placeholder:text-text-secondary focus:border-brand-cyan"
                  />
                </label>

                <label className="mt-4 block text-sm font-medium">
                  Reviewer notes (optional, internal only)
                  <textarea
                    value={form.notes}
                    onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
                    rows={2}
                    className="mt-2 w-full rounded-control border border-border-subtle bg-bg-0 px-3 py-2 text-text-primary outline-none focus:border-brand-cyan"
                  />
                </label>

                {errorMessage && (
                  <p role="alert" className="mt-4 rounded-control border border-status-critical/40 bg-status-critical/10 px-3 py-2 text-sm text-status-critical">
                    {errorMessage}
                  </p>
                )}

                <button
                  type="button"
                  disabled={submitting}
                  onClick={() => handlePublish(doc.id)}
                  className="mt-5 flex min-h-12 w-full items-center justify-center gap-2 rounded-control bg-brand-cyan px-4 text-sm font-bold text-text-on-accent transition-colors hover:bg-brand-cyan-light disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> Publishing…
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="h-4 w-4" aria-hidden="true" /> Verify and publish
                    </>
                  )}
                </button>
                <p className="mt-2 text-center text-[11px] text-text-secondary">
                  This immediately becomes visible on the public dashboard, map, and Locate Me.
                </p>
              </div>
            )}
          </li>
        );
      })}
    </ul>
  );
}
