// Local development/test adapter only. Production uses Cloudflare's D1 binding.
import {DatabaseSync} from 'node:sqlite';
export function localDatabase(path = ':memory:', {readOnly = false} = {}) {
  const sqlite = new DatabaseSync(path, {readOnly});
  sqlite.exec('PRAGMA foreign_keys=ON');
  const prepare = (sql, params = []) => ({
    bind(...values) { return prepare(sql, values); },
    async first() { return sqlite.prepare(sql).get(...params) ?? null; },
    async all() {
      const before = sqlite.prepare('SELECT total_changes() AS n').get().n;
      const results = sqlite.prepare(sql).all(...params);
      const after = sqlite.prepare('SELECT total_changes() AS n').get().n;
      return {success: true, results, meta: {changes: Number(after - before)}};
    },
    async run() { const result = sqlite.prepare(sql).run(...params); return {success: true, results: [], meta: {changes: Number(result.changes)}}; },
    _execute() {
      const statement = sqlite.prepare(sql);
      const before = sqlite.prepare('SELECT total_changes() AS n').get().n;
      const results = statement.columns().length ? statement.all(...params) : (statement.run(...params), []);
      const after = sqlite.prepare('SELECT total_changes() AS n').get().n;
      return {success: true, results, meta: {changes: Number(after - before)}};
    }
  });
  return {
    prepare,
    async batch(statements) {
      sqlite.exec('BEGIN');
      try { const results = statements.map(stmt => stmt._execute()); sqlite.exec('COMMIT'); return results; }
      catch (error) { sqlite.exec('ROLLBACK'); throw error; }
    },
    exec(sql) { sqlite.exec(sql); },
    close() { sqlite.close(); }
  };
}
