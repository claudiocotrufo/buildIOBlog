import express from 'express';
import { readFileSync, readdirSync } from 'fs';
import { join } from 'path';

const app = express();
const port = 4000;
const postsDir = join(process.cwd(), 'db/posts');

// --- Repository (swap this with Firebase/Cosmos in the future) ---

function loadAllPosts() {
  return readdirSync(postsDir)
    .filter(f => f.endsWith('.json'))
    .map(f => JSON.parse(readFileSync(join(postsDir, f), 'utf-8')))
    .sort((a, b) => new Date(b.date) - new Date(a.date));
}

function loadPost(slug) {
  try {
    return JSON.parse(readFileSync(join(postsDir, `${slug}.json`), 'utf-8'));
  } catch {
    return null;
  }
}

// --- API routes ---

app.get('/api/posts', (_req, res) => {
  res.json(loadAllPosts());
});

app.get('/api/posts/:slug', (req, res) => {
  const post = loadPost(req.params.slug);
  if (post) {
    res.json(post);
  } else {
    res.status(404).json({ error: 'Not found' });
  }
});

app.listen(port, () => {
  console.log(`API server running on http://localhost:${port}`);
});
