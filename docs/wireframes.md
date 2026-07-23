# ForensiGuard â€” Guide des Wireframes Figma-Style (Phase 4)

Ce document décrit en détail la structure, le positionnement et l'organisation visuelle des 14 écrans de la plateforme ForensiGuard. Il est rédigé de façon à  ce qu'un designer puisse les implémenter directement dans Figma ou qu'un développeur puisse les coder à  l'aide de Tailwind CSS.

---

## Modèle de Structure Globale (Layout Applicatif)
Pour tous les écrans connectés (du Tableau de bord au Profil), la structure est standardisée en un modèle de type **Sidebar + Main Content Area** avec une barre supérieure :

```
+----------------------------------------------------------------------------------+
| LOGO & BRAND  | SEARCH BAR [Ctrl+K]              (Bell) (User Avatar)            |  <- TOP BAR (64px)
+---------------+------------------------------------------------------------------+
| (Home) Dash   |                                                                  |
| (Alert) Inc.  |                                                                  |
| (Search) File |                                                                  |  <- MAIN CONTENT AREA
| (Clock) Time. |                                                                  |     (Scrollable, Centered, max-w-7xl)
| (Database) Ev. |                                                                  |
|               |                                                                  |
| (Settings)    |                                                                  |
+---------------+------------------------------------------------------------------+
  ^ SIDEBAR (240px)
```

---

## 1. Landing Page

### Layout & Grille :
* **Type** : Landing page une seule page (Single-page marketing).
* **Grille** : 12 colonnes, marges gauche/droite `120px` sur Desktop, largeur maximale `1280px`.

### à‰léments Figma (Haut en Bas) :
1. **Header (Barre de navigation - 80px)** :
   * Gauche : Logo ForensiGuard (icà´ne bouclier néon + texte Outfit Bold).
   * Milieu : Liens textuels (Features, Architecture, Pricing, Docs).
   * Droite : Bouton Ghost "Login", Bouton Primary "Start Free Trial".
2. **Hero Section (Hauteur : 700px)** :
   * Split 50/50 vertical.
   * Colonne Gauche :
     * Badge `Cyber security automated` en haut (fond cyan translucide, texte cyan).
     * Titre `H1` (Outfit 48px, line-height 1.1) : "Next-Gen Incident Response for Enterprise SOCs".
     * Paragraphe (Inter 16px, gris bleuté) : Description rapide de la capture de preuves et de l'analyse YARA automatisée.
     * Boutons : Bouton Primary "Start Free Trial" (grand taille, glow cyan) + Bouton Secondary avec icà´ne Play "Watch Demo".
   * Colonne Droite :
     * Conteneur 3D/Framer Motion simulant l'interface du produit (Timeline d'investigation stylisée avec des nÅ“uds lumineux colorés et des lignes de liaison).
3. **Features Grid (Section : 600px)** :
   * Grille de 3 colonnes de cartes interactives (YARA rules scanning, Cryptographic Chain of Custody, Threat Intelligence feeds).
   * Chaque carte possède une bordure fine translucide, une icà´ne Lucide colorée en haut à  gauche et un titre de carte en Outfit 20px.

---

## 2. Connexion (Login & MFA)

### Layout & Grille :
* **Type** : Centré horizontalement et verticalement sur fond sombre uniforme.

### à‰léments Figma :
1. **Conteneur Principal (Card - 450px x 600px)** :
   * Centré au milieu de l'écran avec une bordure fine `Border` et un léger dégradé radial d'arrière-plan.
   * **En-tête de Carte** :
     * Logo ForensiGuard centré (Shield icà´ne 48px).
     * Titre H2 (Outfit 24px) : "Sign in to ForensiGuard".
     * Sous-titre (Inter 14px, gris) : "Enter your credentials to access the SOC terminal".
   * **Formulaire d'Identification (à‰tape 1)** :
     * Label : "Email Address" + Champ de saisie (input) avec icà´ne enveloppe.
     * Label : "Password" + Champ de saisie (type password) avec icà´ne cadenas et icà´ne "Å“il" pour afficher le mot de passe.
     * Bouton Primary (Largeur 100%) : "Continue" ou "Sign In".
   * **Saisie du Code MFA (à‰tape 2 - Affiché après validation de l'étape 1)** :
     * Message d'instruction : "Enter the 6-digit verification code from your authenticator app."
     * Grille de 6 inputs individuels numérotés de 1 à  6 pour les chiffres du code TOTP.
     * Lien Ghost : "Use recovery code".
     * Bouton Primary (Largeur 100%) : "Verify Code".

---

## 3. Tableau de Bord (Dashboard)

### Layout & Grille :
* Layout standard (Sidebar + Top bar + Main Area). Grille 12 colonnes, `gap-6` (24px).

### à‰léments Figma :
1. **Titre de Section & Actions (Barre d'outils - 80px)** :
   * Gauche : Titre H1 "Security Command Center".
   * Droite : Bouton Primary "+ Create Incident", Bouton Secondary "Upload Artifact".
2. **Ligne de Métriques Clés (4 Cartes - 1 Colonne sur 3 chacune)** :
   * Carte 1 : Active Incidents (Nombre en grand 4xl : `14`, badge rouge `+2 new today`).
   * Carte 2 : YARA Files Scanned (Nombre 4xl : `1,284`, badge vert `100% processed`).
   * Carte 3 : Integrity Validated (Nombre 4xl : `99.8%`, badge vert `No mismatches`).
   * Carte 4 : Avg. Resolution Time (Nombre 4xl : `42m`, badge bleu `-8m vs last week`).
3. **Graphique & Liste Sec (2 Colonnes Split : 8 cols / 4 cols)** :
   * Colonne Gauche (8 colonnes) :
     * Carte "Incident Frequency & Triage Rate" (Graphique Recharts AreaChart en bleu et cyan).
   * Colonne Droite (4 colonnes) :
     * Carte "Recent Threat Intelligence Indicators". Liste verticale de 5 indicateurs d'IOC (IPs, MD5) avec badges de niveau de menace (Malicious, Suspicious, Safe).

---

## 4. Vue des Incidents

### Layout & Grille :
* Layout standard. Zone principale contenant un tableau plein écran.

### à‰léments Figma :
1. **Filtres et Recherche (Barre supérieure de tableau)** :
   * Gauche : Input de recherche locale avec icà´ne loupe ("Search incidents...").
   * Droite : Sélecteur de statut (Dropdown: All, Open, Triage, Resolved), Sélecteur de Sévérité (Dropdown: All, Critical, High, Medium, Low), Bouton "Export CSV".
2. **Tableau des Incidents (Data Table)** :
   * Colonnes :
     * `[ ]` (Case à  cocher globale).
     * `ID` (Code mono-espacé ex: `INC-2026-004`).
     * `Title` (Texte principal en gras, ex: "Brute Force on SSH Service").
     * `Severity` (Badge coloré selon criticité : Rouge pour Critical, Orange pour High, etc.).
     * `Status` (Badge : Open, In Progress, Resolved).
     * `Owner` (Avatar de l'utilisateur assigné + Nom).
     * `Created At` (Date courte, ex: "Jun 27, 03:17").
3. **Panneau Coulissant de Détails (Drawer latéral - Largeur: 480px)** :
   * S'ouvre depuis la droite au clic sur une ligne.
   * Contient les métadonnées détaillées de l'incident, la liste des preuves associées, un fil de commentaires rapides, et un bouton "Go to full Incident workspace".

---

## 5. Analyse de Fichier (File Analysis Portal)

### Layout & Grille :
* Centré horizontalement dans la zone principale. Largeur maximale de la carte principale : `800px`.

### à‰léments Figma :
1. **Zone de Dépà´t de Fichier (Drag & Drop Zone - Hauteur: 300px)** :
   * Bordure en pointillés turquoise avec coins arrondis.
   * Fond très sombre avec un subtil effet de transparence.
   * Icà´ne Lucide `UploadCloud` de 64px de large de couleur turquoise au centre.
   * Texte : "Drag and drop suspicious files here, or click to browse".
   * Légende inférieure (12px) : "Max file size: 100MB. Supports raw binaries, PE, ELF, PDF, docx, logs."
2. **File d'Attente de Traitement (Processing Queue - Sous la zone de dépà´t)** :
   * Liste des fichiers récemment déposés.
   * Pour chaque fichier : Nom du fichier, Taille, Barre de progression horizontale, Bouton "Cancel".
   * Indication visuelle de l'état : En attente, Analyse YARA en cours, Recherche Threat Intel.

---

## 6. Rapport d'Analyse (Analysis Report)

### Layout & Grille :
* Layout standard. Zone principale divisée en une barre latérale gauche d'index et une zone de rapport au format document (type A4 ou conteneur centré).

### à‰léments Figma :
1. **En-tête de Rapport** :
   * Titre H1 "Forensic Analysis Report".
   * Badge de sévérité de la menace (ex: "MALICIOUS" rouge vif ou "SUSPICIOUS" orange).
   * Métadonnées : Date du scan, Nom de l'analyste, ID de l'artéfact.
2. **Section : Empreintes Numériques (Hashes Card)** :
   * Grille à  2 colonnes avec fond sombre.
   * `MD5` : `a12c89f...` (Bouton "Copy" discret à  droite).
   * `SHA-1` : `e59a34...`
   * `SHA-256` : `9f86d08...`
3. **Section : Détection YARA (YARA Matches Card)** :
   * Liste des signatures YARA détectées.
   * Pour chaque règle : Nom de la règle (ex. `CobaltStrike_Beacon`), Auteur, Description, et fragments de code ou chaînes (strings) ayant provoqué la correspondance.
4. **Section : Renseignement sur les Menaces (Threat Intelligence Card)** :
   * Score global de réputation (ex: `48/72 engines detected this file as malicious`).
   * Liste des moteurs d'analyse avec leur résultat individuel.

---

## 7. Collecte des Preuves (Evidence Management & Chain of Custody)

### Layout & Grille :
* Layout standard. Deux onglets : "Register New Evidence" et "Evidence Repository".

### à‰léments Figma (Onglet "Register New Evidence") :
1. **Formulaire d'Enregistrement de Preuve** :
   * Grille de saisie à  double colonne.
   * Colonne 1 :
     * Nom de la preuve (ex: "RAM Dump - WebServer01").
     * Catégorie (Dropdown: RAM Dump, Disk Image, Log File, Network Capture, Physical Device).
     * Date et Heure de Collecte (Date picker + Time picker).
   * Colonne 2 :
     * Collecteur (Nom de l'analyste, prérempli avec sélection modifiable).
     * Hash d'Intégrité Source (Input SHA-256 obligatoire pour validation).
     * Description détaillée / à‰tat physique du média.
2. **Chaîne de Possession Initiale** :
   * Formulaire de signature numérique et déclaration de prise en charge.
   * Bouton Primary en bas à  droite : "Generate Chain of Custody & Register".

---

## 8. Timeline d'Investigation (Incident Timeline)

### Layout & Grille :
* Layout standard. Ligne de temps interactive verticale occupant toute la hauteur.

### à‰léments Figma :
1. **Barre de Contrà´le (Haut)** :
   * Titre "Investigation Timeline â€” INC-2026-004".
   * Bouton Primary "Add Timeline Event", Bouton Secondary "Import Log File".
   * Filtres rapides sous forme de pilules (badges cliquables) : `Network`, `Registry`, `Auth`, `Process`, `Malware`.
2. **Ligne Temporelle (Timeline Track)** :
   * Ligne verticale grise de 2px centrée ou alignée à  gauche.
   * Les nÅ“uds d'événements sont disposés le long de la ligne, triés par horodatage décroissant.
   * **Format d'une Carte d'à‰vénement** :
     * Gauche de la ligne : Horodatage précis (ex: `2026-06-27 03:17:29.412`).
     * Sur la ligne : Icà´ne de type d'événement dans un cercle coloré (ex: icà´ne réseau bleue, icà´ne d'authentification orange).
     * Droite de la ligne : Titre de l'événement (ex: "Unauthorized SSH Login from IP 192.168.1.50"), Description textuelle courte, Auteur ou Source de la donnée, Badge d'importance (High, Medium, Low).

---

## 9. Recherche Globale (Command Palette)

### Layout & Grille :
* Modale flottante centrée, avec flou d'arrière-plan sur toute l'application. Largeur : `650px`.

### à‰léments Figma :
1. **Barre d'Entrée (Search Input)** :
   * Hauteur : 60px.
   * Icà´ne Loupe à  gauche (24px, gris bleuté).
   * Input texte sans bordure, grande taille de police (18px) : "Search incidents, hashes, rules, settings..."
   * Raccourci d'annulation affiché à  droite : `ESC`.
2. **Liste de Résultats Catégorisés (Sous l'input)** :
   * Catégorie `Incidents` (ex. "INC-2026-004: Brute Force on web server").
   * Catégorie `Files` (ex. "mimikatz.exe (SHA-256: 4f129...)").
   * Catégorie `Actions` (ex. "Create New Incident", "Go to User Settings").
   * Chaque ligne sélectionnée possède un arrière-plan cyan translucide et un indicateur `Enter` à  droite.

---

## 10. Gestion des Utilisateurs (RBAC Panel)

### Layout & Grille :
* Layout standard. Tableau de gestion des membres.

### à‰léments Figma :
1. **Barre supérieure d'action** :
   * Titre: "User Management".
   * Bouton Primary : "+ Invite New Member".
2. **Tableau des Membres** :
   * Colonnes :
     * `User` (Photo de profil + Nom + Email).
     * `Role` (Menu déroulant Inline : Administrator, Analyst L2, Incident Responder, Viewer).
     * `Security Status` (Badge vert "MFA Enabled" ou Badge rouge "MFA Disabled").
     * `Last Login` (Date + Adresse IP).
     * `Actions` (Bouton "Revoke Session" ou "Remove User").

---

## 11. Paramètres (Settings)

### Layout & Grille :
* Layout standard. Menu latéral gauche interne (Tabs) et contenu à  droite.

### à‰léments Figma :
1. **Menu Onglets Latéral (Vertical Tabs)** :
   * General, Integrations (VirusTotal, Slack, Jira), YARA Rulesets, Billing.
2. **Panneau d'Intégration API (Contenu Actif)** :
   * Formulaire pour chaque intégration.
   * Ex: "VirusTotal API Key" -> Input text masqué par défaut, bouton "Show/Hide", bouton "Test Connection" vert.
   * Commutateurs (Toggles) pour activer/désactiver les notifications Slack automatiques lors de la détection de menaces critiques.

---

## 12. Centre de Notifications

### Layout & Grille :
* Panneau latéral droit coulissant (Drawer) ou page dédiée. Modélisé ici sous forme de tiroir (Drawer) coulissant de `400px` de large.

### à‰léments Figma :
1. **En-tête de Panneau** :
   * Titre: "Notifications".
   * Bouton Ghost: "Mark all as read".
2. **Liste de Cartes de Notification (Verticale)** :
   * Chaque notification est une petite carte avec une bordure fine et un fond variable selon l'état de lecture.
   * *Notification Critique* : Icà´ne d'alerte rouge, titre "Critical YARA Match", message "File malware.exe matched rule CobaltStrike_Beacon", horodatage "2m ago".
   * *Notification Info* : Icà´ne de tà¢che bleue, message "PDF Report for Incident INC-2026-004 generated successfully", bouton de téléchargement direct sous le texte.

---

## 13. Journal d'Audit (Audit Log)

### Layout & Grille :
* Layout standard. Grand tableau chronologique filtrable.

### à‰léments Figma :
1. **Filtres de Journal d'Audit** :
   * Sélecteur de Plage de Dates, Sélecteur d'Utilisateurs, Sélecteur de type d'action.
2. **Tableau de Logs** :
   * Colonnes :
     * `Timestamp` (Format précis avec millisecondes, mono-espacé).
     * `User` (Nom + Email).
     * `Action` (ex. `DOWNLOAD_EVIDENCE`, `DELETE_INCIDENT`, `LOGIN_MFA_SUCCESS` en code mono-espacé).
     * `Resource Target` (Identifiant de la ressource concernée, ex: `EVID-4921`).
     * `IP Address` (ex. `198.51.100.12`).

---

## 14. Profil (User Profile)

### Layout & Grille :
* Layout standard, zone centrale divisée en sections de carte.

### à‰léments Figma :
1. **Section : Personal Information** :
   * à‰dition du Nom, Prénom, Email, Téléphone. Bouton "Save Profile".
2. **Section : Multi-Factor Authentication (MFA)** :
   * Statut actuel : "Status: Active (TOTP Authenticator)".
   * Si désactivé : Bouton Primary "Setup MFA" qui déclenche une modale avec QR Code et champ de validation à  6 chiffres.
   * Bouton : "View Recovery Codes".
3. **Section : Session History** :
   * Tableau des sessions actives de l'utilisateur (Navigateur, OS, Date d'activation, IP, bouton "Revoke Session" pour déconnecter à  distance).
