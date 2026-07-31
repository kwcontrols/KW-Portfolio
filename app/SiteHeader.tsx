export function SiteHeader() {
  return (
    <header className="site-header">
      <a className="brand" href="/" aria-label="Kui Wu home">
        Kui Wu
      </a>
      <nav aria-label="Primary navigation">
        <a href="/">About</a>
        <a href="/experience">Experience</a>
        <a href="/contact">Contact</a>
      </nav>
    </header>
  );
}
