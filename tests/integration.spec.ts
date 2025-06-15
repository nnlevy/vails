import { describe, it, expect } from 'vitest'
import { Miniflare } from 'miniflare'
import { readFileSync } from 'fs'

describe('worker', () => {
  const mf = new Miniflare({
    modules: true,
    scriptPath: 'dist/index.js',
    kvNamespaces: ['CONTENT'],
    bindings: { ADMIN_USER: 'a', ADMIN_PASS: 'b' },
    modulesRules: [{ type: 'ESModule', include: ['dist/**/*.js'] }]
  })

  it.skip('serves veil types', async () => {
    const md = readFileSync('content/veil-types.md', 'utf-8')
    const credentials = Buffer.from('a:b').toString('base64')
    await mf.dispatchFetch('http://localhost/admin', { method: 'POST', headers: { Authorization: 'Basic ' + credentials }, body: JSON.stringify({ key: 'veil-types.md', content: md }) })
    const res = await mf.dispatchFetch('http://localhost/veil-types')
    expect(res.status).toBe(200)
  })
})
