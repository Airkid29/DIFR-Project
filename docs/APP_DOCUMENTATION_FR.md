## Documentation complète de Velora (FR)

Objectif : documentation détaillée couvrant l'architecture, le développement local, le déploiement, la sécurité et les changements de responsivité appliqués à la landing.

1) Vue d'ensemble
- Nom du projet : Velora / DIFR (Digital Incident & Forensics Response)
- Stack : React + TypeScript (frontend), Vite (bundler), FastAPI (backend), SQLAlchemy + PostgreSQL, Redis + Celery (worker), YARA pour tri de fichiers.
- Rôles principaux : Ingestion → Analyse (YARA, VT) → Stockage preuve → Rapports PDF/Excel → Actions d'IR.

2) Arborescence essentielle
- `frontend/` : app React / Vite. Pages principales : `Landing.tsx`, `LandingV2.tsx`, `Dashboard`, `Incidents`, `Evidence`, `Report`.
- `frontend/src/styles/landingv2.css` : styles de la landing v2.
- `backend/` : FastAPI app, tâches Celery, `init_db.py`, `config.py`, `models.py`, `tasks.py`.
- `docker-compose.yml` : orchestration locale (db, redis, api, worker).

3) Démarrage local (dev)
- Prérequis : Docker Desktop, Node.js 20+, Python 3.11.
- Backend (option Docker) :
  - docker-compose up --build
- Backend (local Python):
  ```powershell
  cd backend
  python -m venv .venv
  .\.venv\Scripts\activate
  pip install -r requirements.txt
  alembic upgrade head
  uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
  ```
- Frontend :
  ```bash
  cd frontend
  npm install
  npm run dev
  ```

4) Architecture détaillée
- Auth : JWT bearer tokens (voir `backend/app/auth`), OAuth providers (Google/GitHub) optionnels.
- API : FastAPI, routes documentées automatiquement via `/docs` (OpenAPI/Swagger).
- DB : PostgreSQL via SQLAlchemy models et Alembic pour migrations.
- Worker : Celery + Redis pour tâches longues (analyse fichier, génération PDF/Excel, scans YARA).
- Sécurité : configuration via `APP_ENV`, `SECRET_KEY` obligatoire en production, CORS / TrustedHosts contrôlés par variables d'environnement.

5) Responsivité — Changements appliqués
- Problème : la landing n'était pas fluide sur petits écrans (nav trop large, grids non adaptatives, paddings fixes).
- Correctifs appliqués :
  - `frontend/src/pages/Landing.tsx` : ajout de media queries (<=1024px et <=600px) pour :
    - faire passer la barre nav en mode wrap et ordonner les éléments (brand, cta, liens) pour petits écrans.
    - réduire paddings, diminuer taille du `h1` via `clamp()` et limiter max-width.
    - transformer les grilles 4-col en 2-col puis 1-col selon breakpoint.
    - empiler les CTA verticalement sur mobile.
  - `frontend/src/styles/landingv2.css` : media queries similaires pour `landing-v2` (grid, wrap, padding réduit).
- Points techniques et recommandations :
  - Utiliser unités relatives (`clamp()`, `vw`, `rem`) pour titres et espacements critiques.
  - Réduire l'utilisation de valeurs fixes (`px`) pour la largeur/height des composants visibles.
  - Pour composants de navigation plus avancés, envisager un menu hamburger ARIA (JS) si le contenu de `.nav-links` est trop long.
  - Tester sur iPhone SE (320px), iPhone 12/13 (390px), iPad (768px) et écrans 1024–1440.

6) Tests et validation
- Recommandation rapide : lancer le frontend dev server (`npm run dev`) et ouvrir les outils dev des navigateurs (device toolbar) pour simuler points d'arrêt suivants : 320px, 375px, 425px, 768px, 1024px.
- Checklist :
  - [ ] Navigation visible et clicable à toutes tailles
  - [ ] H1 lisible, pas de débordement
  - [ ] Les grilles passent 4→2→1 colonnes proprement
  - [ ] Les images/logos sont `max-width:100%` et ne cassent pas la mise en page
  - [ ] Pas de scroll horizontal

7) Accessibilité & performance
- Ajouter `meta name="viewport" content="width=device-width, initial-scale=1"` dans `frontend/index.html` si absent.
- Vérifier contraste sur thèmes clair/sombre, utiliser `prefers-reduced-motion` pour désactiver animations si besoin.
- Lazy-load images et SVGs non critiques.

8) Étapes suivantes proposées
- Implémenter un menu hamburger accessible si la nav contient plus de 4 liens.
- Ajouter tests visuels (Percy/Screener) et audits Lighthouse automatisés.
- Rebuild CI: `npm run build` puis vérifier HTML/CSS minifiés.

9) Récapitulatif des fichiers modifiés
- `frontend/src/pages/Landing.tsx` — responsive CSS ajouté
- `frontend/src/styles/landingv2.css` — règles responsive ajoutées
- Ceci est documenté ci-dessus et peut être enrichi selon retours.

---
Si vous voulez que j'implémente un menu hamburger accessible ou que je lance le dev server et prenne des captures d'écran sur différentes tailles, dites-moi et je m'en occupe.
