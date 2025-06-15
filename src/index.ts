import { layout } from './templates/layout'
import { renderMarkdown } from './lib/markdown'
import { meta } from './lib/seo'

export interface Env {
  CONTENT: KVNamespace
  ADMIN_USER: string
  ADMIN_PASS: string
}

const cache = caches.default

function basicAuth(req: Request, env: Env): boolean {
  const auth = req.headers.get('Authorization')
  if (!auth || !auth.startsWith('Basic ')) return false
  const [user, pass] = atob(auth.slice(6)).split(':')
  return user === env.ADMIN_USER && pass === env.ADMIN_PASS
}

async function getMarkdown(path: string, env: Env): Promise<string | null> {
  let md = await env.CONTENT.get(path)
  if (md) return md
  try {
    md = await (await fetch(`https://dummy/${path}`)).text()
    await env.CONTENT.put(path, md)
    return md
  } catch {
    return null
  }
}

export default {
  async fetch(req: Request, env: Env): Promise<Response> {
    const url = new URL(req.url)
    const pathname = url.pathname

    if (pathname === '/search') {
      const q = url.searchParams.get('q') || ''
      const assetUrl = new URL('/search-index.json', req.url)
      const index = await (await fetch(assetUrl.toString())).json()
      const Fuse = (await import('fuse.js')).default
      const fuse = new Fuse(index, { keys: ['title', 'content'] })
      const results = fuse.search(q).map((r) => r.item)
      return new Response(JSON.stringify(results), { headers: { 'content-type': 'application/json' } })
    }

    if (pathname === '/admin') {
      if (!basicAuth(req, env)) {
        return new Response('Unauthorized', { status: 401, headers: { 'WWW-Authenticate': 'Basic realm="vails"' } })
      }
      if (req.method === 'POST') {
        const { key, content } = await req.json()
        await env.CONTENT.put(key, content)
        cache.delete(`https://vails.org/${key}`)
        return new Response('Saved')
      }
      return new Response('<form method="post"><input name="key"/><textarea name="content"></textarea><button>Save</button></form>', { headers: { 'content-type': 'text/html' } })
    }

    let key: string
    if (pathname === '/') {
      key = 'veil-types.md'
    } else if (pathname.startsWith('/best-practices/')) {
      key = `best-practices/${pathname.split('/')[2]}.md`
    } else {
      key = pathname.slice(1) + '.md'
    }
    const md = await getMarkdown(key, env)
    if (!md) return new Response('Not found', { status: 404 })

    const page = key.replace(/\.md$/, '')
    const html = renderMarkdown(md)
    const body = await layout(page, html)
    const headers = {
      'content-type': 'text/html;charset=utf-8',
      'Cache-Control': pathname.startsWith('/admin') ? 'private,max-age=300' : 'public,max-age=86400'
    }
    return new Response(meta({ title: 'Vails', description: 'All about wedding veils', url: url.href }) + body, { headers })
  }
} satisfies ExportedHandler<Env>
