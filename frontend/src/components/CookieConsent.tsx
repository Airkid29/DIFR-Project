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
    <div className="fixed bottom-0 left-0 right-0 z-[9999]">
      <div className="bg-[#1a2235] border-t border-brand-border shadow-2xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex-1">
              <p className="text-sm text-[#8AAEE0] leading-relaxed">
                <span className="text-[#F0F3FA] font-semibold text-base">🍪 Velora</span> utilise des cookies essentiels pour améliorer votre expérience utilisateur et analyser le trafic de notre site. En cliquant sur "Accepter", vous consentez à l'utilisation de ces cookies.
              </p>
            </div>
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <button
                onClick={handleDecline}
                className="flex-1 sm:flex-none px-5 py-2.5 rounded-xl border border-brand-border text-[#8AAEE0] text-sm font-medium hover:bg-[#2a3a55] transition-all duration-200 cursor-pointer"
              >
                Refuser
              </button>
              <button
                onClick={handleAccept}
                className="flex-1 sm:flex-none px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#00f2fe] to-[#4a9e7a] text-[#0f1623] text-sm font-bold hover:shadow-lg hover:shadow-cyan-500/30 transition-all duration-200 cursor-pointer"
              >
                Accepter
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CookieConsent;
