import path from 'path'
import fs from 'fs'

const STORE_PATH = path.join(process.cwd(), '.mock-data.json')
const MOCK_USER = { id: 'mock-user-00000000', email: 'demo@mamamap.de', aud: 'authenticated' }

type Table = 'profiles' | 'birth_plans' | 'partner_invites' | 'partner_links'
type Row = Record<string, unknown>

function read(): Record<Table, Row[]> {
  try {
    return JSON.parse(fs.readFileSync(STORE_PATH, 'utf-8'))
  } catch {
    return { profiles: [], birth_plans: [], partner_invites: [], partner_links: [] }
  }
}

function write(data: Record<Table, Row[]>): void {
  fs.writeFileSync(STORE_PATH, JSON.stringify(data, null, 2))
}

class Q {
  private _t: Table
  private _preds: Array<(r: Row) => boolean> = []
  private _op: 'select' | 'update' | 'delete' | 'insert' | 'upsert' = 'select'
  private _data: Row | null = null
  private _ord: { field: string; asc: boolean } | null = null
  private _lim: number | null = null

  constructor(t: Table) { this._t = t }

  select(_f?: string) { return this }
  eq(k: string, v: unknown) { this._preds.push(r => r[k] === v); return this }
  is(k: string, v: unknown) { this._preds.push(r => v === null ? r[k] == null : r[k] === v); return this }
  gt(k: string, v: unknown) { this._preds.push(r => String(r[k] ?? '') > String(v ?? '')); return this }
  order(field: string, opts?: { ascending?: boolean }) { this._ord = { field, asc: opts?.ascending ?? true }; return this }
  limit(n: number) { this._lim = n; return this }

  update(data: Row) { this._op = 'update'; this._data = data; return this }
  insert(data: Row) { this._op = 'insert'; this._data = data; return this }
  upsert(data: Row) { this._op = 'upsert'; this._data = data; return this }
  delete() { this._op = 'delete'; return this }

  then(
    resolve: (v: { data: Row | null; error: null }) => unknown,
    reject?: (e: unknown) => unknown,
  ) {
    return this._exec().then(resolve as never, reject)
  }

  async single(): Promise<{ data: Row | null; error: null }> {
    const s = read()
    let rows = s[this._t].filter(r => this._preds.every(p => p(r)))
    if (this._ord) {
      const { field, asc } = this._ord
      rows.sort((a, b) => {
        const av = String(a[field] ?? ''), bv = String(b[field] ?? '')
        return asc ? av.localeCompare(bv) : bv.localeCompare(av)
      })
    }
    if (this._lim !== null) rows = rows.slice(0, this._lim)
    return { data: rows[0] ?? null, error: null }
  }

  private async _exec(): Promise<{ data: null; error: null }> {
    const s = read()
    if (this._op === 'insert' && this._data) {
      s[this._t].push({ id: crypto.randomUUID(), created_at: new Date().toISOString(), ...this._data })
    } else if (this._op === 'upsert' && this._data) {
      const d = this._data
      const matchKeys = d.user_id
        ? ['user_id']
        : d.mother_id && d.partner_user_id
          ? ['mother_id', 'partner_user_id']
          : d.mother_id
            ? ['mother_id']
            : ['id']
      const i = s[this._t].findIndex(r => matchKeys.every(k => r[k] === d[k]))
      const ts = new Date().toISOString()
      if (i >= 0) s[this._t][i] = { ...s[this._t][i], ...d, updated_at: ts }
      else s[this._t].push({ id: crypto.randomUUID(), created_at: ts, updated_at: ts, ...d })
    } else if (this._op === 'update' && this._data) {
      const changes = this._data
      s[this._t] = s[this._t].map(r => this._preds.every(p => p(r)) ? { ...r, ...changes } : r)
    } else if (this._op === 'delete') {
      s[this._t] = s[this._t].filter(r => !this._preds.every(p => p(r)))
    }
    write(s)
    return { data: null, error: null }
  }
}

export function createMockServerClient() {
  return {
    auth: {
      getUser: async () => ({ data: { user: MOCK_USER }, error: null }),
      signOut: async () => ({ error: null }),
      updateUser: async (_: unknown) => ({ data: { user: MOCK_USER }, error: null }),
    },
    from: (table: string) => new Q(table as Table),
  }
}
