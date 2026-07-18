import React, { useState, useEffect } from 'react';

const CookieConsent: React.FC = () => {
  const [showConsent, setShowConsent] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('velora_cookie_consent');
    if (!consent) {
      setShowConsent(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('velora_cookie_consent', 'accepted');
    setShowConsent(false);
  };

  const handleDecline = () => {
    localStorage.setItem('velora_cookie_consent', 'declined');
    setShowConsent(false);
  };

  if (!showConsent) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-brand-card border-t border-brand-border p-4 md:p-6 z-50">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="text-sm text-brand-text-secondary">
          <span className="text-brand-text-primary font-semibold">Velora</span> utilise des cookies pour améliorer votre expérience. En continuant, vous acceptez notre politique de confidentialité.
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleDecline}
            className="px-4 py-2 rounded-lg border border-brand-border text-brand-text-secondary text-sm hover:bg-theme-tint transition-colors cursor-pointer"
          >
            Refuser
          </button>
          <button
            onClick={handleAccept}
            className="px-4 py-2 rounded-lg bg-brand-cyan text-brand-abyssal text-sm font-semibold hover:brightness-110 transition-colors cursor-pointer"
          >
            Accepter
          </button>
        </div>
      </div>
    </div>
  );
};

export default CookieConsent;
