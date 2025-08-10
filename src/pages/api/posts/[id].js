// pages/api/posts/[id].js
import fs from 'fs';
import path from 'path';

const dbPath = path.join(process.cwd(), 'src', 'lib', 'db.json');

const readDb = () => {
  const data = fs.readFileSync(dbPath, 'utf-8');
  const parsed = JSON.parse(data);
  return {
    ...parsed,
    posts: parsed.posts.map(p => ({ ...p, createdAt: new Date(p.createdAt) })),
    comments: parsed.comments.map(c => ({ ...c, createdAt: new Date(c.createdAt) }))
  };
};

const writeDb = (data) => {
  fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
};

// Helper: Get user by ID
const getUserById = (userId, db) => {
  return db.users.find(u => u.id == userId);
};

export default function handler(req, res) {
  const { id } = req.query;
  const db = readDb();
  const postId = Number(id);
  const post = db.posts.find(p => p.id === postId);

  if (!post) {
    return res.status(404).json({ error: 'Post not found' });
  }

  // ✅ Only require auth for PUT and DELETE
  if (req.method === 'PUT' || req.method === 'DELETE') {
    const { userId } = req.body;
    if (!userId) {
      return res.status(400).json({ error: 'User ID required' });
    }

    const user = getUserById(userId, db);
    if (!user) {
      return res.status(401).json({ error: 'Invalid user' });
    }

    // ✅ Check Authorization
    const isOwner = post.authorId == userId;
    const isAdmin = user.role === 'admin';
    const isAuthorized = isOwner || isAdmin;

    if (!isAuthorized) {
      return res.status(403).json({ error: 'Forbidden: You cannot edit this post' });
    }

    // ✅ Handle PUT
    if (req.method === 'PUT') {
      Object.assign(post, req.body);
      writeDb(db);

      // Broadcast update
      try {
        const bc = new BroadcastChannel('posts');
        bc.postMessage({ type: 'UPDATE_POST', post });
        bc.close();
      } catch (err) {
        console.warn('BroadcastChannel error:', err);
      }

      return res.status(200).json(post);
    }

    // ✅ Handle DELETE
    if (req.method === 'DELETE') {
      db.posts = db.posts.filter(p => p.id !== postId);
      db.comments = db.comments.filter(c => c.postId !== postId);
      if (db.likes[`post:${postId}`]) delete db.likes[`post:${postId}`];
      writeDb(db);
      return res.status(200).json({ message: 'Post deleted' });
    }
  }

  // ✅ Allow GET without authentication
  if (req.method === 'GET') {
    return res.status(200).json({ post });
  }

  // Method not allowed
  res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
  return res.status(405).json({ error: 'Method not allowed' });
}