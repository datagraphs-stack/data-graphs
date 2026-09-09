// Registry validation only. A crawler must separately validate DNS and every redirect.
const RESERVED = new Set(['localhost', 'local', 'localdomain', 'internal', 'test', 'invalid', 'example', 'onion', 'arpa', 'home', 'lan', 'corp']);
const STATES = new Set(['pending', 'active', 'paused', 'blocked']);

export function integer(value, name, min, max) {
  if (!Number.isSafeInteger(value) || value < min || value > max) throw new TypeError(`${name} must be an integer from ${min} to ${max}`);
  return value;
}
export function timestamp(value) { return integer(value, 'timestamp', 0, 8_640_000_000_000_000); }
export function text(value, name, max = 1000) {
  if (typeof value !== 'string' || !value.trim() || value.length > max || /[\u0000-\u001f\u007f]/u.test(value)) throw new TypeError(`${name} must be nonempty plain text (max ${max})`);
  return value.trim();
}
export function fields(object, names, label) {
  if (!object || typeof object !== 'object' || Array.isArray(object) || ![Object.prototype, null].includes(Object.getPrototypeOf(object))) throw new TypeError(`${label} must be an object`);
  for (const key of Object.keys(object)) if (!names.includes(key)) throw new TypeError(`Unknown ${label} field: ${key}`);
}
export function sourceOrigin(input) {
  if (typeof input !== 'string' || input.length > 2048 || /[\s\\]/u.test(input) || !input.startsWith('https://')) throw new TypeError('Source must be an explicit HTTPS origin');
  let url;
  try { url = new URL(input); } catch { throw new TypeError('Invalid source URL'); }
  const host = url.hostname.replace(/\.$/, '').toLowerCase();
  const labels = host.split('.');
  if (url.protocol !== 'https:' || url.username || url.password || url.port || url.pathname !== '/' || url.search || url.hash || host.length > 253 || labels.length < 2 || RESERVED.has(labels.at(-1)) || !/[a-z]/u.test(labels.at(-1)) || labels.some(label => !/^[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?$/u.test(label))) throw new TypeError('Source must be a public DNS HTTPS origin without credentials, path, query, fragment or custom port');
  // The apex and www are intentionally NOT merged. A domain is not a company identity.
  return `https://${host}`;
}
export async function sourceId(input) {
  const bytes = new TextEncoder().encode(sourceOrigin(input));
  const digest = new Uint8Array(await crypto.subtle.digest('SHA-256', bytes));
  return `src_${Array.from(digest, b => b.toString(16).padStart(2, '0')).join('')}`;
}
export function sourcePolicy(input = {}) {
  fields(input, ['status', 'note', 'refreshSeconds'], 'policy');
  const status = input.status ?? 'pending';
  if (!STATES.has(status)) throw new TypeError('Unknown source status');
  const note = text(input.note ?? 'Awaiting source-policy review; acquisition disabled.', 'policy note');
  if (status === 'active' && input.note === undefined) throw new TypeError('Activation requires an explicit source-policy note');
  return Object.freeze({status, note, refreshSeconds: integer(input.refreshSeconds ?? 86400, 'refreshSeconds', 3600, 2592000)});
}
export function validateMission(input) {
  fields(input, ['version', 'id', 'name', 'sources', 'budget'], 'mission');
  if (input.version !== 1) throw new TypeError('Unsupported mission version');
  const id = text(input.id, 'mission id', 80);
  if (!/^[a-z][a-z0-9-]*$/u.test(id)) throw new TypeError('Mission id must be a lowercase slug');
  const name = text(input.name, 'mission name', 160);
  if (!Array.isArray(input.sources) || input.sources.length < 1 || input.sources.length > 100) throw new TypeError('A mission needs 1–100 source origins');
  const sources = input.sources.map(sourceOrigin);
  if (new Set(sources).size !== sources.length) throw new TypeError('Duplicate canonical source origin');
  fields(input.budget, ['maxPagesPerSource', 'maxRequests', 'requestDelayMs', 'maxResponseBytes'], 'budget');
  const budget = Object.freeze({
    maxPagesPerSource: integer(input.budget.maxPagesPerSource, 'maxPagesPerSource', 1, 20),
    maxRequests: integer(input.budget.maxRequests, 'maxRequests', 1, 2500),
    requestDelayMs: integer(input.budget.requestDelayMs, 'requestDelayMs', 1000, 60000),
    maxResponseBytes: integer(input.budget.maxResponseBytes, 'maxResponseBytes', 1024, 2_000_000)
  });
  // maxRequests is a hard cap, not a promise to fetch every page. Robots, retries,
  // redirects and discovery must also consume it when the acquisition layer exists.
  return Object.freeze({version: 1, id, name, sources: Object.freeze(sources), budget});
}
