# Node.js REST API

A simple REST API built with pure Node.js to practice backend fundamentals without using Express or other frameworks.

## Features

* Users API
* Products API
* Get users list
* Search users
* Sort users by different fields
* Ascending and descending sorting
* Get user by ID
* Get products list
* Get product by ID
* HTTP status codes
* Error handling with `try/catch`
* Async file operations with `fs/promises`
* JSON file as a simple data source

## Technologies

* Node.js
* JavaScript
* HTTP Module
* File System (`fs/promises`)
* JSON

## API Endpoints

### Users

```text
GET /api/users/usersGetList
GET /api/users/userGetById?id=1
```

Search:

```text
GET /api/users/usersGetList?q=soroush
```

Search and sort:

```text
GET /api/users/usersGetList?q=soroush&sort=name&sortType=1
```

`sortType`:

* `1` → Ascending
* `2` → Descending

### Products

```text
GET /api/products/productsGetList
GET /api/products/productGetById?id=1
```

## Purpose

This project is part of my Node.js backend learning journey.

The main goal is to understand Node.js fundamentals such as HTTP servers, routing, asynchronous I/O, file handling, query parameters, error handling, and the Event Loop before moving to frameworks like Express and NestJS.

## How to Run

```bash
node server.js
```

The server will run on:

```text
http://127.0.0.1:3000
```
