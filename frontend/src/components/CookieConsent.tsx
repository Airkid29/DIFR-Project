import React, { useState, useEffect, useRef } from 'react';

const CookieConsent: React.FC = () => {
  const [showConsent, setShowConsent] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [analytics, setAnalytics] = useState(false);
  const [marketing, setMarketing] = useState(false);
  const bannerRef = useRef<HTMLDivElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  const STORAGE_KEY = "DFIR-Lab_cookie_consent";

  const readConsent = () => {
    try {
      const consent = localStorage.getItem(STORAGE_KEY);
      return consent ? JSON.parse(consent) : null;
    } catch(e) {
      return null;
    }
  };

  const writeConsent = (consent: any) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(consent));
    document.dispatchEvent(new CustomEvent("dfirlab-consent-updated", { detail: consent }));
  };

  useEffect(() => {
    const consent = readConsent();
    if (!consent) {
      requestAnimationFrame(() => {
        setShowConsent(true);
      });
    }
  }, []);

  const acceptAll = () => {
    writeConsent({ necessary: true, analytics: true, marketing: true, date: Date.now() });
    setShowConsent(false);
    setShowModal(false);
  };

  const rejectAll = () => {
    writeConsent({ necessary: true, analytics: false, marketing: false, date: Date.now() });
    setShowConsent(false);
    setShowModal(false);
  };

  const openPreferences = () => {
    const saved = readConsent() || {};
    setAnalytics(!!saved.analytics);
    setMarketing(!!saved.marketing);
    setShowModal(true);
  };

  const savePreferences = () => {
    writeConsent({
      necessary: true,
      analytics: analytics,
      marketing: marketing,
      date: Date.now()
    });
    setShowConsent(false);
    setShowModal(false);
  };

  return (
    <>
      <style>{`
        #rc-banner{ 
          position:fixed; left:20px; right:20px; bottom:20px; z-index:9999; 
          max-width:720px; margin:0 auto; 
          background:var(--brand-card); color:var(--brand-text-primary); 
          border:1px solid var(--brand-border); border-radius:16px; 
          box-shadow:0 30px 60px -20px rgba(0,0,0,0.6); 
          padding:22px 24px; font-family:'Inter',system-ui,sans-serif; 
          display:flex; gap:20px; align-items:center; flex-wrap:wrap; 
          transform:translateY(140%); opacity:0; transition:transform .5s ease, opacity .5s ease; 
        } 
        #rc-banner.show{transform:translateY(0); opacity:1;} 
        #rc-banner .rc-icon{ 
          width:36px; height:36px; flex-shrink:0; border-radius:10px; 
          background:var(--brand-abyssal); border:1px solid var(--brand-border); 
          display:flex; align-items:center; justify-content:center; font-size:16px; 
        } 
        #rc-banner .rc-body{flex:1; min-width:220px;} 
        #rc-banner h3{font-family:'Space Grotesk',sans-serif; font-size:14.5px; font-weight:600; margin:0 0 4px;} 
        #rc-banner p{font-size:13px; line-height:1.55; color:var(--brand-text-secondary); margin:0;} 
        #rc-banner p a{color:var(--brand-text-primary); text-decoration:underline;} 
        #rc-banner .rc-actions{display:flex; gap:10px; flex-wrap:wrap;} 
        #rc-banner button{ 
          font-family:'Inter',sans-serif; font-size:13px; font-weight:500; 
          padding:9px 16px; border-radius:9px; cursor:pointer; border:1px solid var(--brand-border); 
          background:transparent; color:var(--brand-text-primary); transition:all .15s ease; 
          white-space:nowrap; 
        } 
        #rc-banner button:hover{background:rgba(255,255,255,0.05);} 
        #rc-banner .rc-accept{background:var(--brand-cyan); color:#14150f; border-color:transparent;} 
        #rc-banner .rc-accept:hover{filter: brightness(1.1);} 
 
        #rc-modal{ 
          position:fixed; inset:0; z-index:10000; display:none; 
          background:rgba(10,11,10,0.6); backdrop-filter:blur(4px); 
          align-items:center; justify-content:center; padding:20px; 
        } 
        #rc-modal.show{display:flex;} 
        #rc-modal .rc-card{ 
          width:100%; max-width:440px; background:var(--brand-card); border:1px solid var(--brand-border); 
          border-radius:16px; padding:26px; font-family:'Inter',sans-serif; color:var(--brand-text-primary); 
        } 
        #rc-modal h2{font-family:'Space Grotesk',sans-serif; font-size:17px; font-weight:600; margin:0 0 18px;} 
        .rc-row{display:flex; justify-content:space-between; align-items:flex-start; gap:16px; padding:14px 0; border-top:1px solid var(--brand-border);} 
        .rc-row:first-of-type{border-top:none;} 
        .rc-row strong{font-size:13.5px; display:block; margin-bottom:3px;} 
        .rc-row span{font-size:12.5px; color:var(--brand-text-secondary); display:block;} 
        .rc-switch{position:relative; width:38px; height:22px; flex-shrink:0;} 
        .rc-switch input{opacity:0; width:0; height:0;} 
        .rc-switch label{ 
          position:absolute; inset:0; background:var(--brand-abyssal); border:1px solid var(--brand-border); 
          border-radius:100px; cursor:pointer; transition:.2s; 
        } 
        .rc-switch label:before{ 
          content:""; position:absolute; width:14px; height:14px; left:3px; top:3px; 
          background:var(--brand-text-secondary); border-radius:50%; transition:.2s; 
        } 
        .rc-switch input:checked + label{background:rgba(95,203,155,0.18); border-color:var(--brand-cyan);} 
        .rc-switch input:checked + label:before{transform:translateX(16px); background:var(--brand-cyan);} 
        .rc-switch input:disabled + label{opacity:0.5; cursor:not-allowed;} 
        #rc-modal .rc-modal-actions{display:flex; gap:10px; margin-top:22px;} 
        #rc-modal .rc-modal-actions button{flex:1;} 
      `}</style>

      {showConsent && (
        <div id="rc-banner" ref={bannerRef} className={`${showConsent ? 'show' : ''}`} role="dialog" aria-live="polite" aria-label="Préférences cookies">
          <div className="rc-icon">◆</div>
          <div className="rc-body">
            <h3>On utilise des cookies</h3>
            <p>Pour faire tourner la plateforme, mesurer l'usage et améliorer DFIR-Lab. Voir notre politique de confidentialité.</p>
          </div>
          <div className="rc-actions">
            <button type="button" onClick={openPreferences}>Personnaliser</button>
            <button type="button" onClick={rejectAll}>Refuser</button>
            <button type="button" className="rc-accept" onClick={acceptAll}>Accepter tout</button>
          </div>
        </div>
      )}

      {showModal && (
        <div id="rc-modal" ref={modalRef} className={`${showModal ? 'show' : ''}`}>
          <div className="rc-card">
            <h2>Préférences cookies</h2>

            <div className="rc-row">
              <div><strong>Nécessaires</strong><span>Connexion, sécurité, panier de clés API. Toujours actifs.</span></div>
              <div className="rc-switch">
                <input type="checkbox" id="rc-necessary" checked disabled />
                <label htmlFor="rc-necessary"></label>
              </div>
            </div>

            <div className="rc-row">
              <div><strong>Analytics</strong><span>Mesure d'audience et de performance de la plateforme.</span></div>
              <div className="rc-switch">
                <input type="checkbox" id="rc-analytics" checked={analytics} onChange={(e) => setAnalytics(e.target.checked)} />
                <label htmlFor="rc-analytics"></label>
              </div>
            </div>

            <div className="rc-row">
              <div><strong>Marketing</strong><span>Personnalisation des messages et campagnes.</span></div>
              <div className="rc-switch">
                <input type="checkbox" id="rc-marketing" checked={marketing} onChange={(e) => setMarketing(e.target.checked)} />
                <label htmlFor="rc-marketing"></label>
              </div>
            </div>

            <div className="rc-modal-actions">
              <button type="button" onClick={rejectAll}>Refuser tout</button>
              <button type="button" className="rc-accept" onClick={savePreferences}>Enregistrer</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CookieConsent;
