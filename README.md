# 📚 BookWorm Backend API

A production-ready backend for a **Book Recommendation, Review, Tutorial & Reading Tracker** application.  
Built with **Node.js, Express, TypeScript, MongoDB** following a clean **Modular MVC architecture**.

## ✨ Core Features

### 🔐 Authentication & Authorization
- JWT based authentication
- Protected routes via `auth.middleware.ts`
- Role-based access via `role.middleware.ts`
- Admin-only routes enforced

---

### 📚 Book Module
- Create, Read, Update, Soft Delete (Admin)
- Genre population
- Duplicate title prevention
- Advanced querying using reusable QueryBuilder

**Query Support**
- Search (`searchTerm`)
- Filter (`genre`, `author`)
- Sort (`sort=-createdAt,title`)
- Pagination (`page`, `limit`)
- Field selection (`fields=title,author`)

---

### ⭐ Review Module
- Users can create reviews
- Reviews are `pending` by default
- Admin can approve reviews
- Only approved reviews are visible
- Soft delete supported

---

### 🎥 Tutorial Module
- Admin can create tutorials
- Admin can update and delete tutorials
- Auth required to access tutorials
- YouTube video URL support
- Soft delete implemented

---

### 📖 User Library (Bookshelf / Reading Tracker)
Allows users to manage their personal reading progress.

**Shelf States**
- `want` → Want to Read
- `reading` → Currently Reading
- `completed` → Finished Reading

**Business Rules**
- `want` → progress = `0`
- `reading` → progress = `1–99`
- `completed` → progress = `100`
## 🚀 Tech Stack
- Node.js
- Express.js
- TypeScript
- MongoDB + Mongoose
- Zod (Request Validation)
- JWT Authentication
- Role Based Authorization (Admin / User)## 📌 API Reference

### 🌐 Base URL

```http
http://localhost:5000/api/v1
```

---

## 📚 Book API

### Get all books

```http
GET /book
```

| Query Parameter | Type   | Description                           |
| --------------- | ------ | ------------------------------------- |
| `searchTerm`    | string | Search by title, author               |
| `genre`         | string | Filter by genre id                    |
| `sort`          | string | Sort fields (e.g. `-createdAt,title`) |
| `page`          | number | Page number                           |
| `limit`         | number | Items per page                        |
| `fields`        | string | Select fields                         |

---

### Get single book

```http
GET /book/:id
```

| Parameter | Type   | Description |
| --------- | ------ | ----------- |
| `id`      | string | Book ID     |

---

### Create book (Admin)

```http
POST /book
```

---

### Update book (Admin)

```http
PATCH /book/:id
```

---

### Delete book (Admin – Soft delete)

```http
DELETE /book/:id
```

---

## 🏷️ Genre API

### Get all genres

```http
GET /genre
```

---

### Create genre (Admin)

```http
POST /genre
```

---

### Update genre (Admin)

```http
PATCH /genre/:id
```

---

### Delete genre (Admin)

```http
DELETE /genre/:id
```

---

## ⭐ Review API

### Create review

```http
POST /review
```

---

### Get reviews by book

```http
GET /review/book/:bookId
```

| Parameter | Type   | Description |
| --------- | ------ | ----------- |
| `bookId`  | string | Book ID     |

---

### Approve review (Admin)

```http
PATCH /review/:id/approve
```

---

## 🎥 Tutorial API

### Get all tutorials

```http
GET /tutorial
```

---

### Create tutorial (Admin)

```http
POST /tutorial
```

---

### Update tutorial (Admin)

```http
PATCH /tutorial/:id
```

---

### Delete tutorial (Admin – Soft delete)

```http
DELETE /tutorial/:id
```

---

## 👤 User API

### Get all users (Admin)

```http
GET /user
```

---

### Get single user

```http
GET /user/:id
```

---

### Update user role (Admin)

```http
PATCH /user/:id
```

---

## 📖 User Library API

### Get my library

```http
GET /user-library
```

---

### Add book to library

```http
POST /user-library
```

---

### Update shelf / progress

```http
PATCH /user-library/:id
```

---

### Remove book from library

```http
DELETE /user-library/:id
```

---

## 🔐 Authentication Notes

Protected routes require the following header:

```http
Authorization: Bearer <TOKEN>
```

Admin-only routes require `role = Admin`.

---

## 📌 Shelf States (User Library)

| Value       | Meaning           |
| ----------- | ----------------- |
| `want`      | Want to Read      |
| `reading`   | Currently Reading |
| `completed` | Finished Reading  |

---


## Demo

Insert gif or link to demo


## Deployment

To deploy this project run

```bash
  npm run deploy
```


## Installation

Install my-project with npm

```bash
  npm install my-project
  cd my-project
```
    
