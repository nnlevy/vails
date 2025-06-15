import { html } from 'lit-html'

/** Main navigation component */
export const nav = (active: string) => html`
  <nav aria-label="Main" id="main-nav">
    <a href="/" class="logo"><img src="/logo.svg" alt="Vails" /></a>
    <button id="menu-toggle" aria-label="Menu" @click="this.parentElement?.toggleAttribute('aria-expanded')">☰</button>
    <ul>
      <li><a href="/veil-types" class="${active === 'veil-types' ? 'active' : ''}">Veil Types</a></li>
      <li><a href="/markets" class="${active === 'markets' ? 'active' : ''}">Markets</a></li>
      <li><a href="/history" class="${active === 'history' ? 'active' : ''}">History</a></li>
    </ul>
    <form action="/search" method="get">
      <input type="search" name="q" placeholder="Search" />
    </form>
  </nav>
`
