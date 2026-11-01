import { readdir, readFile, stat } from 'node:fs/promises';
import { join, dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const distDir = fileURLToPath(new URL('../dist', import.meta.url));

async function walk(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...await walk(full));
    } else if (entry.name.endsWith('.html')) {
      files.push(full);
    }
  }
  return files;
}

function extractLinks(html) {
  const links = [];
  const hrefRe = /href="([^"]+)"/g;
  let m;
  while ((m = hrefRe.exec(html)) !== null) {
    links.push(m[1]);
  }
  return links;
}

async function fileExists(path) {
  try {
    await stat(path);
    return true;
  } catch {
    return false;
  }
}

async function resolveLink(link, fromFile) {
  if (link.startsWith('http://') || link.startsWith('https://') || link.startsWith('mailto:') || link.startsWith('#')) {
    return null; // Skip external and anchor links
  }
  // Strip fragment
  const [pathPart] = link.split('#');
  if (!pathPart) return null;

  // Resolve relative to dist
  let resolved;
  if (pathPart.startsWith('/')) {
    resolved = join(distDir, pathPart);
  } else {
    resolved = resolve(dirname(fromFile), pathPart);
  }

  // Check as file directly, or as index.html in directory
  if (await fileExists(resolved)) return null;
  if (await fileExists(join(resolved, 'index.html'))) return null;
  if (!resolved.endsWith('.html') && await fileExists(resolved + '.html')) return null;

  return resolved.replace(distDir, '');
}

const htmlFiles = await walk(distDir);
let failed = false;

for (const file of htmlFiles) {
  const html = await readFile(file, 'utf8');
  const links = extractLinks(html);
  for (const link of links) {
    const broken = await resolveLink(link, file);
    if (broken !== null) {
      failed = true;
      console.error(`BROKEN: ${file.replace(distDir, '')} → ${link} (resolved: ${broken})`);
    }
  }
}

if (!failed) {
  console.log(`All internal links OK (${htmlFiles.length} HTML files checked).`);
}

if (failed) process.exitCode = 1;
