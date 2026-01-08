# Task Manager API

Una API RESTful per gestionar usuaris i tasques amb autenticació i permisos d'administrador.

---

## Índex

- [Instal·lació](#instal·lació)  
- [Variables d'entorn](#variables-dentorn)  
- [Endpoints](#endpoints)  
- [Exemples d'ús](#exemples-dús)  
- [Sistema d'autenticació](#sistema-dautenticació)  

---

## Instal·lació

1. Clona el repositori:

```bash
git clone <URL_DEL_REPOSITORI>
cd task-manager-api

```
Instal·la dependències:
```bash
npm install
```
Crea un fitxer .env a la carpeta arrel amb les següents variables:
```bash
PORT=3000
MONGO_URI=mongodb://localhost:27017/task-manager
JWT_SECRET=la_teva_clau_secreta
JWT_EXPIRE=7d
```
Inicia el servidor:
```bash
node app.js
```
Variables d'entorn

PORT: port on s'executa l'API (per defecte 3000)
MONGO_URI: URI de la base de dades MongoDB
JWT_SECRET: clau secreta per generar tokens JWT
JWT_EXPIRE: temps d'expiració del token (ex: 7d, 1h)

Endpoints
Autenticació

POST /api/auth/register – Registrar un usuari nou
Body (JSON):

{
  "name": "Nom",
  "email": "email@example.com",
  "password": "123456"
}

POST /api/auth/login – Login d'un usuari
Body (JSON):
{
  "email": "email@example.com",
  "password": "123456"
}

GET /api/auth/me – Obtenir perfil de l'usuari (requereix token)
Header:
Authorization: Bearer <TOKEN>

PUT /api/auth/profile – Actualitzar perfil de l'usuari
Header: Authorization: Bearer <TOKEN>
Body (JSON):
{
  "name": "Nou Nom",
  "email": "nouemail@example.com"
}
PUT /api/auth/change-password – Canviar contrasenya
Header: Authorization: Bearer <TOKEN>
Body (JSON):
{
  "currentPassword": "123456",
  "newPassword": "nova123456"
}

Tasques

POST /api/tasks – Crear tasca (usuari autenticat)

GET /api/tasks – Obtenir tasques de l'usuari

Admin (només rol admin)

GET /api/admin/users – Obtenir tots els usuaris

PUT /api/admin/users/:id/role – Canviar rol d'un usuari
Body (JSON):
{ "role": "admin" }

DELETE /api/admin/users/:id – Eliminar un usuari i les seves tasques

GET /api/admin/tasks – Obtenir totes les tasques de tots els usuaris

Nota: Un usuari normal que intenti accedir a rutes d'admin obté error:
{
  "success": false,
  "error": "No tens permisos per accedir a aquest recurs"
}

1️⃣ Registrar un usuari nou

Mètode: POST

URL: http://localhost:3000/api/auth/register

Headers:

Content-Type: application/json


Body (raw JSON):

{
  "name": "Joan Garcia",
  "email": "joan@example.com",
  "password": "123456"
}


Resposta esperada:

{
  "success": true,
  "message": "Usuari registrat correctament",
  "data": {
    "token": "<TOKEN_USUARI>",
    "user": {
      "name": "Joan Garcia",
      "email": "joan@example.com",
      "role": "user",
      "_id": "..."
    }
  }
}

2️⃣ Login d’un usuari

Mètode: POST

URL: http://localhost:3000/api/auth/login

Headers:

Content-Type: application/json


Body (raw JSON):

{
  "email": "joan@example.com",
  "password": "123456"
}


Resposta esperada:

{
  "success": true,
  "message": "Sessió iniciada correctament",
  "data": {
    "token": "<TOKEN_USUARI>",
    "user": {
      "name": "Joan Garcia",
      "email": "joan@example.com",
      "role": "user",
      "_id": "..."
    }
  }
}

3️⃣ Obtenir perfil de l’usuari

Mètode: GET

URL: http://localhost:3000/api/auth/me

Headers:

Authorization: Bearer <TOKEN_USUARI>


Resposta esperada:

{
  "success": true,
  "data": {
    "name": "Joan Garcia",
    "email": "joan@example.com",
    "role": "user",
    "_id": "..."
  }
}

4️⃣ Crear tasca (usuari autenticat)

Mètode: POST

URL: http://localhost:3000/api/tasks

Headers:

Authorization: Bearer <TOKEN_USUARI>
Content-Type: application/json


Body (raw JSON):

{
  "title": "Comprar pa",
  "description": "Recordar comprar pa demà"
}


Resposta esperada:
Tasca creada amb l’ID i l’usuari relacionat.

5️⃣ Obtenir tasques de l’usuari

Mètode: GET

URL: http://localhost:3000/api/tasks

Headers:

Authorization: Bearer <TOKEN_USUARI>


Resposta esperada:

{
  "success": true,
  "count": 1,
  "data": [
    {
      "title": "Comprar pa",
      "description": "Recordar comprar pa demà",
      "user": "..."
    }
  ]
}

6️⃣ Accedir a rutes d’admin amb usuari normal (error)

Mètode: GET

URL: http://localhost:3000/api/admin/users

Headers:

Authorization: Bearer <TOKEN_USUARI>


Resposta esperada:

{
  "success": false,
  "error": "No tens permisos per accedir a aquest recurs"
}

7️⃣ Login amb usuari admin

Mètode: POST

URL: http://localhost:3000/api/auth/login

Headers:

Content-Type: application/json


Body (raw JSON):

{
  "email": "admin@example.com",
  "password": "admin123"
}


Resposta esperada:
T’obté el token d’admin per fer peticions de rutes protegides.

8️⃣ Obtenir tots els usuaris (admin)

Mètode: GET

URL: http://localhost:3000/api/admin/users

Headers:

Authorization: Bearer <TOKEN_ADMIN>


Resposta esperada:

{
  "success": true,
  "count": 2,
  "data": [
    { "name": "Administrador", "email": "admin@example.com", "role": "admin", "_id": "..." },
    { "name": "Joan Garcia", "email": "joan@example.com", "role": "user", "_id": "..." }
  ]
}

9️⃣ Canviar rol d’un usuari (admin)

Mètode: PUT

URL: http://localhost:3000/api/admin/users/<USER_ID>/role

Headers:

Authorization: Bearer <TOKEN_ADMIN>
Content-Type: application/json


Body (raw JSON):

{
  "role": "admin"
}

10️⃣ Eliminar usuari (admin)

Mètode: DELETE

URL: http://localhost:3000/api/admin/users/<USER_ID>

Headers:

Authorization: Bearer <TOKEN_ADMIN>


Resposta esperada:
Usuari i totes les tasques relacionades eliminades correctament.
