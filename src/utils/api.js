// src/utils/api.js

// --- Auth Helpers ---
export const getCurrentUser = () => {
  if (typeof window === 'undefined') return null;
  const user = localStorage.getItem('currentUser');
  return user ? JSON.parse(user) : null;
};

export const isAuthenticated = () => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  if (!token) return false;
  try {
    const decoded = JSON.parse(atob(token.split('.')[0]));
    return decoded.exp > Date.now();
  } catch {
    return false;
  }
};

// --- Posts API ---
export const getPosts = async () => {
  const res = await fetch('/api/posts');
  if (!res.ok) throw new Error('Failed to fetch posts');
  return res.json();
};

export const createPost = async (title, content) => {
  const user = getCurrentUser();
  if (!user) throw new Error('Not authenticated');

  const res = await fetch('/api/posts/create', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title, content, authorId: user.id })
  });

  if (!res.ok) throw new Error('Failed to create post');
  const post = await res.json();

  // Optional: Broadcast for real-time UX
  if (typeof window !== 'undefined') {
    const channel = new BroadcastChannel('posts');
    channel.postMessage({ type: 'NEW_POST', post });
    channel.close();
  }

  return post;
};

// src/utils/api.js

export const updatePost = async (id, title, content) => {
  const user = getCurrentUser();
  if (!user) throw new Error('Not authenticated');

console.log('From updatePost: user', user, id, title, content)

  const res = await fetch(`/api/posts/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title, content, userId: user.id })
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || 'Failed to update post');
  }

  const post = await res.json();

  // Broadcast
  if (typeof window !== 'undefined') {
    const channel = new BroadcastChannel('posts');
    channel.postMessage({ type: 'UPDATE_POST', post });
    channel.close();
  }

  return post;
};

export const deletePost = async (id) => {
  const user = getCurrentUser();
  console.log('From deletePost: user', id)
  if (!user) throw new Error('Not authenticated');

  const res = await fetch(`/api/posts/${id}`, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId: user.id })
  });
  console.log('From deletePost: res', res)

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || 'Failed to delete post');
  }

  return res.json();
};

// --- Comments API ---
export const getCommentsForPost = async (postId, page = 1, limit = 5) => {
  const res = await fetch(`/api/comments?postId=${postId}&page=${page}&limit=${limit}`);
  if (!res.ok) throw new Error('Failed to fetch comments');
  const data = await res.json();
  return data;
};

export const addComment = async (postId, content) => {
  const user = getCurrentUser();
  if (!user) throw new Error('Not authenticated');

  const res = await fetch('/api/comments/create', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ postId, content, authorId: user.id })
  });

  if (!res.ok) throw new Error('Failed to add comment');
  const comment = await res.json();

  // Broadcast
  if (typeof window !== 'undefined') {
    const channel = new BroadcastChannel('comments');
    channel.postMessage({ type: 'NEW_COMMENT', comment });
    channel.close();
  }

  return comment;
};

// --- Likes API ---
export const toggleLike = async (type, id) => {
  const user = getCurrentUser();
  if (!user) throw new Error('Not authenticated');

  const res = await fetch('/api/likes/toggle', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ type, id, userId: user.id, value: 1 })
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || 'Failed to like');
  }

  const data = await res.json(); // ✅ Await the JSON
  return data.likes; // ✅ Return likes from parsed JSON
};

export const toggleDislike = async (type, id) => {
  const user = getCurrentUser();
  if (!user) throw new Error('Not authenticated');

  const res = await fetch('/api/likes/toggle', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ type, id, userId: user.id, value: -1 })
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || 'Failed to dislike');
  }

  const data = await res.json(); // ✅ Await
  return data.likes; // ✅ Correct
};

export const getLikes = async (type, id) => {
  try {
    const res = await fetch(`/api/likes?type=${type}&id=${id}`);
    if (!res.ok) throw new Error('Failed to fetch likes');
    const data = await res.json();
    // Ensure likes is always an object
    return data.likes || {};
  } catch (err) {
    console.error('Error fetching likes:', err);
    return {}; // ← Fallback
  }
};