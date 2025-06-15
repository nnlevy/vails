import { html, render } from '@lit-labs/ssr'
import { unsafeHTML } from 'lit-html/directives/unsafe-html.js'
import { nav } from './nav'
import { footer } from './footer'

/** Wrap page content in base layout */
export async function layout(page: string, content: string): Promise<string> {
  const template = html`<!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="stylesheet" href="/styles.css" />
      </head>
      <body>
        <a href="#main" class="skip">Skip to content</a>
        ${nav(page)}
        <main id="main">${unsafeHTML(content)}</main>
        ${footer}
        <script src="https://customer.zaraz.com/v1/script/xyz" defer></script>
      </body>
    </html>`
  let out = ''
  for await (const chunk of render(template)) {
    out += chunk
  }
  return out
}
