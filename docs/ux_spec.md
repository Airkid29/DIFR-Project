# ForensiGuard — Spécification d'Expérience Utilisateur (Phase 2)

Ce document décrit l'expérience utilisateur (UX) pour chacun des 14 écrans cibles de ForensiGuard, en garantissant une navigation fluide, une réduction du nombre de clics et un design moderne axé sur l'efficacité opérationnelle.

---

## Raccourcis Clavier Globaux
Pour accélérer l'analyse DFIR, ForensiGuard intègre des raccourcis globaux disponibles sur toute la plateforme :
* `cmd + k` ou `ctrl + k` : Ouvrir la Recherche Globale.
* `esc` : Fermer les fenêtres modales / annuler l'action en cours.
* `g + d` : Aller au Tableau de Bord.
* `g + i` : Aller à la Vue des Incidents.
* `g + f` : Aller à l'Analyse de Fichier.
* `g + s` : Aller aux Paramètres.

---

## 1. Landing Page
* **Objectif** : Présenter la plateforme ForensiGuard aux prospects, démontrer la valeur ajoutée technique, et encourager la création d'un compte démo.
* **Informations Affichées** : Proposition de valeur (Hero section), animation interactive d'une timeline d'investigation, grille des fonctionnalités clés (YARA, Chain of Custody, Threat Intel), témoignages d'experts, tarifs transparents.
* **Actions Principales** : Bouton "Start Free Trial" (CTA principal), "Request Demo", "Watch Video Walkthrough".
* **Interactions** : Défilement fluide (smooth scrolling), survol des cartes avec effets d'élévation, démo interactive (glisser-déposer un faux fichier pour simuler une analyse de hash).
* **États** : Non applicable (statique).

## 2. Connexion (Login / MFA)
* **Objectif** : Authentifier les utilisateurs de manière hautement sécurisée (avec MFA obligatoire).
* **Informations Affichées** : Formulaire d'identification (email, mot de passe), formulaire de saisie du code MFA TOTP (étape 2), lien de récupération.
* **Actions Principales** : "Sign In", "Submit TOTP Code", "Forgot Password".
* **États** :
  * *Loading* : Spinner discret sur le bouton de connexion, désactivation des champs pendant la vérification.
  * *Error* : Message d'erreur clair et non-divulgateur ("Invalid credentials" ou "Invalid MFA Code") avec contour rouge doux.
  * *Success* : Transition animée fluide vers le Dashboard.
* **Raccourcis** : `Enter` pour valider le formulaire.

## 3. Tableau de Bord (Dashboard)
* **Objectif** : Offrir une vue d'ensemble en temps réel de l'état de sécurité et des investigations en cours.
* **Informations Affichées** : Métriques clés (Incidents Actifs, Fichiers Analysés, Preuves Sécurisées), graphique d'évolution des incidents (Recharts), liste des incidents récents à haute priorité, flux de Threat Intelligence récent.
* **Actions Principales** : "Create New Incident", "Analyze File".
* **Interactions** : Filtres rapides par sévérité (Critical, High, Medium, Low), clic sur une métrique pour filtrer la liste, survol des graphiques pour afficher des infobulles détaillées.
* **États** :
  * *Loading* : Squelettes de chargement (skeletons) pour les métriques et les graphiques.
  * *Empty* : Message de bienvenue avec bouton d'incitation à créer le premier incident.
* **Raccourcis** : `n` pour créer un nouvel incident.

## 4. Vue des Incidents (Incident List & View)
* **Objectif** : Gérer le cycle de vie des incidents de sécurité (tri, assignation, résolution).
* **Informations Affichées** : Tableau interactif avec filtre (ID, Titre, Sévérité, Statut, Propriétaire, Date de création).
* **Actions Principales** : Filtrer, Trier, Exporter la liste (CSV/JSON), Ouvrir la modale de création d'incident.
* **Interactions** : Clic sur une ligne pour ouvrir le panneau latéral de prévisualisation rapide, glisser-déposer pour changer le statut (Kanban optionnel), double-clic pour ouvrir la page complète de l'incident.
* **États** :
  * *Loading* : Tableau avec squelettes de lignes scintillants.
  * *Empty* : Illustration rassurante indiquant qu'aucun incident n'est en cours ("All quiet on the network front").

## 5. Analyse de Fichier (File Analysis Portal)
* **Objectif** : Analyser rapidement un fichier suspect pour extraire ses hashes et détecter des règles YARA.
* **Informations Affichées** : Zone de glisser-déposer (Drag & Drop), liste des fichiers en file d'attente d'analyse, progression des tâches Celery en arrière-plan.
* **Actions Principales** : "Drag & Drop File", "Select File Manually", "Trigger YARA Scan".
* **Interactions** : Effet de survol sur la zone de dépôt (bordure pointillée s'animant au survol d'un fichier), animation de progression circulaire pendant l'analyse.
* **États** :
  * *DragOver* : Zone colorée en vert/bleu néon de sécurité.
  * *Processing* : Barre de progression animée indiquant l'étape actuelle (Calcul de Hash -> Scan YARA -> Recherche Threat Intel).
  * *Success* : Message de confirmation et redirection automatique vers le rapport d'analyse.
  * *Error* : Fichier trop lourd ou format invalide (message d'erreur détaillé).

## 6. Rapport d'Analyse (Analysis Report)
* **Objectif** : Visualiser les résultats détaillés de l'analyse d'un fichier.
* **Informations Affichées** : Métadonnées du fichier (nom, taille, type), hashes (MD5, SHA-1, SHA-256), résultats du scan YARA (règles associées, descriptions), score de réputation Threat Intel, structure de base du fichier.
* **Actions Principales** : "Download PDF Report", "Associate with Incident", "Add to IOC Database".
* **Interactions** : Onglets pour basculer entre l'analyse YARA, les métadonnées de fichier, et les détails de Threat Intel. Copie en un clic des hashes.
* **Raccourcis** : `c` pour copier le hash SHA-256.

## 7. Collecte des Preuves (Evidence / Chain of Custody)
* **Objectif** : Enregistrer et valider des pièces de preuves numériques (ex. image disque, dump de RAM) en garantissant la conformité juridique.
* **Informations Affichées** : Formulaire d'enregistrement (Description, Source, Date de collecte, Collecteur, Méthode d'acquisition, Hash d'intégrité), historique de transfert de la preuve.
* **Actions Principales** : "Register Evidence Item", "Transfer Custody", "Print Chain of Custody Tag".
* **Interactions** : Auto-génération de l'historique sous forme de fil d'Ariane chronologique, signatures numériques intégrées.
* **États** :
  * *Success* : Badge "Verified Integrity" vert néon si le hash correspond à l'état initial.
  * *Warning* : Alerte si la preuve a été transférée sans validation.

## 8. Timeline d'Investigation (Incident Timeline)
* **Objectif** : Aligner chronologiquement les événements pour comprendre le scénario de l'attaque.
* **Informations Affichées** : Ligne temporelle verticale interactive, filtres par étiquettes (Réseau, Système, Authentification, Malware), événements avec icônes distinctes selon la nature.
* **Actions Principales** : "Add Event Manually", "Filter Events", "Import Log (EVTX/CSV)".
* **Interactions** : Clic sur un événement pour ouvrir son détail dans un panneau coulissant, zoom sur la timeline, filtrage par curseur temporel (range slider).
* **Raccourcis** : `+` pour ajouter un événement rapide.

## 9. Recherche Globale (Global Search / Command Palette)
* **Objectif** : Permettre aux analystes d'accéder instantanément à n'importe quel incident, fichier, preuve ou paramètre.
* **Informations Affichées** : Barre de recherche centrale (style Command Palette Vercel/Linear), liste de résultats catégorisés (Incidents, Preuves, Fichiers, Actions rapides).
* **Actions Principales** : Saisir du texte, naviguer à l'aide des flèches directionnelles, sélectionner avec `Enter`.
* **Interactions** : Flou d'arrière-plan (backdrop blur) lors de l'activation, mise en surbrillance automatique du premier résultat.
* **Raccourcis** : `Up/Down` pour naviguer, `Enter` pour ouvrir, `Esc` pour fermer.

## 10. Gestion des Utilisateurs (RBAC Panel)
* **Objectif** : Gérer les comptes d'accès, les rôles (Admin, Analyst, Viewer) et la sécurité de l'équipe SOC.
* **Informations Affichées** : Liste des membres de l'équipe, leur rôle, leur statut de sécurité (MFA activé/désactivé), la date de dernière connexion.
* **Actions Principales** : "Invite User", "Change Role", "Revoke Access", "Enforce MFA globally".
* **Interactions** : Changement de rôle via un menu déroulant fluide, confirmation par modale de sécurité pour les révocations.

## 11. Paramètres (Settings)
* **Objectif** : Configurer la plateforme (profil de l'organisation, intégrations d'API, règles de rétention).
* **Informations Affichées** : Onglets (Général, API & Intégrations, Règles YARA, Facturation).
* **Actions Principales** : "Save Changes", "Generate API Key", "Upload YARA Signature Package".
* **Interactions** : Sauvegarde asynchrone automatique ou via un bouton flottant persistant si modifications détectées.

## 12. Centre de Notifications (Notifications Center)
* **Objectif** : Alerter les analystes des tâches terminées (ex: scan YARA terminé) ou des nouveaux incidents assignés.
* **Informations Affichées** : Liste des notifications (Lues vs Non lues), icônes catégorisées (Succès, Alerte, Info).
* **Actions Principales** : "Mark all as read", "Clear all", Clic sur une notification pour naviguer vers l'objet concerné.
* **Interactions** : Badge numérique rouge vif dynamique sur l'icône de cloche dans la barre supérieure, panneau coulissant latéral (drawer) fluide.

## 13. Journal d'Audit (Audit Log)
* **Objectif** : Suivre l'activité de tous les utilisateurs pour garantir l'immuabilité et la conformité interne.
* **Informations Affichées** : Liste chronologique non modifiable des actions (Utilisateur, Action, Ressource, IP, Horodatage).
* **Actions Principales** : "Export Audit Log (CSV/JSON)", Filtrer par utilisateur ou action.
* **Interactions** : Pagination fluide et recherche plein texte instantanée (debounced).

## 14. Profil (User Profile)
* **Objectif** : Permettre à l'analyste de gérer ses informations personnelles, son mot de passe et son MFA.
* **Informations Affichées** : Informations de base (nom, email, photo), état de la double authentification (MFA), journal des connexions personnelles (historique d'IP).
* **Actions Principales** : "Update Profile Info", "Enable/Disable MFA", "Regenerate Backup Codes".
* **Interactions** : Affichage du QR Code pour la configuration TOTP dans une modale sécurisée avec vérification par code de sécurité.
