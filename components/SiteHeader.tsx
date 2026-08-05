'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useId, useRef, useState } from 'react'
import { shopLinks, treatmentLinks } from '../lib/site-data'

const midLinks = [
  { href: '/how-it-works', label: 'How It Works' },
  { href: '/pricing', label: 'Pricing' },
  { href: '/quality-and-safety', label: 'Quality & Safety' },
]

const endLinks = [{ href: '/faq', label: 'FAQ' }]

const mobileExploreLinks = [
  ...midLinks,
  ...endLinks,
  { href: '/medical-team', label: 'Medical Team' },
  { href: '/patient-center', label: 'Patient Center' },
]

interface NavLinkItem {
  href: string
  label: string
}

interface NavDropdownProps {
  label: string
  href: string
  items: NavLinkItem[]
  align?: 'left' | 'right'
}

function NavDropdown({ label, href, items, align = 'left' }: NavDropdownProps) {
  const [open, setOpen] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)
  const menuId = useId()
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const pathname = usePathname()

  const clearCloseTimer = () => {
    if (closeTimer.current) {
      clearTimeout(closeTimer.current)
      closeTimer.current = null
    }
  }

  const openMenu = () => {
    clearCloseTimer()
    setOpen(true)
  }

  const scheduleClose = () => {
    clearCloseTimer()
    closeTimer.current = setTimeout(() => setOpen(false), 120)
  }

  useEffect(() => () => clearCloseTimer(), [])

  useEffect(() => {
    if (!open) return undefined

    const onPointerDown = (event: PointerEvent) => {
      if (rootRef.current && !rootRef.current.contains(event.target as Node)) {
        setOpen(false)
      }
    }
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false)
    }

    document.addEventListener('pointerdown', onPointerDown)
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('pointerdown', onPointerDown)
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [open])

  const isActive = items.some((item) => item.href === pathname) || pathname === href

  return (
    <div
      className={`nav-dropdown ${align === 'right' ? 'nav-dropdown--right' : ''} ${open ? 'is-open' : ''} ${isActive ? 'is-active' : ''}`}
      ref={rootRef}
      onMouseEnter={openMenu}
      onMouseLeave={scheduleClose}
    >
      <Link
        href={href}
        className="nav-dropdown__trigger"
        aria-haspopup="true"
        aria-expanded={open}
        aria-controls={menuId}
        onClick={() => setOpen(false)}
        onFocus={openMenu}
      >
        <span>{label}</span>
        <span className="nav-dropdown__chevron" aria-hidden="true" />
      </Link>
      <div id={menuId} className="nav-dropdown__menu" role="menu">
        {items.map((item) => {
          const itemActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              role="menuitem"
              className={itemActive ? 'is-active' : ''}
              onClick={() => setOpen(false)}
              onFocus={openMenu}
            >
              {item.label}
            </Link>
          )
        })}
      </div>
    </div>
  )
}

export default function SiteHeader({ variant = 'default' }: { variant?: string }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const pathname = usePathname()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 18)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    setMenuOpen(false)
  }, [pathname])

  useEffect(() => {
    if (!menuOpen) return undefined

    const html = document.documentElement
    const body = document.body
    const prevHtmlOverflow = html.style.overflow
    const prevBodyOverflow = body.style.overflow

    html.style.overflow = 'hidden'
    body.style.overflow = 'hidden'

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMenuOpen(false)
    }
    window.addEventListener('keydown', handleKeyDown)

    return () => {
      html.style.overflow = prevHtmlOverflow
      body.style.overflow = prevBodyOverflow
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [menuOpen])

  const filteredTreatments = treatmentLinks.filter((item) =>
    !searchQuery.trim() || item.label.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const filteredShop = shopLinks.filter((item) =>
    !searchQuery.trim() || item.label.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const filteredExplore = mobileExploreLinks.filter((item) =>
    !searchQuery.trim() || item.label.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div
      className={`site-top site-top--${variant} ${scrolled ? 'is-scrolled' : ''} ${menuOpen ? 'is-menu-open' : ''}`}
    >
      <div className="trust-bar" aria-hidden="true">
        <div className="trust-bar__track">
          <span>LICENSED CLINICAL CARE</span>
          <span className="dot" />
          <span>CLEAR PRICING</span>
          <span className="dot" />
          <span>NO INSURANCE REQUIRED</span>
          <span className="dot" />
          <span>DISCREET DELIVERY</span>
        </div>
      </div>

      <header className="header">
        <div className="container header__inner">
          <Link href="/" className="logo-brand-img-wrap" aria-label="RSRV home" onClick={() => setMenuOpen(false)}>
            <img
              src="/brand/logos/rsrv-wordmark-dark.svg"
              alt="RSRV"
              width={120}
              height={36}
              className="logo-brand-img"
            />
          </Link>

          <nav className="nav" aria-label="Primary">
            <NavDropdown label="Treatments" href="/#treatments" items={treatmentLinks} />
            {midLinks.map((item) => {
              const active = pathname === item.href
              return (
                <Link key={item.href} href={item.href} className={active ? 'is-active' : ''}>
                  {item.label}
                </Link>
              )
            })}
            <NavDropdown label="Shop" href="/supplements" items={shopLinks} align="right" />
            {endLinks.map((item) => {
              const active = pathname === item.href
              return (
                <Link key={item.href} href={item.href} className={active ? 'is-active' : ''}>
                  {item.label}
                </Link>
              )
            })}
          </nav>

          <div className="header__actions">
            <Link href="/patient-login" className="btn btn--ghost header__signin">
              Patient Login
            </Link>
            <Link href="/check-eligibility" className="btn btn--primary header__cta">
              Check Eligibility
            </Link>
            <button
              type="button"
              className={`nav-toggle ${menuOpen ? 'is-open' : ''}`}
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={menuOpen}
              aria-controls="mobile-nav-panel"
              onClick={() => setMenuOpen((open) => !open)}
            >
              <span />
              <span />
              <span />
            </button>
          </div>
        </div>
      </header>

      <div
        id="mobile-nav-panel"
        className={`mobile-nav ${menuOpen ? 'is-open' : ''}`}
        aria-hidden={!menuOpen}
      >
        <button type="button" className="mobile-nav__scrim" aria-label="Close menu" onClick={() => setMenuOpen(false)} />
        <div className="mobile-nav__sheet">
          {/* Quick Search inside mobile menu */}
          <div className="mobile-nav__search">
            <svg className="mobile-nav__search-icon" viewBox="0 0 20 20" fill="none" aria-hidden="true">
              <path
                d="M9 17A8 8 0 109 1a8 8 0 000 16zM19 19l-4.35-4.35"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search treatments, supplements, pricing..."
              className="mobile-nav__search-input"
            />
            {searchQuery && (
              <button
                type="button"
                className="mobile-nav__search-clear"
                onClick={() => setSearchQuery('')}
                aria-label="Clear search"
              >
                ✕
              </button>
            )}
          </div>

          {filteredTreatments.length > 0 && (
            <>
              <p className="mobile-nav__label">Care Programs</p>
              <nav className="mobile-nav__links">
                {filteredTreatments.map((item) => {
                  const active = pathname === item.href
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`mobile-nav__link-item ${active ? 'is-active' : ''}`}
                      onClick={() => setMenuOpen(false)}
                    >
                      <span className="mobile-nav__link-title">{item.label}</span>
                      <span className="mobile-nav__badge">Rx Care</span>
                    </Link>
                  )
                })}
              </nav>
            </>
          )}

          {filteredShop.length > 0 && (
            <>
              <p className="mobile-nav__label">Wellness &amp; Supplements</p>
              <nav className="mobile-nav__links">
                {filteredShop.map((item) => {
                  const active = pathname === item.href
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`mobile-nav__link-item ${active ? 'is-active' : ''}`}
                      onClick={() => setMenuOpen(false)}
                    >
                      <span className="mobile-nav__link-title">{item.label}</span>
                      <span className="mobile-nav__badge mobile-nav__badge--shop">Shop</span>
                    </Link>
                  )
                })}
              </nav>
            </>
          )}

          {filteredExplore.length > 0 && (
            <>
              <p className="mobile-nav__label">Information &amp; Portal</p>
              <nav className="mobile-nav__links">
                {filteredExplore.map((item) => {
                  const active = pathname === item.href
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`mobile-nav__link-item ${active ? 'is-active' : ''}`}
                      onClick={() => setMenuOpen(false)}
                    >
                      <span className="mobile-nav__link-title">{item.label}</span>
                      <span className="mobile-nav__arrow" aria-hidden="true">→</span>
                    </Link>
                  )
                })}
              </nav>
            </>
          )}

          <div className="mobile-nav__actions">
            <Link href="/check-eligibility" className="btn btn--primary btn--lg" onClick={() => setMenuOpen(false)}>
              Check Eligibility →
            </Link>
            <Link href="/patient-login" className="btn btn--outline btn--lg" onClick={() => setMenuOpen(false)}>
              Patient Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

