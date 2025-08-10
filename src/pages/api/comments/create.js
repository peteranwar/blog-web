// pages/api/comments/create.js
import fs from 'fs';
import path from 'path';

const dbPath = path.join(process.cwd(), 'src', 'lib', 'db.json');

const readDb = () => {
  const data = fs.readFileSync(dbPath, 'utf-8');
  return JSON.parse(data);
};

const writeDb = (data) => {
  fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
};

export default function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).end();
  }

  const db = readDb();
  const { postId, content, authorId } = req.body;

  const comment = {
    id: Date.now(),
    postId: parseInt(postId),
    authorId,
    content,
    createdAt: new Date().toISOString()
  };

  db.comments.unshift(comment);
  writeDb(db);

  res.status(201).json(comment);
}