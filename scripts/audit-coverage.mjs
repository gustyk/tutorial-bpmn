import { readFile } from 'node:fs/promises';

const path = new URL('../content-src/00-research/inventory.json', import.meta.url);
const inventory = JSON.parse(await readFile(path, 'utf8'));
const eventCatalog = await readFile(new URL('../src/content/docs/events/catalog.mdx', import.meta.url), 'utf8');
const eventRows = [...eventCatalog.matchAll(/^\|\s*(\d+)\s*\|/gm)].map((match) => Number(match[1]));
const ids = inventory.elements.map((item) => item.id);
const duplicates = ids.filter((id, index) => ids.indexOf(id) !== index);
const statuses = inventory.elements.reduce((acc, item) => {
  acc[item.status] = (acc[item.status] ?? 0) + 1;
  return acc;
}, {});
const required = ['Participant', 'Connecting Object', 'Task Type', 'Activity Marker', 'Subprocess', 'Gateway', 'Event', 'Data', 'Artifact'];
const missingCategories = required.filter((category) => !inventory.elements.some((item) => item.category === category));

console.log(`Inventory entries: ${inventory.elements.length}`);
console.log(`Event types: ${inventory.events.length}`);
console.log(`Camunda reference event cells: ${eventRows.length}`);
console.log(`Status: ${JSON.stringify(statuses)}`);
if (duplicates.length) console.error(`Duplicate IDs: ${duplicates.join(', ')}`);
if (missingCategories.length) console.error(`Missing categories: ${missingCategories.join(', ')}`);
if (!inventory.limitations?.length) console.error('Missing explicit limitations/risk notes.');
if (eventRows.length !== 61 || eventRows.some((number, index) => number !== index + 1)) {
  console.error('Event catalog must contain exactly 61 sequentially numbered reference cells.');
}
if (duplicates.length || missingCategories.length || !inventory.limitations?.length || eventRows.length !== 61) process.exitCode = 1;
if ((statuses.VERIFIED ?? 0) !== inventory.elements.length) {
  console.warn(`Coverage NOT VERIFIED: ${statuses.VERIFIED ?? 0}/${inventory.elements.length}; do not claim completion.`);
}
