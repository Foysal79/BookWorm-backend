# BookWorm — Project Analysis Report (Frontend + Backend)

##  Project Overview

**BookWorm** is a book recommendation + reading tracker app with two roles:

- **User**: discover books, manage personal shelves (Want to Read / Currently Reading / Read), track progress, write reviews + ratings, watch tutorials, see personalized recommendations and reading stats.
- **Admin**: manage users/roles, books, genres, reviews moderation, and YouTube tutorial links.

Core goals:

- Fully protected routes (no public homepage).
- Server-side authentication + authorization.
- Clean, modular code with strong UX for loading/error states.
- Responsive, book-themed “cozy library” design.

---

##  Functional Requirements Breakdown

###  Authentication & Authorization

**Registration**

- Inputs: `name`, `email (unique)`, `photo upload`, `password`.
- Validation:
  - Duplicate email blocked.
  - Strong password rules (min length, complexity).
  - Required fields.
- Data stored securely (hashed password, photo URL).

**Login**

- Inputs: `email`, `password`.
- Verify credentials + issue tokens.

**Route Protection**

- Every route requires login.
- If not logged in → redirect to `/login`.

**Default Route Behavior**

- Normal User → redirect `/` → `/my-library`.
- Admin → redirect `/` → `/admin/dashboard`.

**Role-Based Access Control (RBAC)**

- Admin-only pages: manage books/genres/users/reviews/tutorials.
- User pages: library/dashboard/browse/details/tutorials.

---

###  User Features

**A) Browse Books**

- Book list with:
  - Search: title, author
  - Filters: genre (multi-select), rating range
  - Sort: rating, most shelved
  - Pagination or infinite scroll
- SSR/SSG using **Next.js App Router** (preferred) for good SEO/performance.

**B) Book Details**

- Show full details: cover, title, author, genre, description, community rating.
- Actions:
  - Add to shelf: Want to Read / Currently Reading / Read
  - Progress tracking (when Currently Reading)
  - Write review + rating (1–5)

**C) My Library (Reading Tracker)**

- Shelves:
  - Want to Read
  - Currently Reading (with progress)
  - Read
- Progress model options:
  - `pagesRead / totalPages` OR `percent`
- UX:
  - Inline progress update
  - Quick move between shelves

**D) Reviews & Ratings**

- User submits review → starts as **pending**.
- Approved reviews are visible publicly on Book Details.

**E) User Dashboard/Home**

- Reading stats overview:
  - Books read this year
  - Total pages read
  - Average rating given
  - Favorite genre breakdown
  - Reading streak
- Recommendations block (12–18 books grid/carousel)

**F) Tutorials Page**

- 10–12 embedded YouTube videos.
- Same page for User & Admin viewing; admin can manage.

**G) Reading Challenge / Goals**

- User sets annual goal: e.g., “Read 50 books in 2026”.
- Track goal completion with circular progress.

---

###  Admin Features

**Admin Dashboard**

- Overview cards:
  - total users
  - total books
  - pending reviews
- Charts (Chart.js/Recharts):
  - books per genre
  - monthly books read (aggregate)
  - pages over time (optional)

**Manage Books**

- CRUD:
  - Create: title, author, genre(select existing), description, cover upload → store URL
  - Read: table/list with thumbnails + actions
  - Update: all fields editable
  - Delete: confirmation modal

**Manage Genres**

- Add/edit genres.
- Books must reference a genre.

**Manage Users**

- View users list.
- Change roles: Admin ↔ Normal User.

**Moderate Reviews**

- Pending reviews list.
- Approve or delete.

**Manage Tutorials**

- Add/remove YouTube links.
- Validate URL and store `videoId`.

---

##  Recommendation System (Simple but Explainable)

###  Inputs

- **User’s Read shelf** genres frequency.
- **User’s average ratings** by genre and overall.
- **Community signals**:
  - Books with high approved review ratings
  - Most shelved books

###  Algorithm (Practical Approach)

1. Compute top genres from user’s **Read** shelf.
2. Create candidate pool:
   - Books in top genres not already in user shelves.
   - Add popular books by community rating & most shelved.
3.
   ## Score candidates:
   - genre match weight
   -
     - community average rating
   -
     - approved reviews count/quality
4. Pick 12–18 results.

###  Fallback Rule

- If user has **< 3** books in Read:
  - Show a mix of popular + random + trending.

###  “Why this book?” Tooltip

- Store a short explanation string per recommendation, e.g.
  - “Matches your Mystery preference (4 books read) + high-rated reviews.”

---



##  Technical Architecture

## Backend (Node.js + Express + MongoDB)

**Core stack**

- Node.js + Express
- TypeScript
- MongoDB + Mongoose
- Auth: JWT access + refresh tokens, bcrypt password hash
- Validation: Zod/Joi
- Uploads: Cloudinary (recommended) or local

### Backend Modules (Modular MVC)

- `auth` (register/login/refresh/logout)
- `user` (profile, role update by admin)
- `book` (CRUD)
- `genre` (CRUD)
- `review` (create pending, approve/delete)
- `tutorial` (CRUD)
- `library` (shelves, progress updates)
- `stats` (dashboard + analytics)
- (optional) `recommendation` (computed endpoint)

---

##  Data Model / Database Schema (MongoDB)

###  User

- `_id`
- `name`
- `email` (unique)
- `passwordHash`
- `photoUrl`
- `role`: `Admin | User`
- `createdAt`, `updatedAt`

###  Genre

- `_id`
- `name` (unique)
- `slug` (unique)

###  Book

- `_id`
- `title`
- `author`
- `genreId` (ref Genre)
- `description`
- `coverImageUrl`
- `totalPages` (optional but helpful for progress)
- `avgRating` (derived)
- `approvedReviewCount` (derived)
- `shelvedCount` (derived)

###  Review

- `_id`
- `bookId` (ref Book)
- `userId` (ref User)
- `rating` (1–5)
- `text`
- `status`: `pending | approved`
- `createdAt`

###  LibraryItem (User Shelves)

- `_id`
- `userId` (ref User)
- `bookId` (ref Book)
- `shelf`: `want | reading | read`
- `progressPercent` OR `pagesRead`
- `startedAt`, `finishedAt`
- Unique index: `(userId, bookId)` to prevent duplicates

###  ReadingGoal

- `_id`
- `userId`
- `year` (e.g., 2026)
- `goalBooks` (e.g., 50)

###  Tutorial

- `_id`
- `title`
- `youtubeUrl`
- `youtubeVideoId`
- `createdBy` (admin userId)

---

##  API Design (Sample Endpoints)

Production Base URL:
- `https://bookreading-five.vercel.app/api/v1`

Local Base URL:
- `http://localhost:5000/api/v1`

---

## Authentication
Most endpoints require a JWT access token.

Add this header:

```http
Authorization: Bearer <token>
Content-Type: application/json
```

---

## API Endpoints

### User (`/user`)

#### Register (Public)
- **POST** `/user/register`

**Body**
```json
{
  "name": "Foysal",
  "email": "foysal@gmail.com",
  "password": "123456"
}
```

#### Login (Public)
- **POST** `/user/login`

**Body**
```json
{
  "email": "foysal@gmail.com",
  "password": "123456"
}
```

**Response (example)**
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

**Body**
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

**Body (example)**
```json
{
  "title": "Atomic Habits",
  "author": "James Clear",
  "coverImageUrl": "https://...",
  "genre": "_toggle_with_your_genre_id_or_slug_",
  "description": "..."
}
```

#### Update Book (Admin)
- **PATCH** `/book/:id`

**Body (example)**
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

**Body**
```json
{ "name": "Fiction" }
```

#### Update Genre (Admin)
- **PATCH** `/genre/:id`

**Body**
```json
{ "name": "Sci-Fi" }
```

#### Delete Genre (Admin)
- **DELETE** `/genre/:id`

---

### Review (`/review`)

#### Create Review (Auth)
- **POST** `/review`

**Body (example)**
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

**Body (example)**
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

#### Create Tutorial (Admin)
- **POST** `/tutorial`

**Body (example)**
```json
{
  "title": "How to build reading habit",
  "content": "..."
}
```

#### Get All Tutorials (Auth)
- **GET** `/tutorial`

#### Update Tutorial (Admin)
- **PATCH** `/tutorial/:id`

#### Delete Tutorial (Admin)
- **DELETE** `/tutorial/:id`

---

### Reading Goal (`/reading-goal`)

#### Create Reading Goal (Auth)
- **POST** `/reading-goal`

**Body (example)**
```json
{
  "period": "monthly",
  "targetBook": 5,
  "startDate": "2026-01-01",
  "endDate": "2026-01-31"
}
```

#### Get My Goals (Auth, Admin/User)
- **GET** `/reading-goal/user/:userId`

#### Get My Active Goal (Auth, Admin/User)
- **GET** `/reading-goal/active/:userId`

#### Get Active Goal Progress (Auth, Admin/User)
- **GET** `/reading-goal/active/:userId/progress`

#### Update Goal (Auth)
- **PATCH** `/reading-goal/:id`

**Body (example)**
```json
{
  "targetBook": 10,
  "isActive": true
}
```

#### Delete Goal (Auth)
- **DELETE** `/reading-goal/:id`

---

## Quick Endpoint Table

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

# Postman Collection JSON

> Copy-paste into a file like: `BookWorm.postman_collection.json` and Import in Postman.

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
            "header": [
              { "key": "Authorization", "value": "Bearer {{token}}" }
            ],
            "url": { "raw": "{{baseUrl}}/user", "host": ["{{baseUrl}}"], "path": ["user"] }
          }
        },
        {
          "name": "Get Single User (Self/Admin)",
          "request": {
            "method": "GET",
            "header": [
              { "key": "Authorization", "value": "Bearer {{token}}" }
            ],
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
            "header": [
              { "key": "Authorization", "value": "Bearer {{token}}" }
            ],
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


##  Error Handling & Edge Cases

**Auth**

- Wrong credentials
- Token expired (refresh flow)
- Forbidden role access

**Books**

- Invalid book ID
- Genre not found
- Empty cover image

**Reviews**

- Prevent multiple reviews per user per book (optional rule)
- Pending reviews hidden from public

**Library**

- Prevent duplicate shelf items
- Progress can’t exceed 100% or totalPages
- If shelf becomes `read`, auto set progress 100%

**Uploads**

- Validate file size + type
- Cloud upload failure fallback

---

