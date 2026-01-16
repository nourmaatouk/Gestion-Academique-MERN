# Gestion Académique - MERN Microservices

Système complet de gestion académique basé sur une architecture microservices avec une stack MERN (MongoDB, Express, React, Node.js).
Ce projet permet la gestion des étudiants, enseignants, cours, notes et départements via une interface moderne et des services backend découplés.

## 🏗 Architecture

### Diagramme de Microservices

```mermaid
graph TD
    Client[Client (Frontend - React/Vite)]
    Gateway[API Gateway (3000)]
    Auth[Auth Service (3001)]
    User[User Service (3002)]
    Course[Course Service (3003)]
    Grade[Grade Service (3004)]
    DB[(MongoDB)]

    Client -->|HTTP API| Gateway
    Gateway -->|Auth API| Auth
    Gateway -->|User API| User
    Gateway -->|Course API| Course
    Gateway -->|Grade API| Grade

    Auth --> DB
    User --> DB
    Course --> DB
    Grade --> DB
### Structure du Projet

```
gestion-academique-mern/
├── backend/                  # Services Backend
│   ├── api-gateway/          # Point d'entrée (Port 3000)
│   ├── auth-service/         # Service d'authentification
│   ├── user-service/         # Service Utilisateurs
│   ├── course-service/       # Service Cours
│   └── grade-service/        # Service Notes
├── frontend/                 # Application React
│   └── src/
│       ├── components/       # Composants UI
│       ├── features/         # Logique métier (Redux/Context)
│       └── pages/            # Vues de l'application
└── README.md                 # Documentation
```

Le projet est divisé en deux parties principales :

### Backend (Microservices)
Une architecture microservices gérée via un API Gateway central.
- **API Gateway** (Port 3000) : Point d'entrée unique.
- **Auth Service** (Port 3001) : Authentification & JWT.
- **User Service** (Port 3002) : Gestion des étudiants et enseignants.
- **Course Service** (Port 3003) : Gestion des cours, départements et inscriptions.
- **Grade Service** (Port 3004) : Gestion des notes.

Voir la [Documentation Backend](./backend/README.md) pour plus de détails sur l'API et les modèles.

### Frontend
Une application SPA rapide et réactive construite avec Vite.
- **Technos** : React 19, TypeScript, Tailwind CSS.
- **Fonctionnalités** : Dashboards par rôle (Admin, Teacher, Student), gestion des entités, visualisation des notes.

Voir la [Documentation Frontend](./frontend/README.md) pour plus de détails sur l'interface et les composants.

## 🚀 Prérequis

- [Node.js](https://nodejs.org/) (v18+)
- [MongoDB](https://www.mongodb.com/) (Local ou Atlas)

## 📦 Installation

Un script utilitaire est disponible dans le backend pour installer toutes les dépendances.

1.  **Cloner le projet**
    ```bash
    git clone <votre-url-repo>
    cd gestion-academique-mern
    ```

2.  **Installer les dépendances Backend**
    ```bash
    cd backend
    npm run install-all
    ```
    *Cette commande installe les dépendances pour l'API Gateway et tous les microservices.*

3.  **Installer les dépendances Frontend**
    ```bash
    cd ../frontend
    npm install
    ```

## ⚙️ Configuration

Vous devez configurer les variables d'environnement pour chaque service backend.
Consultez la section [Configuration du Backend](./backend/README.md#configuration) pour voir les variables requises (`.env`) pour chaque service.

Pour le frontend, la configuration par défaut proxy les requêtes vers `http://localhost:3000`.

## ▶️ Démarrage

### Lancer tout le système (Dev)

Pour un développement efficace, il est conseillé d'ouvrir deux terminaux :

**Terminal 1 : Backend**
Lance tous les microservices et la gateway en parallèle.
```bash
cd backend
npm run dev
```

**Terminal 2 : Frontend**
Lance le serveur de développement Vite.
```bash
cd frontend
npm run dev
```

L'application sera accessible sur : **http://localhost:5173**

## 🔑 Comptes de Test (Seed)

Pour initialiser la base de données avec des comptes administrateur et enseignant par défaut :

```bash
cd backend
node seed-admin.js    # Crée admin@test.com / password123
node seed-teacher.js  # Crée teacher@test.com / password123
```

- **Étudiant** : `student@test.com` / `password123` (à créer ou voir seed si disponible)

## 🛠 Technologies Principales

-   **Backend**: Node.js, Express, MongoDB, Mongoose, JWT, Microservices pattern.
-   **Frontend**: React, TypeScript, Vite, Tailwind CSS, Axios, React Router.
-   **DevOps/Tools**: Concurrently, ESLint.
