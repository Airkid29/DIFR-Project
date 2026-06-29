// EVIDENCE PAGE
import React, { useState } from "react";
import { Database, Plus, Search, ShieldCheck, Download, X, Loader } from "lucide-react";

interface EvidenceItem {
  id: string;
  name: string;
  category: string;
  collector: string;
  date_collected: string;
  sha256_hash: string;
  custodian: string;
  verified: boolean;
  custody_chain: any[];
}

export default function Evidence() {
  const [evidence, setEvidence] = useState<EvidenceItem[]>([
    {
      id: "EVID-9021",
      name: "Corporate DC01 SSD dump",
      category: "Disk Image",
      collector: "R. Jenkins",
      date_collected: "2026-06-27T02:50:00.000Z",
      sha256_hash: "9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08",
      custodian: "Inspector Sarah Vance",
      verified: true,
      custody_chain: [
        { id: 1, date: "2026-06-27T02:50:00.000Z", from: "Acquisition", to: "R. Jenkins", action: "Initial acquisition & cryptographic hashing" }
      ]
    }
  ]);

  const [search, setSearch] = useState("");
  const [selectedItem, setSelectedItem] = useState<EvidenceItem | null>(null);
  const [isRegistering, setIsRegistering] = useState(false);

  const s = {
    container: { display: "flex", flexDirection: "column", gap: 24 },
    header: { display: "flex", justifyContent: "space-between", alignItems: "flex-start" },
    headerText: { flex: 1 },
    title: { fontFamily: "'Outfit', sans-serif", fontWeight: 800, fontSize: 28, color: "#F9FAFB", letterSpacing: -1, marginBottom: 8 },
    desc: { fontSize: 11, color: "#9CA3AF" },
    btn: { padding: "10px 16px", background: "linear-gradient(135deg, #3B82F6, #10B981)", border: "none", borderRadius: 8, color: "#0A0E1A", fontWeight: 700, fontSize: 12, cursor: "pointer", display: "flex", alignItems: "center", gap: 8 },
    splitGrid: { display: "grid", gridTemplateColumns: "2fr 1fr", gap: 24 },
    controlBar: { background: "rgba(17, 24, 39, 0.5)", border: "1px solid #1F2937", borderRadius: 12, padding: 16 },
    searchWrap: { position: "relative" },
    input: { width: "100%", padding: "8px 12px 8px 36px", background: "#0A0E1A", border: "1px solid #1F2937", borderRadius: 8, fontSize: 12, color: "#F9FAFB", outline: "none" },
    evidenceCard: { background: "rgba(17, 24, 39, 0.5)", border: "1px solid #1F2937", borderRadius: 12, padding: 16, cursor: "pointer", transition: "all 0.2s", marginBottom: 12, display: "flex", justifyContent: "space-between" },
    badge: { display: "inline-block", padding: "4px 8px", borderRadius: 6, fontSize: 9, fontWeight: 700, background: "rgba(59, 130, 246, 0.1)", color: "#3B82F6", border: "1px solid rgba(59, 130, 246, 0.2)", textTransform: "uppercase" },
    badgeVerified: { background: "rgba(16, 185, 129, 0.1)", color: "#10B981", border: "1px solid rgba(16, 185, 129, 0.2)" },
    detailPanel: { background: "rgba(17, 24, 39, 0.5)", border: "1px solid #1F2937", borderRadius: 12, padding: 20 },
    panelTitle: { fontFamily: "'Outfit', sans-serif", fontWeight: 700, fontSize: 14, color: "#F9FAFB", borderBottom: "1px solid #1F2937", paddingBottom: 12, marginBottom: 16 }
  };

  const filtered = evidence.filter(e => e.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div style={s.container}>
      <div style={s.header}>
        <div style={s.headerText}>
          <h1 style={s.title}>Chain of Custody Repository</h1>
          <p style={s.desc}>Immutable registry ensuring cryptographic integrity and audit trails of case materials.</p>
        </div>
        <button style={s.btn} onClick={() => setIsRegistering(true)}>
          <Plus size={16} />
          <span>Register Evidence</span>
        </button>
      </div>

      <div style={s.splitGrid}>
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={s.controlBar}>
            <div style={s.searchWrap}>
              <Search size={16} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "#9CA3AF" }} />
              <input type="text" style={s.input} placeholder="Search registered evidence..." value={search} onChange={(e) => setSearch(e.target.value)} />
            </div>
          </div>

          <div>
            {filtered.map((item) => (
              <div key={item.id} style={{ ...s.evidenceCard, borderColor: selectedItem?.id === item.id ? "#3B82F6" : "#1F2937", background: selectedItem?.id === item.id ? "rgba(59, 130, 246, 0.05)" : "rgba(17, 24, 39, 0.5)" }} onClick={() => setSelectedItem(item)}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                    <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, fontWeight: 700, color: "#3B82F6" }}>{item.id}</span>
                    <span style={s.badge}>{item.category}</span>
                    {item.verified && <span style={{ ...s.badge, ...s.badgeVerified }}>✓ Verified</span>}
                  </div>
                  <h3 style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 700, fontSize: 14, color: "#F9FAFB", marginBottom: 8 }}>{item.name}</h3>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, fontSize: 10 }}>
                    <div><span style={{ color: "#6B7280", fontWeight: 600, textTransform: "uppercase" }}>Custodian</span><p style={{ color: "#F9FAFB", fontWeight: 600, marginTop: 4 }}>{item.custodian}</p></div>
                    <div><span style={{ color: "#6B7280", fontWeight: 600, textTransform: "uppercase" }}>SHA-256</span><p style={{ color: "#9CA3AF", fontFamily: "'JetBrains Mono', monospace", marginTop: 4, fontSize: 9 }}>{item.sha256_hash.slice(0, 16)}...</p></div>
                  </div>
                </div>
                <div style={{ width: 40, height: 40, background: "rgba(255,255,255,0.05)", border: "1px solid #1F2937", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", color: "#9CA3AF" }}>
                  <Database size={18} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          {selectedItem ? (
            <div style={s.detailPanel}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, fontWeight: 700, color: "#3B82F6" }}>{selectedItem.id} Detail</span>
                <button style={{ background: "none", border: "none", color: "#3B82F6", cursor: "pointer", display: "flex", alignItems: "center", gap: 4, fontSize: 10 }}>
                  <Download size={14} />
                  <span>PDF Audit</span>
                </button>
              </div>

              <h3 style={s.panelTitle}>{selectedItem.name}</h3>

              <div style={{ space: "yes" }}>
                <label style={{ fontSize: 9, fontWeight: 700, color: "#6B7280", textTransform: "uppercase", display: "block", marginBottom: 12 }}>Custody Timeline</label>
                <div style={{ borderLeft: "2px solid #1F2937", paddingLeft: 16, display: "flex", flexDirection: "column", gap: 16 }}>
                  {selectedItem.custody_chain.map((hist: any) => (
                    <div key={hist.id} style={{ position: "relative" }}>
                      <div style={{ position: "absolute", left: -23, top: 6, width: 8, height: 8, background: "#3B82F6", borderRadius: "50%" }} />
                      <div style={{ fontSize: 11, fontWeight: 600, color: "#F9FAFB", marginBottom: 4 }}>{hist.to}</div>
                      <div style={{ fontSize: 9, color: "#9CA3AF", fontFamily: "'JetBrains Mono', monospace" }}>From {hist.from} - {hist.action}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div style={{ ...s.detailPanel, textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: 300 }}>
              <Database size={32} style={{ opacity: 0.2, marginBottom: 12 }} />
              <p style={{ fontSize: 12, color: "#9CA3AF" }}>Select evidence to view details</p>
            </div>
          )}
        </div>
      </div>

      {isRegistering && (
        <div style={{ position: "fixed", inset: 0, zIndex: 50, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}>
          <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.6)", backdropFilter: "blur(10px)" }} onClick={() => setIsRegistering(false)} />
          <div style={{ position: "relative", background: "#111827", border: "1px solid #1F2937", borderRadius: 12, padding: 20, maxWidth: 420, width: "100%", zIndex: 10 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16, paddingBottom: 12, borderBottom: "1px solid #1F2937" }}>
              <h3 style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 700, fontSize: 16, color: "#F9FAFB" }}>Register Evidence Item</h3>
              <button onClick={() => setIsRegistering(false)} style={{ background: "none", border: "none", color: "#9CA3AF", cursor: "pointer", fontSize: 20 }}>×</button>
            </div>
            <form style={{ display: "flex", flexDirection: "column", gap: 16 }} onSubmit={(e) => { e.preventDefault(); setIsRegistering(false); }}>
              <div>
                <label style={{ fontSize: 9, fontWeight: 600, color: "#6B7280", textTransform: "uppercase", display: "block", marginBottom: 6 }}>Evidence Name</label>
                <input type="text" style={{ ...s.input, width: "100%" }} placeholder="e.g. Corporate DC01 SSD dump" />
              </div>
              <div>
                <label style={{ fontSize: 9, fontWeight: 600, color: "#6B7280", textTransform: "uppercase", display: "block", marginBottom: 6 }}>Category</label>
                <select style={{ ...s.input, width: "100%" }}>
                  <option>Disk Image</option>
                  <option>RAM Dump</option>
                  <option>Log File</option>
                </select>
              </div>
              <div>
                <label style={{ fontSize: 9, fontWeight: 600, color: "#6B7280", textTransform: "uppercase", display: "block", marginBottom: 6 }}>SHA-256 Hash</label>
                <input type="text" style={{ ...s.input, width: "100%", fontFamily: "'JetBrains Mono', monospace" }} placeholder="64-character hex hash" />
              </div>
              <button style={{ padding: 12, background: "linear-gradient(135deg, #3B82F6, #10B981)", border: "none", borderRadius: 8, color: "#0A0E1A", fontWeight: 700, cursor: "pointer" }}>
                Register & Audit Evidence
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}