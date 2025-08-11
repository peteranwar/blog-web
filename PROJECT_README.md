# Blog Platform – React & Next.js Developer Task

A full-featured blog platform built with **React**, **Next.js**, **Zustand**, and **Tailwind CSS**. This project demonstrates frontend architecture, authentication, real-time updates, SSR for SEO, and full test coverage — all without an external backend.


---

## ✅ Features

- **Blog CRUD**: Create, read, update, and delete blog posts.
- **Authentication**: JWT-like login with role-based access (user/admin).
- **User Roles**: Admins can edit/delete any post; users can only edit their own.
- **Comments System**: Users can add comments to posts.
- **Real-Time Updates**: New comments appear instantly using `BroadcastChannel` (simulates WebSockets).
- **Like/Dislike System**: Users can like or dislike posts and comments.
- **Server-Side Rendering (SSR)**: Blog posts are server-rendered for SEO and fast loading.
- **Pagination**: Both posts and comments are paginated for better UX.
- **Unit Testing**: Full test coverage using Jest and React Testing Library.
- **No External Backend**: Simulated using `db.json` and Next.js API Routes.

---

## 🛠 Tech Stack

- **Framework**: Next.js (Pages Router)
- **Frontend**: React, Tailwind CSS
- **State Management**: Zustand
- **Authentication**: JWT-like tokens in `localStorage`
- **Data Persistence**: `db.json` + API Routes (Node.js `fs`)
- **Real-Time**: `BroadcastChannel` (simulates SSE/WebSocket)
- **Testing**: Jest, React Testing Library
- **Styling**: Tailwind CSS

---

## 🚀 Getting Started

### 1. Clone the repo
```bash
git clone https://github.com/peteranwar/blog-web.git
cd blog-web


- Install dependencies
npm install
npm run dev


🔐 Authentication
User Login: user / pass
Admin Login: admin / admin
Only logged-in users can:

Create or edit posts
Add comments
Like/dislike posts
Admins can edit/delete any post.

🧪 Running Tests
npm test

Tests cover:

   CRUD operations for posts


🖼️ 📂 Project Structure

blog-web/
├── pages/
│   ├── posts/          → Post list, detail, create, edit
│   ├── auth/
│   │   └── login.js
│   └── api/            → Simulated backend
├── src/
│   ├── utils/api.js    → API client
│   ├── store/useStore.js → Zustand store
│   └── lib/db.json     → "Database" file
├── __tests__/
│   └── features/       → Unit tests
└── public/


📝 Notes
No external API or backend — all data is stored in src/lib/db.json and synced via API Routes.
SSR & SEO are supported via getServerSideProps.
Real-time is simulated using BroadcastChannel across tabs.
Testing mocks fetch, localStorage, and BroadcastChannel.