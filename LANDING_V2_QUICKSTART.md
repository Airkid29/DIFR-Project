# 🚀 DIFR Landing V2 - Quick Start

## ⚡ Démarrer Rapidement

### 1️⃣ Installer les dépendances (si pas déjà fait)

```bash
cd "c:\Users\rachi\Desktop\DIFR Project\frontend"
npm install
```

### 2️⃣ Démarrer le serveur de développement

```bash
npm run dev
```

Vous verrez quelque chose comme :
```
VITE v8.1.0  ready in 234 ms

  ➜  Local:   http://localhost:5173/
  ➜  press h to show help
```

### 3️⃣ Ouvrir la landing page V2

```
http://localhost:5173/landing-v2
```

---

## 🎨 Tester le Mode Clair/Sombre

### Manière 1 : Via le Toggle du Layout (Recommandé)
1. Connectez-vous à l'app
2. Utilisez le toggle Moon/Sun dans le header
3. Retournez à `/landing-v2`
4. Le thème est appliqué ! 🌙

### Manière 2 : Directement via localStorage

1. Ouvrez DevTools (F12)
2. Allez à Console
3. Exécutez :
```javascript
// Mode Clair
localStorage.setItem("theme", "light");
window.location.reload();

// Mode Sombre (défaut)
localStorage.setItem("theme", "dark");
window.location.reload();
```

---

## 📝 Personnaliser le Contenu

### Option 1 : Éditer le Titre Principal

Fichier : `frontend/src/pages/LandingV2.tsx`

Cherchez :
```typescript
<h1 className="landing-h1">
  Detect threats. <span className="landing-metallic">Respond faster.</span> Stay secure.
</h1>
```

Remplacez par votre titre.

### Option 2 : Utiliser la Configuration

Fichier : `frontend/src/config/landingConfig.ts`

```typescript
export const LANDING_CONFIG = {
  hero: {
    title: "Votre nouveau titre",
    subtitle: "Votre nouvelle description"
  }
  // ... modifier d'autres sections
};
```

Puis utilisez-la dans le composant.

### Option 3 : Éditer les Couleurs

Fichier : `frontend/src/styles/landingv2.css`

Au début du fichier, modifiez :
```css
.landing-v2 {
  --landing-gold: #votre-couleur-hex;
  --landing-mint: #votre-couleur-hex;
}

.landing-v2[data-theme="light"] {
  --landing-gold: #votre-couleur-hex-light;
  --landing-mint: #votre-couleur-hex-light;
}
```

---

## 📂 Structure Rapidement Expliquée

```
DIFR Project/
├── frontend/
│   └── src/
│       ├── pages/
│       │   ├── LandingV2.tsx        ← Page principale (à éditer)
│       │   ├── Landing.tsx          ← Ancienne landing
│       │   ├── Dashboard.tsx        ← Autre pages...
│       │   └── ...
│       ├── styles/
│       │   └── landingv2.css        ← Styles (à éditer)
│       ├── config/
│       │   └── landingConfig.ts     ← Configuration (à éditer)
│       └── App.tsx                  ← Routes (déjà modifié)
└── LANDING_V2_*.md                  ← Documentation

```

---

## ✅ Checklist de Vérification

- [ ] Dépendances installées : `npm install`
- [ ] Serveur démarré : `npm run dev`
- [ ] Landing V2 accessible : `http://localhost:5173/landing-v2`
- [ ] Thème clair testé
- [ ] Thème sombre testé
- [ ] Responsive (F12 → Toggle device toolbar)
- [ ] Tous les boutons cliquables
- [ ] Animations fluides
- [ ] Pas d'erreurs console (F12 → Console)

---

## 🐛 Troubleshooting Rapide

### ❌ "Cannot find module 'styles/landingv2.css'"

**Solution** : Vérifier le chemin dans LandingV2.tsx

```typescript
import "../styles/landingv2.css"; // ✅ Bon
import "./styles/landingv2.css";  // ❌ Mauvais
```

### ❌ "React is not defined"

**Solution** : Ajouter l'import en haut du fichier

```typescript
import React from "react"; // ✅ Ajouter ça
```

### ❌ Thème ne change pas

**Solution** : Vérifier localStorage

```javascript
// Dans la console
localStorage.getItem("theme") // Devrait retourner "light" ou "dark"
```

### ❌ Animations saccadées

**Solution** : Réduire les effets

Dans `landingv2.css`, réduire la duración des animations ou fermer les DevTools.

---

## 📊 Voir les Fichiers Changés

Fichiers **créés** :
```
✅ frontend/src/pages/LandingV2.tsx
✅ frontend/src/styles/landingv2.css
✅ frontend/src/config/landingConfig.ts
✅ LANDING_V2_README.md
✅ LANDING_V2_CHANGES.md
✅ LANDING_V2_MAINTENANCE.md
✅ LANDING_V2_DELIVERY.md (ce fichier)
```

Fichiers **modifiés** :
```
✏️ frontend/src/App.tsx (import + route ajoutés)
```

---

## 🎯 Prochaines Étapes

### Immédiat
1. ✅ Vérifier le visuel (http://localhost:5173/landing-v2)
2. ✅ Tester mode clair/sombre
3. ✅ Tester sur mobile (DevTools)

### Court Terme (1-2 jours)
- [ ] Ajouter vos propres couleurs/logos
- [ ] Modifier les textes
- [ ] Ajouter vos vraies statistiques

### Moyen Terme (1-2 semaines)
- [ ] Ajouter des images/illustrations
- [ ] Ajouter des formulaires
- [ ] Setup analytics
- [ ] Tester sur vrais appareils

### Long Terme
- [ ] Remplacer le vieux Landing.tsx
- [ ] Ajouter blog/testimonials
- [ ] Optimisation SEO
- [ ] Déploiement

---

## 📞 Besoin d'Aide ?

### Documentation Disponible

1. **LANDING_V2_README.md** - Overview & Guide utilisateur
2. **LANDING_V2_CHANGES.md** - Récapitulatif technique
3. **LANDING_V2_MAINTENANCE.md** - Guide complet maintenance
4. **LANDING_V2_DELIVERY.md** - Résumé livraison

### Ressources Utiles

- **Lucide Icons** : Chercher des icônes → https://lucide.dev
- **Color Picker** : Convertir couleurs → https://htmlcolorcodes.com
- **Responsive Tester** : Chrome DevTools (F12)
- **CSS Reference** : MDN → https://developer.mozilla.org/en-US/docs/Web/CSS

---

## 💡 Astuces Pro

### 1️⃣ Hot Reload
Vite redécharge automatiquement quand vous changez les fichiers. Pas besoin de rafraîchir !

### 2️⃣ DevTools React
```bash
npm install -g @react-devtools/shell
```

### 3️⃣ Inspecter les Éléments
F12 → Elements → Voir les classes `.landing-*`

### 4️⃣ Mesurer les Performances
F12 → Performance → Record → Interactions → Stop

### 5️⃣ Vérifier l'Accessibilité
F12 → Lighthouse → Run audit

---

## 🎬 Exemple de Flux de Travail

```bash
# 1. Démarrer
cd "c:\Users\rachi\Desktop\DIFR Project\frontend"
npm run dev

# 2. Ouvrir navigateur
http://localhost:5173/landing-v2

# 3. Éditer LandingV2.tsx ou landingv2.css

# 4. Voir les changements en temps réel (hot reload)

# 5. Tester le thème
localStorage.setItem("theme", "light");
window.location.reload();

# 6. Vérifier les erreurs
F12 → Console

# 7. Quand satisfait : npm run build
```

---

## 📈 Résultats Attendus

### Visual
- ✨ Design moderne et professionnel
- ✨ Animations fluides
- ✨ Couleurs cohérentes
- ✨ Textes bien alignés
- ✨ Responsive sur tous les appareils

### Fonctionnel
- ✅ Tous les onglets fonctionnent
- ✅ Thème clair/sombre fonctionne
- ✅ Pas d'erreurs console
- ✅ Performance optimale
- ✅ Pas de layouts cassés

---

**Bonne chance! 🚀 Et bienvenue à la nouvelle landing page V2 ! 🎉**

Besoin d'aide ? Consultez les fichiers de documentation.
