# MasajedConnect - Plan de Navigation

Ce document détaille l'architecture de navigation et les flux utilisateurs pour la plateforme MasajedConnect.

## 1. Zone Publique (Visiteur)
Accessible à tous sans connexion.

*   **`/` (Accueil)**
    *   Carte interactive (Leaflet/Google Maps) affichant les mosquées.
    *   Barre de recherche (par ville, nom).
    *   Liste des mosquées "À la une" ou les plus proches (géolocalisation).
*   **`/mosque/[id]` (Détail Mosquée)**
    *   **En-tête** : Photo, Nom, Adresse, Itinéraire.
    *   **Horaires** : Prières du jour (Fajr, Dhuhr, Asr, Maghrib, Isha) + Jumu'ah. Indication du décalage Iqamah.
    *   **Services** : Icônes (Femmes, PMR, Parking, École).
    *   **Onglet "Entraide"** : Liste des besoins actuels (ex: Travaux, Bénévolat).
    *   **Onglet "Événements"** : Calendrier des activités à venir.
*   **`/login`** : Formulaire de connexion (Superviseur / Admin).
*   **`/register`** : Formulaire de demande de création de compte Superviseur (nécessite validation Admin).
    *   Champs : Nom, Email, Infos de la mosquée à revendiquer ou créer.

## 2. Zone Superviseur (Authentifié)
Accessible uniquement aux utilisateurs ayant le rôle `SUPERVISOR` et dont le compte est validé. Le superviseur gère **une** mosquée (ou plusieurs si étendu plus tard).

*   **`/dashboard`** : Vue d'ensemble (Vue rapide des horaires, prochains événements).
*   **`/dashboard/profile`** : Édition des informations de la mosquée.
    *   Modifier nom, adresse, description.
    *   Upload de photos.
    *   Sélection des services disponibles.
*   **`/dashboard/prayers`** : Gestion des horaires.
    *   Configuration de la méthode de calcul (API).
    *   Ajustement manuel des minutes pour l'Iqamah.
*   **`/dashboard/events`** : Gestion des événements.
    *   Bouton "Ajouter un événement".
    *   Liste (Modifier / Supprimer).
*   **`/dashboard/needs`** : Gestion des besoins (Module Entraide).
    *   Créer une demande (Titre, Description).
    *   Marquer comme "Pourvu/Résolu".

## 3. Zone Admin (Authentifié)
Accessible uniquement aux utilisateurs ayant le rôle `ADMIN`.

*   **`/admin`** : Tableau de bord global (Stats : nb mosquées, nb utilisateurs).
*   **`/admin/validations`** : File d'attente des validations.
    *   Liste des nouvelles mosquées / superviseurs en attente.
    *   Actions : Valider ou Rejeter (avec motif).
*   **`/admin/users`** : Gestion des utilisateurs (Bannir, Modifier rôle).
*   **`/admin/mosques`** : Liste complète des mosquées (accès éditeur global en cas de problème).

## Architecture Technique (Routing)
L'application utilisera le système de routing de Next.js (App Router).

```
app/
├── (public)/
│   ├── page.tsx           # Accueil / Carte
│   ├── login/
│   ├── register/
│   └── mosque/
│       └── [id]/
│           └── page.tsx   # Détails Mosquée
├── (protected)/
│   ├── layout.tsx         # Vérification Auth (Session)
│   ├── dashboard/         # Espace Superviseur
│   │   ├── page.tsx
│   │   ├── profile/
│   │   ├── prayers/
│   │   ├── events/
│   │   └── needs/
│   └── admin/             # Espace Admin (Role Guard: Admin only)
│       ├── page.tsx
│       ├── validations/
│       └── users/
└── api/                   # API Routes (Next.js / Supabase handling)
```
