import React from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, FileText } from "lucide-react";

export default function TermsOfService() {
  const navigate = useNavigate();
  return (
    <div style={{ minHeight: "100vh", padding: "48px 24px", background: "radial-gradient(circle at top, rgba(95,203,155,0.16), transparent 35%), var(--brand-abyssal)" }}>
      <div style={{ maxWidth: 860, margin: "0 auto", width: "100%" }}>
        <button type="button" onClick={() => navigate("/")} style={{ display: "inline-flex", alignItems: "center", gap: 8, marginBottom: 24, padding: "8px 16px", borderRadius: 10, border: "1px solid var(--brand-border)", background: "transparent", color: "var(--brand-text-primary)", cursor: "pointer" }}>
          <ArrowLeft size={16} /> Retour à l'accueil
        </button>

        <div style={{ background: "var(--glass-bg)", border: "1px solid var(--brand-border)", borderRadius: 20, padding: "32px 40px", boxShadow: "0 20px 70px rgba(0,0,0,0.25)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
            <FileText size={28} color="var(--brand-cyan)" />
            <h1 style={{ fontSize: 32, fontWeight: 800, color: "var(--brand-text-primary)" }}>Conditions d'utilisation</h1>
          </div>

          <div style={{ color: "var(--brand-text-secondary)", lineHeight: 1.8, fontSize: 15, display: "flex", flexDirection: "column", gap: 20 }}>
            <p>
              Dernière mise à jour : <strong style={{ color: "var(--brand-text-primary)" }}>23 juillet 2026</strong>
            </p>

            <section>
              <h2 style={{ fontSize: 20, fontWeight: 700, color: "var(--brand-text-primary)", marginTop: 28, marginBottom: 12 }}>1. Acceptation des conditions</h2>
              <p>
                En accédant et en utilisant la plateforme DFIR-Lab, vous acceptez sans réserve ces conditions d'utilisation. Si vous n'acceptez pas ces conditions, veuillez ne pas utiliser notre service.
              </p>
            </section>

            <section>
              <h2 style={{ fontSize: 20, fontWeight: 700, color: "var(--brand-text-primary)", marginTop: 28, marginBottom: 12 }}>2. Description du service</h2>
              <p>
                DFIR-Lab fournit une plateforme de réponse aux incidents et de criminalistique numérique, incluant :
              </p>
              <ul style={{ paddingLeft: 20, marginTop: 8, marginBottom: 8 }}>
                <li style={{ marginBottom: 8 }}>Gestion des incidents et investigations ;</li>
                <li style={{ marginBottom: 8 }}>Analyse de fichiers et de preuves numériques ;</li>
                <li style={{ marginBottom: 8 }}>Intelligence sur les menaces ;</li>
                <li style={{ marginBottom: 8 }}>Rapports et exportations.</li>
              </ul>
            </section>

            <section>
              <h2 style={{ fontSize: 20, fontWeight: 700, color: "var(--brand-text-primary)", marginTop: 28, marginBottom: 12 }}>3. Compte utilisateur</h2>
              <p>
                Pour utiliser certaines fonctionnalités, vous devez créer un compte. Vous êtes responsable de la sécurité de votre compte et de votre mot de passe. Nous ne pouvons pas être tenus responsables de toute perte ou dommage résultant de votre non-respect de cette obligation.
              </p>
            </section>

            <section>
              <h2 style={{ fontSize: 20, fontWeight: 700, color: "var(--brand-text-primary)", marginTop: 28, marginBottom: 12 }}>4. Utilisation autorisée</h2>
              <p>Vous acceptez d'utiliser la plateforme DFIR-Lab uniquement à des fins légales et conformément à ces conditions. Vous ne devez pas :</p>
              <ul style={{ paddingLeft: 20, marginTop: 8, marginBottom: 8 }}>
                <li style={{ marginBottom: 8 }}>Utiliser la plateforme pour des activités illégales ;</li>
                <li style={{ marginBottom: 8 }}>Tenter d'accéder à des zones non autorisées de la plateforme ;</li>
                <li style={{ marginBottom: 8 }}>Interférer avec le fonctionnement normal de la plateforme ;</li>
                <li style={{ marginBottom: 8 }}>Utiliser la plateforme pour envoyer du spam ou des communications non sollicitées.</li>
              </ul>
            </section>

            <section>
              <h2 style={{ fontSize: 20, fontWeight: 700, color: "var(--brand-text-primary)", marginTop: 28, marginBottom: 12 }}>5. Propriété intellectuelle</h2>
              <p>
                Tous les droits de propriété intellectuelle sur la plateforme DFIR-Lab (code, design, contenu, marques, etc.) restent la propriété exclusive de DFIR-Lab ou de ses concédants. Vous n'êtes autorisé à utiliser que les droits expressément accordés dans ces conditions.
              </p>
            </section>

            <section>
              <h2 style={{ fontSize: 20, fontWeight: 700, color: "var(--brand-text-primary)", marginTop: 28, marginBottom: 12 }}>6. Limitation de responsabilité</h2>
              <p>
                Dans les limites permises par la loi, DFIR-Lab ne peut être tenu responsable des dommages directs ou indirects résultant de l'utilisation ou de l'impossibilité d'utiliser la plateforme.
              </p>
            </section>

            <section>
              <h2 style={{ fontSize: 20, fontWeight: 700, color: "var(--brand-text-primary)", marginTop: 28, marginBottom: 12 }}>7. Modifications des conditions</h2>
              <p>
                Nous nous réservons le droit de modifier ces conditions d'utilisation à tout moment. Les modifications prendront effet dès leur publication sur la plateforme. Votre utilisation continue de la plateforme après ces modifications constitue votre acceptation des nouvelles conditions.
              </p>
            </section>

            <section>
              <h2 style={{ fontSize: 20, fontWeight: 700, color: "var(--brand-text-primary)", marginTop: 28, marginBottom: 12 }}>8. Résiliation</h2>
              <p>
                Nous nous réservons le droit de suspendre ou de résilier votre accès à la plateforme, à notre seule discrétion, sans préavis, pour toute violation de ces conditions d'utilisation.
              </p>
            </section>

            <section>
              <h2 style={{ fontSize: 20, fontWeight: 700, color: "var(--brand-text-primary)", marginTop: 28, marginBottom: 12 }}>9. Droit applicable</h2>
              <p>
                Ces conditions d'utilisation sont régies par le droit français. Tout litige relatif à ces conditions sera soumis à la compétence des tribunaux de Paris.
              </p>
            </section>

            <section>
              <h2 style={{ fontSize: 20, fontWeight: 700, color: "var(--brand-text-primary)", marginTop: 28, marginBottom: 12 }}>10. Contact</h2>
              <p>
                Pour toute question concernant ces conditions d'utilisation, veuillez nous contacter à : <strong style={{ color: "var(--brand-cyan)" }}>contact@dfir-lab.com</strong>
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
