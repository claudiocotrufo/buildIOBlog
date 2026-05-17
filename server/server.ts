import {
  AngularNodeAppEngine,
  createNodeRequestHandler,
  isMainModule,
  writeResponseToNodeResponse,
} from '@angular/ssr/node';
import express from 'express';
import { join } from 'node:path';
import { readFileSync, readdirSync } from 'node:fs';

const browserDistFolder = join(import.meta.dirname, '../browser');
const postsDir = join(process.cwd(), 'db/posts');

const app = express();
const angularApp = new AngularNodeAppEngine();

// --- Repository (swap this with Firebase/Cosmos in the future) ---

function loadAllPosts() {
  return readdirSync(postsDir)
    .filter((f: string) => f.endsWith('.json'))
    .map((f: string) => JSON.parse(readFileSync(join(postsDir, f), 'utf-8')))
    .sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

function loadPost(slug: string) {
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
  const post = loadPost(req.params['slug']);
  if (post) {
    res.json(post);
  } else {
    res.status(404).json({ error: 'Not found' });
  }
});

/**
 * Serve static files from /browser
 */
app.use(
  express.static(browserDistFolder, {
    maxAge: '1y',
    index: false,
    redirect: false,
  }),
);

/**
 * Handle all other requests by rendering the Angular application.
 */
app.use((req, res, next) => {
  angularApp
    .handle(req)
    .then((response) => (response ? writeResponseToNodeResponse(response, res) : next()))
    .catch(next);
});

/**
 * Start the server if this module is the main entry point, or it is ran via PM2.
 * The server listens on the port defined by the `PORT` environment variable, or defaults to 4000.
 */
if (isMainModule(import.meta.url) || process.env['pm_id']) {
  const port = process.env['PORT'] || 4000;
  app.listen(port, (error) => {
    if (error) {
      throw error;
    }

    console.log(`Node Express server listening on http://localhost:${port}`);
  });
}

/**
 * Request handler used by the Angular CLI (for dev-server and during build) or Firebase Cloud Functions.
 */
export const reqHandler = createNodeRequestHandler(app);
