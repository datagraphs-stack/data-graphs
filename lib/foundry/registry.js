import {integer, sourceId, sourceOrigin, sourcePolicy, text, timestamp} from './policy.js';

const PUBLIC_COLUMNS = 'source_id, origin, status, policy_note, policy_revision, refresh_seconds, created_at_ms, updated_at_ms, next_fetch_at_ms';
const checkedId = value => {
  if (typeof value !== 'string' || !/^src_[0-9a-f]{64}$/u.test(value)) throw new TypeError('Invalid source ID');
  return value;
};

// D1 binding API. No public HTTP handler, credentials, network fetches or automatic
// migrations. The caller must be an authorized operator or trusted worker.
export class SourceRegistry {
  constructor(db) {
    if (!db || typeof db.prepare !== 'function' || typeof db.batch !== 'function') throw new TypeError('A D1-compatible database binding is required');
    this.db = db;
  }
  async register(originInput, policyInput = {}, nowMs = Date.now()) {
    const origin = sourceOrigin(originInput), id = await sourceId(origin), policy = sourcePolicy(policyInput);
    timestamp(nowMs);
    const results = await this.db.batch([
      this.db.prepare(`INSERT INTO foundry_sources (source_id,origin,status,policy_note,refresh_seconds,created_at_ms,updated_at_ms,next_fetch_at_ms)
        VALUES (?,?,?,?,?,?,?,?) ON CONFLICT(origin) DO NOTHING`).bind(id, origin, policy.status, policy.note, policy.refreshSeconds, nowMs, nowMs, nowMs),
      this.db.prepare(`INSERT INTO foundry_source_policy_events (event_id,source_id,policy_revision,status,note,refresh_seconds,recorded_at_ms)
        SELECT ?,source_id,policy_revision,status,policy_note,refresh_seconds,created_at_ms FROM foundry_sources WHERE source_id=? AND policy_revision=1
        ON CONFLICT(source_id,policy_revision) DO NOTHING`).bind(crypto.randomUUID(), id),
      this.db.prepare(`SELECT ${PUBLIC_COLUMNS} FROM foundry_sources WHERE source_id=?`).bind(id)
    ]);
    return {created: results[0].meta.changes === 1, source: results[2].results[0]};
  }
  async get(id) {
    return this.db.prepare(`SELECT ${PUBLIC_COLUMNS} FROM foundry_sources WHERE source_id=?`).bind(checkedId(id)).first();
  }
  async list({limit = 100, after = ''} = {}) {
    integer(limit, 'limit', 1, 100);
    if (after !== '') checkedId(after);
    const result = await this.db.prepare(`SELECT ${PUBLIC_COLUMNS} FROM foundry_sources WHERE source_id>? ORDER BY source_id LIMIT ?`).bind(after, limit).all();
    return result.results;
  }
  async setPolicy(id, policyInput, nowMs = Date.now()) {
    checkedId(id); timestamp(nowMs);
    const policy = sourcePolicy(policyInput);
    const result = await this.db.batch([
      this.db.prepare(`UPDATE foundry_sources SET status=?,policy_note=?,refresh_seconds=?,policy_revision=policy_revision+1,updated_at_ms=?,lease_token=NULL,lease_expires_at_ms=NULL
        WHERE source_id=? AND updated_at_ms<=?`).bind(policy.status, policy.note, policy.refreshSeconds, nowMs, id, nowMs),
      this.db.prepare(`INSERT INTO foundry_source_policy_events (event_id,source_id,policy_revision,status,note,refresh_seconds,recorded_at_ms)
        SELECT ?,source_id,policy_revision,status,policy_note,refresh_seconds,updated_at_ms FROM foundry_sources WHERE source_id=?
        ON CONFLICT(source_id,policy_revision) DO NOTHING`).bind(crypto.randomUUID(), id)
    ]);
    if (result[0].meta.changes !== 1) throw new Error('Source absent or policy timestamp precedes current state');
    return this.get(id);
  }
  async due({nowMs = Date.now(), limit = 10} = {}) {
    timestamp(nowMs); integer(limit, 'limit', 1, 100);
    const result = await this.db.prepare(`SELECT ${PUBLIC_COLUMNS} FROM foundry_sources WHERE status='active' AND next_fetch_at_ms<=?
      AND (lease_expires_at_ms IS NULL OR lease_expires_at_ms<=?) ORDER BY next_fetch_at_ms,source_id LIMIT ?`).bind(nowMs, nowMs, limit).all();
    return result.results;
  }
  async claim({nowMs = Date.now(), leaseSeconds = 60} = {}) {
    timestamp(nowMs); integer(leaseSeconds, 'leaseSeconds', 10, 600);
    const expires = timestamp(nowMs + leaseSeconds * 1000);
    const token = crypto.randomUUID();
    // Single atomic statement prevents two workers from claiming the same source.
    return this.db.prepare(`UPDATE foundry_sources SET lease_token=?,lease_expires_at_ms=? WHERE source_id=(
      SELECT source_id FROM foundry_sources WHERE status='active' AND next_fetch_at_ms<=? AND (lease_expires_at_ms IS NULL OR lease_expires_at_ms<=?)
      ORDER BY next_fetch_at_ms,source_id LIMIT 1) RETURNING ${PUBLIC_COLUMNS},lease_token,lease_expires_at_ms`).bind(token, expires, nowMs, nowMs).first();
  }
  async release(id, token, {nowMs = Date.now(), delaySeconds} = {}) {
    checkedId(id); text(token, 'lease token', 80); timestamp(nowMs);
    if (delaySeconds !== undefined) integer(delaySeconds, 'delaySeconds', 60, 2592000);
    // A revoked/expired holder cannot clear a newer lease or reschedule a source.
    const result = await this.db.prepare(`UPDATE foundry_sources SET next_fetch_at_ms=?+COALESCE(?,refresh_seconds)*1000,lease_token=NULL,lease_expires_at_ms=NULL
      WHERE source_id=? AND lease_token=? AND lease_expires_at_ms>? AND status='active'`).bind(nowMs, delaySeconds ?? null, id, token, nowMs).run();
    return result.meta.changes === 1;
  }
}
