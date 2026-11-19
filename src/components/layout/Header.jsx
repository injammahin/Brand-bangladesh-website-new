/**
 * Header — solid black bar with the full logo (client-approved, Demo 2).
 * Hides on scroll down, returns on scroll up. Brand-stripe scroll progress along the bottom edge.
 * Desktop (≥1280px): inline menu. Below that: hamburger opens a full-height menu panel.
 */
import { useEffect, useRef, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { useT, ui, NAV, switchLocalePath } from '@/lib/i18n'
import { cn } from '@/lib/utils'

export function Header() {
  const { t, href, locale } = useT()
  const { pathname } = useLocation()
  const [open, setOpen] = useState(false)
  const [hidden, setHidden] = useState(false)
  const [copied, setCopied] = useState(false)
  const barRef = useRef(null)
  const lastY = useRef(0)

  // hide on scroll down / show on scroll up + progress bar
  useEffect(() => {
    let raf = 0
    const onScroll = () => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(() => {
        const y = window.scrollY
        const max = document.documentElement.scrollHeight - window.innerHeight
        if (barRef.current) barRef.current.style.transform = `scaleX(${max > 0 ? y / max : 0})`
        const d = y - lastY.current
        if (d > 8 && y > 120) setHidden(true)
        else if (d < -4 || y < 120) setHidden(false)
        lastY.current = y
      })
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => { window.removeEventListener('scroll', onScroll); cancelAnimationFrame(raf) }
  }, [])

  // close the menu on navigation
  useEffect(() => { setOpen(false) }, [pathname])

  // menu open: lock page scroll, close on Escape or when resized up to desktop
  useEffect(() => {
    if (!open) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const onKey = (e) => e.key === 'Escape' && setOpen(false)
    const mq = window.matchMedia('(min-width: 1280px)')
    const onMq = () => mq.matches && setOpen(false)
    window.addEventListener('keydown', onKey)
    mq.addEventListener('change', onMq)
    return () => {
      document.body.style.overflow = prev
      window.removeEventListener('keydown', onKey)
      mq.removeEventListener('change', onMq)
    }
  }, [open])

  const share = async () => {
    const url = window.location.href
    try {
      if (navigator.share) await navigator.share({ title: document.title, url })
      else {
        await navigator.clipboard.writeText(url)
        setCopied(true)
        setTimeout(() => setCopied(false), 1800)
      }
    } catch { /* cancelled */ }
  }

  const bn = locale === 'bn'
  const linkCls = ({ isActive }) => cn(
    'relative py-2 transition-colors duration-200',
    bn ? 'font-bengali text-[0.95rem]' : 'font-inter text-[0.6875rem] uppercase tracking-label',
    isActive ? 'text-gold' : 'text-cream/65 hover:text-cream',
  )

  return (
    <>
      <header
        className={cn(
          'fixed inset-x-0 top-0 z-50 bg-ink text-cream transition-transform duration-500 ease-brand',
          hidden && !open && '-translate-y-full',
        )}
      >
        <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-3 focus:z-50 rounded bg-cream px-3 py-2 font-inter text-xs text-ink">
          {t(ui.skipToContent)}
        </a>

        <div className="container-x flex h-[var(--header-h)] items-center justify-between gap-4">
          {/* Full logo */}
          <Link to={href()} className="shrink-0 transition-opacity hover:opacity-80" aria-label={`Brand Bangladesh — ${t(ui.home)}`}>
            <img src="/assets/brand/logo-full-light.png" alt="Brand Bangladesh" width="908" height="284" className="h-9 w-auto md:h-11" />
          </Link>

          {/* Desktop menu */}
          <nav className="hidden items-center gap-5 xl:flex 2xl:gap-7" aria-label="Main">
            {NAV.map((item) => (
              <NavLink key={item.key} to={href(item.path)} className={linkCls}>
                {t(ui.nav[item.key])}
              </NavLink>
            ))}
          </nav>

          {/* Utilities */}
          <div className="flex items-center gap-1 sm:gap-2">
            <Link to={href('/search')} className="grid h-10 w-10 place-items-center rounded-full text-cream/65 transition-colors hover:bg-cream/10 hover:text-cream" aria-label={t(ui.search)}>
              <svg width="17" height="17" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <circle cx="7" cy="7" r="5" stroke="currentColor" strokeWidth="1.4" />
                <path d="M11 11l3.5 3.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
              </svg>
            </Link>

            <button type="button" onClick={share} className="relative hidden h-10 w-10 place-items-center rounded-full text-cream/65 transition-colors hover:bg-cream/10 hover:text-cream sm:grid" aria-label={t(ui.share)}>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <circle cx="12" cy="3.5" r="2" stroke="currentColor" strokeWidth="1.3" />
                <circle cx="4" cy="8" r="2" stroke="currentColor" strokeWidth="1.3" />
                <circle cx="12" cy="12.5" r="2" stroke="currentColor" strokeWidth="1.3" />
                <path d="M5.8 7l4.4-2.5M5.8 9l4.4 2.5" stroke="currentColor" strokeWidth="1.3" />
              </svg>
              {copied && (
                <span role="status" className="absolute right-0 top-full mt-2 whitespace-nowrap rounded bg-cream px-2 py-1 font-inter text-[10px] text-ink">{t(ui.copied)}</span>
              )}
            </button>

            <LangSwitch pathname={pathname} locale={locale} className="hidden sm:flex" />

            {/* Hamburger below desktop */}
            <button
              type="button"
              onClick={() => setOpen((o) => !o)}
              className="grid h-10 w-10 place-items-center rounded-full transition-colors hover:bg-cream/10 xl:hidden"
              aria-label={t(open ? ui.menuClose : ui.menuOpen)}
              aria-expanded={open}
              aria-controls="mobile-menu"
            >
              <span className="relative block h-3 w-6" aria-hidden="true">
                <span className={cn('absolute left-0 top-0 h-px w-6 bg-cream transition-transform duration-300', open && 'translate-y-1.5 rotate-45')} />
                <span className={cn('absolute left-0 top-1.5 h-px w-6 bg-cream transition-opacity duration-300', open && 'opacity-0')} />
                <span className={cn('absolute left-0 top-3 h-px w-6 bg-cream transition-transform duration-300', open && '-translate-y-1.5 -rotate-45')} />
              </span>
            </button>
          </div>
        </div>

        {/* Scroll progress, in the six brand colours */}
        <div className="absolute inset-x-0 bottom-0 h-[2px] bg-cream/5" aria-hidden="true">
          <div ref={barRef} className="brand-stripe h-full origin-left" style={{ transform: 'scaleX(0)' }} />
        </div>
      </header>

      {/* Mobile / tablet menu panel */}
      <div
        id="mobile-menu"
        className={cn(
          'fixed inset-x-0 bottom-0 top-[var(--header-h)] z-40 flex flex-col overflow-y-auto bg-ink text-cream transition-[opacity,transform] duration-500 ease-brand xl:hidden',
          open ? 'translate-y-0 opacity-100' : 'pointer-events-none -translate-y-4 opacity-0',
        )}
        aria-hidden={!open}
        inert={!open || undefined}
      >
        <nav className="container-x flex-1 pt-4" aria-label="Mobile">
          {NAV.map((item, i) => (
            <NavLink
              key={item.key}
              to={href(item.path)}
              className={({ isActive }) => cn(
                'flex items-baseline gap-4 border-b border-cream/10 py-4 transition-colors',
                isActive ? 'text-gold' : 'text-cream/85 hover:text-cream',
              )}
              style={{ transitionDelay: open ? `${60 + i * 35}ms` : '0ms' }}
            >
              <span className="w-6 font-inter text-[11px] text-cream/35">{String(i + 1).padStart(2, '0')}</span>
              <span className={cn('leading-tight', bn ? 'font-bengali text-2xl' : 'font-cormorant text-[1.75rem] sm:text-3xl')}>{t(ui.nav[item.key])}</span>
            </NavLink>
          ))}
        </nav>

        <div className="container-x flex flex-wrap items-center justify-between gap-4 border-t border-cream/10 py-6 pb-[max(1.5rem,env(safe-area-inset-bottom))]">
          <LangSwitch pathname={pathname} locale={locale} large />
          <Link to={href('/community')} className="inline-flex items-center gap-2 rounded-full bg-cream px-5 py-3 font-inter text-xs font-medium uppercase tracking-label text-ink transition-colors hover:bg-gold">
            {t(ui.shareStory)} <span aria-hidden="true">→</span>
          </Link>
        </div>
      </div>
    </>
  )
}

function LangSwitch({ pathname, locale, className, large }) {
  return (
    <div className={cn('items-center rounded-full border border-cream/15 p-0.5 font-inter', large ? 'flex text-sm' : 'text-xs', className)}>
      {[
        { code: 'en', label: 'EN', aria: 'Switch to English' },
        { code: 'bn', label: 'বাংলা', aria: 'বাংলায় দেখুন' },
      ].map((l) => (
        <Link
          key={l.code}
          to={switchLocalePath(pathname, l.code)}
          lang={l.code}
          aria-label={l.aria}
          aria-current={locale === l.code ? 'true' : undefined}
          className={cn(
            'rounded-full transition-colors',
            large ? 'px-4 py-2' : 'px-3 py-1.5',
            l.code === 'bn' && 'font-bengali',
            locale === l.code ? 'bg-cream text-ink' : 'text-cream/60 hover:text-cream',
          )}
        >
          {l.label}
        </Link>
      ))}
    </div>
  )
}
