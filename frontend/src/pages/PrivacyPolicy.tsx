import React from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, ShieldCheck } from "lucide-react";

export default function PrivacyPolicy() {
  const navigate = useNavigate();
  return (
    <div style={{ minHeight: "100vh", padding: "48px 24px", background: "radial-gradient(circle at top, rgba(95,203,155,0.16), transparent 35%), var(--brand-abyssal)" }}>
      <div style={{ maxWidth: 860, margin: "0 auto", width: "100%" }}>
        <button type="button" onClick={() => navigate("/")} style={{ display: "inline-flex", alignItems: "center", gap: 8, marginBottom: 24, padding: "8px 16px", borderRadius: 10, border: "1px solid var(--brand-border)", background: "transparent", color: "var(--brand-text-primary)", cursor: "pointer" }}>
          <ArrowLeft size={16} /> Retour à l'accueil
        </button>

        <div style={{ background: "var(--glass-bg)", border: "1px solid var(--brand-border)", borderRadius: 20, padding: "32px 40px", boxShadow: "0 20px 70px rgba(0,0,0,0.25)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
            <ShieldCheck size={28} color="var(--brand-cyan)" />
            <h1 style={{ fontSize: 32, fontWeight: 800, color: "var(--brand-text-primary)" }}>Politique de confidentialité</h1>
          </div>

          <div style={{ color: "var(--brand-text-secondary)", lineHeight: 1.8, fontSize: 15, display: "flex", flexDirection: "column", gap: 20 }}>
            <p>
              Dernière mise à jour : <strong style={{ color: "var(--brand-text-primary)" }}>23 juillet 2026</strong>
            </p>

            <section>
              <h2 style={{ fontSize: 20, fontWeight: 700, color: "var(--brand-text-primary)", marginTop: 28, marginBottom: 12 }}>1. Introduction</h2>
              <p>
                DFIR-Lab (« nous », « notre ») s'engage à protéger la vie privée des utilisateurs (« vous ») de notre plateforme. Cette politique de confidentialité décrit comment nous collectons, utilisons, partageons et protégeons vos données personnelles lors de votre utilisation de DFIR-Lab.
              </p>
            </section>

            <section>
              <h2 style={{ fontSize: 20, fontWeight: 700, color: "var(--brand-text-primary)", marginTop: 28, marginBottom: 12 }}>2. Données que nous collectons</h2>
              <ul style={{ paddingLeft: 20, marginTop: 8, marginBottom: 8 }}>
                <li style={{ marginBottom: 8 }}><strong style={{ color: "var(--brand-text-primary)" }}>Informations de compte :</strong> Nom, adresse e-mail, mot de passe (haché), et autres informations fournies lors de l'inscription.</li>
                <li style={{ marginBottom: 8 }}><strong style={{ color: "var(--brand-text-primary)" }}>Données d'utilisation :</strong> Journaux d'accès, pages visitées, temps passé sur la plateforme, et interactions avec les fonctionnalités.</li>
                <li style={{ marginBottom: 8 }}><strong style={{ color: "var(--brand-text-primary)" }}>Données de preuves et d'investigations :</strong> Fichiers téléversés, hashes, et informations liées aux incidents et investigations (ces données restent sous votre contrôle).</li>
              </ul>
            </section>

            <section>
              <h2 style={{ fontSize: 20, fontWeight: 700, color: "var(--brand-text-primary)", marginTop: 28, marginBottom: 12 }}>3. Utilisation des données</h2>
              <p>Nous utilisons les données collectées pour :</p>
              <ul style={{ paddingLeft: 20, marginTop: 8, marginBottom: 8 }}>
                <li style={{ marginBottom: 8 }}>Fournir, maintenir et améliorer notre plateforme ;</li>
                <li style={{ marginBottom: 8 }}>Gérer votre compte et l'authentification ;</li>
                <li style={{ marginBottom: 8 }}>Communiquer avec vous concernant les mises à jour et les informations importantes ;</li>
                <li style={{ marginBottom: 8 }}>Assurer la sécurité et l'intégrité de la plateforme.</li>
              </ul>
            </section>

            <section>
              <h2 style={{ fontSize: 20, fontWeight: 700, color: "var(--brand-text-primary)", marginTop: 28, marginBottom: 12 }}>4. Partage des données</h2>
              <p>
                Nous ne vendons pas vos données personnelles. Nous pouvons partager vos données dans les cas suivants :
              </p>
              <ul style={{ paddingLeft: 20, marginTop: 8, marginBottom: 8 }}>
                <li style={{ marginBottom: 8 }}>Avec vos consentement explicite ;</li>
                <li style={{ marginBottom: 8 }}>Avec nos fournisseurs de services tiers (hébergement, paiement, etc.) qui respectent la confidentialité des données ;</li>
                <li style={{ marginBottom: 8 }}>Pour répondre à des exigences légales ou réglementaires.</li>
              </ul>
            </section>

            <section>
              <h2 style={{ fontSize: 20, fontWeight: 700, color: "var(--brand-text-primary)", marginTop: 28, marginBottom: 12 }}>5. Sécurité des données</h2>
              <p>
                Nous mettons en œuvre des mesures techniques et organisationnelles appropriées pour protéger vos données contre l'accès non autorisé, la modification, la divulgation ou la destruction. Cela inclut le chiffrement des données en transit et au repos.
              </p>
            </section>

            <section>
              <h2 style={{ fontSize: 20, fontWeight: 700, color: "var(--brand-text-primary)", marginTop: 28, marginBottom: 12 }}>6. Vos droits</h2>
              <p>
                Vous avez le droit d'accéder, de rectifier, de supprimer, de restreindre l'utilisation, de demander la portabilité, ou de vous opposer au traitement de vos données personnelles. Pour exercer ces droits, contactez-nous à privacy@dfir-lab.com.
              </p>
            </section>

            <section>
              <h2 style={{ fontSize: 20, fontWeight: 700, color: "var(--brand-text-primary)", marginTop: 28, marginBottom: 12 }}>7. Cookies</h2>
              <p>
                Nous utilisons des cookies et des technologies similaires pour améliorer votre expérience sur notre plateforme. Pour plus d'informations, consultez notre bannière de consentement aux cookies.
              </p>
            </section>

            <section>
              <h2 style={{ fontSize: 20, fontWeight: 700, color: "var(--brand-text-primary)", marginTop: 28, marginBottom: 12 }}>8. Modifications de cette politique</h2>
              <p>
                Nous pouvons mettre à jour cette politique de confidentialité de temps à autre. Nous vous informerons des modifications importantes par e-mail ou par une notification sur notre plateforme.
              </p>
            </section>

            <section>
              <h2 style={{ fontSize: 20, fontWeight: 700, color: "var(--brand-text-primary)", marginTop: 28, marginBottom: 12 }}>9. Contact</h2>
              <p>
                Pour toute question concernant cette politique de confidentialité, veuillez nous contacter à : <strong style={{ color: "var(--brand-cyan)" }}>rachidbawa80@gmail.com</strong>
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
