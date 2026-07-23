# ForensiGuard â€” Système de Design UI (Phase 3)

Ce document spécifie les jetons de design (design tokens) et les composants de ForensiGuard pour assurer une esthétique haut de gamme, moderne et cohérente.

---

## 1. Palette de Couleurs (Mode Sombre par Défaut, Mode Clair Optionnel)

Nous utilisons une palette de couleurs HSL raffinée inspirée de l'esthétique "cyber-sécurité premium" : arrière-plan sombre abyssal, bordures subtiles et accents électriques pour attirer l'attention de l'analyste sans fatigue visuelle.

### Mode Sombre (Default)
* **Background (Abyssal)** : `hsl(222, 47%, 4%)` (un bleu-noir très profond)
* **Card / Secondary Background** : `hsl(222, 47%, 7%)`
* **Border / Divider** : `hsl(217, 32%, 17%)`
* **Text Primary** : `hsl(210, 40%, 98%)` (blanc pur adouci)
* **Text Secondary** : `hsl(215, 20%, 65%)` (gris bleuté)
* **Accent Primary (Neon Cyan)** : `hsl(180, 100%, 50%)` / `#00f2fe` (énergie et action)
* **Accent Success (Emerald)** : `hsl(150, 84%, 44%)` (intégrité vérifiée, pas de menace)
* **Accent Warning (Amber)** : `hsl(38, 92%, 50%)` (triage nécessaire, moyenne priorité)
* **Accent Destructive (Crimson)** : `hsl(346, 84%, 55%)` (règle YARA critique, menace confirmée)
* **Accent Info (Indigo)** : `hsl(226, 70%, 55%)`

### Mode Clair (Optional Toggle)
* **Background** : `hsl(210, 40%, 98%)`
* **Card / Secondary Background** : `hsl(0, 0%, 100%)`
* **Border / Divider** : `hsl(214, 32%, 91%)`
* **Text Primary** : `hsl(222, 47%, 12%)`
* **Text Secondary** : `hsl(215, 16%, 47%)`
* **Accent Primary** : `hsl(221, 83%, 53%)`

---

## 2. Typographie
* **Police Principale & Titres** : `Outfit` (pour les en-têtes et métriques à  fort impact visuel) et `Inter` (pour le texte de labeur et les données).
* **Police Monospace** : `JetBrains Mono` ou `Fira Code` (pour les hashes, règles YARA, dumps de logs, et lignes de commande).
* **à‰chelle des tailles** :
  * `xs` : 12px (légendes, métadonnées)
  * `sm` : 14px (corps de texte par défaut, étiquettes)
  * `base` : 16px (texte de formulaire, boutons)
  * `lg` : 18px (sous-titres de cartes)
  * `xl` : 20px (titres de cartes)
  * `2xl` : 24px (titres d'écrans secondaires)
  * `3xl` : 30px (titres de pages principaux)
  * `4xl` : 36px (chiffres clés du dashboard)

---

## 3. Grille, Espacement & Rayons (Radius)
* **Grille de mise en page** : Système de grille de 12 colonnes standard avec gouttières de `24px` (`gap-6` en Tailwind).
* **à‰chelle d'espacement** : Basée sur un pas de 4px (`4px`, `8px`, `12px`, `16px`, `24px`, `32px`, `48px`, `64px`).
* **Bordures arrondies (Border Radius)** :
  * `radius-sm` : 4px (petits badges, boutons condensés)
  * `radius-md` : 8px (boutons standards, inputs, sélecteurs)
  * `radius-lg` : 12px (cartes, menus déroulants, modales)
  * `radius-xl` : 20px (grandes sections hero de la landing page)

---

## 4. Composants Réutilisables

### A. Boutons (Buttons)
* **Primary** : Fond dégradé subtil `Cyan` vers `Deep Blue`, texte blanc, effet de lueur (glow) discret au survol, transition Framer Motion au clic (`scale: 0.98`).
* **Secondary** : Fond transparent, bordure fine `Border`, texte `Text Primary`, s'illumine en bleu/cyan au survol.
* **Destructive** : Fond rouge cramoisi, texte blanc, s'assombrit au survol.
* **Ghost** : Pas de bordure ni de fond, uniquement du texte qui change de couleur au survol.

### B. Badges de Statut (Status Badges)
* **Badge Critique** : Fond rouge translucide (`hsl(346, 84%, 55%, 0.1)`), bordure rouge fine, pastille clignotante (ping animation) rouge.
* **Badge Warning** : Fond ambre translucide, bordure ambre, pastille fixe ambre.
* **Badge Success** : Fond vert translucide, bordure verte, icà´ne de crochet de validation.

### C. Champs de Formulaire (Form Controls)
* Fond sombre légèrement plus foncé que la carte (`hsl(222, 47%, 5%)`).
* Bordure grise fine, devenant Cyan Néon avec une ombre portée diffuse (ring shadow) lors du focus.
* Texte d'espace réservé (placeholder) en gris bleuté atténué.

### D. Tableaux (Data Tables)
* Lignes séparées par une bordure fine inférieure. Effet de survol (`hover:bg-card/50`).
* En-têtes en majuscules de petite taille, couleur `Text Secondary`.
* Alignement à  gauche pour le texte, à  droite pour les actions et métriques chiffrées, centré pour les badges.

### E. Cartes Métriques (Metric Cards)
* Fond de carte avec effet de flou de verre (glassmorphic gradient) : dégradé linéaire transparent sur fond sombre, bordure fine réfléchissante.
* Contient une icà´ne vectorielle stylisée dans le coin supérieur droit, la valeur principale en grand et un indicateur de tendance (ex. +12% vs semaine dernière).

---

## 5. Animations & Transitions (Framer Motion Configuration)
Pour garantir une navigation ultra-fluide et premium, toutes les transitions d'écrans et d'éléments interactifs respectent les spécifications de mouvement suivantes :

* **Transitions de Pages (Router)** :
  * Entrée : Opacité de 0 à  1, translation y de 10px à  0px. Durée: 0.25s, courbe `easeOut`.
* **Panneaux Latéraux (Drawers)** :
  * Glissement depuis la droite (`x: "100%"` vers `0`). Durée: 0.3s, courbe `anticipate`.
* **Modales** :
  * à‰chelle de 0.95 à  1, opacité de 0 à  1. Durée: 0.2s, courbe `easeOut`.
* **Boutons & à‰léments Cliquables** :
  * Survol : Augmentation de la luminosité ou léger décalage vers le haut (`y: -1px`), lueur douce.
  * Clic : Effet de ressort (`spring` avec `stiffness: 400`, `damping: 15`), réduction d'échelle à  `0.98`.
