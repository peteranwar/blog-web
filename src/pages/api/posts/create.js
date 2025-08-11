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
  const { title, content, authorId } = req.body;

  const newPost = {
    id: Date.now(),
    title,
    content,
    authorId,
    createdAt: new Date().toISOString()
  };

  db.posts.unshift(newPost);
  writeDb(db);

  res.status(201).json(newPost);
}