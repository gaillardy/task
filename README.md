
#  TaskFlow - Gestion de tâches

Bienvenue dans **TaskFlow**, un gestionnaire de tâches moderne développé avec **Laravel 10**. Ce projet permet de gérer des tâches de manière simple.

---

##  Introduction

Cette API a été conçue pour fournir une interface intuitive et sécurisée afin de :
- Créer des tâches
- Lire/lister des tâches
- Mettre à jour des tâches
- Supprimer des tâches

Elle respecte les conventions REST et est construite autour du framework **Laravel 10**, offrant des performances solides, et une architecture claire.

---

##  Caractéristiques du Projet

-  API RESTful construite avec Laravel 10
-  Réponses JSON bien formatées
-  CRUD complet via API REST
-  Tri par date et statut
-  Animations fluides
-  Persistance des données

---

##  API Endpoints

Chaque endpoint est détaillé ci-dessous avec son URL, méthode HTTP et description.

---

###  Liste des tâches

- **URL** : `/api/tasks`
- **Méthode** : `GET`
- **Description** : Récupère la liste complète des tâches.

---

###  Créer une tâche

- **URL** : `/api/tasks`
- **Méthode** : `POST`
- **Description** : Crée une nouvelle tâche.



---

###  Modifier une tâche

- **URL** : `/api/tasks/edit/{task}`
- **Méthode** : `PUT`
- **Description** : Met à jour une tâche existante.


---

###  Supprimer une tâche

- **URL** : `/api/tasks/delete/{task}`
- **Méthode** : `DELETE`
- **Description** : Supprime une tâche spécifique.


---

##  Démarrer le projet

Voici les étapes à suivre pour démarrer ce projet localement :

```bash
# Cloner le dépôt
git clone https://github.com/ton-utilisateur/task-manager.git

# Aller dans le répertoire du projet
cd task-manager

# Installer les dépendances
composer install

# Copier le fichier d'environnement
cp .env.example .env

# Générer la clé d'application
php artisan key:generate

# Configurer la base de données dans le fichier `.env`

# Migrer et insérer les données initiales
php artisan migrate:fresh --seed

# Lancer le serveur de développement
php artisan serve
```

---

##  Liens utiles Laravel 10

Voici quelques ressources Laravel utilisées dans ce projet :

- [Documentation officielle de Laravel 10](https://laravel.com/docs/10.x)
- [Routing Laravel](https://laravel.com/docs/10.x/routing)
- [Seeder et Migration](https://laravel.com/docs/10.x/seeding)
- [Controller Resource](https://laravel.com/docs/10.x/controllers#resource-controllers)
- [Validation des données](https://laravel.com/docs/10.x/validation)


