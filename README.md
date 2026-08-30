# BlogSphere

A simple full-stack blogging platform built as a college mini project. Users can browse,
search, filter, and publish blog posts across categories like Technology, Programming,
Lifestyle, and Education.

## Tech Stack

- **Frontend:** HTML, CSS, vanilla JavaScript
- **Backend:** Node.js, Express
- **Database:** MongoDB (via Mongoose)

## Project Structure

```
BlogWebsite/
├── frontend/
│   ├── index.html
│   ├── style.css
│   └── script.js
└── backend/
    ├── server.js
    ├── config/
    │   └── db.js
    ├── models/
    │   └── Post.js
    ├── controllers/
    │   └── postController.js
    ├── routes/
    │   └── postRoutes.js
    ├── package.json
    └── .env.example
```

## Features

- Browse blog posts in a card-based grid layout
- Filter posts by category
- Live search across title, author, category, and content
- Publish new posts through a modal form
- View full post details in a dedicated modal
- Fully responsive layout (mobile, tablet, desktop)
- Posts are stored in MongoDB — they persist across refreshes and are shared with
  every visitor, not just kept in browser memory

## Getting Started

### 1. Backend setup

```bash
cd backend
npm install
cp .env.example .env
```

Open `.env` and set `MONGO_URI` to your MongoDB connection string — either a free
cluster from [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) or a local install.

```bash
npm run dev
```

The API will run at `http://localhost:5000`.

### 2. Frontend setup

No build step needed — it's plain HTML/CSS/JS. Open `frontend/index.html` with a tool
like VS Code's **Live Server** extension (recommended, so `fetch()` calls work properly)
or any static file server.

By default the frontend expects the backend at `http://localhost:5000/api` — this is
set at the top of `frontend/script.js` if you ever need to change it.

## API Reference

| Method | Route            | Description                          |
|--------|-------------------|----------------------------------------|
| GET    | `/api/posts`       | List all posts (supports `?category=` and `?search=`) |
| GET    | `/api/posts/:id`   | Get a single post                     |
| POST   | `/api/posts`       | Create a new post                     |
| PUT    | `/api/posts/:id`   | Update an existing post               |
| DELETE | `/api/posts/:id`   | Delete a post                         |

## Notes

This project intentionally keeps things simple — there's no login system, so anyone can
publish a post, similar to a public noticeboard. That keeps the scope appropriate for a
mini project while still covering a real full-stack flow: a frontend calling a REST API
backed by a database.
