/**
 * Layout — header + page + footer for every route under /:locale.
 * Unknown locale segments redirect to the English version of the same path.
 */
import { useEffect } from 'react'
import { Navigate, Outlet, useLocation, useParams } from 'react-router-dom'
import { LocaleProvider, isLocale } from '@/lib/i18n'
import { initLenis, destroyLenis, getLenis, headerH, ScrollTrigger } from '@/lib/motion'
import { Header } from './Header'
import { Footer } from './Footer'

function ScrollToTop() {
  const { pathname, hash } = useLocation()
  useEffect(() => {
    const lenis = getLenis()
    const el = hash && document.getElementById(hash.slice(1))
    if (lenis) lenis.scrollTo(el || 0, { immediate: true })
    else if (el) el.scrollIntoView()
    else window.scrollTo(0, 0)
    setTimeout(() => ScrollTrigger.refresh(), 50)
  }, [pathname, hash])
  return null
}

/** Smooth scrolling for the whole site (Demo 1); anchor links glide via Lenis */
function useSmoothScroll() {
  useEffect(() => {
    const lenis = initLenis()
    const onClick = (e) => {
      const a = e.target.closest?.('a[href^="#"]')
      if (!a || !lenis) return
      const el = document.getElementById(a.getAttribute('href').slice(1))
      if (el) { e.preventDefault(); lenis.scrollTo(el, { offset: -headerH() }) }
    }
    document.addEventListener('click', onClick)
    return () => { document.removeEventListener('click', onClick); destroyLenis() }
  }, [])
}

export function Layout() {
  const { locale } = useParams()
  const { pathname, search, hash } = useLocation()
  useSmoothScroll()
  if (!isLocale(locale)) return <Navigate to={`/en${pathname}${search}${hash}`} replace />

  return (
    <LocaleProvider locale={locale}>
      <ScrollToTop />
      <Header />
      <main id="main-content" tabIndex={-1} className="min-h-[60vh] pt-[var(--header-h)] outline-none">
        <Outlet />
      </main>
      <Footer />
    </LocaleProvider>
  )
}
