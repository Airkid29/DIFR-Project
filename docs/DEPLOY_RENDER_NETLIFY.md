# Deploy ForensiGuard — Render (free) + Netlify

## Stack gratuite

| Service | Plateforme | Rôle |
|---------|------------|------|
| Frontend | Netlify | Interface React |
| API + Worker Celery | Render Web Service (Free) | Backend dans un seul conteneur |
| PostgreSQL | Render Postgres (Free) | Base de données |
| Redis | Render Key Value (Free) | File Celery |

> **Limites du gratuit Render** : l'API s'endort après ~15 min sans trafic (réveil ~1 min), 512 Mo RAM, disque éphémère (fichiers uploadés perdus au redémarrage).

---

## Partie 1 — Pousser le code sur GitHub

```powershell
cd "C:\Users\rachi\Desktop\DIFR Project"
git add render.yaml backend/start.sh backend/Dockerfile backend/app/
git add frontend/src/utils/api.ts frontend/src/pages/Login.tsx netlify.toml
git commit -m "Add Render deployment blueprint and Netlify API URL support"
git push origin main
```

---

## Partie 2 — Déployer le backend sur Render

### 2.1 Créer un compte Render

1. Allez sur https://render.com
2. Inscrivez-vous avec **GitHub**
3. Autorisez l'accès à votre dépôt `DIFR Project`

### 2.2 Déployer via Blueprint (recommandé)

1. Dashboard Render → **New +** → **Blueprint**
2. Sélectionnez le repo GitHub `DIFR Project`
3. Render détecte `render.yaml` et propose 3 ressources :
   - `forensiguard-db` (PostgreSQL)
   - `forensiguard-redis` (Redis)
   - `forensiguard-api` (Web Service Docker)
4. Cliquez **Apply**

Le premier build prend **5–15 minutes** (compilation de `yara-python`).

### 2.3 Récupérer l'URL de l'API

Une fois le déploiement vert :

1. Ouvrez le service **forensiguard-api**
2. Copiez l'URL publique, ex. `https://forensiguard-api.onrender.com`
3. Testez : `https://forensiguard-api.onrender.com/health` → `{"status":"ok"}`
4. Docs : `https://forensiguard-api.onrender.com/docs`

---

## Partie 3 — Connecter le frontend Netlify

### 3.1 Variable d'environnement

Netlify → **Site configuration** → **Environment variables** :

| Key | Value |
|-----|-------|
| `VITE_API_URL` | `https://forensiguard-api.onrender.com` |

Sans slash final. Remplacez par votre vraie URL Render.

### 3.2 Redéployer Netlify

**Deploys** → **Trigger deploy** → **Deploy site**

### 3.3 Vérifier

1. Login sur le site Netlify
2. Reconfigurer VirusTotal / OTX dans Settings (nouvelle base Render)
3. Tester File Analysis

---

## Dépannage

| Problème | Solution |
|----------|----------|
| « Unable to connect » | `VITE_API_URL` manquant ou incorrect + redéployer Netlify |
| API lente au 1er appel | Plan gratuit : réveil ~1 min après inactivité |
| Scan bloqué | Logs Render du service `forensiguard-api` |
| Build échoue (mémoire) | Relancer le deploy ou passer en Starter ($7/mois) |
