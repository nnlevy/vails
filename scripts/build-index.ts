import { writeFileSync, readdirSync, readFileSync } from 'fs'
import { join } from 'path'
import { marked } from 'marked'

interface Doc {
  title: string
  slug: string
  content: string
}

const contentDir = join('content', 'best-practices')
const files = readdirSync(contentDir)
const docs: Doc[] = files.map((file) => {
  const md = readFileSync(join(contentDir, file), 'utf-8')
  const slug = file.replace(/\.md$/, '')
  const titleMatch = md.match(/^#\s+(.*)/)
  const title = titleMatch ? titleMatch[1] : slug
  const html = marked.parse(md)
  return { title, slug, content: html }
})

writeFileSync('public/search-index.json', JSON.stringify(docs))
