# Frontend - Gestion Académique

Application React/TypeScript pour le système de gestion académique.

## Technologies

- **React 19** - Bibliothèque UI
- **TypeScript** - Typage statique
- **Vite** - Build tool
- **Tailwind CSS** - Framework CSS
- **React Router** - Navigation
- **Axios** - Client HTTP

## Structure

```
frontend/src/
├── components/
│   ├── layout/           # Layouts (Admin, Teacher, Student)
│   └── ui/               # Composants UI réutilisables
├── features/
│   ├── assignments/      # API & types affectations
│   ├── courses/          # API & types cours
│   ├── departments/      # API & types départements
│   ├── enrollments/      # API & types inscriptions
│   ├── grades/           # API & types notes
│   ├── students/         # API & types étudiants
│   └── teachers/         # API & types enseignants
├── pages/
│   ├── admin/            # Pages admin (Dashboard, Students, Teachers, etc.)
│   ├── auth/             # Page de connexion
│   ├── student/          # Pages étudiant (Dashboard, Courses, Grades)
│   └── teacher/          # Pages enseignant (Dashboard, Courses, Grades)
├── services/
│   ├── api.ts            # Instance Axios configurée
│   └── token.ts          # Gestion JWT (stockage, décodage)
├── App.tsx               # Routes principales
└── main.tsx              # Point d'entrée
```

## Installation

```bash
cd frontend
npm install
```

## Tailwind CSS

Tailwind CSS est déjà configuré dans le projet. Les fichiers de configuration :

- `tailwind.config.js` - Configuration Tailwind
- `postcss.config.js` - Configuration PostCSS
- `src/index.css` - Import des directives Tailwind

Si vous devez réinstaller Tailwind :

```bash
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

## Configuration

Le frontend utilise un proxy Vite pour communiquer avec le backend.

Fichier `vite.config.ts` :
```typescript
server: {
  proxy: {
    "/api": {
      target: "http://localhost:3000",  // API Gateway
      changeOrigin: true,
    },
  },
}
```

## Démarrage

```bash
# Mode développement
npm run dev

# Build production
npm run build

# Preview production
npm run preview
```

L'application sera accessible sur http://localhost:5173

## Pages

### Authentification
- `/login` - Page de connexion

### Admin (`/admin/*`)
- `/admin` - Dashboard avec statistiques
- `/admin/students` - Gestion des étudiants
- `/admin/teachers` - Gestion des enseignants
- `/admin/courses` - Gestion des cours
- `/admin/departments` - Gestion des départements
- `/admin/enrollments` - Gestion des inscriptions
- `/admin/assignments` - Affectation enseignants/cours
- `/admin/grades` - Gestion des notes

### Enseignant (`/teacher/*`)
- `/teacher` - Dashboard enseignant
- `/teacher/courses` - Mes cours
- `/teacher/grades` - Gérer les notes

### Étudiant (`/student/*`)
- `/student` - Dashboard étudiant
- `/student/courses` - Mes cours
- `/student/grades` - Mes notes

## Comptes de test

| Rôle | Email | Mot de passe |
|------|-------|--------------|
| Admin | admin@test.com | password123 |
| Teacher | teacher@test.com | password123 |
| Student | student@test.com | password123 |

## Scripts

| Commande | Description |
|----------|-------------|
| `npm run dev` | Démarre le serveur de développement |
| `npm run build` | Build pour la production |
| `npm run preview` | Preview du build de production |
| `npm run lint` | Vérifie le code avec ESLint |
