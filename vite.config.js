import { defineConfig } from 'vite';
import { fileURLToPath, URL } from 'node:url';
import fs from 'node:fs';
import path from 'node:path';

const root = fileURLToPath(new URL('.', import.meta.url));

// Auto-discover every top-level HTML page so new pages (services.html,
// solutions.html, etc.) become build entries without touching this file.
const htmlEntries = fs
  .readdirSync(root)
  .filter((file) => file.endsWith('.html'));

const input = Object.fromEntries(
  htmlEntries.map((file) => [path.parse(file).name, path.resolve(root, file)])
);

const INCLUDE_TAG = /<!--@include:\s*([\w./-]+)\s*-->/g;

/**
 * Minimal SSI-style partial system so nav/footer/sections live once under
 * components/ and sections/ and get composed into each page at build time.
 * `<!--@include: components/nav.html-->` is replaced with that file's
 * contents, recursively (partials may include partials).
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

export default defineConfig({
  plugins: [htmlIncludes()],
  build: {
    rollupOptions: { input },
    assetsInlineLimit: 0, // never inline videos/large images as base64
  },
  server: {
    port: 5173,
  },
});
