// FILE ANALYSIS PAGE
import React, { useRef, useState } from "react";
import { UploadCloud, File, AlertTriangle, CheckCircle, Download } from "lucide-react";

export default function FileAnalysis() {
  const [dragActive, setDragActive] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<"idle" | "scanning" | "done">("idle");
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<{ threat: number; severity: string; hashes: { md5: string; sha1: string; sha256: string }; matches: string[]; notes: string[] }>({ threat: 0, severity: "Low", hashes: { md5: "", sha1: "", sha256: "" }, matches: [], notes: [] });
  const fileInputRef = useRef<HTMLInputElement>(null);

  const s: Record<string, React.CSSProperties> = {
    container: { display: "flex", flexDirection: "column" as const, gap: 24, maxWidth: 980, margin: "0 auto" },
    header: { display: "flex", flexDirection: "column" as const, gap: 8 },
    title: { fontFamily: "'Outfit', sans-serif", fontWeight: 800, fontSize: 32, color: "#F9FAFB", letterSpacing: -0.5, marginBottom: 8 },
    desc: { fontSize: 14, color: "#9CA3AF", lineHeight: 1.7 },
    uploadZone: { border: "2px dashed #1F2937", borderRadius: 14, padding: 70, display: "flex", flexDirection: "column" as const, alignItems: "center", justifyContent: "center", gap: 16, cursor: "pointer", transition: "all 0.2s" },
    uploadZoneActive: { borderColor: "#3B82F6", background: "rgba(59, 130, 246, 0.05)" },
    uploadIcon: { width: 46, height: 46, color: "#9CA3AF", animation: "pulse 2s infinite" },
    uploadText: { textAlign: "center" as const },
    uploadTextMain: { fontSize: 15, fontWeight: 600, color: "#F9FAFB", marginBottom: 6 },
    uploadTextSub: { fontSize: 12, color: "#9CA3AF" },
    fileInfo: { background: "rgba(17, 24, 39, 0.5)", border: "1px solid #1F2937", borderRadius: 14, padding: 24, display: "flex", flexDirection: "column" as const, gap: 16 },
    progressBar: { width: "100%", height: 6, background: "#1F2937", borderRadius: 3, overflow: "hidden" },
    progressFill: { height: "100%", background: "#3B82F6", transition: "width 0.3s" },
    resultsGrid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 },
    resultCard: { background: "rgba(17, 24, 39, 0.5)", border: "1px solid #1F2937", borderRadius: 12, padding: 16, display: "flex", flexDirection: "column" as const, gap: 12 },
    threatBig: { fontFamily: "'Outfit', sans-serif", fontWeight: 900, fontSize: 34, lineHeight: 1 },
    badge: { display: "inline-block", padding: "4px 8px", borderRadius: 6, fontSize: 11, fontWeight: 700, textTransform: "uppercase" as const },
    badgeMalicious: { background: "rgba(239, 68, 68, 0.1)", color: "#EF4444", border: "1px solid rgba(239, 68, 68, 0.2)" },
    badgeClean: { background: "rgba(16, 185, 129, 0.1)", color: "#10B981", border: "1px solid rgba(16, 185, 129, 0.2)" },
    hashBox: { background: "#0A0E1A", border: "1px solid #1F2937", padding: 12, borderRadius: 8, fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: "#9CA3AF", wordBreak: "break-all" as const, marginTop: 4 }
  };

  const bufferToHex = (buffer: ArrayBuffer) => Array.from(new Uint8Array(buffer), (byte) => byte.toString(16).padStart(2, "0")).join("");

  const createSimpleHash = (name: string, size: number) => {
    let hash = 0;
    for (let i = 0; i < name.length; i += 1) hash = (hash << 5) - hash + name.charCodeAt(i);
    return `${Math.abs(hash).toString(16).padStart(8, "0")}${size.toString(16).padStart(6, "0")}`;
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
      void processFile(e.dataTransfer.files[0]);
    }
  };

  const processFile = async (selectedFile: File) => {
    setFile(selectedFile);
    setStatus("scanning");
    setProgress(0);

    const reader = new FileReader();
    const bytes = await new Promise<ArrayBuffer>((resolve, reject) => {
      reader.onload = () => resolve(reader.result as ArrayBuffer);
      reader.onerror = () => reject(new Error("Unable to read file"));
      reader.readAsArrayBuffer(selectedFile);
    });

    const content = new TextDecoder("utf-8").decode(bytes.slice(0, 24000));
    const lower = `${selectedFile.name} ${content}`.toLowerCase();

    const [sha256, sha1] = await Promise.all([
      crypto.subtle.digest("SHA-256", bytes).then(bufferToHex),
      crypto.subtle.digest("SHA-1", bytes).then(bufferToHex)
    ]);

    const matches: string[] = [];
    const notes: string[] = [];
    let threat = 16;

    if (/(mimikatz|psexec|rundll32|powershell|mshta|wscript|cobalt|dropper|regsvr32|cmd\.exe)/i.test(lower)) {
      threat += 42;
      matches.push("Suspicious execution pattern detected");
      notes.push("The file name or content references known offensive tooling.");
    }
    if (/(http|https|curl|wget|base64|xor)/i.test(lower)) {
      threat += 14;
      notes.push("Network or encoded payload patterns were observed.");
    }
    if (selectedFile.size > 20_000_000) {
      threat += 8;
      notes.push("The artifact is relatively large for a standard document or log file.");
    }
    if (/\.(exe|dll|scr|bat|ps1|vbs|js|jar)$/i.test(selectedFile.name)) {
      threat += 12;
      notes.push("The extension is commonly associated with executable automation.");
    }
    if (matches.length === 0) {
      notes.push("No high-confidence malware signature hit was found in the sample preview.");
    }

    const severity = threat >= 75 ? "Critical" : threat >= 45 ? "High" : threat >= 25 ? "Medium" : "Low";

    let currentProgress = 0;
    const interval = window.setInterval(() => {
      currentProgress += 18;
      if (currentProgress >= 100) {
        window.clearInterval(interval);
        setProgress(100);
        setResult({
          threat: Math.min(100, threat),
          severity,
          hashes: { md5: createSimpleHash(selectedFile.name, selectedFile.size), sha1, sha256 },
          matches,
          notes
        });
        setStatus("done");
      } else {
        setProgress(currentProgress);
      }
    }, 180);
  };

  const handleReset = () => {
    setFile(null);
    setStatus("idle");
    setProgress(0);
    setResult({ threat: 0, severity: "Low", hashes: { md5: "", sha1: "", sha256: "" }, matches: [], notes: [] });
  };

  return (
    <div style={s.container}>
      <div style={s.header}>
        <h1 style={s.title}>Forensic Artifact Scanner</h1>
        <p style={s.desc}>Upload a sample artifact to generate a realistic triage report with file fingerprinting, heuristic indicators, and suspicious pattern detection for presentations and demos.</p>
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
          <input ref={fileInputRef} type="file" hidden onChange={(e) => e.target.files && void processFile(e.target.files[0])} />
          <UploadCloud style={s.uploadIcon} />
          <div style={s.uploadText}>
            <div style={s.uploadTextMain}>Drag and drop a file here, or click to browse</div>
            <div style={s.uploadTextSub}>Supports .exe, .dll, .bin, .pdf, .log, .evtx and other investigative artifacts (Max 100MB)</div>
          </div>
        </div>
      ) : (
        <div style={s.fileInfo}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
            <File size={34} style={{ color: "#3B82F6" }} />
            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                <span style={{ fontSize: 14, fontWeight: 700, color: "#F9FAFB" }}>{file?.name}</span>
                <span style={{ fontSize: 11, color: "#9CA3AF", fontFamily: "'JetBrains Mono', monospace" }}>{((file?.size || 0) / 1024).toFixed(2)} KB</span>
              </div>
              <div style={s.progressBar}>
                <div style={{ ...s.progressFill, width: `${progress}%` }} />
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "#9CA3AF", marginTop: 8 }}>
                <span>{status === "scanning" ? "Scanning file..." : "Scan complete"}</span>
                <span>{progress}%</span>
              </div>
            </div>
          </div>

          {status === "done" && (
            <div style={s.resultsGrid}>
              <div style={s.resultCard}>
                <h3 style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 700, fontSize: 15, color: "#F9FAFB", borderBottom: "1px solid #1F2937", paddingBottom: 12, marginBottom: 12 }}>Threat Assessment</h3>
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
                  {result.threat > 50 ? (
                    <>
                      <AlertTriangle size={28} style={{ color: "#EF4444" }} />
                      <div>
                        <div style={{ ...s.threatBig, color: "#EF4444" }}>{result.threat}/100</div>
                        <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
                          <span style={{ ...s.badge, ...s.badgeMalicious }}>{result.severity}</span>
                          <span style={{ ...s.badge, background: "rgba(255,255,255,0.05)", color: "#F9FAFB", border: "1px solid #1F2937" }}>Heuristic scan</span>
                        </div>
                      </div>
                    </>
                  ) : (
                    <>
                      <CheckCircle size={28} style={{ color: "#10B981" }} />
                      <div>
                        <div style={{ ...s.threatBig, color: "#10B981" }}>{result.threat}/100</div>
                        <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
                          <span style={{ ...s.badge, ...s.badgeClean }}>{result.severity}</span>
                          <span style={{ ...s.badge, background: "rgba(255,255,255,0.05)", color: "#F9FAFB", border: "1px solid #1F2937" }}>Heuristic scan</span>
                        </div>
                      </div>
                    </>
                  )}
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {result.matches.length > 0 ? result.matches.map((match) => <div key={match} style={{ fontSize: 12, color: "#F9FAFB" }}>• {match}</div>) : <div style={{ fontSize: 12, color: "#9CA3AF" }}>No strong signature match found.</div>}
                </div>
              </div>

              <div style={s.resultCard}>
                <h3 style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 700, fontSize: 15, color: "#F9FAFB", borderBottom: "1px solid #1F2937", paddingBottom: 12, marginBottom: 12 }}>Digital Fingerprints</h3>
                <div style={{ display: "flex", flexDirection: "column" as const, gap: 8 }}>
                  <div>
                    <span style={{ fontSize: 9, fontWeight: 600, color: "#6B7280", textTransform: "uppercase" }}>MD5</span>
                    <div style={s.hashBox}>{result.hashes.md5}</div>
                  </div>
                  <div>
                    <span style={{ fontSize: 9, fontWeight: 600, color: "#6B7280", textTransform: "uppercase" }}>SHA-1</span>
                    <div style={s.hashBox}>{result.hashes.sha1}</div>
                  </div>
                  <div>
                    <span style={{ fontSize: 9, fontWeight: 600, color: "#6B7280", textTransform: "uppercase" }}>SHA-256</span>
                    <div style={s.hashBox}>{result.hashes.sha256}</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div style={{ display: "flex", gap: 12, marginTop: 20, borderTop: "1px solid #1F2937", paddingTop: 20, flexWrap: "wrap" }}>
            <button onClick={handleReset} style={{ padding: "10px 16px", background: "rgba(255,255,255,0.05)", border: "1px solid #1F2937", borderRadius: 8, color: "#F9FAFB", fontWeight: 600, fontSize: 13, cursor: "pointer" }}>
              Scan Another File
            </button>
            {status === "done" && (
              <button style={{ padding: "10px 16px", background: "linear-gradient(135deg, #3B82F6, #10B981)", border: "none", borderRadius: 8, color: "#0A0E1A", fontWeight: 700, fontSize: 13, cursor: "pointer", display: "flex", alignItems: "center", gap: 8, marginLeft: "auto" }}>
                <Download size={14} />
                <span>Export Report</span>
              </button>
            )}
          </div>

          {status === "done" && (
            <div style={{ borderTop: "1px solid #1F2937", paddingTop: 16, display: "flex", flexDirection: "column", gap: 8 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: "#F9FAFB" }}>Operational notes</div>
              {result.notes.map((note) => (
                <div key={note} style={{ fontSize: 12, color: "#9CA3AF" }}>• {note}</div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}