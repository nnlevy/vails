import { describe, it, expect } from 'vitest'
import { renderMarkdown } from '../src/lib/markdown'

describe('markdown', () => {
  it('renders headings', () => {
    const html = renderMarkdown('# Test')
    expect(html.trim()).toContain('<h1')
  })
})
