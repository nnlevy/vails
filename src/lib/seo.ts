/** Generate standard meta tags */
export function meta({ title, description, url }: { title: string; description: string; url: string }): string {
  return `<title>${title}</title>\n<meta name="description" content="${description}" />\n<link rel="canonical" href="${url}" />`
}

/** Generate JSON-LD for articles */
export function articleJSONLD({ title, url, date }: { title: string; url: string; date: string }): string {
  return JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: title,
    url,
    datePublished: date
  })
}
