/**
 * Explore the land (Demo 1) — the 3D map film blended into the cream page, a landmark preview card,
 * and an auto-touring landmark list (4 s each; click to jump).
 */
import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { useT } from '@/lib/i18n'
import { gsap, prefersReduced } from '@/lib/motion'
import { LANDMARKS, getDivision, getPillar } from '@/data/home'

const EDGE_FADE = 'linear-gradient(to top, #FBFAF7 0%, transparent 15%), linear-gradient(to bottom, #FBFAF7 0%, transparent 15%), linear-gradient(to left, #FBFAF7 0%, transparent 15%), linear-gradient(to right, #FBFAF7 0%, transparent 15%)'

function LandmarkCard({ lm }) {
  const { t, href } = useT()
  const ref = useRef(null)
  const division = getDivision(lm.division)
  useEffect(() => {
    const el = ref.current
    if (!el || prefersReduced()) return
    const ctx = gsap.context(() => {
      gsap.fromTo(el, { clipPath: 'inset(0 100% 0 0)', opacity: 0, x: -20 }, { clipPath: 'inset(0 0% 0 0)', opacity: 1, x: 0, duration: 0.9, ease: 'power3.out' })
      gsap.fromTo(el.querySelector('img'), { scale: 1.15 }, { scale: 1, duration: 1.2, ease: 'power2.out' })
      gsap.fromTo(el.querySelectorAll('[data-txt]'), { y: 15, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, stagger: 0.1, delay: 0.2, ease: 'power2.out' })
    }, el)
    return () => ctx.revert()
  }, [])
  return (
    <Link ref={ref} to={href(`/regions/${lm.division}`)} className="group flex h-full w-full max-w-[420px] flex-col rounded-xl border border-ink/5 bg-cream p-3 shadow-lg sm:p-4 lg:aspect-[3/4] lg:max-w-none">
      <div className="relative aspect-[4/3] w-full overflow-hidden rounded-lg bg-ink/5 lg:aspect-auto lg:flex-1">
        <img src={lm.image} alt={t(lm.name)} loading="lazy" className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
      </div>
      <div className="mt-4 overflow-hidden px-1 sm:px-2">
        <p data-txt className="micro-label mb-1">{t(division?.name)} · {t(getPillar(lm.pillar)?.title ?? { en: '', bn: '' })}</p>
        <p data-txt className="font-cormorant text-2xl leading-tight text-ink">{t(lm.name)}</p>
        <p data-txt className="mt-1 text-xs leading-relaxed text-ink/50">{t(lm.tagline)}</p>
      </div>
    </Link>
  )
}

export function ExploreLand() {
  const { t, locale } = useT()
  const [active, setActive] = useState(0)
  const [playing, setPlaying] = useState(false)
  const listRef = useRef(null)
  const videoRef = useRef(null)
  const sectionRef = useRef(null)

  // auto-tour only while the section is on screen
  useEffect(() => {
    const el = sectionRef.current
    const v = videoRef.current
    if (!el) return
    const io = new IntersectionObserver(([e]) => {
      setPlaying(e.isIntersecting && !prefersReduced())
      if (v) (e.isIntersecting && !prefersReduced() ? v.play().catch(() => {}) : v.pause())
    }, { threshold: 0.2 })
    io.observe(el)
    return () => io.disconnect()
  }, [])

  useEffect(() => {
    if (!playing) return
    const id = setTimeout(() => setActive((p) => (p + 1) % LANDMARKS.length), 4000)
    return () => clearTimeout(id)
  }, [active, playing])

  // keep the active item centred in the list without scrolling the page
  useEffect(() => {
    const list = listRef.current
    const btn = list?.children[active]
    if (!list || !btn) return
    list.scrollTo({ left: btn.offsetLeft - list.clientWidth / 2 + btn.clientWidth / 2, behavior: 'smooth' })
  }, [active])

  return (
    <section ref={sectionRef} id="map" className="container-x relative bg-cream py-20 md:py-24" aria-label={t({ en: 'Landmarks of Bangladesh', bn: 'বাংলাদেশের দর্শনীয় স্থান' })}>
      <div className="mb-8">
        <p className="micro-label mb-2">{t({ en: 'Explore the land', bn: 'দেশটা ঘুরে দেখুন' })}</p>
        <h2 className={`leading-none tracking-tight text-ink ${locale === 'bn' ? 'font-bengali-serif text-4xl md:text-5xl' : 'font-cormorant text-[clamp(2.4rem,5vw,4rem)]'}`}>
          {t({ en: 'Explore the land', bn: 'দেশটা ঘুরে দেখুন' })}
        </h2>
      </div>

      <div className="flex flex-col gap-8">
        <div className="grid grid-cols-1 gap-8 lg:h-[70vh] lg:grid-cols-[2fr_1fr]">
          <div className="relative flex h-[42vh] w-full items-center justify-center overflow-hidden rounded-xl sm:h-[50vh] lg:h-full">
            <video ref={videoRef} src="/assets/video/3d-view.mp4" className="absolute inset-0 h-full w-full scale-[1.05] object-cover" style={{ mixBlendMode: 'multiply' }} muted loop playsInline preload="metadata" aria-hidden="true" />
            <div className="pointer-events-none absolute inset-0" style={{ background: EDGE_FADE }} />
          </div>
          <div className="flex h-full w-full items-center justify-center">
            <LandmarkCard key={active} lm={LANDMARKS[active]} />
          </div>
        </div>

        <div className="relative z-10 w-full rounded-xl border border-ink/10 bg-cream p-4 shadow-sm sm:p-6">
          <p className="micro-label mb-4">{t({ en: 'Landmarks', bn: 'দর্শনীয় স্থান' })}</p>
          <nav ref={listRef} className="relative flex snap-x gap-6 overflow-x-auto pb-3 sm:gap-8" aria-label={t({ en: 'Landmarks', bn: 'দর্শনীয় স্থান' })} data-lenis-prevent>
            {LANDMARKS.map((lm, i) => (
              <button
                key={lm.id}
                type="button"
                className={`group min-w-[150px] flex-shrink-0 snap-start text-left transition-colors duration-300 sm:min-w-[160px] ${active === i ? 'text-ink' : 'text-ink/40 hover:text-ink/80'}`}
                onClick={() => setActive(i)}
                aria-pressed={active === i}
              >
                <div className="mb-2 h-1 w-full overflow-hidden rounded-full bg-ink/5">
                  <div className={`h-full ${active === i ? `w-full bg-gold ${playing ? 'animate-[bb-progress_4s_linear]' : ''}` : 'w-0 bg-transparent'}`} />
                </div>
                <p className="mb-1 font-cormorant text-xl leading-tight">{t(lm.name)}</p>
                <p className="micro-label" style={{ color: active === i ? '#D9AA66' : 'rgba(16,20,20,.4)' }}>{t(getDivision(lm.division)?.name)}</p>
              </button>
            ))}
          </nav>
        </div>
      </div>
    </section>
  )
}
