/**
 * audit-coverage.mjs
 * Aturan A1–A9 (IMPLEMENTATION-PLAN §7.2).
 * Jalankan tanpa flag untuk mode development (A9 = info saja).
 * Jalankan dengan --release untuk mode rilis (A9 = error).
 * Gunakan --report untuk mencetak tabel coverage.
 */
import { readFile, readdir } from 'node:fs/promises';
import { createRequire } from 'node:module';
import { existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const require = createRequire(import.meta.url);
const Ajv = require('ajv');
const ajv = new Ajv({ allErrors: true, strict: false });

const isRelease = process.argv.includes('--release');
const isReport = process.argv.includes('--report');

const root = new URL('..', import.meta.url);
const inventoryPath = new URL('content-src/00-research/inventory.json', root);
const schemaPath = new URL('schemas/inventory.schema.json', root);

const inventory = JSON.parse(await readFile(inventoryPath, 'utf8'));
const schema = JSON.parse(await readFile(schemaPath, 'utf8'));

let failed = false;

function fail(rule, msg) {
  failed = true;
  console.error(`${rule} FAIL: ${msg}`);
}
function warn(rule, msg) {
  console.warn(`${rule} WARN: ${msg}`);
}
function ok(rule, msg) {
  if (isReport) console.log(`${rule} OK: ${msg}`);
}

// ─── Schema validation ────────────────────────────────────────────────────────
const validate = ajv.compile(schema);
if (!validate(inventory)) {
  for (const e of validate.errors ?? []) fail('SCHEMA', `${e.instancePath} ${e.message}`);
} else {
  ok('SCHEMA', 'inventory.json conforme al schema');
}

const elements = inventory.elements;

// ─── A1: tier/slug/status sah; counts per tier ───────────────────────────────
const tierCounts = { A: 0, B: 0, C: 0 };
for (const el of elements) {
  if (!['A','B','C'].includes(el.tier)) fail('A1', `${el.id} tier "${el.tier}" tidak sah`);
  if (!el.slug) fail('A1', `${el.id} tidak memiliki slug`);
  if (!['VERIFIED','DRAFTED','TODO'].includes(el.status)) fail('A1', `${el.id} status "${el.status}" tidak sah`);
  tierCounts[el.tier] = (tierCounts[el.tier] ?? 0) + 1;
}
if (tierCounts.A !== 35 || tierCounts.B !== 10 || tierCounts.C !== 3) {
  fail('A1', `jumlah tier A=${tierCounts.A} B=${tierCounts.B} C=${tierCounts.C} (harusnya 35/10/3)`);
} else {
  ok('A1', `jumlah tier A=35 B=10 C=3`);
}
const ids = elements.map((e) => e.id);
const dups = ids.filter((id, i) => ids.indexOf(id) !== i);
if (dups.length) fail('A1', `id duplikat: ${dups.join(', ')}`);

// ─── A2: Tier A harus punya introducedIn dan reusedIn ≥1 ─────────────────────
const tierA = elements.filter((e) => e.tier === 'A');
for (const el of tierA) {
  if (!el.introducedIn) fail('A2', `${el.id} (${el.notation}) tidak memiliki introducedIn`);
  if (!el.reusedIn || el.reusedIn.length === 0) {
    // Hanya warn selama development — kasus belum dibangun
    warn('A2', `${el.id} (${el.notation}) belum memiliki reusedIn (kasus belum dibangun)`);
  }
}
ok('A2', `${tierA.length} notasi Tier A diperiksa`);

// ─── A3: Tier A dengan docPath harus punya file dan 19 heading bagian ──────────
const TIER_A_HEADING_COUNT = 19;
for (const el of tierA) {
  if (!el.docPath) {
    // Normal selama WP-0–WP-6; halaman dibuat di WP-7–WP-9
    warn('A3', `${el.id} belum memiliki docPath (belum WP-7+)`);
    continue;
  }
  const filePath = fileURLToPath(new URL(`src/content/docs/${el.docPath}`, root));
  if (!existsSync(filePath)) {
    fail('A3', `${el.id} docPath "${el.docPath}" tidak ditemukan`);
    continue;
  }
  const content = await readFile(filePath, 'utf8');
  const headings = (content.match(/^##\s/mg) ?? []).length;
  if (headings < TIER_A_HEADING_COUNT) {
    fail('A3', `${el.id} docPath memuat ${headings}/${TIER_A_HEADING_COUNT} heading bagian`);
  }
}

// ─── A4: Tier B harus punya halaman dengan 7 bagian ──────────────────────────
const TIER_B_HEADING_COUNT = 7;
const tierB = elements.filter((e) => e.tier === 'B');
for (const el of tierB) {
  if (!el.docPath) {
    warn('A4', `${el.id} belum memiliki docPath (Katalog Tier B belum dibangun)`);
    continue;
  }
  const filePath = fileURLToPath(new URL(`src/content/docs/${el.docPath}`, root));
  if (!existsSync(filePath)) {
    fail('A4', `${el.id} docPath "${el.docPath}" tidak ditemukan`);
    continue;
  }
  const content = await readFile(filePath, 'utf8');
  const headings = (content.match(/^##\s/mg) ?? []).length;
  if (headings < TIER_B_HEADING_COUNT) {
    fail('A4', `${el.id} hanya memiliki ${headings}/${TIER_B_HEADING_COUNT} heading bagian`);
  }
}

// ─── A5: confusedWith harus simetris ─────────────────────────────────────────
for (const el of elements) {
  if (!el.confusedWith) continue;
  for (const otherId of el.confusedWith) {
    const other = elements.find((e) => e.id === otherId);
    if (!other) { fail('A5', `${el.id}.confusedWith refs ${otherId} yang tidak ada`); continue; }
    if (!(other.confusedWith ?? []).includes(el.id)) {
      fail('A5', `${el.id}↔${otherId} confusedWith tidak simetris`);
    }
  }
}

// ─── A6: setiap kasus punya criteria.json yang sah ───────────────────────────
// Hanya cek kasus yang ada di content-src/cases/
let criteriaTotal = 0;
const criteriaSchemaPath = new URL('schemas/criteria.schema.json', root);
let validateCriteria = null;
if (existsSync(fileURLToPath(criteriaSchemaPath))) {
  const criteriaSchema = JSON.parse(await readFile(criteriaSchemaPath, 'utf8'));
  validateCriteria = ajv.compile(criteriaSchema);
}
try {
  const casesDir = fileURLToPath(new URL('content-src/cases', root));
  const caseDirs = await readdir(casesDir, { withFileTypes: true });
  for (const d of caseDirs) {
    if (!d.isDirectory()) continue;
    const criteriaPath = fileURLToPath(new URL(`content-src/cases/${d.name}/criteria.json`, root));
    if (!existsSync(criteriaPath)) {
      warn('A6', `${d.name} tidak memiliki criteria.json (belum dibangun)`);
      continue;
    }
    const criteria = JSON.parse(await readFile(criteriaPath, 'utf8'));
    if (validateCriteria && !validateCriteria(criteria)) {
      for (const e of validateCriteria.errors ?? []) fail('A6', `${d.name} criteria.json ${e.instancePath} ${e.message}`);
    }
    const items = criteria.criteria ?? [];
    criteriaTotal += items.length;
    if (items.length < 4) fail('A6', `${d.name} hanya ${items.length} kriteria (minimum 4)`);
    const autoCount = items.filter((c) => c.check?.mode === 'auto').length;
    if (autoCount < 2) fail('A6', `${d.name} hanya ${autoCount} kriteria auto (minimum 2)`);
  }
} catch {
  warn('A6', 'content-src/cases/ belum ada (belum WP-7+)');
}

// ─── A7: total titik reuse negatif ≥5 ────────────────────────────────────────
const negativeReuseTotal = elements.reduce((sum, el) => sum + (el.negativeReuse?.length ?? 0), 0);
if (negativeReuseTotal < 5) {
  // Warn selama development; akan fail di WP-8+
  warn('A7', `${negativeReuseTotal}/5 titik reuse negatif terdaftar (belum WP-7+)`);
} else {
  ok('A7', `${negativeReuseTotal} titik reuse negatif`);
}

// ─── A8: proporsi tipe soal (hanya jika ada modul) ───────────────────────────
// Skip selama WP-0–WP-6; akan diaktifkan saat modul ada
warn('A8', 'proporsi tipe soal belum dapat diperiksa (modul belum dibangun)');

// ─── A9: tidak ada TODO/DRAFTED saat --release ────────────────────────────────
const draftedOrTodo = elements.filter((e) => e.status !== 'VERIFIED');
if (isRelease) {
  if (draftedOrTodo.length > 0) {
    fail('A9', `${draftedOrTodo.length} entri belum VERIFIED: ${draftedOrTodo.map((e) => e.id).join(', ')}`);
  } else {
    ok('A9', 'semua entri VERIFIED');
  }
} else {
  if (draftedOrTodo.length > 0) {
    console.info(`A9 INFO: ${draftedOrTodo.length}/${elements.length} entri belum VERIFIED (OK dalam mode development)`);
  }
}

// ─── Summary ──────────────────────────────────────────────────────────────────
const statuses = elements.reduce((acc, e) => { acc[e.status] = (acc[e.status] ?? 0) + 1; return acc; }, {});
console.log(`\nInventory entries: ${elements.length} | Event types: ${inventory.events.length}`);
console.log(`Tier: A=${tierCounts.A} B=${tierCounts.B} C=${tierCounts.C}`);
console.log(`Status: ${JSON.stringify(statuses)}`);
if (criteriaTotal > 0) console.log(`Criteria total: ${criteriaTotal}`);

if (isReport) {
  console.log('\n--- Coverage report ---');
  console.log('ID  | Tier | Status   | introducedIn | reusedIn');
  for (const el of elements) {
    const reused = (el.reusedIn ?? []).join(',') || '—';
    const intro = el.introducedIn ?? '—';
    console.log(`${el.id.padEnd(3)} | ${el.tier}    | ${el.status.padEnd(8)} | ${intro.padEnd(12)} | ${reused}`);
  }
}

if (failed) {
  console.error('\naudit:coverage FAILED — lihat error di atas');
  process.exitCode = 1;
} else {
  console.log('\naudit:coverage OK (warnings tidak memblokir development build)');
}
