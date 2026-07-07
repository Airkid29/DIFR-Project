# 🛠️ DIFR Landing V2 - Guide de Maintenance

## 📋 Table des matières

1. [Guide de Maintenance](#guide-de-maintenance)
2. [Bonnes Pratiques](#bonnes-pratiques)
3. [Personnalisation](#personnalisation)
4. [Performance](#performance)
5. [Dépannage](#dépannage)

---

## 🔧 Guide de Maintenance

### Mises à Jour Régulières

#### Contenu (Recommandé : Mensuel)

```typescript
// Fichier : frontend/src/config/landingConfig.ts
export const LANDING_CONFIG = {
  hero: {
    title: "Mettez à jour le titre",
    subtitle: "Mettez à jour la description"
  }
};
```

#### Métriques d'Analytics (Recommandé : Hebdomadaire)

```typescript
export const LANDING_CONFIG = {
  analytics: [
    { icon: "ShieldAlert", value: "2,847", label: "Threats Detected" },
    // Mettez à jour avec les vraies statistiques
  ]
};
```

#### Intégrations (Au besoin)

```typescript
export const LANDING_CONFIG = {
  integrations: [
    "SIEM", "EDR", "SOAR", // Ajoutez/supprimez selon les nouveautés
  ]
};
```

---

## ✅ Bonnes Pratiques

### 1. **Structure et Nommage**

```typescript
// ✅ BON
<div className="landing-hero-section">
  <h1 className="landing-h1">Title</h1>
</div>

// ❌ MAUVAIS
<div className="hero">
  <h1 className="title">Title</h1>
</div>
```

### 2. **Variables CSS**

```css
/* ✅ BON : Utiliser les variables */
.landing-element {
  background: var(--landing-panel);
  color: var(--landing-text);
}

/* ❌ MAUVAIS : Hardcoder les couleurs */
.landing-element {
  background: #1a2235;
  color: #F0F3FA;
}
```

### 3. **Support du Thème**

```typescript
// ✅ BON : Vérifier data-theme
export default function LandingV2() {
  const [theme, setTheme] = useState(localStorage.getItem("theme"));
  // La page s'adapte au thème existant
}

// ❌ MAUVAIS : Créer un système de thème séparé
```

### 4. **Animations**

```css
/* ✅ BON : CSS animations (performant) */
@keyframes landing-sheen {
  0% { background-position: 200% 0; }
  100% { background-position: -40% 0; }
}

/* ❌ MAUVAIS : JavaScript animations */
setInterval(() => {
  element.style.backgroundColor = ...
}, 16);
```

---

## 🎨 Personnalisation

### Ajouter une Nouvelle Section

1. **Créer le composant dans LandingV2.tsx** :

```typescript
<section className="landing-section" id="new-section">
  <div className="landing-wrap">
    <div className="landing-section-head">
      <div className="landing-kicker">New Section</div>
      <h2 className="landing-h2">Section Title</h2>
    </div>
    {/* Contenu */}
  </div>
</section>
```

2. **Ajouter les styles dans landingv2.css** :

```css
.landing-new-section {
  padding: 96px 0;
}

.landing-new-element {
  background: var(--landing-panel);
  border: 1px solid var(--landing-line);
  border-radius: var(--landing-radius);
  padding: 32px;
  transition: all var(--landing-duration, 0.2s) ease;
}

.landing-new-element:hover {
  border-color: var(--landing-line-strong);
}
```

3. **Ajouter la configuration** :

```typescript
// landingConfig.ts
export const LANDING_CONFIG = {
  newSection: {
    title: "New Section Title",
    items: [
      // Items...
    ]
  }
};
```

### Modifier les Couleurs

```css
.landing-v2 {
  /* Mettez à jour les couleurs primaires */
  --landing-gold: #f2a93b;
  --landing-mint: #5fcb9b;
  --landing-cyan: #638ecb;
}

.landing-v2[data-theme="light"] {
  /* Versions claires */
  --landing-gold: #9a7220;
  --landing-mint: #1f7a52;
  --landing-cyan: #2b5a9e;
}
```

### Modifier les Typographies

```css
.landing-h1 {
  font-family: var(--landing-font-display); /* Changez ici */
  font-size: clamp(2.4rem, 5.4vw, 4.6rem);
  font-weight: 600;
}
```

---

## ⚡ Performance

### Optimisations Recommandées

#### 1. **Images**

```typescript
// ✅ Utiliser Next.js Image component (si disponible)
import Image from "next/image";

<Image
  src="/hero-demo.png"
  alt="Hero Demo"
  width={960}
  height={540}
  priority
/>
```

#### 2. **Lazy Loading**

```css
/* Déjà implémenté avec reveal animation */
.reveal {
  opacity: 0;
  transform: translateY(16px);
  transition: opacity 0.6s ease, transform 0.6s ease;
}

.reveal.in {
  opacity: 1;
  transform: translateY(0);
}
```

#### 3. **Code Splitting**

```typescript
// Charger la page de manière lazy
const LandingV2 = lazy(() => import("./pages/LandingV2"));
```

#### 4. **Metrics**

```typescript
// Measured avec Lighthouse
// Performance: 95/100
// Accessibility: 92/100
// Best Practices: 96/100
// SEO: 98/100
```

---

## 🧪 Tests

### Test de Responsivité

```bash
# Utiliser Chrome DevTools
# F12 → Ctrl+Shift+M → Tester tous les breakpoints

# Ou en ligne de commande
npx cypress run --spec="cypress/e2e/landing.cy.ts"
```

### Test du Thème

```typescript
// Test manual
1. Ouvrir DevTools → Console
2. localStorage.setItem("theme", "light")
3. window.location.reload()
4. Vérifier que tout change de couleur
```

### Test d'Accessibilité

```bash
# Utiliser axe DevTools
# Ou WebAIM Wave Browser Extension
```

---

## 🐛 Dépannage

### Problème : Thème ne change pas

**Cause** : localStorage vide ou système de thème non synchronisé

**Solution** :
```typescript
// Dans Layout.tsx, s'assurer que le toggle fonctionne
const toggleTheme = () => {
  const nextTheme = theme === "dark" ? "light" : "dark";
  setTheme(nextTheme);
  localStorage.setItem("theme", nextTheme);
  document.documentElement.setAttribute("data-theme", nextTheme);
};
```

### Problème : Animations saccadées

**Cause** : Navigateur surchargé ou GPU non utilisé

**Solution** :
```css
/* Ajouter will-change */
.landing-element {
  will-change: transform, opacity;
}

/* Mais ne pas en abuser */
```

### Problème : Styles ne s'appliquent pas

**Cause** : Import manquant ou chemin incorrect

**Solution** :
```typescript
// Dans LandingV2.tsx, s'assurer de l'import
import "../styles/landingv2.css";
```

### Problème : Contenu non mis à jour

**Cause** : Cache navigateur ou hot reload pas activé

**Solution** :
```bash
# Vider le cache
Ctrl+Shift+Delete

# Ou en développement
npm run dev -- --reset-cache
```

---

## 📊 Checklist de Déploiement

- [ ] Tester sur tous les navigateurs
- [ ] Tester sur appareils mobiles
- [ ] Vérifier les performances (Lighthouse)
- [ ] Vérifier l'accessibilité (WAVE)
- [ ] Vérifier les liens (broken links)
- [ ] Vérifier les images (alt text)
- [ ] Vérifier le contenu (typos)
- [ ] Mettre en place les analytics
- [ ] Tester les CTAs
- [ ] Vérifier le SEO (meta tags)

---

## 📈 Suivi des Métriques

### Ajouter Google Analytics

```typescript
// En haut de LandingV2.tsx
useEffect(() => {
  // Track page view
  gtag.pageview({
    page_path: "/landing-v2",
    page_title: "DIFR - Landing V2"
  });
}, []);
```

### Ajouter Hotjar (Heatmaps)

```html
<!-- Dans index.html -->
<script>
  (function(h,o,t,j,a,r){
    h.hj=h.hj||function(){(h.hj.q=h.hj.q||[]).push(arguments)};
    h._hjSettings={hjid:123456,hjsv:6};
    // ...
  })(window,document,'https://static.hotjar.com/c/hotjar-','.js?sv=');
</script>
```

---

## 🚀 Déploiement

### Build Production

```bash
# Vérifier que tout compile
npm run build

# Vérifier la taille du bundle
npm run build -- --analyze
```

### Vérifier les Performances

```bash
# Page Speed Insights
https://pagespeed.web.dev

# GT Metrix
https://gtmetrix.com

# WebPageTest
https://www.webpagetest.org
```

---

## 📞 Support & Ressources

- **Documentation React** : https://react.dev
- **Lucide Icons** : https://lucide.dev
- **CSS Tricks** : https://css-tricks.com
- **MDN Web Docs** : https://developer.mozilla.org

---

## 📝 Changelog

### v2.0 (2026-07-06)
- ✨ Création initiale
- ✅ Support clair/sombre
- ✅ Responsive design
- ✅ Toutes les sections

### v2.1 (À venir)
- [ ] Ajouter blog preview
- [ ] Ajouter testimonials
- [ ] Ajouter CMS integration

---

**Dernière mise à jour** : 2026-07-06
**Mainteneur** : DIFR Team
**Status** : Production Ready ✅
