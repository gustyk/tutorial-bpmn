/**
 * Build-time reader for content-src/00-research/inventory.json.
 * Import this in Astro pages and components that need notation metadata.
 */
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

export type Tier = 'A' | 'B' | 'C';
export type Status = 'VERIFIED' | 'DRAFTED' | 'TODO';

export interface InventoryElement {
  id: string;
  category: string;
  notation: string;
  variants?: string;
  camunda?: string;
  chapter?: string;
  docPath?: string;
  status: Status;
  tier: Tier;
  slug: string;
  introducedIn: string | null;
  reusedIn: string[];
  sources: string[];
}

export interface EventTierByPosition {
  start: Tier | null;
  intermediateCatch: Tier | null;
  intermediateThrow: Tier | null;
  boundaryInterrupting: Tier | null;
  boundaryNonInterrupting: Tier | null;
  eventSubprocessInterrupting: Tier | null;
  eventSubprocessNonInterrupting: Tier | null;
  end: Tier | null;
}

export interface InventoryEvent {
  type: string;
  allowed: string;
  status: Status;
  tierByPosition: EventTierByPosition;
}

export interface Inventory {
  scope: string;
  limitations: string[];
  sources: Array<{
    id: string;
    url: string;
    kind: string;
    checked: string;
    status: Status;
    notes?: string;
  }>;
  eventPositions: string[];
  events: InventoryEvent[];
  elements: InventoryElement[];
}

let _cache: Inventory | null = null;

export function getInventory(): Inventory {
  if (_cache) return _cache;
  const path = fileURLToPath(
    new URL('../../content-src/00-research/inventory.json', import.meta.url)
  );
  _cache = JSON.parse(readFileSync(path, 'utf8')) as Inventory;
  return _cache;
}

export function getElementsByTier(tier: Tier): InventoryElement[] {
  return getInventory().elements.filter((e) => e.tier === tier);
}

export function getElementById(id: string): InventoryElement | undefined {
  return getInventory().elements.find((e) => e.id === id);
}

export function getElementBySlug(slug: string): InventoryElement | undefined {
  return getInventory().elements.find((e) => e.slug === slug);
}

export function getElementsIntroducedIn(caseId: string): InventoryElement[] {
  return getInventory().elements.filter((e) => e.introducedIn === caseId);
}
