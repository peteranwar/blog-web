// src/data/db.js

// Initial default data
const initialData = {
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
    likes: {}
  };
  
  // Helper to deserialize dates
  const reviveDates = (obj) => {
    if (obj?.createdAt) obj.createdAt = new Date(obj.createdAt);
    return obj;
  };
  
  // Load from localStorage if available
  const loadFromLocalStorage = () => {
    if (typeof window === 'undefined') return null; // No localStorage on server
    const saved = localStorage.getItem('mockDb');
    return saved ? JSON.parse(saved) : null;
  };
  
  // Initialize db
  const saved = loadFromLocalStorage();
  
  const db = {
    users: initialData.users,
    posts: saved?.posts?.map(reviveDates) || initialData.posts,
    comments: saved?.comments?.map(reviveDates) || initialData.comments,
    likes: saved?.likes || initialData.likes
  };
  
  // Save back to localStorage whenever needed (call this after any change)
  export const saveDb = () => {
    if (typeof window === 'undefined') return;
    const serializable = {
      posts: db.posts,
      comments: db.comments,
      likes: db.likes
    };
    localStorage.setItem('mockDb', JSON.stringify(serializable));
  };
  
  export default db;