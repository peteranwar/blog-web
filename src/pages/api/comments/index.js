// pages/api/comments/index.js
import fs from 'fs';
import path from 'path';

const dbPath = path.join(process.cwd(), 'src', 'lib', 'db.json');

const readDb = () => {
  const data = fs.readFileSync(dbPath, 'utf-8');
  const parsed = JSON.parse(data);
  return {
    ...parsed,
    comments: parsed.comments.map(c => ({ ...c, createdAt: new Date(c.createdAt) }))
  };
};

export default function handler(req, res) {
  const db = readDb();
  const { postId, page = 1, limit = 5 } = req.query;

  if (req.method === 'GET') {
    if (!postId) {
      return res.status(400).json({ error: 'postId is required' });
    }

    const filtered = db.comments
      .filter(c => c.postId == postId)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    const total = filtered.length;
    const start = (+page - 1) * +limit;
    const paginated = filtered.slice(start, start + +limit);
    const totalPages = Math.ceil(total / limit);

    return res.status(200).json({
      comments: paginated,
      pagination: {
        page: +page,
        limit: +limit,
        total,
        totalPages
      }
    });
  }

  res.status(405).end();
}