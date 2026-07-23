// FILE ANALYSIS PAGE
import React, { useRef, useState } from "react";
import { UploadCloud, File, AlertTriangle, CheckCircle, Download } from "lucide-react";
import { api } from "../utils/api";
import { exportForensicPdf } from "../utils/pdfExport";
import { t } from "../i18n";

type YaraJob = {
  id: string;
  status: string;
  score: number;
  matched_rules: Array<{ rule?: string; meta?: Record<string, unknown> }>;
  md5?: string;
  sha1?: string;
  sha256?: string;
};

type ScanResult = {
  threat: number;
  severity: string;
  hashes: { md5: string; sha1: string; sha256: string };
  matches: string[];
  notes: string[];
  intelMessages: string[];
};

const severityFromScore = (score: number): keyof typeof severityKeys => {
  if (score >= 75) return "critical";
  if (score >= 45) return "high";
  if (score >= 25) return "medium";
  return "low";
};

const severityKeys = { critical: "critical", high: "high", medium: "medium", low: "low" } as const;

const buildResultFromJob = (job: YaraJob): ScanResult => {
  const matches: string[] = [];
  const notes: string[] = [];
  const intelMessages: string[] = [];

  for (const entry of job.matched_rules || []) {
    const rule = entry.rule || t("fileAnalysis.unknownRule");
    if (rule === "ThreatIntel_VirusTotal") {
      const positives = Number(entry.meta?.positives ?? 0);
      const total = Number(entry.meta?.total ?? 0);
      const found = Boolean(entry.meta?.found);
      if (found && positives > 0) {
        matches.push(t("fileAnalysis.vtFlagged", { positives: String(positives), total: String(total) }));
        const permalink = entry.meta?.permalink;
        if (typeof permalink === "string" && permalink) {
          notes.push(t("fileAnalysis.vtReport", { url: permalink }));
        }
      } else if (found) {
        notes.push(t("fileAnalysis.vtClean", { positives: String(positives), total: String(total) }));
      } else {
        notes.push(t("fileAnalysis.vtNotFound"));
      }
      continue;
    }

    if (rule === "ThreatIntel_OTX") {
      const pulseCount = Number(entry.meta?.pulse_count ?? 0);
      if (pulseCount > 0) {
        matches.push(t("fileAnalysis.otxPulses", { count: String(pulseCount) }));
        notes.push(t("fileAnalysis.otxFound"));
      } else {
        notes.push(t("fileAnalysis.otxNotFound"));
      }
      continue;
    }

    matches.push(t("fileAnalysis.yaraMatch", { rule }));
    const description = entry.meta?.description;
    if (typeof description === "string" && description) {
      notes.push(description);
    }
  }

  if (matches.length === 0) {
    notes.push(t("fileAnalysis.noMatches"));
  }

  const severityKey = severityFromScore(job.score ?? 0);

  return {
    threat: job.score ?? 0,
    severity: t(`common.${severityKey}`),
    hashes: {
      md5: job.md5 || "",
      sha1: job.sha1 || "",
      sha256: job.sha256 || "",
    },
    matches,
    notes,
    intelMessages,
  };
};

export default function FileAnalysis() {
  const [dragActive, setDragActive] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<"idle" | "scanning" | "done" | "error">("idle");
  const [progress, setProgress] = useState(0);
  const [errorMessage, setErrorMessage] = useState("");
  const [result, setResult] = useState<ScanResult>({
    threat: 0,
    severity: t("common.low"),
    hashes: { md5: "", sha1: "", sha256: "" },
    matches: [],
    notes: [],
    intelMessages: [],
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleExportReport = () => {
    if (!file) return;
    exportForensicPdf({
      title: t("fileAnalysis.reportTitle"),
      fileName: file.name,
      fileSize: `${((file.size || 0) / 1024).toFixed(2)} KB`,
      threatScore: result.threat,
      severity: result.severity,
      hashes: result.hashes,
      signatures: result.matches.length > 0 ? result.matches : [t("fileAnalysis.noDirectMatches")],
      notes: result.notes.length > 0 ? result.notes : [t("fileAnalysis.noHeuristicNotes")],
      custody: [
        t("fileAnalysis.custody1"),
        t("fileAnalysis.custody2"),
        t("fileAnalysis.custody3"),
      ],
    });
  };

  const s: Record<string, React.CSSProperties> = {
    container: { display: "flex", flexDirection: "column" as const, gap: 24, maxWidth: 980, margin: "0 auto" },
    header: { display: "flex", flexDirection: "column" as const, gap: 8 },
    title: { fontFamily: "'Space Grotesk', 'Outfit', sans-serif", fontWeight: 800, fontSize: "var(--page-title-size, 32px)" as any, color: "var(--brand-text-primary)", letterSpacing: -0.5, marginBottom: 8 },
    desc: { fontSize: "var(--page-desc-size, 14px)" as any, color: "var(--brand-text-secondary)", lineHeight: 1.7 },
    uploadZone: { border: "2px dashed var(--brand-border)", borderRadius: 14, display: "flex", flexDirection: "column" as const, alignItems: "center", justifyContent: "center", gap: 16, cursor: "pointer", transition: "all 0.2s" },
    uploadZoneActive: { borderColor: "var(--brand-cyan)", background: "var(--theme-white-bg-tint)" },
    uploadIcon: { width: 46, height: 46, color: "var(--brand-text-secondary)", animation: "pulse 2s infinite" },
    uploadText: { textAlign: "center" as const },
    uploadTextMain: { fontSize: 15, fontWeight: 600, color: "var(--brand-text-primary)", marginBottom: 6 },
    uploadTextSub: { fontSize: 12, color: "var(--brand-text-secondary)" },
    fileInfo: { background: "var(--glass-bg)", border: "1px solid var(--brand-border)", borderRadius: 14, padding: 24, display: "flex", flexDirection: "column" as const, gap: 16 },
    progressBar: { width: "100%", height: 6, background: "var(--brand-border)", borderRadius: 3, overflow: "hidden" },
    progressFill: { height: "100%", background: "var(--brand-cyan)", transition: "width 0.3s" },
    resultCard: { background: "var(--glass-bg)", border: "1px solid var(--brand-border)", borderRadius: 12, padding: 16, display: "flex", flexDirection: "column" as const, gap: 12 },
    threatBig: { fontFamily: "'Space Grotesk', 'Outfit', sans-serif", fontWeight: 900, fontSize: 34, lineHeight: 1 },
    badge: { display: "inline-block", padding: "4px 8px", borderRadius: 6, fontSize: 11, fontWeight: 700, textTransform: "uppercase" as const },
    badgeMalicious: { background: "rgba(255,95,95,0.1)", color: "var(--brand-crimson)", border: "1px solid rgba(255,95,95,0.2)" },
    badgeClean: { background: "rgba(95,203,155,0.1)", color: "var(--brand-cyan)", border: "1px solid rgba(95,203,155,0.2)" },
    hashBox: { background: "var(--brand-abyssal)", border: "1px solid var(--brand-border)", padding: 12, borderRadius: 8, fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--brand-text-secondary)", wordBreak: "break-all" as const, marginTop: 4 },
  };

  const pollYaraJob = async (jobId: string): Promise<YaraJob> => {
    for (let attempt = 0; attempt < 90; attempt += 1) {
      const job = (await api.get(`/api/yara/job/${jobId}`)) as YaraJob;
      if (job.status === "completed" || job.status === "failed") {
        return job;
      }
      setProgress((current) => Math.min(current + 4, 90));
      await new Promise((resolve) => window.setTimeout(resolve, 700));
    }
    throw new Error(t("fileAnalysis.scanTimeout"));
  };

  const processFile = async (selectedFile: File) => {
    setFile(selectedFile);
    setStatus("scanning");
    setProgress(8);
    setErrorMessage("");

    try {
      const formData = new FormData();
      formData.append("file", selectedFile);
      const createdJob = (await api.post("/api/yara/scan", formData)) as YaraJob;
      setProgress(20);

      const completedJob = await pollYaraJob(createdJob.id);
      if (completedJob.status === "failed") {
        throw new Error(t("fileAnalysis.scanServerFailed"));
      }

      setProgress(100);
      setResult(buildResultFromJob(completedJob));
      setStatus("done");
    } catch (error) {
      const message = error instanceof Error ? error.message : t("fileAnalysis.analyzeError");
      setErrorMessage(message);
      setStatus("error");
      setProgress(0);
    }
  };

  const handleReset = () => {
    setFile(null);
    setStatus("idle");
    setProgress(0);
    setErrorMessage("");
    setResult({
      threat: 0,
      severity: t("common.low"),
      hashes: { md5: "", sha1: "", sha256: "" },
      matches: [],
      notes: [],
      intelMessages: [],
    });
  };

  return (
    <div style={s.container}>
      <div style={s.header}>
        <h1 style={s.title}>{t("fileAnalysis.title")}</h1>
        <p style={s.desc}>
          {t("fileAnalysis.desc")}
        </p>
      </div>

      {status === "idle" ? (
        <div
          style={{ ...s.uploadZone, ...(dragActive ? s.uploadZoneActive : {}) }}
          className="p-6 sm:p-16 md:p-20"
          onDragEnter={(e) => { e.preventDefault(); setDragActive(true); }}
          onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
          onDragLeave={(e) => { e.preventDefault(); setDragActive(false); }}
          onDrop={(e) => {
            e.preventDefault();
            setDragActive(false);
            if (e.dataTransfer.files[0]) void processFile(e.dataTransfer.files[0]);
          }}
          onClick={() => fileInputRef.current?.click()}
        >
          <input ref={fileInputRef} type="file" hidden onChange={(e) => e.target.files && void processFile(e.target.files[0])} />
          <UploadCloud style={s.uploadIcon} />
          <div style={s.uploadText}>
            <div style={s.uploadTextMain}>{t("fileAnalysis.dragDrop")}</div>
            <div style={s.uploadTextSub}>{t("fileAnalysis.supportedFormats")}</div>
          </div>
        </div>
      ) : (
        <div style={s.fileInfo}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
            <File size={34} style={{ color: "var(--brand-cyan)" }} />
            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                <span style={{ fontSize: 14, fontWeight: 700, color: "var(--brand-text-primary)" }}>{file?.name}</span>
                <span style={{ fontSize: 11, color: "var(--brand-text-secondary)", fontFamily: "var(--font-mono)" }}>{((file?.size || 0) / 1024).toFixed(2)} KB</span>
              </div>
              <div style={s.progressBar}>
                <div style={{ ...s.progressFill, width: `${progress}%` }} />
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "var(--brand-text-secondary)", marginTop: 8 }}>
                <span>
                  {status === "scanning" && t("fileAnalysis.scanning")}
                  {status === "done" && t("fileAnalysis.scanComplete")}
                  {status === "error" && t("fileAnalysis.scanFailed")}
                </span>
                <span>{progress}%</span>
              </div>
            </div>
          </div>

          {status === "error" && (
            <div style={{ padding: 12, borderRadius: 8, background: "rgba(255,95,95,0.08)", border: "1px solid rgba(255,95,95,0.2)", color: "var(--brand-crimson)", fontSize: 13 }}>
              {errorMessage}
            </div>
          )}

          {status === "done" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div style={s.resultCard}>
                <h3 style={{ fontFamily: "var(--font-outfit)", fontWeight: 700, fontSize: 15, color: "var(--brand-text-primary)", borderBottom: "1px solid var(--brand-border)", paddingBottom: 12, marginBottom: 12 }}>{t("fileAnalysis.threatAssessment")}</h3>
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
                  {result.threat > 50 ? (
                    <>
                      <AlertTriangle size={28} style={{ color: "var(--brand-crimson)" }} />
                      <div>
                        <div style={{ ...s.threatBig, color: "var(--brand-crimson)" }}>{result.threat}/100</div>
                        <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
                          <span style={{ ...s.badge, ...s.badgeMalicious }}>{result.severity}</span>
                          <span style={{ ...s.badge, background: "var(--theme-white-bg-tint)", color: "var(--brand-text-primary)", border: "1px solid var(--brand-border)" }}>{t("fileAnalysis.yaraIntel")}</span>
                        </div>
                      </div>
                    </>
                  ) : (
                    <>
                      <CheckCircle size={28} style={{ color: "var(--brand-cyan)" }} />
                      <div>
                        <div style={{ ...s.threatBig, color: "var(--brand-cyan)" }}>{result.threat}/100</div>
                        <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
                          <span style={{ ...s.badge, ...s.badgeClean }}>{result.severity}</span>
                          <span style={{ ...s.badge, background: "var(--theme-white-bg-tint)", color: "var(--brand-text-primary)", border: "1px solid var(--brand-border)" }}>{t("fileAnalysis.yaraIntel")}</span>
                        </div>
                      </div>
                    </>
                  )}
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {result.matches.length > 0 ? result.matches.map((match) => <div key={match} style={{ fontSize: 12, color: "var(--brand-text-primary)" }}>â€¢ {match}</div>) : <div style={{ fontSize: 12, color: "var(--brand-text-secondary)" }}>{t("fileAnalysis.noSignatureMatch")}</div>}
                </div>
              </div>

              <div style={s.resultCard}>
                <h3 style={{ fontFamily: "var(--font-outfit)", fontWeight: 700, fontSize: 15, color: "var(--brand-text-primary)", borderBottom: "1px solid var(--brand-border)", paddingBottom: 12, marginBottom: 12 }}>{t("fileAnalysis.digitalFingerprints")}</h3>
                <div style={{ display: "flex", flexDirection: "column" as const, gap: 8 }}>
                  <div>
                    <span style={{ fontSize: 9, fontWeight: 600, color: "var(--brand-text-secondary)", textTransform: "uppercase" }}>MD5</span>
                    <div style={s.hashBox}>{result.hashes.md5 || "â€”"}</div>
                  </div>
                  <div>
                    <span style={{ fontSize: 9, fontWeight: 600, color: "var(--brand-text-secondary)", textTransform: "uppercase" }}>SHA-1</span>
                    <div style={s.hashBox}>{result.hashes.sha1 || "â€”"}</div>
                  </div>
                  <div>
                    <span style={{ fontSize: 9, fontWeight: 600, color: "var(--brand-text-secondary)", textTransform: "uppercase" }}>SHA-256</span>
                    <div style={s.hashBox}>{result.hashes.sha256 || "â€”"}</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div style={{ display: "flex", gap: 12, marginTop: 20, borderTop: "1px solid var(--brand-border)", paddingTop: 20, flexWrap: "wrap" }}>
            <button onClick={handleReset} style={{ padding: "10px 16px", background: "var(--theme-white-bg-tint)", border: "1px solid var(--brand-border)", borderRadius: 8, color: "var(--brand-text-primary)", fontWeight: 600, fontSize: 13, cursor: "pointer" }}>
              {t("fileAnalysis.scanAnother")}
            </button>
            {status === "done" && (
              <button type="button" onClick={handleExportReport} style={{ padding: "10px 16px", background: "var(--brand-text-primary)", border: "none", borderRadius: 8, color: "var(--brand-abyssal)", fontWeight: 700, fontSize: 13, cursor: "pointer", display: "flex", alignItems: "center", gap: 8 }} className="sm:ml-auto">
                <Download size={14} />
                <span>{t("fileAnalysis.exportReport")}</span>
              </button>
            )}
          </div>

          {status === "done" && (
            <div style={{ borderTop: "1px solid var(--brand-border)", paddingTop: 16, display: "flex", flexDirection: "column", gap: 8 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: "var(--brand-text-primary)" }}>{t("fileAnalysis.operationalNotes")}</div>
              {result.notes.map((note) => (
                <div key={note} style={{ fontSize: 12, color: "var(--brand-text-secondary)" }}>â€¢ {note}</div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
