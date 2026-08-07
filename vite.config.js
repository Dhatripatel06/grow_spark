import { defineConfig } from 'vite';
import { fileURLToPath, URL } from 'node:url';
import fs from 'node:fs';
import path from 'node:path';

const root = fileURLToPath(new URL('.', import.meta.url));
const pagesDir = path.resolve(root, 'pages');
const outDir = path.resolve(root, 'dist');

// Auto-discover every pages/.../index.html so new routes (pages/about/index.html,
// pages/solutions/some-industry/index.html, etc.) become build entries without
// touching this file. Directory nesting under pages/ is the routing structure —
// pages/services/index.html builds to dist/services/index.html, served at
// /services/ by any static host that resolves directory index files.
function findPageEntries(dir) {
  const found = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const abs = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      found.push(...findPageEntries(abs));
    } else if (entry.name === 'index.html') {
      found.push(abs);
    }
  }
  return found;
}

const input = Object.fromEntries(
  findPageEntries(pagesDir).map((file) => {
    const relDir = path.relative(pagesDir, path.dirname(file));
    const key = relDir ? `pages/${relDir.split(path.sep).join('/')}/index` : 'pages/index';
    return [key, file];
  })
);

const INCLUDE_TAG = /<!--@include:\s*([\w./-]+)\s*-->/g;

/**
 * Minimal SSI-style partial system so nav/footer/sections live once under
 * components/ and sections/ and get composed into each page at build time.
 * `<!--@include: components/nav.html-->` is replaced with that file's
 * contents, recursively (partials may include partials). Include paths are
 * always resolved against the project root, regardless of how deep the
 * including page lives under pages/.
 */
function htmlIncludes() {
  function resolveIncludes(html, seen) {
    return html.replace(INCLUDE_TAG, (match, relPath) => {
      const abs = path.resolve(root, relPath);
      if (seen.has(abs)) {
        throw new Error(`Circular @include detected: ${relPath}`);
      }
      const partial = fs.readFileSync(abs, 'utf-8');
      return resolveIncludes(partial, new Set(seen).add(abs));
    });
  }

  return {
    name: 'html-includes',
    enforce: 'pre',
    transformIndexHtml(html) {
      return resolveIncludes(html, new Set());
    },
  };
}

/**
 * Keeping `root` at the project root (not pages/) is what lets pages/**\/index.html
 * reference ../assets/... in dev without leaving Vite's dev-mode module
 * resolution boundary — assets/ has to stay reachable from `root` for
 * `<script type="module">` imports to resolve. The tradeoff is that Vite's
 * build then naturally emits dist/pages/<route>/index.html (each HTML
 * entry's output path mirrors its path relative to root). This hook moves
 * that output up a level after the build so the final dist/ matches the
 * routing structure (dist/services/index.html, not dist/pages/services/index.html).
 */
function flattenPagesOutput() {
  function moveDir(from, to) {
    fs.mkdirSync(to, { recursive: true });
    for (const entry of fs.readdirSync(from, { withFileTypes: true })) {
      const src = path.join(from, entry.name);
      const dest = path.join(to, entry.name);
      if (entry.isDirectory()) {
        moveDir(src, dest);
      } else {
        fs.renameSync(src, dest);
      }
    }
    fs.rmdirSync(from);
  }

  return {
    name: 'flatten-pages-output',
    closeBundle() {
      const builtPagesDir = path.join(outDir, 'pages');
      if (fs.existsSync(builtPagesDir)) {
        moveDir(builtPagesDir, outDir);
      }
    },
  };
}

/**
 * Dev-only: lets the dev server understand the same clean directory URLs
 * (/services/, /solutions/growth-has-stalled/) that the static build output
 * resolves automatically in production. Rewrites a request for a route
 * directory to that route's real pages/.../index.html file on disk; anything
 * that doesn't match a known page (assets, /@vite/client, etc.) passes
 * through untouched.
 */
function cleanUrlDevServer() {
  return {
    name: 'clean-url-dev-server',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        if (!req.url || req.url.includes('.')) return next();

        const [urlPath, query] = req.url.split('?');
        const cleanPath = urlPath.replace(/\/+$/, '');
        const candidate = path.join(pagesDir, cleanPath, 'index.html');

        if (fs.existsSync(candidate)) {
          req.url = `/pages${cleanPath}/index.html${query ? `?${query}` : ''}`;
        }
        next();
      });
    },
  };
}

export default defineConfig({
  plugins: [htmlIncludes(), flattenPagesOutput(), cleanUrlDevServer()],
  build: {
    outDir: 'dist',
    rollupOptions: { input },
    assetsInlineLimit: 0, // never inline videos/large images as base64
  },
  server: {
    port: 5173,
  },
});
