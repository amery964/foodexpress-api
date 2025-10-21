#  FoodExpress API

API RESTful développée avec **Node.js** et **Express.js**, permettant la gestion des **utilisateurs**, des **restaurants** et des **menus** pour la startup *FoodExpress*.  
Elle utilise **MongoDB** via Mongoose, **JWT** pour l’authentification, **Joi** pour la validation des entrées et **Swagger** pour la documentation.

---

##  Démarrage rapide

```bash
# Installation des dépendances
npm install

# Lancer le serveur en mode développement
npm run dev

# Lancer le serveur normalement
npm start
```

➡️ Par défaut, l’API tourne sur :  
**http://localhost:5000**

📘 Documentation Swagger :  
**http://localhost:5000/docs**

---

##  Configuration de l’environnement

Crée un fichier `.env` à la racine du projet :

```bash
PORT=5000
MONGO_URI=mongodb://localhost:27017/foodexpress
JWT_SECRET=supersecretchangeit
```

---

##  Endpoints principaux

###  `/api/users`

| Méthode | Endpoint | Accès | Description |
|----------|-----------|--------|--------------|
| **POST** | `/api/users` | Public | Créer un compte utilisateur |
| **POST** | `/api/users/login` | Public | Connexion (retourne un token JWT) |
| **GET** | `/api/users/me` | Authentifié | Voir le profil de l’utilisateur connecté |
| **GET** | `/api/users` | Admin | Lister tous les utilisateurs |
| **PATCH** | `/api/users/:id` | Auth (self ou admin) | Modifier un utilisateur |
| **DELETE** | `/api/users/:id` | Auth (self ou admin) | Supprimer un utilisateur |

---

### `/api/restaurants`

| Méthode | Endpoint | Accès | Description |
|----------|-----------|--------|--------------|
| **GET** | `/api/restaurants` | Public | Lister les restaurants (tri et pagination) |
| **GET** | `/api/restaurants/:id` | Public | Détails d’un restaurant |
| **POST** | `/api/restaurants` | Admin | Créer un restaurant |
| **PATCH** | `/api/restaurants/:id` | Admin | Modifier un restaurant |
| **DELETE** | `/api/restaurants/:id` | Admin | Supprimer un restaurant |

---

### `/api/menus`

| Méthode | Endpoint | Accès | Description |
|----------|-----------|--------|--------------|
| **GET** | `/api/menus` | Public | Lister les menus (tri et pagination) |
| **GET** | `/api/menus/:id` | Public | Détails d’un menu |
| **POST** | `/api/menus` | Admin | Créer un menu |
| **PATCH** | `/api/menus/:id` | Admin | Modifier un menu |
| **DELETE** | `/api/menus/:id` | Admin | Supprimer un menu |

---

##  Authentification

- Authentification par **JWT** (Bearer Token)
- Exemple de header :
  ```
  Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
  ```
- Le token est obligatoire pour toutes les routes protégées (sauf lecture publique)

---

##  Tests

```bash
npm test
```

Tests automatisés avec **Jest** et **Supertest** :  
- Vérification du login et de l’inscription  
- Vérification des autorisations (401 / 403 / 200)  
- Tests CRUD utilisateurs, restaurants, menus  
- Routes publiques (`GET`) accessibles sans token  

---

##  Technologies utilisées

- **Node.js / Express.js**
- **MongoDB / Mongoose**
- **JWT (jsonwebtoken)**
- **Joi** – Validation des données
- **Swagger UI** – Documentation automatique
- **Jest + Supertest** – Tests unitaires et d’intégration
- **bcrypt** – Hash des mots de passe

---

##  Notes

- Base de données locale : `mongodb://localhost:27017/foodexpress`
- Architecture du projet :
  ```
  src/
  ├── controllers/
  ├── models/
  ├── routes/
  ├── middlewares/
  ├── validations/
  ├── docs/
  config/
  ```
- Respect des bonnes pratiques REST  
- Hash sécurisé des mots de passe avec bcrypt  
- Validation des entrées utilisateurs avec Joi  
- Documentation interactive Swagger disponible sur `/docs`

---

## Auteur

Projet réalisé par **Farouk et AMERY**  
Étudiants en 3ᵉ année Bachelor Informatique à **SUPINFO**  
Projet académique : **FoodExpress API**