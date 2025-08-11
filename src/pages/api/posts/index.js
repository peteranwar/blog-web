import fs from 'fs';
import path from 'path';

const dbPath = path.join(process.cwd(), 'src', 'lib', 'db.json');

// Read DB
const readDb = () => {
  const data = fs.readFileSync(dbPath, 'utf-8');
  const parsed = JSON.parse(data);
  return {
    ...parsed,
    posts: parsed.posts.map(p => ({ ...p, createdAt: new Date(p.createdAt) })),
    comments: parsed.comments.map(c => ({ ...c, createdAt: new Date(c.createdAt) }))
  };
};


export default function handler(req, res) {
  const db = readDb();

  switch (req.method) {
    case 'GET':
      const { page = 1, limit = 5 } = req.query;
      const posts = db.posts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      const start = (+page - 1) * +limit;
      const paginated = posts.slice(start, start + +limit);

      res.status(200).json({
        posts: paginated,
        total: posts.length,
        page: +page,
        totalPages: Math.ceil(posts.length / +limit)
      });
      break;

    default:
      res.setHeader('Allow', ['GET']);
      res.status(405).end();
  }
}