/**
 * Hero — the client's island-map brand film (Demo 2 style), shown whole on its own warm-beige ground.
 * W-03 smoothness: the file is re-encoded at a steady 24 fps with a seamless loop (its end cross-fades
 * into its opening frame), and nothing scroll-driven runs on top of the video.
 * The film starts when the loader fades out; the poster (its first frame) shows until then.
 */
import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { useT } from '@/lib/i18n'
import { gsap, prefersReduced } from '@/lib/motion'

const S = {
  h1: { en: 'Brand Bangladesh — a nation of rivers and resilience', bn: 'ব্র্যান্ড বাংলাদেশ — নদী আর অদম্য মানুষের দেশ' },
  slogan1: { en: 'A nation of rivers and resilience,', bn: 'নদী আর অদম্য মানুষের দেশ,' },
  slogan2: { en: 'open to the world.', bn: 'বিশ্বের জন্য উন্মুক্ত।' },
  scroll: { en: 'Scroll', bn: 'নিচে দেখুন' },
  discover: { en: 'Discover our story', bn: 'আমাদের গল্প জানুন' },
  soundOn: { en: 'Sound on', bn: 'শব্দ চালু' },
  soundOff: { en: 'Sound off', bn: 'শব্দ বন্ধ' },
}

export function Hero({ ready }) {
  const { t, href, locale } = useT()
  const videoRef = useRef(null)
  const bandRef = useRef(null)
  const [muted, setMuted] = useState(true)
  const bn = locale === 'bn'

  // start the film once the loader has gone
  useEffect(() => {
    const v = videoRef.current
    if (!v) return
    if (prefersReduced()) { v.poster = '/assets/video/hero-end.jpg'; return }
    v.muted = true
    if (ready) v.play().catch(() => {})
    else v.pause()
  }, [ready])

  // pause when off screen (keeps the rest of the page smooth)
  useEffect(() => {
    const v = videoRef.current
    if (!v || prefersReduced()) return
    const io = new IntersectionObserver(([e]) => {
      if (!ready) return
      if (e.isIntersecting) v.play().catch(() => {})
      else v.pause()
    }, { threshold: 0.05 })
    io.observe(v)
    return () => io.disconnect()
  }, [ready])

  // bottom band slides in after the loader
  useEffect(() => {
    const el = bandRef.current
    if (!el || !ready) return
    const items = el.querySelectorAll('[data-band]')
    if (prefersReduced()) { gsap.set(items, { opacity: 1 }); return }
    const tw = gsap.fromTo(items, { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 1.1, ease: 'expo.out', stagger: 0.12, delay: 0.5 })
    return () => tw.kill()
  }, [ready])

  const toggleSound = () => {
    const v = videoRef.current
    if (!v) return
    v.muted = !muted
    setMuted(!muted)
    if (v.paused) v.play().catch(() => {})
  }

  return (
    <section id="hero" className="relative isolate h-[calc(100svh-var(--header-h))] min-h-[520px] overflow-hidden bg-[#E9E2CF]" aria-labelledby="hero-h">
      <h1 id="hero-h" className="sr-only">{t(S.h1)}</h1>

      {/* the film's own warm ground, so the frame has no seams */}
      <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse 80% 70% at 55% 40%, #F3EDDC 0%, #E9E2CF 55%, #DDD5C2 100%)' }} aria-hidden="true" />

      <div className="absolute inset-0 flex items-center justify-center pb-32 md:pb-0" aria-hidden="true">
        <video
          ref={videoRef}
          className="hero-film aspect-video w-[135%] max-w-none object-cover sm:w-full md:max-h-full md:w-[min(100%,calc((100svh-var(--header-h))*16/9))]"
          poster="/assets/video/hero-poster.jpg?v=4"
          muted
          loop
          playsInline
          preload="auto"
        >
          <source src="/assets/video/hero.webm?v=4" type='video/webm; codecs="vp9, opus"' />
          <source src="/assets/video/hero.mp4?v=4" type="video/mp4" />
        </video>
      </div>

      {/* soft fade into the page below + light behind the two text corners */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{ background: 'linear-gradient(to top, #FBFAF7 0%, rgba(251,250,247,0) 16%), radial-gradient(ellipse 40% 34% at 0% 100%, rgba(251,250,247,.9), rgba(251,250,247,0) 72%), radial-gradient(ellipse 40% 34% at 100% 100%, rgba(251,250,247,.9), rgba(251,250,247,0) 72%)' }}
        aria-hidden="true"
      />

      <button
        type="button"
        onClick={toggleSound}
        className="absolute right-4 top-4 z-20 inline-flex items-center gap-2 rounded-full border border-ink/10 bg-cream/85 px-3.5 py-2 font-inter text-[11px] uppercase tracking-label text-ink/75 backdrop-blur transition-colors hover:bg-cream sm:right-6 md:right-10 md:top-6 lg:right-16"
        aria-pressed={!muted}
      >
        <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
          <path d="M2 6h3l4-3v10l-4-3H2z" fill="currentColor" />
          {muted
            ? <path d="M11 6l4 4M15 6l-4 4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
            : <path d="M11.5 5.5a3.5 3.5 0 010 5M13 3.5a6 6 0 010 9" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />}
        </svg>
        <span className={bn ? 'font-bengali normal-case tracking-normal' : ''}>{t(muted ? S.soundOn : S.soundOff)}</span>
      </button>

      {/* bottom band: slogan · scroll cue · call to action */}
      <div ref={bandRef} className="container-x absolute inset-x-0 bottom-0 grid grid-cols-[1fr_auto] items-end gap-4 pb-6 md:grid-cols-[1fr_auto_1fr] md:gap-6 md:pb-9">
        <div data-band className="max-w-[380px] opacity-0">
          <div className="brand-stripe mb-3 h-[3px] w-14 rounded-full" aria-hidden="true" />
          <p className={`leading-[1.15] text-ink ${bn ? 'font-bengali-serif text-[clamp(1.1rem,1.8vw,1.6rem)]' : 'font-cormorant text-[clamp(1.25rem,2vw,1.9rem)]'}`}>
            {t(S.slogan1)} <span className="italic text-teal">{t(S.slogan2)}</span>
          </p>
        </div>

        <a href="#after-hero" data-band className="group hidden flex-col items-center gap-3 justify-self-center opacity-0 md:flex" aria-label={t(S.scroll)}>
          <span className="relative flex h-14 w-14 items-center justify-center">
            <span className="absolute inset-0 animate-[bb-focus_2.4s_cubic-bezier(.16,1,.3,1)_infinite] rounded-full border border-gold/60" />
            <span className="absolute inset-0 animate-[bb-focus_2.4s_cubic-bezier(.16,1,.3,1)_1.2s_infinite] rounded-full border border-gold/40" />
            <span className="relative flex h-[34px] w-[22px] justify-center rounded-full border-[1.5px] border-ink/50 bg-cream/70 pt-1.5 backdrop-blur-sm transition-colors group-hover:border-ink">
              <span className="h-[7px] w-[3px] animate-[bb-wheel_1.6s_ease-in-out_infinite] rounded-full bg-ink/70" />
            </span>
          </span>
          <span className="micro-label">{t(S.scroll)}</span>
        </a>

        <Link
          to={href('/story')}
          data-band
          className="group inline-flex items-center gap-2 justify-self-end whitespace-nowrap rounded-full bg-ink px-4 py-3 font-inter text-[11px] uppercase tracking-label text-cream opacity-0 transition-colors hover:bg-dark-teal sm:gap-3 sm:px-6 sm:py-3.5 sm:text-xs"
        >
          <span className={bn ? 'font-bengali normal-case tracking-normal text-sm' : ''}>{t(S.discover)}</span>
          <span className="transition-transform group-hover:translate-x-1" aria-hidden="true">→</span>
        </Link>
      </div>
    </section>
  )
}
