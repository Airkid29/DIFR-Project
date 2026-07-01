// THREAT INTELLIGENCE LOOKUP PAGE
import React, { useState } from "react";
import { Search, Globe, Link2, Hash, Server } from "lucide-react";
import { api } from "../utils/api";
import { ps } from "../utils/pageStyles";
import { t } from "../i18n";

type IndicatorType = "hash" | "url" | "domain" | "ip";

type IntelResult = {
  virustotal?: Record<string, unknown>;
  otx?: Record<string, unknown>;
  messages: string[];
};

const typeOptions: { value: IndicatorType; icon: React.ReactNode; label: string }[] = [
  { value: "hash", icon: <Hash size={14} />, label: "SHA-256" },
  { value: "url", icon: <Link2 size={14} />, label: "URL" },
  { value: "domain", icon: <Globe size={14} />, label: "Domaine" },
  { value: "ip", icon: <Server size={14} />, label: "IP" },
];

export default function ThreatIntel() {
  const [indicatorType, setIndicatorType] = useState<IndicatorType>("hash");
  const [indicator, setIndicator] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<IntelResult | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!indicator.trim()) return;
    setError("");
    setLoading(true);
    setResult(null);
    try {
      const endpoint = indicatorType === "hash"
        ? "/api/intel/hash"
        : "/api/intel/lookup";
      const body = indicatorType === "hash"
        ? { sha256_hash: indicator.trim() }
        : { indicator: indicator.trim(), indicator_type: indicatorType };
      const data = await api.post(endpoint, body);
      setResult(data);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : t("common.serverError"));
    } finally {
      setLoading(false);
    }
  };

  const vt = result?.virustotal as Record<string, unknown> | undefined;
  const otx = result?.otx as Record<string, unknown> | undefined;

  return (
    <div style={ps.container}>
      <div style={ps.header}>
        <div>
          <h1 style={ps.title}>{t("threatIntel.title")}</h1>
          <p style={ps.desc}>{t("threatIntel.desc")}</p>
        </div>
      </div>

      <form onSubmit={handleSearch} style={{ ...ps.card, display: "flex", flexDirection: "column", gap: 16 }}>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {typeOptions.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => setIndicatorType(opt.value)}
              style={{
                ...ps.btnSecondary,
                background: indicatorType === opt.value ? "rgba(99, 142, 203, 0.15)" : ps.btnSecondary.background,
                borderColor: indicatorType === opt.value ? "var(--brand-cyan)" : "var(--brand-border)",
                color: indicatorType === opt.value ? "var(--brand-cyan)" : "var(--brand-text-primary)",
              }}
            >
              {opt.icon}
              {opt.label}
            </button>
          ))}
        </div>

        <div style={{ position: "relative" }}>
          <Search
            size={16}
            style={{
              position: "absolute",
              left: 12,
              top: "50%",
              transform: "translateY(-50%)",
              color: "var(--brand-text-secondary)",
            }}
          />
          <input
            type="text"
            value={indicator}
            onChange={(e) => setIndicator(e.target.value)}
            placeholder={t(`threatIntel.placeholder.${indicatorType}`)}
            style={{ ...ps.input, paddingLeft: 40 }}
            disabled={loading}
          />
        </div>

        <button type="submit" style={ps.btnPrimary} disabled={loading}>
          {loading ? t("threatIntel.searching") : t("threatIntel.search")}
        </button>

        {error && <div style={{ ...ps.danger, fontSize: 13 }}>{error}</div>}
      </form>

      {result && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 16 }}>
          <div style={ps.card}>
            <h3 style={{ fontWeight: 700, marginBottom: 12, color: "var(--brand-text-primary)" }}>VirusTotal</h3>
            {vt ? (
              <div style={{ display: "flex", flexDirection: "column", gap: 8, fontSize: 13 }}>
                {vt.positives !== undefined && (
                  <div>
                    <span style={ps.muted}>{t("threatIntel.detections")} : </span>
                    <strong style={{ color: Number(vt.positives) > 0 ? "var(--brand-crimson)" : "var(--brand-emerald)" }}>
                      {String(vt.positives)}/{String(vt.total || "?")}
                    </strong>
                  </div>
                )}
                {vt.detected_urls !== undefined && (
                  <div><span style={ps.muted}>URLs détectées : </span>{String(vt.detected_urls)}</div>
                )}
                {typeof vt.country === "string" && vt.country && (
                  <div><span style={ps.muted}>Pays : </span>{vt.country}</div>
                )}
                {typeof vt.as_owner === "string" && vt.as_owner && (
                  <div><span style={ps.muted}>AS : </span>{vt.as_owner}</div>
                )}
                {typeof vt.permalink === "string" && vt.permalink && (
                  <a href={vt.permalink} target="_blank" rel="noreferrer" style={{ color: "var(--brand-cyan)", fontSize: 12 }}>
                    {t("threatIntel.viewReport")}
                  </a>
                )}
                {typeof vt.verbose_msg === "string" && vt.verbose_msg && (
                  <div style={ps.muted}>{vt.verbose_msg}</div>
                )}
              </div>
            ) : (
              <p style={ps.muted}>{t("threatIntel.noVtData")}</p>
            )}
          </div>

          <div style={ps.card}>
            <h3 style={{ fontWeight: 700, marginBottom: 12, color: "var(--brand-text-primary)" }}>AlienVault OTX</h3>
            {otx ? (
              <div style={{ fontSize: 13 }}>
                <div>
                  <span style={ps.muted}>Pulses : </span>
                  <strong style={{ color: Number(otx.pulse_count) > 0 ? "var(--brand-crimson)" : "var(--brand-emerald)" }}>
                    {String(otx.pulse_count ?? 0)}
                  </strong>
                </div>
                {otx.reputation !== undefined && (
                  <div style={{ marginTop: 8 }}><span style={ps.muted}>Réputation : </span>{String(otx.reputation)}</div>
                )}
              </div>
            ) : (
              <p style={ps.muted}>{t("threatIntel.noOtxData")}</p>
            )}
          </div>

          {result.messages.length > 0 && (
            <div style={{ ...ps.card, gridColumn: "1 / -1" }}>
              <h3 style={{ fontWeight: 700, marginBottom: 12, color: "var(--brand-text-primary)" }}>{t("threatIntel.summary")}</h3>
              <ul style={{ margin: 0, paddingLeft: 18, display: "flex", flexDirection: "column", gap: 6 }}>
                {result.messages.map((msg, i) => (
                  <li key={i} style={{ fontSize: 13, color: "var(--brand-text-secondary)" }}>{msg}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
