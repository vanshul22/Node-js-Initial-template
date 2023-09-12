# Node Js Starter Template API with MySQL, Express and JWT Authentication.

## Introduction

This project provides a RESTful API for user management. It allows users to register, login, view their profile and update their information. The API is built using Node.js, Express and MySQL. It utilizes JSON Web Tokens (JWT) for authentication.

## Prerequisites

To run this project, you will need the following:

- Node.js installed on your system.
- MySQL database server running.
- A MySQL client, such as MySQL Workbench, to create and manage the database.

## Setup

1. Clone the project repository.

```sh
git https://github.com/vanshul22/Node-js-Initial-template.git
```

2. Install the dependencies.

```sh
npm install
```

3. Create a `.env` file in the project root directory and add the following environment variables:

```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=password
DB_NAME=test
JWT_SECRET=secret
```

4. Create the database and tables.

```sh
mysql -u root -p password -D test < schema.sql
```

5. Server :

(A) Start the Production server.

```sh
npm run start
```

(B) Start the Development Server.

```sh
npm run dev
```

## Usage

### Register a new user

```sh
curl -X POST http://localhost:3000/api/users -H "Content-Type: application/json" -d '{"username": "johndoe", "password": "secret"}'
```

### Login

```sh
curl -X POST http://localhost:3000/api/users/login -H "Content-Type: application/json" -d '{"username": "johndoe", "password": "secret"}'
```

### Get all users

```sh
curl -X GET http://localhost:3000/api/users -H "Authorization: Bearer <token>" -H "Content-Type: application/json"
```

### Get a user by ID

```sh
curl -X GET http://localhost:3000/api/users/1 -H "Authorization: Bearer <token>" -H "Content-Type: application/json"
```

### Update a user

```sh
curl -X PUT http://localhost:3000/api/users/1 -H "Authorization: Bearer <token>" -H "Content-Type: application/json"
```

### Delete a user

```sh
curl -X DELETE http://localhost:3000/api/users/1 -H "Authorization: Bearer <token>" -H "Content-Type: application/json"
```
