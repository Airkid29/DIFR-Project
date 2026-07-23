# Documentation Complète de DFIR-Lab

## 1. Vue d'Ensemble

DFIR-Lab (Digital Forensic & Incident Response) est une plateforme tout-en-un dédiée à la réponse aux incidents numériques et à la criminalistique numérique.

### 1.1 Fonctionnalités Principales

- **Gestion des Incidents** : Création, suivi, et résolution d'incidents avec classification de gravité
- **Gestion des Preuves** : Traçabilité chain-of-custody (chaîne de garde) complète
- **Analyse de Fichiers** : Analyse YARA + intégration VirusTotal et OTX
- **Intelligence sur les Menaces** : Recherche d'IOC (Indicators of Compromise)
- **Rapports et Export** : Génération de rapports PDF d'audit médico-légale
- **Intégration Slack** : Notifications automatiques
- **Authentification Multi-Facteurs (MFA)** : Sécurité renforcée

### 1.2 Stack Technique

| Couche | Technologies |
|--------|--------------|
| Frontend | React 18, TypeScript, Vite |
| Backend | FastAPI (Python 3.11+) |
| Base de données | PostgreSQL (avec SQLAlchemy ORM) |
| Tâches asynchrones | Celery + Redis |
| Analyse de fichiers | YARA Rules |
| Conteneurisation | Docker / Docker Compose |
| Déploiement | Render (Backend) + Netlify (Frontend) |

---

## 2. Installation et Lancement Local

### 2.1 Prérequis

- Docker Desktop (pour l'environnement complet)
- Node.js 20+ (pour le frontend)
- Python 3.11+ (pour le backend en mode développement)
- Git (optionnel, pour cloner le repo)

### 2.2 Installation complète avec Docker Compose

Étape par étape pour lancer DFIR-Lab localement :

1. **Ouvrez votre terminal** et placez-vous dans le répertoire du projet :
   ```powershell
   cd "c:\Users\rachi\Desktop\DIFR Project"
   ```

2. **Démarrez tous les services** via Docker Compose :
   ```powershell
   docker-compose up --build
   ```
   - Cela initialisera :
     - La base de données PostgreSQL
     - Redis (pour les tâches asynchrones)
     - Le backend FastAPI
     - Le worker Celery
     - Le frontend React (si configuré)

3. **Vérifiez que les services sont bien démarrés** :
   - Backend API : [http://localhost:8000/docs](http://localhost:8000/docs) (documentation Swagger)
   - Frontend : [http://localhost:5173](http://localhost:5173) (si vous démarrez le frontend séparément)

### 2.3 Démarrage du Frontend Séparément

Si vous voulez lancer le frontend en mode développement sans Docker :

1. Accédez au dossier frontend :
   ```powershell
   cd "c:\Users\rachi\Desktop\DIFR Project\frontend"
   ```

2. Installez les dépendances :
   ```powershell
   npm install
   ```

3. Lancez le serveur de développement :
   ```powershell
   npm run dev
   ```

### 2.4 Démarrage du Backend Séparément

Pour développer le backend :

1. Accédez au dossier backend :
   ```powershell
   cd "c:\Users\rachi\Desktop\DIFR Project\backend"
   ```

2. Créez et activez un environnement virtuel Python :
   ```powershell
   python -m venv .venv
   .\.venv\Scripts\activate
   ```

3. Installez les dépendances :
   ```powershell
   pip install -r requirements.txt
   ```

4. Exécutez les migrations (si nécessaire) :
   ```powershell
   alembic upgrade head
   ```

5. Lancez le serveur :
   ```powershell
   uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
   ```

---

## 3. Utilisation de l'Application : Guide Étape par Étape

### 3.1 Création de Compte et Connexion

1. **Accédez à la page d'accueil** : `http://localhost:5173`
2. Cliquez sur **"S'inscrire"** (Register)
3. Remplissez le formulaire :
   - Nom d'utilisateur / Prénom
   - Adresse email
   - Mot de passe
4. Cliquez sur **"Créer un compte"**
5. Connectez-vous avec vos identifiants
6. **Optionnel** : Activez la double authentification (MFA) dans les paramètres de votre profil pour une sécurité renforcée

### 3.2 Tableau de Bord (Dashboard)

Le tableau de bord est la première page que vous voyez après connexion. Il affiche :

- **Actions Rapides** :
  - Analyse de fichier
  - Création d'incident
  - Recherche d'intelligence sur les menaces
- **Statistiques Clés** :
  - Incidents actifs
  - Preuves triées
  - Intégrité vérifiée
  - Temps moyen de triage
- **Graphique** : Volume d'incidents dans le temps
- **Flux de Menaces** : Dernières menaces détectées avec niveau de confiance

**Pour utiliser le Dashboard** :
1. Cliquez sur n'importe quelle carte d'action rapide pour accéder à la fonctionnalité correspondante
2. Cliquez sur le bouton "Voir toutes les menaces" pour accéder à la page d'intelligence sur les menaces

### 3.3 Gestion des Incidents

#### 3.3.1 Créer un Nouvel Incident

1. Cliquez sur **"Incidents"** dans la barre de navigation
2. Cliquez sur le bouton **"+ Enregistrer un Incident"**
3. Remplissez le formulaire :
   - **Titre** : Nom clair de l'incident (obligatoire)
   - **Description** : Détails contextuels sur l'incident
   - **Gravité** :
     - `critical` (Critique) : Incident majeur nécessitant une intervention immédiate
     - `high` (Élevé) : Incident important
     - `medium` (Moyen) : Incident modéré
     - `low` (Bas) : Incident mineur
4. Cliquez sur **"Créer l'Incident"**

#### 3.3.2 Filtrer et Rechercher des Incidents

- Utilisez la **barre de recherche** pour filtrer par titre ou ID d'incident
- Utilisez le **menu déroulant** pour filtrer par gravité

#### 3.3.3 Mettre à Jour le Statut d'un Incident

1. Sélectionnez un incident dans la liste
2. Dans le panneau de détails à droite :
   - Modifiez le **statut** :
     - `open` (Ouvert)
     - `triage` (En cours de triage)
     - `resolved` (Résolu)
   - Modifiez la **gravité** si nécessaire

#### 3.3.4 Voir la Chronologie d'un Incident

1. Sélectionnez un incident
2. Cliquez sur le bouton **"Voir la Chronologie"**

### 3.4 Gestion des Preuves (Evidence)

#### 3.4.1 Enregistrer une Nouvelle Preuve

1. Cliquez sur **"Evidence"** dans la barre de navigation
2. Cliquez sur **"+ Enregistrer une Preuve"**
3. Remplissez le formulaire :
   - **Nom de la Preuve** : Nom descriptif (obligatoire)
   - **Catégorie** :
     - `Disk Image` (Image de Disque)
     - `RAM Dump` (Dump Mémoire RAM)
     - `Log File` (Fichier de Log)
   - **Hash SHA-256** : Hash de la preuve (64 caractères hexadécimaux - obligatoire)
   - **Emplacement** : Où la preuve est stockée (par défaut : "Secure vault")
4. Cliquez sur **"Enregistrer et Auditer"**

#### 3.4.2 Transférer la Custodie d'une Preuve

1. Sélectionnez une preuve dans la liste
2. Cliquez sur **"Transférer la Custodie"**
3. Remplissez le formulaire :
   - **Nouveau Gardien** (New Custodian) : Nom ou ID de la personne à qui vous transférez
   - **Action Réalisée** : Détails sur l'action effectuée lors du transfert
4. Cliquez sur **"Confirmer le Transfert"**

#### 3.4.3 Accepter/Refuser un Transfert

Si une preuve vous est transférée :
1. Sélectionnez la preuve
2. Cliquez sur **"Accepter"** ou **"Rejeter"** selon le cas

#### 3.4.4 Exporter un Rapport de Preuve

1. Sélectionnez une preuve
2. Cliquez sur :
   - **"PDF"** pour générer un rapport local via le frontend
   - **"Serveur"** pour télécharger un rapport généré par le backend

### 3.5 Analyse de Fichiers

#### 3.5.1 Soumettre un Fichier à l'Analyse

1. Cliquez sur **"Analyse"** dans la barre de navigation
2. **Deux méthodes pour ajouter un fichier** :
   - Glissez-déposez le fichier dans la zone de téléchargement
   - Cliquez sur la zone pour sélectionner un fichier depuis votre ordinateur
3. Attendez que l'analyse soit terminée (vous verrez une barre de progression)

#### 3.5.2 Interpréter les Résultats

Une fois l'analyse terminée, vous verrez :

1. **Évaluation de la Menace** :
   - Score de menace (0-100)
   - Niveau de gravité correspondant
   - Badge indiquant le type d'analyse (YARA + Intel)
   - Liste des règles YARA et intégrations qui ont matché

2. **Empreintes Digitales** :
   - MD5
   - SHA-1
   - SHA-256

3. **Notes Opérationnelles** : Détails complémentaires sur l'analyse

#### 3.5.3 Exporter le Rapport d'Analyse

1. Après l'analyse, cliquez sur **"Exporter le Rapport PDF"**
2. Le rapport téléchargé contiendra toutes les informations :
   - Détails du fichier (nom, taille)
   - Score et gravité
   - Empreintes (hashes)
   - Règles correspondantes
   - Notes opérationnelles
   - Chaîne de garde

### 3.6 Intelligence sur les Menaces (Threat Intel)

1. Cliquez sur **"Intel"** dans la barre de navigation
2. Entrez un IOC (Indicator of Compromise) : hash, IP, domaine, URL, etc.
3. Cliquez sur **Rechercher**
4. Consultez les résultats provenant de VirusTotal et OTX (si vos clés API sont configurées)

### 3.7 Paramètres et Profil

1. Cliquez sur **"Profil"** (Profile) dans la barre de navigation
2. Ici, vous pouvez :
   - Mettre à jour vos informations personnelles
   - Configurer la double authentification (MFA)
   - Gérer vos clés API pour VirusTotal et OTX
   - Configurer les intégrations Slack
3. Cliquez sur **"Paramètres"** (Settings) pour des configurations système avancées

---

## 4. Configuration des Intégrations

### 4.1 VirusTotal

1. Créez un compte sur [VirusTotal](https://www.virustotal.com/)
2. Obtenez votre clé API dans les paramètres de votre profil
3. Dans DFIR-Lab, allez dans **Profil > Paramètres**
4. Entrez votre clé API VirusTotal et enregistrez

### 4.2 OTX (AlienVault Open Threat Exchange)

1. Créez un compte sur [AlienVault OTX](https://otx.alienvault.com/)
2. Obtenez votre clé API
3. Dans DFIR-Lab, allez dans **Profil > Paramètres**
4. Entrez votre clé API OTX et enregistrez

### 4.3 Slack

Voir le fichier `docs/SLACK_AND_AVATAR_SETUP.md` pour la configuration détaillée de l'intégration Slack.

---

## 5. Rôles et Permissions

- **Administrateur (Admin)** : Accès à toutes les fonctionnalités, y compris Ultra Admin (gestion des utilisateurs, audits, etc.)
- **Analyste** : Gestion des incidents et preuves, analyses
- **Visualiseur** : Accès en lecture seule

---

## 6. Sécurité et Audit

- Toutes les actions sont enregistrées dans les logs d'audit (Audit Log)
- La chaîne de garde (chain-of-custody) est tracée intégralement pour chaque preuve
- Les mots de passe sont hachés et jamais stockés en clair
- MFA est recommandé pour tous les comptes

---

## 7. Dépannage (Troubleshooting)

### 7.1 Problèmes de Connexion

- Vérifiez que le backend est bien démarré sur `http://localhost:8000`
- Vérifiez les logs du backend pour les erreurs
- Videz le cache de votre navigateur et réessayez

### 7.2 Analyse de Fichier Échoue

- Vérifiez que le worker Celery est bien démarré
- Vérifiez les logs du worker
- Assurez-vous que Redis est accessible

### 7.3 Erreur 500 (Internal Server Error)

- Vérifiez les logs du backend FastAPI
- Vérifiez que la base de données PostgreSQL est bien connectée
- Vérifiez les variables d'environnement

---

## 8. Déploiement en Production

Pour le déploiement, consultez le fichier `docs/DEPLOY_RENDER_NETLIFY.md`.

---

## 9. Glossaire

| Terme | Définition |
|-------|------------|
| DFIR | Digital Forensics & Incident Response - Criminalistique numérique et réponse aux incidents |
| IOC | Indicator of Compromise - Indicateur de compromission |
| Chain of Custody | Chaîne de garde - Traçabilité complète des preuves numériques |
| YARA | Langage/tool pour la détection de malware via des règles |
| MFA | Multi-Factor Authentication - Authentification multi-facteurs |
| SHA-256 | Fonction de hachage cryptographique produisant un empreinte de 256 bits |

---

## 10. Mise à jour du Projet

Pour mettre à jour votre installation :

1. Récupérez les dernières modifications :
   ```bash
   git pull
   ```

2. Redémarrez les services Docker :
   ```powershell
   docker-compose down
   docker-compose up --build
   ```

3. Mettez à jour les dépendances frontend :
   ```powershell
   cd frontend
   npm install
   ```
