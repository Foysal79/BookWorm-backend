# BookWorm — Backend API (Project Analysis + Documentation)

A cozy-library themed **Book Recommendation + Reading Tracker** backend with **role-based access (Admin/User)**, fully protected routes, and modular MVC architecture.

---

## ✨ Project Overview

**BookWorm** has two roles:

- **User**: browse/search books, manage shelves (Want / Reading / Read), track progress, submit reviews, watch tutorials, view stats and recommendations.
- **Admin**: manage users/roles, books, genres, moderate reviews, manage tutorial links.

**Core goals**
- ✅ All routes protected (no public homepage idea on backend → all endpoints except auth require token)
- ✅ Server-side authentication + authorization (JWT)
- ✅ Modular MVC codebase
- ✅ Strong validation + consistent error handling

---

## 🧰 Tech Stack

- **Node.js + Express**
- **TypeScript**
- **MongoDB + Mongoose**
- **Auth**: JWT (access + refresh) + bcrypt
- **Validation**: Zod / Joi
- **Uploads**: Cloudinary (recommended) or local

---

## 🔐 Authentication & Authorization

### Registration
**Inputs**: `name`, `email (unique)`, `photo (optional upload)`, `password`

**Rules**
- Duplicate email blocked
- Password must be strong (min length + complexity)
- Password stored as hash (bcrypt)

### Login
**Inputs**: `email`, `password`

**Flow**
- Verify credentials
- Issue JWT token(s)

### Route Protection
- Every non-auth endpoint requires a valid token
- Role-based access:
  - **Admin-only**: manage books/genres/users/reviews/tutorials
  - **User/Admin**: library, stats, browse, tutorials (read)

---

## 📁 Folder Structure (Modular MVC)

```bash
src/
  app.ts
  server.ts

  config/
    index.ts

  middlewares/
    auth.middleware.ts
    requireRole.middleware.ts
    validateRequest.middleware.ts
    globalErrorHandler.ts
    notFound.ts

  modules/
    auth/
      auth.controller.ts
      auth.service.ts
      auth.route.ts
      auth.validation.ts

    user/
      user.model.ts
      user.interface.ts
      user.controller.ts
      user.service.ts
      user.route.ts
      user.validation.ts

    genre/
      genre.model.ts
      genre.interface.ts
      genre.controller.ts
      genre.service.ts
      genre.route.ts
      genre.validation.ts

    book/
      book.model.ts
      book.interface.ts
      book.controller.ts
      book.service.ts
      book.route.ts
      book.validation.ts

    review/
      review.model.ts
      review.interface.ts
      review.controller.ts
      review.service.ts
      review.route.ts
      review.validation.ts

    tutorial/
      tutorial.model.ts
      tutorial.interface.ts
      tutorial.controller.ts
      tutorial.service.ts
      tutorial.route.ts
      tutorial.validation.ts

    userLibrary/
      userLibrary.model.ts
      userLibrary.interface.ts
      userLibrary.controller.ts
      userLibrary.service.ts
      userLibrary.route.ts
      userLibrary.validation.ts

    readingGoal/
      readingGoal.model.ts
      readingGoal.interface.ts
      readingGoal.controller.ts
      readingGoal.service.ts
      readingGoal.route.ts
      readingGoal.validation.ts

    stats/
      stats.controller.ts
      stats.service.ts
      stats.route.ts

```

---

## 🗃️ Database Schema (MongoDB)

### User
- `_id`
- `name`
- `email` (unique)
- `passwordHash`
- `photoUrl`
- `role`: `Admin | User`
- `createdAt`, `updatedAt`

### Genre
- `_id`
- `name` (unique)
- `slug` (unique)

### Book
- `_id`
- `title`
- `author`
- `genreId` (ref Genre)
- `description`
- `coverImageUrl`
- `totalPages` (optional but helpful)
- `avgRating` (derived)
- `approvedReviewCount` (derived)
- `shelvedCount` (derived)

### Review
- `_id`
- `bookId` (ref Book)
- `userId` (ref User)
- `rating` (1–5)
- `text`
- `status`: `pending | approved`
- `createdAt`

### LibraryItem (User Shelves)
- `_id`
- `userId` (ref User)
- `bookId` (ref Book)
- `shelf`: `want | reading | read`
- `progressPercent` OR `pagesRead`
- `startedAt`, `finishedAt`
- Unique index: `(userId, bookId)`

### ReadingGoal
- `_id`
- `userId`
- `year` (e.g., 2026)
- `goalBooks` (e.g., 50)

### Tutorial
- `_id`
- `title`
- `youtubeUrl`
- `youtubeVideoId`
- `createdBy` (admin userId)

---

## 🌐 Base URLs

- **Production**: `https://bookreading-five.vercel.app/api/v1`
- **Local**: `http://localhost:5000/api/v1`

---

## 🧾 Authorization Header

Most endpoints require:

```http
Authorization: Bearer <token>
Content-Type: application/json
```

---

## 🧩 API Endpoints

### Auth / User (`/user`)

#### Register (Public)
- **POST** `/user/register`

```json
{
  "name": "Foysal",
  "email": "foysal@gmail.com",
  "password": "123456"
}
```

#### Login (Public)
- **POST** `/user/login`

```json
{
  "email": "foysal@gmail.com",
  "password": "123456"
}
```

**Response**
```json
{
  "success": true,
  "data": {
    "accessToken": "JWT_TOKEN_HERE",
    "user": {
      "_id": "USER_ID",
      "name": "Foysal",
      "email": "foysal@gmail.com",
      "role": "User"
    }
  }
}
```

#### Get All Users (Admin)
- **GET** `/user`

#### Get Single User (Self/Admin)
- **GET** `/user/:id`

#### Update User Role (Admin)
- **PATCH** `/user/:id`

```json
{ "role": "Admin" }
```

#### Delete User (Admin)
- **DELETE** `/user/:id`

---

### Book (`/book`)

#### Get All Books (Auth)
- **GET** `/book`

**Query (optional)**
- `searchTerm=atomic`
- `sort=-createdAt`
- `page=1&limit=10`
- `fields=title,author,genre`

#### Get Single Book (Auth)
- **GET** `/book/:id`

#### Create Book (Admin)
- **POST** `/book`

```json
{
  "title": "Atomic Habits",
  "author": "James Clear",
  "coverImageUrl": "https://...",
  "genre": "GENRE_ID",
  "description": "..."
}
```

#### Update Book (Admin)
- **PATCH** `/book/:id`

```json
{ "title": "Atomic Habits (Updated)" }
```

#### Delete Book (Admin)
- **DELETE** `/book/:id`

---

### Genre (`/genre`)

#### Get All Genres (Auth)
- **GET** `/genre`

#### Create Genre (Admin)
- **POST** `/genre`

```json
{ "name": "Fiction" }
```

#### Update Genre (Admin)
- **PATCH** `/genre/:id`

```json
{ "name": "Sci-Fi" }
```

#### Delete Genre (Admin)
- **DELETE** `/genre/:id`

---

### Review (`/review`)

#### Create Review (Auth)
- **POST** `/review`

```json
{
  "book": "BOOK_ID",
  "rating": 5,
  "comment": "Amazing book!"
}
```

#### Get Reviews By Book (Auth)
- **GET** `/review/book/:bookId`

#### Approve Review (Admin)
- **PATCH** `/review/:id/approve`

---

### User Library (`/user-library`)

#### Add to My Library (Auth)
- **POST** `/user-library`

```json
{
  "book": "BOOK_ID",
  "status": "reading"
}
```

#### Get My Library (Auth)
- **GET** `/user-library/me`

---

### Tutorial (`/tutorial`)

#### Get All Tutorials (Auth)
- **GET** `/tutorial`

#### Create Tutorial (Admin)
- **POST** `/tutorial`

```json
{
  "title": "How to build reading habit",
  "content": "..."
}
```

#### Update Tutorial (Admin)
- **PATCH** `/tutorial/:id`

#### Delete Tutorial (Admin)
- **DELETE** `/tutorial/:id`

---

### Reading Goal (`/reading-goal`)

#### Create Reading Goal (Auth)
- **POST** `/reading-goal`

```json
{
  "period": "monthly",
  "targetBook": 5,
  "startDate": "2026-01-01",
  "endDate": "2026-01-31"
}
```

#### Get My Goals (Auth)
- **GET** `/reading-goal/user/:userId`

#### Get My Active Goal (Auth)
- **GET** `/reading-goal/active/:userId`

#### Get Active Goal Progress (Auth)
- **GET** `/reading-goal/active/:userId/progress`

#### Update Goal (Auth)
- **PATCH** `/reading-goal/:id`

#### Delete Goal (Auth)
- **DELETE** `/reading-goal/:id`

---

## ✅ Quick Endpoint Table

| Module | Method | Endpoint | Access |
|---|---|---|---|
| User | POST | `/user/register` | Public |
| User | POST | `/user/login` | Public |
| User | GET | `/user` | Admin |
| User | GET | `/user/:id` | Self/Admin |
| User | PATCH | `/user/:id` | Admin |
| User | DELETE | `/user/:id` | Admin |
| Book | GET | `/book` | Auth |
| Book | GET | `/book/:id` | Auth |
| Book | POST | `/book` | Admin |
| Book | PATCH | `/book/:id` | Admin |
| Book | DELETE | `/book/:id` | Admin |
| Genre | GET | `/genre` | Auth |
| Genre | POST | `/genre` | Admin |
| Genre | PATCH | `/genre/:id` | Admin |
| Genre | DELETE | `/genre/:id` | Admin |
| Review | POST | `/review` | Auth |
| Review | GET | `/review/book/:bookId` | Auth |
| Review | PATCH | `/review/:id/approve` | Admin |
| Library | POST | `/user-library` | Auth |
| Library | GET | `/user-library/me` | Auth |
| Tutorial | POST | `/tutorial` | Admin |
| Tutorial | GET | `/tutorial` | Auth |
| Tutorial | PATCH | `/tutorial/:id` | Admin |
| Tutorial | DELETE | `/tutorial/:id` | Admin |
| Goal | POST | `/reading-goal` | Auth |
| Goal | GET | `/reading-goal/user/:userId` | Auth |
| Goal | GET | `/reading-goal/active/:userId` | Auth |
| Goal | GET | `/reading-goal/active/:userId/progress` | Auth |
| Goal | PATCH | `/reading-goal/:id` | Auth |
| Goal | DELETE | `/reading-goal/:id` | Auth |

---

## 🧠 Recommendation System (Simple + Explainable)

**Signals**
- User’s most-read genres
- User’s ratings pattern
- Community rating + approved review quality
- Most-shelved books

**Approach**
1. Find user’s top genres from `Read` shelf.
2. Build candidate pool:
   - Books in top genres **not already** in user shelves.
   - Add popular books by rating + shelved count.
3. Score candidates:
   - Genre match weight
   - Community average rating
   - Approved review count/quality
4. Return 12–18 books.

**Fallback**
- If user has < 3 books in `Read`, show popular + random + trending mix.

**“Why this book?” tooltip**
- Store a short explanation string, e.g.
  - `Matches your Mystery preference (4 books read) + high-rated reviews.`

---

## 🧯 Error Handling & Edge Cases

### Auth
- Wrong credentials
- Token expired → refresh flow
- Forbidden role access

### Books
- Invalid ID
- Genre not found
- Missing cover image

### Reviews
- Optional: block multiple reviews per user per book
- Pending reviews hidden from public/normal lists

### Library
- Prevent duplicates (unique index)
- Progress cannot exceed 100% / totalPages
- If shelf becomes `read` → auto set progress 100%

### Uploads
- Validate file type + size
- Cloud upload failure fallback

---

## 📦 Postman Collection

Copy-paste into a file:

`BookWorm.postman_collection.json`

Then import into Postman.

```json
{
  "info": {
    "name": "BookWorm API",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "variable": [
    { "key": "baseUrl", "value": "https://bookreading-five.vercel.app/api/v1" },
    { "key": "token", "value": "" },
    { "key": "userId", "value": "" },
    { "key": "bookId", "value": "" },
    { "key": "genreId", "value": "" },
    { "key": "reviewId", "value": "" },
    { "key": "tutorialId", "value": "" },
    { "key": "goalId", "value": "" }
  ],
  "item": [
    {
      "name": "User",
      "item": [
        {
          "name": "Register",
          "request": {
            "method": "POST",
            "header": [{ "key": "Content-Type", "value": "application/json" }],
            "url": { "raw": "{{baseUrl}}/user/register", "host": ["{{baseUrl}}"], "path": ["user", "register"] },
            "body": {
              "mode": "raw",
              "raw": "{\n  \"name\": \"Foysal\",\n  \"email\": \"foysal@gmail.com\",\n  \"password\": \"123456\"\n}"
            }
          }
        },
        {
          "name": "Login",
          "request": {
            "method": "POST",
            "header": [{ "key": "Content-Type", "value": "application/json" }],
            "url": { "raw": "{{baseUrl}}/user/login", "host": ["{{baseUrl}}"], "path": ["user", "login"] },
            "body": {
              "mode": "raw",
              "raw": "{\n  \"email\": \"foysal@gmail.com\",\n  \"password\": \"123456\"\n}"
            }
          },
          "event": [
            {
              "listen": "test",
              "script": {
                "type": "text/javascript",
                "exec": [
                  "try {",
                  "  const json = pm.response.json();",
                  "  const token = json?.data?.accessToken;",
                  "  if (token) pm.collectionVariables.set('token', token);",
                  "} catch (e) {}"
                ]
              }
            }
          ]
        },
        {
          "name": "Get All Users (Admin)",
          "request": {
            "method": "GET",
            "header": [{ "key": "Authorization", "value": "Bearer {{token}}" }],
            "url": { "raw": "{{baseUrl}}/user", "host": ["{{baseUrl}}"], "path": ["user"] }
          }
        },
        {
          "name": "Get Single User (Self/Admin)",
          "request": {
            "method": "GET",
            "header": [{ "key": "Authorization", "value": "Bearer {{token}}" }],
            "url": { "raw": "{{baseUrl}}/user/{{userId}}", "host": ["{{baseUrl}}"], "path": ["user", "{{userId}}"] }
          }
        },
        {
          "name": "Update User Role (Admin)",
          "request": {
            "method": "PATCH",
            "header": [
              { "key": "Authorization", "value": "Bearer {{token}}" },
              { "key": "Content-Type", "value": "application/json" }
            ],
            "url": { "raw": "{{baseUrl}}/user/{{userId}}", "host": ["{{baseUrl}}"], "path": ["user", "{{userId}}"] },
            "body": { "mode": "raw", "raw": "{\n  \"role\": \"Admin\"\n}" }
          }
        },
        {
          "name": "Delete User (Admin)",
          "request": {
            "method": "DELETE",
            "header": [{ "key": "Authorization", "value": "Bearer {{token}}" }],
            "url": { "raw": "{{baseUrl}}/user/{{userId}}", "host": ["{{baseUrl}}"], "path": ["user", "{{userId}}"] }
          }
        }
      ]
    },
    {
      "name": "Book",
      "item": [
        {
          "name": "Get All Books",
          "request": {
            "method": "GET",
            "header": [{ "key": "Authorization", "value": "Bearer {{token}}" }],
            "url": {
              "raw": "{{baseUrl}}/book?page=1&limit=10",
              "host": ["{{baseUrl}}"],
              "path": ["book"],
              "query": [
                { "key": "page", "value": "1" },
                { "key": "limit", "value": "10" }
              ]
            }
          }
        },
        {
          "name": "Get Single Book",
          "request": {
            "method": "GET",
            "header": [{ "key": "Authorization", "value": "Bearer {{token}}" }],
            "url": { "raw": "{{baseUrl}}/book/{{bookId}}", "host": ["{{baseUrl}}"], "path": ["book", "{{bookId}}"] }
          }
        },
        {
          "name": "Create Book (Admin)",
          "request": {
            "method": "POST",
            "header": [
              { "key": "Authorization", "value": "Bearer {{token}}" },
              { "key": "Content-Type", "value": "application/json" }
            ],
            "url": { "raw": "{{baseUrl}}/book", "host": ["{{baseUrl}}"], "path": ["book"] },
            "body": {
              "mode": "raw",
              "raw": "{\n  \"title\": \"Atomic Habits\",\n  \"author\": \"James Clear\",\n  \"coverImageUrl\": \"https://...\",\n  \"genre\": \"{{genreId}}\",\n  \"description\": \"...\"\n}"
            }
          }
        },
        {
          "name": "Update Book (Admin)",
          "request": {
            "method": "PATCH",
            "header": [
              { "key": "Authorization", "value": "Bearer {{token}}" },
              { "key": "Content-Type", "value": "application/json" }
            ],
            "url": { "raw": "{{baseUrl}}/book/{{bookId}}", "host": ["{{baseUrl}}"], "path": ["book", "{{bookId}}"] },
            "body": { "mode": "raw", "raw": "{\n  \"title\": \"Updated Title\"\n}" }
          }
        },
        {
          "name": "Delete Book (Admin)",
          "request": {
            "method": "DELETE",
            "header": [{ "key": "Authorization", "value": "Bearer {{token}}" }],
            "url": { "raw": "{{baseUrl}}/book/{{bookId}}", "host": ["{{baseUrl}}"], "path": ["book", "{{bookId}}"] }
          }
        }
      ]
    },
    {
      "name": "Genre",
      "item": [
        {
          "name": "Get All Genres",
          "request": {
            "method": "GET",
            "header": [{ "key": "Authorization", "value": "Bearer {{token}}" }],
            "url": { "raw": "{{baseUrl}}/genre", "host": ["{{baseUrl}}"], "path": ["genre"] }
          }
        },
        {
          "name": "Create Genre (Admin)",
          "request": {
            "method": "POST",
            "header": [
              { "key": "Authorization", "value": "Bearer {{token}}" },
              { "key": "Content-Type", "value": "application/json" }
            ],
            "url": { "raw": "{{baseUrl}}/genre", "host": ["{{baseUrl}}"], "path": ["genre"] },
            "body": { "mode": "raw", "raw": "{\n  \"name\": \"Fiction\"\n}" }
          }
        },
        {
          "name": "Update Genre (Admin)",
          "request": {
            "method": "PATCH",
            "header": [
              { "key": "Authorization", "value": "Bearer {{token}}" },
              { "key": "Content-Type", "value": "application/json" }
            ],
            "url": { "raw": "{{baseUrl}}/genre/{{genreId}}", "host": ["{{baseUrl}}"], "path": ["genre", "{{genreId}}"] },
            "body": { "mode": "raw", "raw": "{\n  \"name\": \"Sci-Fi\"\n}" }
          }
        },
        {
          "name": "Delete Genre (Admin)",
          "request": {
            "method": "DELETE",
            "header": [{ "key": "Authorization", "value": "Bearer {{token}}" }],
            "url": { "raw": "{{baseUrl}}/genre/{{genreId}}", "host": ["{{baseUrl}}"], "path": ["genre", "{{genreId}}"] }
          }
        }
      ]
    },
    {
      "name": "Review",
      "item": [
        {
          "name": "Create Review",
          "request": {
            "method": "POST",
            "header": [
              { "key": "Authorization", "value": "Bearer {{token}}" },
              { "key": "Content-Type", "value": "application/json" }
            ],
            "url": { "raw": "{{baseUrl}}/review", "host": ["{{baseUrl}}"], "path": ["review"] },
            "body": { "mode": "raw", "raw": "{\n  \"book\": \"{{bookId}}\",\n  \"rating\": 5,\n  \"comment\": \"Amazing book!\"\n}" }
          }
        },
        {
          "name": "Get Reviews By Book",
          "request": {
            "method": "GET",
            "header": [{ "key": "Authorization", "value": "Bearer {{token}}" }],
            "url": { "raw": "{{baseUrl}}/review/book/{{bookId}}", "host": ["{{baseUrl}}"], "path": ["review", "book", "{{bookId}}"] }
          }
        },
        {
          "name": "Approve Review (Admin)",
          "request": {
            "method": "PATCH",
            "header": [{ "key": "Authorization", "value": "Bearer {{token}}" }],
            "url": { "raw": "{{baseUrl}}/review/{{reviewId}}/approve", "host": ["{{baseUrl}}"], "path": ["review", "{{reviewId}}", "approve"] }
          }
        }
      ]
    },
    {
      "name": "User Library",
      "item": [
        {
          "name": "Add to My Library",
          "request": {
            "method": "POST",
            "header": [
              { "key": "Authorization", "value": "Bearer {{token}}" },
              { "key": "Content-Type", "value": "application/json" }
            ],
            "url": { "raw": "{{baseUrl}}/user-library", "host": ["{{baseUrl}}"], "path": ["user-library"] },
            "body": { "mode": "raw", "raw": "{\n  \"book\": \"{{bookId}}\",\n  \"status\": \"reading\"\n}" }
          }
        },
        {
          "name": "Get My Library",
          "request": {
            "method": "GET",
            "header": [{ "key": "Authorization", "value": "Bearer {{token}}" }],
            "url": { "raw": "{{baseUrl}}/user-library/me", "host": ["{{baseUrl}}"], "path": ["user-library", "me"] }
          }
        }
      ]
    },
    {
      "name": "Tutorial",
      "item": [
        {
          "name": "Get All Tutorials",
          "request": {
            "method": "GET",
            "header": [{ "key": "Authorization", "value": "Bearer {{token}}" }],
            "url": { "raw": "{{baseUrl}}/tutorial", "host": ["{{baseUrl}}"], "path": ["tutorial"] }
          }
        },
        {
          "name": "Create Tutorial (Admin)",
          "request": {
            "method": "POST",
            "header": [
              { "key": "Authorization", "value": "Bearer {{token}}" },
              { "key": "Content-Type", "value": "application/json" }
            ],
            "url": { "raw": "{{baseUrl}}/tutorial", "host": ["{{baseUrl}}"], "path": ["tutorial"] },
            "body": { "mode": "raw", "raw": "{\n  \"title\": \"How to build reading habit\",\n  \"content\": \"...\"\n}" }
          }
        },
        {
          "name": "Update Tutorial (Admin)",
          "request": {
            "method": "PATCH",
            "header": [
              { "key": "Authorization", "value": "Bearer {{token}}" },
              { "key": "Content-Type", "value": "application/json" }
            ],
            "url": { "raw": "{{baseUrl}}/tutorial/{{tutorialId}}", "host": ["{{baseUrl}}"], "path": ["tutorial", "{{tutorialId}}"] },
            "body": { "mode": "raw", "raw": "{\n  \"title\": \"Updated title\"\n}" }
          }
        },
        {
          "name": "Delete Tutorial (Admin)",
          "request": {
            "method": "DELETE",
            "header": [{ "key": "Authorization", "value": "Bearer {{token}}" }],
            "url": { "raw": "{{baseUrl}}/tutorial/{{tutorialId}}", "host": ["{{baseUrl}}"], "path": ["tutorial", "{{tutorialId}}"] }
          }
        }
      ]
    },
    {
      "name": "Reading Goal",
      "item": [
        {
          "name": "Create Reading Goal",
          "request": {
            "method": "POST",
            "header": [
              { "key": "Authorization", "value": "Bearer {{token}}" },
              { "key": "Content-Type", "value": "application/json" }
            ],
            "url": { "raw": "{{baseUrl}}/reading-goal", "host": ["{{baseUrl}}"], "path": ["reading-goal"] },
            "body": {
              "mode": "raw",
              "raw": "{\n  \"period\": \"monthly\",\n  \"targetBook\": 5,\n  \"startDate\": \"2026-01-01\",\n  \"endDate\": \"2026-01-31\"\n}"
            }
          }
        },
        {
          "name": "Get My Goals",
          "request": {
            "method": "GET",
            "header": [{ "key": "Authorization", "value": "Bearer {{token}}" }],
            "url": { "raw": "{{baseUrl}}/reading-goal/user/{{userId}}", "host": ["{{baseUrl}}"], "path": ["reading-goal", "user", "{{userId}}"] }
          }
        },
        {
          "name": "Get My Active Goal",
          "request": {
            "method": "GET",
            "header": [{ "key": "Authorization", "value": "Bearer {{token}}" }],
            "url": { "raw": "{{baseUrl}}/reading-goal/active/{{userId}}", "host": ["{{baseUrl}}"], "path": ["reading-goal", "active", "{{userId}}"] }
          }
        },
        {
          "name": "Get Active Goal Progress",
          "request": {
            "method": "GET",
            "header": [{ "key": "Authorization", "value": "Bearer {{token}}" }],
            "url": { "raw": "{{baseUrl}}/reading-goal/active/{{userId}}/progress", "host": ["{{baseUrl}}"], "path": ["reading-goal", "active", "{{userId}}", "progress"] }
          }
        },
        {
          "name": "Update Goal",
          "request": {
            "method": "PATCH",
            "header": [
              { "key": "Authorization", "value": "Bearer {{token}}" },
              { "key": "Content-Type", "value": "application/json" }
            ],
            "url": { "raw": "{{baseUrl}}/reading-goal/{{goalId}}", "host": ["{{baseUrl}}"], "path": ["reading-goal", "{{goalId}}"] },
            "body": { "mode": "raw", "raw": "{\n  \"targetBook\": 10\n}" }
          }
        },
        {
          "name": "Delete Goal",
          "request": {
            "method": "DELETE",
            "header": [{ "key": "Authorization", "value": "Bearer {{token}}" }],
            "url": { "raw": "{{baseUrl}}/reading-goal/{{goalId}}", "host": ["{{baseUrl}}"], "path": ["reading-goal", "{{goalId}}"] }
          }
        }
      ]
    }
  ]
}
```

---

## 🧪 Suggested Testing Flow (Postman)

1) Register → Login → save token
2) Create Genre (Admin)
3) Create Book (Admin)
4) User adds book to Library
5) User posts Review → Admin approves
6) Fetch Book details + reviews
7) Create Reading Goal → fetch progress

---

## 📌 Notes / Implementation Tips

- Always store `passwordHash`, never raw password.
- Use `unique index (userId, bookId)` on LibraryItem.
- On shelf change to `read`, auto-set progress = 100 and set `finishedAt`.
- For tutorials: validate URL and store only `youtubeVideoId`.

---

## 📄 License

MIT

