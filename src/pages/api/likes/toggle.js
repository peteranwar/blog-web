import fs from 'fs';
import path from 'path';

const dbPath = path.join(process.cwd(), 'src', 'lib', 'db.json');

const readDb = () => {
  const data = fs.readFileSync(dbPath, 'utf-8');
  const parsed = JSON.parse(data);
  return {
    ...parsed,
    likes: parsed.likes || {}
  };
};

const writeDb = (data) => {
  fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
};

export default function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { type, id, userId, value } = req.body;
  if (!type || !id || !userId || (value !== 1 && value !== -1)) {
    return res.status(400).json({ error: 'Invalid request' });
  }

  const db = readDb();
  const key = `${type}:${id}`;
  if (!db.likes[key]) {
    db.likes[key] = {};
  }

  // If user already liked/disliked, toggle off
  if (db.likes[key][userId] === value) {
    delete db.likes[key][userId];
  } else {
    // Set new value (like or dislike)
    db.likes[key][userId] = value;
    // Remove opposite reaction
    if (value === 1) {
      if (db.likes[key][userId] === -1) delete db.likes[key][userId];
    } else if (value === -1) {
      if (db.likes[key][userId] === 1) delete db.likes[key][userId];
    }
  }

  // Save to db.json
  writeDb(db);

  // Return updated likes
  res.status(200).json({ likes: db.likes[key] });
}