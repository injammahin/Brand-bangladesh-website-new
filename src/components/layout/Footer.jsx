/**
 * Footer — Demo 2 footer with the map video band.
 * W-07: the video has no box or hard edge. Its edges are masked away on all four sides and it is
 * multiplied onto the cream footer, so its light sky becomes the footer colour and only the map
 * and clouds remain.
 */
import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFacebookF, faInstagram, faXTwitter, faYoutube, faLinkedinIn } from '@fortawesome/free-brands-svg-icons'
import { useT, ui } from '@/lib/i18n'

const L = {
  discover: { en: 'Discover', bn: 'আবিষ্কার' },
  pillars: { en: 'Pillars', bn: 'স্তম্ভ' },
  help: { en: 'Help', bn: 'সহায়তা' },
  newsletter: { en: 'Newsletter', bn: 'নিউজলেটার' },
  newsletterBody: { en: 'The monthly magazine and Brand Bangladesh stories, in your inbox.', bn: 'মাসিক ম্যাগাজিন আর ব্র্যান্ড বাংলাদেশের গল্প, সরাসরি আপনার ইনবক্সে।' },
  subscribed: { en: 'Subscribed — see you next month.', bn: 'সাবস্ক্রাইব হয়েছে — আগামী মাসে দেখা হবে।' },
  rights: { en: 'Brand Bangladesh. All rights reserved.', bn: 'ব্র্যান্ড বাংলাদেশ। সর্বস্বত্ব সংরক্ষিত।' },
  tagline: { en: 'A nation of rivers and resilience — told every month.', bn: 'নদী আর অদম্য মানুষের দেশ — প্রতি মাসে নতুন গল্পে।' },
  play: { en: 'Play video', bn: 'ভিডিও চালান' },
  pause: { en: 'Pause video', bn: 'ভিডিও থামান' },
  email: { en: 'Email address', bn: 'ইমেইল ঠিকানা' },
  subscribe: { en: 'Subscribe', bn: 'সাবস্ক্রাইব' },
}

const PILLARS = [
  { slug: 'tourism', name: { en: 'Tourism', bn: 'পর্যটন' } },
  { slug: 'exports', name: { en: 'Exports', bn: 'রপ্তানি' } },
  { slug: 'governance', name: { en: 'Governance', bn: 'সুশাসন' } },
  { slug: 'investment', name: { en: 'Investment & Immigration', bn: 'বিনিয়োগ ও অভিবাসন' } },
  { slug: 'culture', name: { en: 'Culture & Heritage', bn: 'সংস্কৃতি ও ঐতিহ্য' } },
  { slug: 'people', name: { en: 'People', bn: 'মানুষ' } },
]

const SOCIAL = [
  { name: 'Facebook', icon: faFacebookF },
  { name: 'Instagram', icon: faInstagram },
  { name: 'X', icon: faXTwitter },
  { name: 'YouTube', icon: faYoutube },
  { name: 'LinkedIn', icon: faLinkedinIn },
]

// Soft fade on all four sides: two linear masks intersected
const EDGE_MASK = 'linear-gradient(to right, transparent 0%, #000 12%, #000 88%, transparent 100%), linear-gradient(to bottom, transparent 0%, #000 30%, #000 65%, transparent 100%)'

export function Footer() {
  const { t, n, href, locale } = useT()
  const videoRef = useRef(null)
  const bandRef = useRef(null)
  const [paused, setPaused] = useState(false)
  const [email, setEmail] = useState('')
  const [err, setErr] = useState('')
  const [done, setDone] = useState(false)

  // only play while the footer is on screen (saves battery and keeps scrolling smooth)
  useEffect(() => {
    const v = videoRef.current
    const band = bandRef.current
    if (!v || !band) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) { setPaused(true); return }
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !v.dataset.userPaused) v.play().catch(() => {})
      else v.pause()
    }, { threshold: 0.1 })
    io.observe(band)
    return () => io.disconnect()
  }, [])

  const togglePause = () => {
    const v = videoRef.current
    if (!v) return
    if (v.paused) { delete v.dataset.userPaused; v.play().catch(() => {}); setPaused(false) }
    else { v.dataset.userPaused = '1'; v.pause(); setPaused(true) }
  }

  const onSubscribe = (e) => {
    e.preventDefault()
    if (e.currentTarget.elements.website?.value) return // spam trap
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { setErr(t(ui.invalidEmail)); return }
    setErr('')
    setDone(true) // TODO: connect to the newsletter service
  }

  const groups = [
    {
      title: L.discover,
      items: [
        { label: ui.nav.story, to: '/story' },
        { label: ui.nav.regions, to: '/regions' },
        { label: ui.nav.numbers, to: '/numbers' },
        { label: ui.nav.publication, to: '/publication' },
        { label: ui.nav.community, to: '/community' },
      ],
    },
    { title: L.pillars, items: PILLARS.map((p) => ({ label: p.name, to: `/pillars/${p.slug}` })) },
    {
      title: L.help,
      items: [
        { label: ui.nav.about, to: '/about' },
        { label: { en: 'Contact & Inquiries', bn: 'যোগাযোগ ও জিজ্ঞাসা' }, to: '/contact' },
        { label: { en: 'FAQ', bn: 'সাধারণ প্রশ্ন' }, to: '/faq' },
        { label: { en: 'Press Room & Media Kit', bn: 'প্রেস রুম ও মিডিয়া কিট' }, to: '/press' },
        { label: ui.search, to: '/search' },
      ],
    },
  ]

  const legal = [
    { label: { en: 'Privacy', bn: 'গোপনীয়তা' }, to: '/legal/privacy' },
    { label: { en: 'Terms', bn: 'শর্তাবলি' }, to: '/legal/terms' },
    { label: { en: 'Accessibility', bn: 'প্রবেশযোগ্যতা' }, to: '/legal/accessibility' },
    { label: { en: 'Content Usage', bn: 'কনটেন্ট ব্যবহার' }, to: '/legal/content-usage' },
  ]

  const bn = locale === 'bn'

  return (
    <footer className="relative bg-cream" aria-label="Brand Bangladesh footer">
      {/* Map video band — blended into the cream footer (W-07) */}
      {/* bb-site proportions: a low, full-width band (max 320px) */}
      <div ref={bandRef} className="relative isolate overflow-hidden bg-cream" style={{ height: 'min(38vh, 320px)', minHeight: 200 }}>
        {/* the fade sits on the band itself, so all four edges dissolve into the cream footer */}
        <div
          className="absolute inset-0"
          style={{ WebkitMaskImage: EDGE_MASK, maskImage: EDGE_MASK, WebkitMaskComposite: 'source-in', maskComposite: 'intersect', mixBlendMode: 'multiply' }}
        >
          <video
            ref={videoRef}
            className="absolute inset-0 h-full w-full object-cover"
            style={{ filter: 'sepia(.12) saturate(1.05) brightness(1.06) contrast(1.02)' }}
            src="/assets/video/footer.mp4"
            muted
            loop
            playsInline
            preload="metadata"
            aria-hidden="true"
          />
        </div>
        <button
          type="button"
          onClick={togglePause}
          className="absolute bottom-3 right-4 z-10 inline-flex items-center gap-2 rounded-full bg-cream/80 px-3 py-1.5 font-inter text-[10px] uppercase tracking-label text-ink/50 backdrop-blur transition-colors hover:text-ink md:right-10 lg:right-16"
          aria-label={t(paused ? L.play : L.pause)}
        >
          <span aria-hidden="true">{paused ? '▶' : '❚❚'}</span>
          <span className={bn ? 'font-bengali normal-case tracking-normal' : ''}>{t(paused ? L.play : L.pause)}</span>
        </button>
      </div>

      <div className="container-x pb-[max(2.5rem,env(safe-area-inset-bottom))] pt-10 md:pt-14">
        {/* Logo + tagline */}
        <div className="mb-10 flex flex-col gap-4 border-b border-ink/[0.08] pb-8 md:mb-14 md:flex-row md:items-end md:justify-between">
          <Link to={href()} aria-label={`Brand Bangladesh — ${t(ui.home)}`} className="w-fit">
            <img src="/assets/brand/logo-full.png" alt="Brand Bangladesh" width="908" height="284" className="h-12 w-auto md:h-16" />
          </Link>
          <p className={`max-w-md text-ink/55 md:text-right ${bn ? 'font-bengali text-base' : 'font-cormorant text-lg italic md:text-xl'}`}>
            {t(L.tagline)}
          </p>
        </div>

        {/* Link columns + newsletter */}
        <div className="mb-12 grid grid-cols-2 gap-x-6 gap-y-10 md:grid-cols-3 lg:grid-cols-[1fr_1fr_1fr_1.3fr] lg:gap-10">
          {groups.map((g) => (
            <div key={g.title.en}>
              <p className="micro-label mb-4">{t(g.title)}</p>
              <ul className="space-y-3">
                {g.items.map((item) => (
                  <li key={item.to}>
                    <Link to={href(item.to)} className="text-sm text-ink/55 transition-colors duration-200 hover:text-ink">
                      {t(item.label)}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div className="col-span-2 md:col-span-3 lg:col-span-1">
            <p className="micro-label mb-4">{t(L.newsletter)}</p>
            <p className="mb-4 max-w-sm text-sm leading-relaxed text-ink/55">{t(L.newsletterBody)}</p>
            {done ? (
              <p role="status" className="text-sm text-teal">{t(L.subscribed)}</p>
            ) : (
              <form onSubmit={onSubscribe} noValidate className="max-w-sm" aria-label={t(L.newsletter)}>
                <div className="flex gap-2">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    className="min-w-0 flex-1 rounded-full border border-ink/20 bg-white/60 px-4 py-2.5 text-sm outline-none transition-colors focus:border-teal"
                    aria-label={t(L.email)}
                    aria-invalid={!!err}
                    autoComplete="email"
                  />
                  <input type="text" name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />
                  <button type="submit" className="shrink-0 rounded-full bg-ink px-5 py-2.5 text-sm text-cream transition-colors hover:bg-dark-teal" aria-label={t(L.subscribe)}>
                    →
                  </button>
                </div>
                {err && <p className="mt-2 text-xs text-red" role="alert">{err}</p>}
              </form>
            )}
          </div>
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col gap-5 border-t border-ink/[0.08] pt-8 lg:flex-row lg:items-center lg:justify-between">
          <p className="order-3 text-xs text-ink/40 lg:order-1">
            © {n(new Date().getFullYear())} {t(L.rights)}
          </p>
          <ul className="order-2 flex flex-wrap gap-x-5 gap-y-2">
            {legal.map((l) => (
              <li key={l.to}>
                <Link to={href(l.to)} className="text-xs text-ink/45 transition-colors hover:text-ink">{t(l.label)}</Link>
              </li>
            ))}
          </ul>
          <ul className="order-1 flex gap-2 lg:order-3">
            {SOCIAL.map((s) => (
              <li key={s.name}>
                <a href="#" className="grid h-9 w-9 place-items-center rounded-full border border-ink/10 text-ink/50 transition-colors hover:border-ink hover:bg-ink hover:text-cream" aria-label={`Brand Bangladesh on ${s.name}`}>
                  <FontAwesomeIcon icon={s.icon} className="text-[13px]" />
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  )
}
