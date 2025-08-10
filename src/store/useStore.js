// src/store/useStore.js
import { create } from 'zustand';

// Mock DB (same as before)
const db = {
  users: [
    { id: 1, username: 'user', password: 'pass', role: 'user' },
    { id: 2, username: 'admin', password: 'admin', role: 'admin' }
  ],
  posts: [
    {
      id: 1,
      title: 'Welcome to Our Blog',
      content: 'This is our first post!',
      authorId: 1,
      createdAt: new Date('2025-04-01'),
    }
  ],
  comments: [
    {
      id: 1,
      postId: 1,
      authorId: 2,
      content: 'Great post!',
      createdAt: new Date('2025-04-02'),
    }
  ],
  likes: {} // { "post:1": { "1": 1 }, "comment:2": { "2": -1 } }
};

// Persist helper
const saveDb = () => {
  if (typeof window === 'undefined') return;
  const serializableDb = JSON.parse(JSON.stringify(db));
  localStorage.setItem('mockDb', JSON.stringify(serializableDb));
};

const loadDb = () => {
  if (typeof window === 'undefined') return;
  const saved = localStorage.getItem('mockDb');
  if (saved) {
    const parsed = JSON.parse(saved);
    db.posts = parsed.posts.map(p => ({ ...p, createdAt: new Date(p.createdAt) }));
    db.comments = parsed.comments.map(c => ({ ...c, createdAt: new Date(c.createdAt) }));
    db.likes = parsed.likes || {};
  }
};

loadDb();

// Zustand Store
export const useStore = create((set, get) => ({
  // Auth
  user: null,
  isAuthenticated: false,
  login: (username, password) => {
    const user = db.users.find(u => u.username === username && u.password === password);
    if (!user) return false;

    const fakeToken = btoa(JSON.stringify({
      userId: user.id,
      role: user.role,
      exp: Date.now() + 3600000
    }));

    if (typeof window !== 'undefined') {
      localStorage.setItem('token', fakeToken);
      localStorage.setItem('currentUser', JSON.stringify(user));
    }

    set({ user, isAuthenticated: true });
    return true;
  },
  logout: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
      localStorage.removeItem('currentUser');
    }
    set({ user: null, isAuthenticated: false });
  },
  initializeAuth: () => {
    const storedUser = typeof window !== 'undefined' ? localStorage.getItem('currentUser') : null;
    if (storedUser) {
      set({ user: JSON.parse(storedUser), isAuthenticated: true });
    }
  },

  // Posts
  posts: db.posts,
  addPost: (post) => {
    db.posts.unshift(post);
    saveDb();
    set({ posts: [...db.posts] });

    // Broadcast
    if (typeof window !== 'undefined') {
      const channel = new BroadcastChannel('posts');
      channel.postMessage({ type: 'NEW_POST', post });
      channel.close();
    }
  },
  updatePost: (id, updated) => {
    const post = db.posts.find(p => p.id == id);
    if (post) {
      Object.assign(post, updated);
      saveDb();
      set({ posts: [...db.posts] });
    }
  },
  deletePost: (id) => {
    db.posts = db.posts.filter(p => p.id != id);
    db.comments = db.comments.filter(c => c.postId != id);
    delete db.likes[`post:${id}`];
    saveDb();
    set({ posts: [...db.posts] });
  },

  // Comments
  comments: db.comments,
  addComment: (comment) => {
    db.comments.unshift(comment);
    saveDb();
    set({ comments: [...db.comments] });

    const channel = new BroadcastChannel('comments');
    channel.postMessage({ type: 'NEW_COMMENT', comment });
    channel.close();
  },
  getCommentsByPostId: (postId) => {
    return db.comments
      .filter(c => c.postId == postId)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  },

  // Likes
  likes: db.likes,
  toggleLike: (type, id, userId) => {
    const key = `${type}:${id}`;
    if (!db.likes[key]) db.likes[key] = {};
    const current = db.likes[key][userId];
    if (current === 1) {
      delete db.likes[key][userId];
    } else {
      db.likes[key][userId] = 1;
    }
    saveDb();
    set({ likes: { ...db.likes } });
    return db.likes[key];
  },
  toggleDislike: (type, id, userId) => {
    const key = `${type}:${id}`;
    if (!db.likes[key]) db.likes[key] = {};
    const current = db.likes[key][userId];
    if (current === -1) {
      delete db.likes[key][userId];
    } else {
      db.likes[key][userId] = -1;
    }
    saveDb();
    set({ likes: { ...db.likes } });
    return db.likes[key];
  },
  getLikes: (type, id) => {
    const key = `${type}:${id}`;
    return db.likes[key] || {};
  }
}));