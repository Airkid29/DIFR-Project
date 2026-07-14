# Slack Channel Setup and Avatar Upload Guide

## English

### Workspace setup
1. Start the backend and frontend in local development:
   - `docker-compose up --build`
   - In another terminal: `cd frontend && npm install && npm run dev`
2. Confirm backend API is reachable at `http://localhost:8000` and frontend at `http://localhost:5173`.
3. The frontend is configured to proxy `/api` and `/uploads` to the backend, so uploaded avatar images are served correctly from the FastAPI app.

### Avatar upload flow
1. Open the Settings page in the app.
2. In the General tab, choose a profile photo file using the file input.
3. The app uploads the file to `POST /api/uploads/avatar`.
4. The backend stores the file in `UPLOAD_DIR` and returns a public upload URL.
5. The frontend saves that URL to the authenticated user's profile via `PUT /api/auth/me` and displays the avatar immediately.

### Slack channel and webhook mapping
ForensiGuard supports:
- `slack_webhook_url` (global fallback)
- `slack_webhook_incidents` (incident-specific)
- `slack_webhook_evidence` (evidence-specific)
- `slack_webhook_audit` (audit/test notifications)

Recommended channels and webhook mappings:
- `#incidents-alerts` → `slack_webhook_incidents`
- `#evidence-tracking` → `slack_webhook_evidence`
- `#security-audit` → `slack_webhook_audit`

#### How to create incoming webhooks in Slack
1. Open Slack and go to `Settings & administration` > `Manage apps`.
2. Search for and install the `Incoming Webhooks` app.
3. Add a new webhook and choose the target channel.
4. Copy the generated URL, which should start with `https://hooks.slack.com/services/...`.
5. Paste the URL into the matching webhook field on the Settings page.

#### Verification and fallback behavior
- If a context-specific webhook is set, the app uses it first.
- If a context-specific webhook is not set, it falls back to the global `slack_webhook_url`.
- The Settings page also includes a `Test Slack Notification` button to verify the configured webhook.

### Troubleshooting
- Ensure the backend is running and reachable from the frontend.
- If avatars do not appear, verify the `/uploads` path is accessible in the browser.
- If Slack notifications fail, verify the webhook URL is valid and the channel exists.

---

## Français

### Configuration de l'espace de travail
1. Démarrez le backend et le frontend en développement local :
   - `docker-compose up --build`
   - Dans un autre terminal : `cd frontend && npm install && npm run dev`
2. Vérifiez que l'API backend est disponible sur `http://localhost:8000` et le frontend sur `http://localhost:5173`.
3. Le frontend est configuré pour proxyfier `/api` et `/uploads` vers le backend, ce qui permet de servir les images d'avatar téléversées.

### Flux de téléversement de l'avatar
1. Ouvrez la page Paramètres dans l'application.
2. Dans l'onglet Général, choisissez une photo de profil via le champ de fichier.
3. L'application téléverse le fichier vers `POST /api/uploads/avatar`.
4. Le backend enregistre le fichier dans `UPLOAD_DIR` et renvoie une URL publique.
5. Le frontend sauvegarde cette URL dans le profil de l'utilisateur via `PUT /api/auth/me` et affiche immédiatement l'avatar.

### Mapping des canaux Slack
ForensiGuard accepte :
- `slack_webhook_url` (fallback global)
- `slack_webhook_incidents` (incidents)
- `slack_webhook_evidence` (preuves)
- `slack_webhook_audit` (audit / notifications de test)

Canaux recommandés :
- `#incidents-alerts` → `slack_webhook_incidents`
- `#evidence-tracking` → `slack_webhook_evidence`
- `#security-audit` → `slack_webhook_audit`

#### Création d'un webhook entrant Slack
1. Dans Slack, allez dans `Paramètres et administration` > `Gérer les applications`.
2. Recherchez et installez l'application `Incoming Webhooks`.
3. Ajoutez un nouveau webhook et choisissez le canal cible.
4. Copiez l'URL générée, qui commence par `https://hooks.slack.com/services/...`.
5. Collez l'URL dans le champ webhook correspondant sur la page Paramètres.

#### Vérification et comportement de repli
- Si un webhook contextuel est configuré, l'application l'utilise en priorité.
- Si aucun webhook contextuel n'est configuré, l'application utilise `slack_webhook_url` global.
- La page Paramètres contient aussi un bouton `Test Slack Notification` pour vérifier le webhook.

### Résolution de problèmes
- Assurez-vous que le backend est démarré et accessible depuis le frontend.
- Si les avatars ne s'affichent pas, vérifiez que le chemin `/uploads` est accessible dans le navigateur.
- Si les notifications Slack échouent, vérifiez que l'URL du webhook est valide et que le canal existe.
