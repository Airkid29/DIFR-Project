# DIFR Project – Rapport ultra détaillé

## 1. Présentation générale

DIFR Project est une application de démonstration orientée sécurité informatique et analyse forensique. Elle a été conçue pour illustrer un tableau de bord opérationnel, un flux d’analyse de fichiers, une gestion des incidents, et un espace de profil utilisateur dans un contexte de présentation professionnelle.

### Objectif du projet

- Montrer un environnement de travail moderne pour la sécurité numérique.
- Présenter une interface cohérente, claire et prête à être exposée.
- Simuler un flux d’investigation crédible avec des données de démonstration.
- Rendre l’application prête à être déployée sur une plateforme comme Netlify.

### Public visé

- Présentations clients
- Démonstrations de produit
- Entretien technique
- Validation UI/UX

---

## 2. Architecture du projet

### Frontend

- React avec TypeScript
- Vite comme outil de build
- Interface organisée en pages et composants réutilisables
- Thème clair/sombre et basculeur de langue FR/EN

### Backend

- API Python/FastAPI
- Base de données et logique d’initialisation
- Services d’analyse et structures de données dédiées

### Conteneurs

- Docker Compose pour simplifier l’exécution locale
- Services backend et frontend isolés

---

## 3. Fonctionnalités principales

### Tableau de bord

Le tableau de bord centralise les métriques clés du système :
- incidents actifs
- fichiers analysés
- intégrité vérifiée
- temps moyen de réponse
- alertes critiques

### Analyse de fichiers

La page d’analyse permet :
- l’upload d’un artefact
- un scan simulé avec progression
- calcul de fingerprints
- évaluation de sévérité
- notes opérationnelles

### Gestion des incidents

La page incidents offre :
- une liste d’incidents riche
- un filtre par gravité
- une recherche rapide
- des statuts d’avancement
- une interface de création d’incident

### Profil utilisateur

La page profil présente :
- informations utilisateur
- paramètres de sécurité
- MFA
- activité récente

---

## 4. Parcours utilisateur

### Parcours 1 – Consultation du tableau de bord

1. L’utilisateur ouvre l’application.
2. Il consulte les indicateurs prioritaires.
3. Il observe les alertes et les flux de données simulés.

### Parcours 2 – Analyse d’un fichier

1. L’utilisateur dépose un fichier.
2. Le système affiche un scan progressif.
3. Il obtient un résumé de risque et des empreintes numériques.

### Parcours 3 – Gestion des incidents

1. L’utilisateur consulte les incidents.
2. Il filtre et recherche les cas.
3. Il peut créer un nouveau signalement.

### Parcours 4 – Configuration du profil

1. L’utilisateur visualise ses informations de compte.
2. Il gère sa sécurité MFA.
3. Il consulte ses derniers événements.

---

## 5. Structure technique

### Répertoires principaux

- backend : logique API et services
- frontend : application React/Vite
- docs : documentation et dossier de présentation

### Composants notables

- Layout : structure générale de navigation
- SettingsContext : gestion du thème clair/sombre et de la langue
- pages : écrans principaux du produit

---

## 6. Design et expérience utilisateur

### Points forts

- interface moderne
- contraste amélioré pour le thème clair
- hiérarchie visuelle plus lisible
- textes agrandis et plus faciles à présenter
- données de démonstration enrichies

### Objectif UX

Offrir une expérience visuelle plus convaincante lors d’une présentation ou d’une démo client.

---

## 7. Déploiement

### Prérequis

- Node.js installé
- npm disponible
- accès à un hébergeur compatible Vite

### Build local

```bash
cd frontend
npm install
npm run build
```

### Déploiement sur Netlify

1. Connecter le dépôt à Netlify.
2. Sélectionner le dossier frontend comme répertoire de build.
3. Définir la commande de build : npm run build.
4. Définir le dossier de publication : dist.

### Notes importantes

- La configuration Vite est prête pour un usage moderne.
- Le projet est pensé pour être facile à déployer avec une build propre.

---

## 8. Éléments à compléter pour la présentation

Ajouter ici les captures d’écran suivantes :

- capture du tableau de bord
- capture de la page d’analyse de fichiers
- capture des incidents
- capture du profil utilisateur
- capture du mode clair
- capture du mode sombre
- capture de la vue mobile si nécessaire

---

## 9. Résumé exécutif

DIFR Project est un prototype de produit centré sécurité et investigations numériques. Il est visuellement soigné, plus lisible pour une présentation, plus riche en contenu de démonstration, et préparé pour un déploiement simple sur une plateforme comme Netlify.

---

## 10. Prochaines améliorations possibles

- intégrer une vraie API d’analyse de fichiers
- connecter les données à une base live
- ajouter des graphiques plus avancés
- enrichir les workflows d’authentification
- améliorer la version mobile
