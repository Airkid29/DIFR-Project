import React from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Briefcase, Users, Zap, ShieldCheck } from "lucide-react";

export default function Careers() {
  const navigate = useNavigate();
  return (
    <div style={{ minHeight: "100vh", padding: "48px 24px", background: "radial-gradient(circle at top, rgba(95,203,155,0.16), transparent 35%), var(--brand-abyssal)" }}>
      <div style={{ maxWidth: 860, margin: "0 auto", width: "100%" }}>
        <button type="button" onClick={() => navigate("/")} style={{ display: "inline-flex", alignItems: "center", gap: 8, marginBottom: 24, padding: "8px 16px", borderRadius: 10, border: "1px solid var(--brand-border)", background: "transparent", color: "var(--brand-text-primary)", cursor: "pointer" }}>
          <ArrowLeft size={16} /> Retour à l'accueil
        </button>

        <div style={{ background: "var(--glass-bg)", border: "1px solid var(--brand-border)", borderRadius: 20, padding: "32px 40px", boxShadow: "0 20px 70px rgba(0,0,0,0.25)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
            <Briefcase size={28} color="var(--brand-cyan)" />
            <h1 style={{ fontSize: 32, fontWeight: 800, color: "var(--brand-text-primary)" }}>Carrières chez DFIR-Lab</h1>
          </div>
          <p style={{ color: "var(--brand-text-secondary)", lineHeight: 1.7, fontSize: 16, marginBottom: 32 }}>
            Rejoignez une équipe passionnée dédiée à rendre la cybersécurité plus accessible et plus efficace pour tous.
          </p>

          <section style={{ marginBottom: 36 }}>
            <h2 style={{ fontSize: 22, fontWeight: 700, color: "var(--brand-text-primary)", marginBottom: 20, display: "flex", alignItems: "center", gap: 10 }}>
              <Users size={22} color="var(--brand-cyan)" /> Pourquoi nous rejoindre ?
            </h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 20 }}>
              <div style={{ background: "var(--theme-white-bg-tint)", border: "1px solid var(--brand-border)", borderRadius: 14, padding: 20 }}>
                <h3 style={{ fontSize: 16, fontWeight: 700, color: "var(--brand-text-primary)", marginBottom: 8 }}>Travail à distance</h3>
                <p style={{ color: "var(--brand-text-secondary)", fontSize: 14, lineHeight: 1.6 }}>Travailler depuis n'importe où dans le monde, avec des horaires flexibles.</p>
              </div>
              <div style={{ background: "var(--theme-white-bg-tint)", border: "1px solid var(--brand-border)", borderRadius: 14, padding: 20 }}>
                <h3 style={{ fontSize: 16, fontWeight: 700, color: "var(--brand-text-primary)", marginBottom: 8 }}>Développement professionnel</h3>
                <p style={{ color: "var(--brand-text-secondary)", fontSize: 14, lineHeight: 1.6 }}>Accès à des formations, certifications et conférences dans le domaine de la cybersécurité.</p>
              </div>
              <div style={{ background: "var(--theme-white-bg-tint)", border: "1px solid var(--brand-border)", borderRadius: 14, padding: 20 }}>
                <h3 style={{ fontSize: 16, fontWeight: 700, color: "var(--brand-text-primary)", marginBottom: 8 }}>Équipe dynamique</h3>
                <p style={{ color: "var(--brand-text-secondary)", fontSize: 14, lineHeight: 1.6 }}>Collaborer avec des experts passionnés dans un environnement de travail inclusif.</p>
              </div>
            </div>
          </section>

          <section>
            <h2 style={{ fontSize: 22, fontWeight: 700, color: "var(--brand-text-primary)", marginBottom: 20, display: "flex", alignItems: "center", gap: 10 }}>
              <Zap size={22} color="var(--brand-cyan)" /> Postes ouverts
            </h2>
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div style={{ background: "var(--theme-white-bg-tint)", border: "1px solid var(--brand-border)", borderRadius: 14, padding: 20, cursor: "pointer", transition: "border-color 0.2s ease" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 12, marginBottom: 8 }}>
                  <div>
                    <h3 style={{ fontSize: 18, fontWeight: 700, color: "var(--brand-text-primary)" }}>Développeur Full Stack</h3>
                    <p style={{ color: "var(--brand-text-secondary)", fontSize: 13, marginBottom: 8 }}>
                      <strong style={{ color: "var(--brand-cyan)" }}>Remote · Temps plein</strong>
                    </p>
                  </div>
                  <span style={{ background: "rgba(95,203,155,0.16)", color: "var(--brand-cyan)", fontSize: 11, fontWeight: 700, padding: "4px 10px", borderRadius: 8 }}>Ouvert</span>
                </div>
                <p style={{ color: "var(--brand-text-secondary)", fontSize: 14, lineHeight: 1.6, marginBottom: 12 }}>
                  Contribuez au développement de notre plateforme DFIR, travaillez avec React, TypeScript, FastAPI et plus encore.
                </p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                  <span style={{ background: "var(--brand-abyssal)", border: "1px solid var(--brand-border)", padding: "4px 8px", borderRadius: 6, fontSize: 12, color: "var(--brand-text-secondary)" }}>React</span>
                  <span style={{ background: "var(--brand-abyssal)", border: "1px solid var(--brand-border)", padding: "4px 8px", borderRadius: 6, fontSize: 12, color: "var(--brand-text-secondary)" }}>TypeScript</span>
                  <span style={{ background: "var(--brand-abyssal)", border: "1px solid var(--brand-border)", padding: "4px 8px", borderRadius: 6, fontSize: 12, color: "var(--brand-text-secondary)" }}>FastAPI</span>
                  <span style={{ background: "var(--brand-abyssal)", border: "1px solid var(--brand-border)", padding: "4px 8px", borderRadius: 6, fontSize: 12, color: "var(--brand-text-secondary)" }}>Python</span>
                </div>
              </div>

              <div style={{ background: "var(--theme-white-bg-tint)", border: "1px solid var(--brand-border)", borderRadius: 14, padding: 20, cursor: "pointer", transition: "border-color 0.2s ease" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 12, marginBottom: 8 }}>
                  <div>
                    <h3 style={{ fontSize: 18, fontWeight: 700, color: "var(--brand-text-primary)" }}>Expert(e) en réponse aux incidents</h3>
                    <p style={{ color: "var(--brand-text-secondary)", fontSize: 13, marginBottom: 8 }}>
                      <strong style={{ color: "var(--brand-cyan)" }}>Remote · Temps plein</strong>
                    </p>
                  </div>
                  <span style={{ background: "rgba(95,203,155,0.16)", color: "var(--brand-cyan)", fontSize: 11, fontWeight: 700, padding: "4px 10px", borderRadius: 8 }}>Ouvert</span>
                </div>
                <p style={{ color: "var(--brand-text-secondary)", fontSize: 14, lineHeight: 1.6, marginBottom: 12 }}>
                  Apportez votre expertise DFIR pour aider nos clients à répondre aux incidents de sécurité et à améliorer notre plateforme.
                </p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                  <span style={{ background: "var(--brand-abyssal)", border: "1px solid var(--brand-border)", padding: "4px 8px", borderRadius: 6, fontSize: 12, color: "var(--brand-text-secondary)" }}>DFIR</span>
                  <span style={{ background: "var(--brand-abyssal)", border: "1px solid var(--brand-border)", padding: "4px 8px", borderRadius: 6, fontSize: 12, color: "var(--brand-text-secondary)" }}>Criminalistique numérique</span>
                  <span style={{ background: "var(--brand-abyssal)", border: "1px solid var(--brand-border)", padding: "4px 8px", borderRadius: 6, fontSize: 12, color: "var(--brand-text-secondary)" }}>Threat Intel</span>
                </div>
              </div>

              <div style={{ background: "var(--theme-white-bg-tint)", border: "1px solid var(--brand-border)", borderRadius: 14, padding: 20, cursor: "pointer", transition: "border-color 0.2s ease" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 12, marginBottom: 8 }}>
                  <div>
                    <h3 style={{ fontSize: 18, fontWeight: 700, color: "var(--brand-text-primary)" }}>Designer Product / UX</h3>
                    <p style={{ color: "var(--brand-text-secondary)", fontSize: 13, marginBottom: 8 }}>
                      <strong style={{ color: "var(--brand-cyan)" }}>Remote · Temps plein</strong>
                    </p>
                  </div>
                  <span style={{ background: "rgba(95,203,155,0.16)", color: "var(--brand-cyan)", fontSize: 11, fontWeight: 700, padding: "4px 10px", borderRadius: 8 }}>Ouvert</span>
                </div>
                <p style={{ color: "var(--brand-text-secondary)", fontSize: 14, lineHeight: 1.6, marginBottom: 12 }}>
                  Construisez une expérience utilisateur exceptionnelle pour les professionnels de la cybersécurité et les équipes DFIR.
                </p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                  <span style={{ background: "var(--brand-abyssal)", border: "1px solid var(--brand-border)", padding: "4px 8px", borderRadius: 6, fontSize: 12, color: "var(--brand-text-secondary)" }}>Figma</span>
                  <span style={{ background: "var(--brand-abyssal)", border: "1px solid var(--brand-border)", padding: "4px 8px", borderRadius: 6, fontSize: 12, color: "var(--brand-text-secondary)" }}>Design System</span>
                  <span style={{ background: "var(--brand-abyssal)", border: "1px solid var(--brand-border)", padding: "4px 8px", borderRadius: 6, fontSize: 12, color: "var(--brand-text-secondary)" }}>UX Research</span>
                </div>
              </div>
            </div>
          </section>

          <div style={{ marginTop: 36, paddingTop: 24, borderTop: "1px solid var(--brand-border)" }}>
            <h3 style={{ fontSize: 18, fontWeight: 700, color: "var(--brand-text-primary)", marginBottom: 12, display: "flex", alignItems: "center", gap: 10 }}>
              <ShieldCheck size={20} color="var(--brand-cyan)" /> Postuler
            </h3>
            <p style={{ color: "var(--brand-text-secondary)", lineHeight: 1.7, fontSize: 15 }}>
              Aucun poste ne correspond à vos compétences ? Nous sommes toujours à la recherche de talent ! Envoyez-nous votre candidature spontanée à <strong style={{ color: "var(--brand-cyan)" }}>careers@dfir-lab.com</strong>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
