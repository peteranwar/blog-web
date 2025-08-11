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

}));