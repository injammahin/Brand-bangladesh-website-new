/**
 * Manifesto (Demo 1) — words light up one by one while the section is pinned,
 * and the brand mark draws itself in outline beside them.
 * Pinned only on desktop; on phones it plays as a normal scroll-scrubbed block.
 */
import { useEffect, useRef } from 'react'
import { useT } from '@/lib/i18n'
import { gsap, headerH, prefersReduced } from '@/lib/motion'
import { MARK_PATHS } from './brandMark'

const TEXT = {
  p1: { en: 'Bangladesh is not just a country. It is a civilisation of rivers, of resilience, of over 170 million dreams.', bn: 'বাংলাদেশ শুধু একটি দেশ নয়। এ এক নদীর সভ্যতা, অদম্য প্রাণের সভ্যতা — সতেরো কোটিরও বেশি মানুষের স্বপ্ন।' },
  p2: { en: "A nation that weaves the world's garments, that feeds its neighbours, that shelters the world's largest mangrove forest. This is Brand Bangladesh.", bn: 'যে জাতি বিশ্বের জন্য পোশাক বোনে, প্রতিবেশীর মুখে অন্ন তুলে দেয়, বুকে আগলে রাখে পৃথিবীর বৃহত্তম ম্যানগ্রোভ বন। এই ব্র্যান্ড বাংলাদেশ।' },
}

export function Manifesto() {
  const { t, locale } = useT()
  const sectionRef = useRef(null)
  const logoRef = useRef(null)
  const bn = locale === 'bn'
  const w1 = t(TEXT.p1).split(' ')
  const w2 = t(TEXT.p2).split(' ')

  useEffect(() => {
    const section = sectionRef.current
    if (!section) return
    const words = section.querySelectorAll('[data-word]')
    const paths = logoRef.current?.querySelectorAll('path') ?? []
    if (prefersReduced()) { gsap.set(words, { opacity: 1 }); return }

    const mm = gsap.matchMedia()
    mm.add({ desktop: '(min-width: 1024px)', mobile: '(max-width: 1023px)' }, (c) => {
      gsap.set(words, { opacity: 0.15 })
      gsap.set(paths, { strokeDasharray: 1, strokeDashoffset: 1 })
      const tl = gsap.timeline({
        scrollTrigger: c.conditions.desktop
          ? { trigger: section, start: () => `top ${headerH()}px`, end: '+=150%', scrub: 1.2, pin: true, invalidateOnRefresh: true }
          : { trigger: section, start: 'top 75%', end: 'bottom 60%', scrub: 1 },
      })
      words.forEach((w, i) => tl.to(w, { opacity: 1, duration: 0.1, ease: 'none' }, (i / words.length) * 0.8))
      paths.forEach((p, i) => tl.to(p, { strokeDashoffset: 0, duration: 0.8, ease: 'power1.inOut' }, 0.1 + i * 0.05))
    })
    return () => mm.revert()
  }, [locale])

  return (
    <section
      ref={sectionRef}
      id="manifesto"
      className="relative overflow-hidden bg-cream py-20 lg:h-[calc(100svh-var(--header-h))] lg:py-0"
      aria-label={t({ en: 'Nation brand manifesto', bn: 'জাতীয় ব্র্যান্ডের ঘোষণা' })}
    >
      <div className="container-x flex h-full items-center justify-center">
        <div className="flex w-full max-w-7xl flex-col items-center justify-between gap-12 lg:flex-row lg:gap-20">
          <div className="flex w-full max-w-2xl flex-1 flex-col gap-6 md:gap-8">
            <p className={`text-teal ${bn ? 'font-bengali-serif text-2xl leading-[1.5] md:text-4xl' : 'font-cormorant text-3xl leading-[1.15] md:text-4xl lg:text-5xl'}`} aria-label={w1.join(' ')}>
              {w1.map((w, i) => <span key={i}><span data-word aria-hidden="true">{w}</span> </span>)}
            </p>
            <p className="max-w-lg text-base leading-relaxed text-teal/80 md:text-lg lg:text-xl" aria-label={w2.join(' ')}>
              {w2.map((w, i) => <span key={i}><span data-word aria-hidden="true">{w}</span> </span>)}
            </p>
          </div>
          <div className="flex w-full flex-1 justify-center lg:justify-end">
            <svg ref={logoRef} viewBox="0 0 250.2 262.5" className="w-2/3 max-w-sm text-teal sm:w-1/2 lg:w-full lg:max-w-md" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="0.75">
              {MARK_PATHS.map((m) => <path key={m.d} pathLength="1" d={m.d} />)}
            </svg>
          </div>
        </div>
      </div>
    </section>
  )
}
