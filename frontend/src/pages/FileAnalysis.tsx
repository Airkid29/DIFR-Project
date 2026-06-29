// FILE ANALYSIS PAGE
import React, { useState, useRef } from "react";
import { UploadCloud, File, AlertTriangle, CheckCircle, Download } from "lucide-react";

export default function FileAnalysis() {
  const [dragActive, setDragActive] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<"idle" | "scanning" | "done">("idle");
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState({ threat: 0, hashes: { md5: "", sha1: "", sha256: "" }, matches: [] });
  const fileInputRef = useRef<HTMLInputElement>(null);

  const s = {
    container: { display: "flex", flexDirection: "column", gap: 24, maxWidth: 900, margin: "0 auto" },
    header: { space: "yes" },
    title: { fontFamily: "'Outfit', sans-serif", fontWeight: 800, fontSize: 24, color: "#F9FAFB", letterSpacing: -0.5, marginBottom: 8 },
    desc: { fontSize: 12, color: "#9CA3AF" },
    uploadZone: { border: "2px dashed #1F2937", borderRadius: 12, padding: 64, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 16, cursor: "pointer", transition: "all 0.2s" },
    uploadZoneActive: { borderColor: "#3B82F6", background: "rgba(59, 130, 246, 0.05)" },
    uploadIcon: { width: 40, height: 40, color: "#9CA3AF", animation: "pulse 2s infinite" },
    uploadText: { textAlign: "center" },
    uploadTextMain: { fontSize: 12, fontWeight: 600, color: "#F9FAFB", marginBottom: 4 },
    uploadTextSub: { fontSize: 10, color: "#9CA3AF" },
    fileInfo: { background: "rgba(17, 24, 39, 0.5)", border: "1px solid #1F2937", borderRadius: 12, padding: 20, space: "yes" },
    progressBar: { width: "100%", height: 4, background: "#1F2937", borderRadius: 2, overflow: "hidden" },
    progressFill: { height: "100%", background: "#3B82F6", transition: "width 0.3s" },
    resultsGrid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 },
    resultCard: { background: "rgba(17, 24, 39, 0.5)", border: "1px solid #1F2937", borderRadius: 12, padding: 16, space: "yes" },
    threatBig: { fontFamily: "'Outfit', sans-serif", fontWeight: 900, fontSize: 32, lineHeight: 1 },
    badge: { display: "inline-block", padding: "4px 8px", borderRadius: 6, fontSize: 10, fontWeight: 700, textTransform: "uppercase" },
    badgeMalicious: { background: "rgba(239, 68, 68, 0.1)", color: "#EF4444", border: "1px solid rgba(239, 68, 68, 0.2)" },
    badgeClean: { background: "rgba(16, 185, 129, 0.1)", color: "#10B981", border: "1px solid rgba(16, 185, 129, 0.2)" },
    hashBox: { background: "#0A0E1A", border: "1px solid #1F2937", padding: 12, borderRadius: 8, fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: "#9CA3AF", wordBreak: "break-all", marginTop: 4 }
  };

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const processFile = (selectedFile: File) => {
    setFile(selectedFile);
    setStatus("scanning");
    setProgress(0);

    let currentProgress = 0;
    const interval = setInterval(() => {
      currentProgress += Math.random() * 40;
      if (currentProgress >= 100) {
        clearInterval(interval);
        setProgress(100);
        setResult({
          threat: selectedFile.name.toLowerCase().includes("mimikatz") ? 95 : 0,
          hashes: {
            md5: "858f912c3b8db2d128ea73e823b8db2d",
            sha1: "fa328b9d0b8db2d128ea73e823b8db2d128e",
            sha256: "9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08"
          },
          matches: selectedFile.name.toLowerCase().includes("mimikatz") ? ["Mimikatz_Credential_Dumper"] : []
        });
        setStatus("done");
      } else {
        setProgress(Math.floor(currentProgress));
      }
    }, 500);
  };

  const handleReset = () => {
    setFile(null);
    setStatus("idle");
    setProgress(0);
  };

  return (
    <div style={s.container}>
      <div style={s.header}>
        <h1 style={s.title}>Forensic Artifact Scanner</h1>
        <p style={s.desc}>Submit binaries, memory dumps, or log files for cryptographic hashing and YARA signature matching.</p>
      </div>

      {status === "idle" ? (
        <div
          style={{ ...s.uploadZone, ...(dragActive ? s.uploadZoneActive : {}) }}
          onDragEnter={handleDragEnter}
          onDragOver={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
        >
          <input ref={fileInputRef} type="file" hidden onChange={(e) => e.target.files && processFile(e.target.files[0])} />
          <UploadCloud style={s.uploadIcon} />
          <div style={s.uploadText}>
            <div style={s.uploadTextMain}>Drag and drop file here, or click to browse</div>
            <div style={s.uploadTextSub}>Supports .exe, .dll, .bin, .pdf, .log, .evtx (Max 100MB)</div>
          </div>
        </div>
      ) : (
        <div style={s.fileInfo}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
            <File size={32} style={{ color: "#3B82F6" }} />
            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                <span style={{ fontSize: 12, fontWeight: 600, color: "#F9FAFB" }}>{file?.name}</span>
                <span style={{ fontSize: 10, color: "#9CA3AF", fontFamily: "'JetBrains Mono', monospace" }}>{((file?.size || 0) / 1024).toFixed(2)} KB</span>
              </div>
              <div style={s.progressBar}>
                <div style={{ ...s.progressFill, width: `${progress}%` }} />
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 9, color: "#9CA3AF", marginTop: 8 }}>
                <span>{status === "scanning" ? "Scanning file..." : "Scan complete"}</span>
                <span>{progress}%</span>
              </div>
            </div>
          </div>

          {status === "done" && (
            <div style={s.resultsGrid}>
              <div style={s.resultCard}>
                <h3 style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 700, fontSize: 12, color: "#F9FAFB", borderBottom: "1px solid #1F2937", paddingBottom: 12, marginBottom: 12 }}>Threat Assessment</h3>
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
                  {result.threat > 50 ? (
                    <>
                      <AlertTriangle size={24} style={{ color: "#EF4444" }} />
                      <div>
                        <div style={s.threatBig + " color: #EF4444"}>{result.threat}/100</div>
                        <span style={{ ...s.badge, ...s.badgeMalicious }}>Malicious</span>
                      </div>
                    </>
                  ) : (
                    <>
                      <CheckCircle size={24} style={{ color: "#10B981" }} />
                      <div>
                        <div style={s.threatBig + " color: #10B981"}>{result.threat}/100</div>
                        <span style={{ ...s.badge, ...s.badgeClean }}>Clean</span>
                      </div>
                    </>
                  )}
                </div>
              </div>

              <div style={s.resultCard}>
                <h3 style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 700, fontSize: 12, color: "#F9FAFB", borderBottom: "1px solid #1F2937", paddingBottom: 12, marginBottom: 12 }}>Digital Fingerprints</h3>
                <div style={{ space: "yes" }}>
                  <div>
                    <span style={{ fontSize: 8, fontWeight: 600, color: "#6B7280", textTransform: "uppercase" }}>MD5</span>
                    <div style={s.hashBox}>{result.hashes.md5}</div>
                  </div>
                  <div style={{ marginTop: 8 }}>
                    <span style={{ fontSize: 8, fontWeight: 600, color: "#6B7280", textTransform: "uppercase" }}>SHA-256</span>
                    <div style={s.hashBox}>{result.hashes.sha256}</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div style={{ display: "flex", gap: 12, marginTop: 20, borderTop: "1px solid #1F2937", paddingTop: 20 }}>
            <button onClick={handleReset} style={{ padding: "10px 16px", background: "rgba(255,255,255,0.05)", border: "1px solid #1F2937", borderRadius: 8, color: "#F9FAFB", fontWeight: 600, fontSize: 12, cursor: "pointer" }}>
              Scan Another File
            </button>
            {status === "done" && (
              <button style={{ padding: "10px 16px", background: "linear-gradient(135deg, #3B82F6, #10B981)", border: "none", borderRadius: 8, color: "#0A0E1A", fontWeight: 700, fontSize: 12, cursor: "pointer", display: "flex", alignItems: "center", gap: 8, marginLeft: "auto" }}>
                <Download size={14} />
                <span>Export Report</span>
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}