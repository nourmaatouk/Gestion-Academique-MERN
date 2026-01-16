# Backend - Gestion Académique

Backend microservices pour le système de gestion académique.

## Architecture

```
backend/
├── api-gateway/       # Point d'entrée unique (port 3000)
├── auth-service/      # Authentification & JWT (port 3001)
├── user-service/      # Gestion étudiants & enseignants (port 3002)
├── course-service/    # Cours, départements, inscriptions (port 3003)
├── grade-service/     # Gestion des notes (port 3004)
├── seed-admin.js      # Script pour créer un admin
└── seed-teacher.js    # Script pour créer un enseignant
```

## Prérequis

- Node.js 18+
- MongoDB (local ou Atlas)

## Installation

```bash
# Installer les dépendances de chaque service
cd backend
npm install

cd api-gateway && npm install && cd ..
cd auth-service && npm install && cd ..
cd user-service && npm install && cd ..
cd course-service && npm install && cd ..
cd grade-service && npm install && cd ..
```

## Configuration

Créer un fichier `.env` dans chaque service :

### auth-service/.env
```
PORT=3001
MONGODB_URI=mongodb://localhost:27017/gestion-academique
JWT_SECRET=your_secret_key
JWT_EXPIRES_IN=7d
```

### user-service/.env
```
PORT=3002
MONGODB_URI=mongodb://localhost:27017/gestion-academique
JWT_SECRET=your_secret_key
AUTH_SERVICE_URL=http://localhost:3001/api/auth
```

### course-service/.env
```
PORT=3003
MONGODB_URI=mongodb://localhost:27017/gestion-academique
JWT_SECRET=your_secret_key
```

### grade-service/.env
```
PORT=3004
JWT_SECRET=your_secret_key
COURSE_SERVICE_URL=http://localhost:3003/api/courses
```

### api-gateway/.env
```
PORT=3000
```

## Démarrage

```bash
# Démarrer tous les services (depuis le dossier backend)
npm run dev

# Ou démarrer individuellement
cd api-gateway && npm run dev
cd auth-service && npm run dev
cd user-service && npm run dev
cd course-service && npm run dev
cd grade-service && npm run dev
```

## Créer un Admin

```bash
node seed-admin.js
```

Crée un utilisateur admin avec :
- Email: admin@test.com
- Password: password123

## API Endpoints

### Auth Service (via Gateway)
| Méthode | Route | Description |
|---------|-------|-------------|
| POST | /api/auth/register | Inscription |
| POST | /api/auth/login | Connexion |
| GET | /api/auth/verify | Vérifier token |

### User Service (via Gateway)
| Méthode | Route | Description |
|---------|-------|-------------|
| GET | /api/users/students | Liste étudiants |
| POST | /api/users/students | Créer étudiant |
| GET | /api/users/students/:id | Détail étudiant |
| PATCH | /api/users/students/:id | Modifier étudiant |
| DELETE | /api/users/students/:id | Supprimer étudiant |
| GET | /api/users/students/profile | Profil étudiant connecté |
| GET | /api/users/teachers | Liste enseignants |
| POST | /api/users/teachers | Créer enseignant |
| GET | /api/users/teachers/:id | Détail enseignant |
| PATCH | /api/users/teachers/:id | Modifier enseignant |
| DELETE | /api/users/teachers/:id | Supprimer enseignant |
| GET | /api/users/teachers/profile | Profil enseignant connecté |

### Course Service (via Gateway)
| Méthode | Route | Description |
|---------|-------|-------------|
| GET | /api/courses/courses | Liste cours |
| POST | /api/courses/courses | Créer cours |
| GET | /api/courses/courses/:id | Détail cours |
| PATCH | /api/courses/courses/:id | Modifier cours |
| DELETE | /api/courses/courses/:id | Supprimer cours |
| GET | /api/courses/departments | Liste départements |
| POST | /api/courses/departments | Créer département |
| PATCH | /api/courses/departments/:id | Modifier département |
| DELETE | /api/courses/departments/:id | Supprimer département |
| GET | /api/courses/enrollments | Liste inscriptions |
| POST | /api/courses/enrollments | Créer inscription |
| GET | /api/courses/enrollments/student/:studentId | Inscriptions d'un étudiant |
| GET | /api/courses/enrollments/course/:courseId | Inscriptions d'un cours |
| PATCH | /api/courses/enrollments/:enrollmentId | Modifier inscription |
| DELETE | /api/courses/enrollments/:enrollmentId | Supprimer inscription |
| GET | /api/courses/assignments | Liste affectations |
| POST | /api/courses/assignments | Affecter enseignant à cours |
| GET | /api/courses/assignments/teacher/:teacherId | Cours d'un enseignant |
| PATCH | /api/courses/assignments/:id | Modifier affectation |
| DELETE | /api/courses/assignments/:id | Supprimer affectation |

### Grade Service (via Gateway)
| Méthode | Route | Description |
|---------|-------|-------------|
| PATCH | /api/grades/update | Mettre à jour une note |
| GET | /api/grades/student/:studentId | Notes d'un étudiant |
| GET | /api/grades/course/:courseId | Notes d'un cours |

## Rôles & Permissions

| Rôle | Permissions |
|------|-------------|
| **admin** | Accès complet à toutes les ressources |
| **teacher** | Voir étudiants, gérer notes de ses cours |
| **student** | Voir son profil, ses cours, ses notes |

## Technologies

- **Express.js** - Framework web
- **MongoDB** - Base de données
- **Mongoose** - ODM MongoDB
- **JWT** - Authentification
- **bcryptjs** - Hashage mots de passe
- **Axios** - Communication inter-services
