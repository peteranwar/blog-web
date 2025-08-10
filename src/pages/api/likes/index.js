// pages/api/likes/index.js
import fs from 'fs';
import path from 'path';

const dbPath = path.join(process.cwd(), 'src', 'lib', 'db.json');

const readDb = () => {
  const data = fs.readFileSync(dbPath, 'utf-8');
  const parsed = JSON.parse(data);
  return {
    ...parsed,
    likes: parsed.likes || {}  // ← ensure exists
  };
};

export default function handler(req, res) {
  const { type, id } = req.query;
  if (!type || !id) {
    return res.status(400).json({ error: 'Missing type or id' });
  }

  const db = readDb();
  const key = `${type}:${id}`;
  const likes = db.likes[key] || {};  // ← fallback

  if (req.method === 'GET') {
    return res.status(200).json({ likes });  // ← correct shape
  }

  res.setHeader('Allow', ['GET']);
  res.status(405).json({ error: 'Method not allowed' });
}