import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'

const NAV_LINKS = [
  { href: '/#features', label: 'Features' },
  { href: '/#about', label: 'About' },
  { href: '/#contact', label: 'Contact' },
] as const

export function SiteLogo({ to = '/' }: { to?: string }) {
  return (
    <Link to={to} className="logo" aria-label="One Pacific By The Bay home">
      <img
        className="logo-mark"
        src="/favicon.svg"
        alt=""
        width={32}
        height={32}
        decoding="async"
      />
      <span className="logo-text">
        One Pacific
        <br />
        By The Bay
      </span>
    </Link>
  )
}

type SiteHeaderProps = {
  variant?: 'overlay' | 'solid'
}

export function SiteHeader({ variant = 'overlay' }: SiteHeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false)
  const location = useLocation()

  useEffect(() => {
    setMenuOpen(false)
  }, [location.pathname])

  useEffect(() => {
    document.body.classList.toggle('nav-open', menuOpen)
    return () => document.body.classList.remove('nav-open')
  }, [menuOpen])

  return (
    <header
      className={`site-header${variant === 'solid' ? ' site-header--solid' : ''}`}
    >
      <SiteLogo />
      <nav className={`nav${menuOpen ? ' is-open' : ''}`} aria-label="Primary">
        {NAV_LINKS.map((link) => (
          <Link
            key={link.href}
            to={link.href}
            onClick={(event) => {
              setMenuOpen(false)
              const hash = link.href.includes('#')
                ? `#${link.href.split('#')[1]}`
                : ''
              if (location.pathname === '/' && hash) {
                event.preventDefault()
                window.history.pushState(null, '', hash)
                const el = document.getElementById(hash.slice(1))
                el?.scrollIntoView({ behavior: 'smooth', block: 'start' })
              }
            }}
          >
            {link.label}
          </Link>
        ))}
      </nav>
      <button
        type="button"
        className="nav-toggle"
        aria-expanded={menuOpen}
        aria-label={menuOpen ? 'Close menu' : 'Open menu'}
        onClick={() => setMenuOpen((open) => !open)}
      >
        <span />
      </button>
    </header>
  )
}
