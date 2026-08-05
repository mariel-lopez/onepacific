export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="footer-inner">
        <p className="footer-copy">
          © {new Date().getFullYear()} One Pacific by the Bay. All rights
          reserved.
        </p>
        <p className="footer-credit">
          Designed by{' '}
          <a
            href="https://www.linkedin.com/company/patandbas/"
            target="_blank"
            rel="noopener noreferrer"
          >
            pat &amp; bas
          </a>
        </p>
      </div>
    </footer>
  )
}
