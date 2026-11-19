/**
 * W-04 — Demo 1 hexagon, unchanged: pinned scroll (~600%), outline draws, spokes extend, centre logo,
 * then each pillar lights up in turn with its card.
 * W-05 — a still flag of Bangladesh beside it (client asked for a plain flag image, no pole or waving):
 * correct 10:6 flag, disc radius 1/5 of the length, centre slightly towards the hoist.
 */
import { useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useT } from '@/lib/i18n'
import { gsap, headerH, prefersReduced } from '@/lib/motion'
import { PILLARS } from '@/data/home'
import { MARK_PATHS } from './brandMark'

// SVG geometry — flat-top hexagon (same as Demo 1)
const CX = 350
const CY = 350
const R = 220
const hexPoint = (deg, r) => {
  const rad = ((deg - 90) * Math.PI) / 180
  return { x: CX + r * Math.cos(rad), y: CY + r * Math.sin(rad) }
}
const HEX_VERTICES = [0, 60, 120, 180, 240, 300].map((a) => hexPoint(a, R))
const hexPoints = HEX_VERTICES.map((p) => `${p.x},${p.y}`).join(' ')
function wedgePath(i, innerR = 0) {
  const s = i * 60 - 90
  const e = (i + 1) * 60 - 90
  const p1 = hexPoint(s, innerR), p2 = hexPoint(e, innerR), p3 = hexPoint(e, R), p4 = hexPoint(s, R)
  return `M ${p1.x} ${p1.y} L ${p4.x} ${p4.y} L ${p3.x} ${p3.y} L ${p2.x} ${p2.y} Z`
}


export function HexagonSection() {
  const { t, href, locale } = useT()
  const navigate = useNavigate()
  const sectionRef = useRef(null)
  const outlineRef = useRef(null)
  const spokesRef = useRef([])
  const wedgesRef = useRef([])
  const labelsRef = useRef([])
  const centreRef = useRef(null)
  const cardsRef = useRef([])
  const flagRef = useRef(null)

  useEffect(() => {
    const section = sectionRef.current
    if (!section) return
    if (prefersReduced()) {
      gsap.set([...wedgesRef.current, ...labelsRef.current, centreRef.current, outlineRef.current], { opacity: 1 })
      gsap.set(cardsRef.current[0], { opacity: 1, clipPath: 'inset(0 0% 0 0)', pointerEvents: 'auto' })
      return
    }

    const ctx = gsap.context(() => {
      gsap.set(outlineRef.current, { strokeDasharray: 1, strokeDashoffset: 1, opacity: 1 })
      gsap.set(spokesRef.current, { scaleY: 0, transformOrigin: `${CX}px ${CY}px` })
      gsap.set(wedgesRef.current, { opacity: 0, scale: 0.8, transformOrigin: `${CX}px ${CY}px` })
      gsap.set(labelsRef.current, { opacity: 0, y: 10 })
      gsap.set(centreRef.current, { opacity: 0 })
      gsap.set(cardsRef.current, { clipPath: 'inset(0 100% 0 0)', opacity: 0 })

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: () => `top ${headerH()}px`,
          end: '+=600%',
          invalidateOnRefresh: true,
          scrub: 1.5,
          pin: true,
          pinSpacing: true,
          anticipatePin: 1,
        },
      })

      tl.to(outlineRef.current, { strokeDashoffset: 0, duration: 0.12, ease: 'none' }, 0)
      tl.to(spokesRef.current, { scaleY: 1, duration: 0.13, ease: 'power2.out', stagger: 0.02 }, 0.12)
      tl.to(centreRef.current, { opacity: 1, duration: 0.08, ease: 'none' }, 0.25)

      const dur = 0.09
      PILLARS.forEach((_, i) => {
        const start = 0.35 + i * dur
        if (i > 0) {
          tl.to(wedgesRef.current[i - 1], { opacity: 0.4, duration: 0.04 }, start)
          tl.to(cardsRef.current[i - 1], { clipPath: 'inset(0 100% 0 0)', opacity: 0, pointerEvents: 'none', duration: 0.04 }, start)
        }
        tl.to(wedgesRef.current[i], { opacity: 1, scale: 1, duration: 0.07, ease: 'back.out(1.5)' }, start)
        tl.to(labelsRef.current[i], { opacity: 1, y: 0, duration: 0.06, ease: 'expo.out' }, start + 0.02)
        tl.to(cardsRef.current[i], { clipPath: 'inset(0 0% 0 0)', opacity: 1, duration: 0.07, ease: 'expo.out', pointerEvents: 'auto' }, start + 0.03)
      })
      tl.to(wedgesRef.current, { opacity: 1, duration: 0.1 }, 0.9)
    }, section)

    return () => ctx.revert()
  }, [])

  const labelOffset = R * 1.25

  return (
    <section
      ref={sectionRef}
      id="hexagon"
      className="relative flex h-[calc(100svh-var(--header-h))] items-center overflow-hidden bg-cream"
      aria-label={t({ en: 'The six Brand Pillars', bn: 'ছয়টি ব্র্যান্ড স্তম্ভ' })}
    >
      <div className="relative mx-auto flex h-full w-full max-w-[1600px] flex-col items-center justify-center px-4 sm:px-6 lg:flex-row lg:justify-between lg:px-12 xl:px-24">
        {/* Hexagon */}
        <div className="flex min-h-0 w-full flex-1 items-center justify-center lg:h-full lg:justify-start">
          <svg viewBox="0 0 700 700" className="aspect-square max-h-[52svh] w-full max-w-full lg:h-[95vh] lg:max-h-[1200px] lg:w-auto" aria-hidden="true" style={{ overflow: 'visible' }}>
            {PILLARS.map((p, i) => (
              <path
                key={p.id}
                ref={(el) => { wedgesRef.current[i] = el }}
                d={wedgePath(i, 65)}
                fill={p.color}
                opacity={0}
                className="cursor-pointer"
                style={{ transition: 'filter .3s' }}
                onClick={() => navigate(href(`/pillars/${p.id}`))}
                onMouseEnter={(e) => { e.currentTarget.style.filter = `drop-shadow(0 0 16px ${p.color})` }}
                onMouseLeave={(e) => { e.currentTarget.style.filter = '' }}
              />
            ))}
            <polygon ref={outlineRef} points={hexPoints} pathLength="1" fill="none" stroke="#101414" strokeWidth="1" opacity={0} />
            {PILLARS.map((p, i) => (
              <line key={p.id} ref={(el) => { spokesRef.current[i] = el }} x1={CX} y1={CY} x2={HEX_VERTICES[i].x} y2={HEX_VERTICES[i].y} stroke="#101414" strokeWidth="0.5" opacity={0.15} />
            ))}
            {PILLARS.map((p, i) => {
              const pt = hexPoint(i * 60 - 90 + 30, labelOffset)
              const words = locale === 'bn' ? p.title.bn.split(' ও ') : p.title.en.toUpperCase().split(' & ')
              return (
                <text
                  key={p.id}
                  ref={(el) => { labelsRef.current[i] = el }}
                  x={pt.x} y={pt.y}
                  textAnchor="middle" dominantBaseline="middle"
                  fill={p.color} fontSize={locale === 'bn' ? 18 : 14} fontFamily={locale === 'bn' ? 'var(--font-bengali)' : 'var(--font-inter)'} fontWeight="700" letterSpacing={locale === 'bn' ? 0 : 2.5}
                  opacity={0}
                >
                  {words.length === 1 ? words[0] : (
                    <>
                      <tspan x={pt.x} dy="-0.6em">{words[0]} {locale === 'bn' ? 'ও' : '&'}</tspan>
                      <tspan x={pt.x} dy="1.2em">{words[1]}</tspan>
                    </>
                  )}
                </text>
              )
            })}
            <g ref={centreRef} opacity={0}>
              <svg x={CX - 35} y={CY - 40} width="70" height="80" viewBox="0 0 250.2 262.5">
                {MARK_PATHS.map((m) => <path key={m.d} fill={m.fill} d={m.d} />)}
              </svg>
            </g>
          </svg>
        </div>

        {/* Right column: flag + title + pillar cards */}
        <div className="relative flex w-full shrink-0 flex-col justify-center pb-4 lg:h-full lg:w-[400px] lg:pb-0">
          <div className="relative z-10 mb-5 flex items-center gap-5 lg:mb-12 lg:block">
            {/* W-05 flag */}
            <figure ref={flagRef} className="w-28 shrink-0 sm:w-36 lg:mb-10 lg:w-full lg:max-w-[340px]">
              {/* the flag of Bangladesh: 10:6, disc radius 1/5 of the length, centre slightly towards the hoist */}
              <svg viewBox="0 0 10 6" className="block w-full rounded-[3px] shadow-[0_20px_40px_-24px_rgba(0,60,40,.5)]" role="img" aria-label={t({ en: 'Flag of Bangladesh', bn: 'বাংলাদেশের জাতীয় পতাকা' })}>
                <rect width="10" height="6" fill="#006A4E" />
                <circle cx="4.5" cy="3" r="2" fill="#F42A41" />
              </svg>
              <figcaption className="mt-3 hidden items-center gap-3 lg:flex">
                <span className="h-px w-8 bg-ink/25" />
                <span className={`text-ink/50 ${locale === 'bn' ? 'font-bengali text-sm' : 'font-cormorant text-[15px] italic'}`}>
                  {t({ en: 'The land, and the sun rising over it', bn: 'সবুজ মাটি, আর তার বুকে উদিত সূর্য' })}
                </span>
              </figcaption>
            </figure>

            <div>
              <p className="micro-label mb-2 lg:mb-3">{t({ en: 'The six pillars', bn: 'ছয়টি স্তম্ভ' })}</p>
              <h2 className={`leading-none tracking-tight text-ink ${locale === 'bn' ? 'font-bengali-serif text-3xl md:text-5xl' : 'font-cormorant text-4xl md:text-5xl lg:text-6xl'}`}>
                {t({ en: 'Brand Bangladesh', bn: 'ব্র্যান্ড বাংলাদেশ' })}
              </h2>
            </div>
          </div>

          {/* Phones: tap-friendly pillar list */}
          <ul className="grid grid-cols-2 gap-2 md:hidden">
            {PILLARS.map((p) => (
              <li key={p.id}>
                <Link to={href(`/pillars/${p.id}`)} className="flex items-center gap-2 rounded-full border border-ink/10 px-3 py-2 text-xs text-ink/80">
                  <span className="h-2 w-2 shrink-0 rounded-full" style={{ backgroundColor: p.color }} />
                  <span className="truncate">{t(p.title)}</span>
                </Link>
              </li>
            ))}
          </ul>

          {/* Pillar cards */}
          <div className="relative hidden h-64 w-full md:block lg:h-72">
            {PILLARS.map((p, i) => (
              <div
                key={p.id}
                ref={(el) => { cardsRef.current[i] = el }}
                className="pointer-events-none absolute left-0 top-1/2 w-80 -translate-y-1/2 border-l-2 py-1 pl-6 opacity-0"
                style={{ clipPath: 'inset(0 100% 0 0)', borderColor: p.color }}
              >
                <p className="micro-label mb-2" style={{ color: p.color }}>{t({ en: 'Pillar', bn: 'স্তম্ভ' })}</p>
                <h3 className={`mb-3 leading-tight text-ink ${locale === 'bn' ? 'font-bengali-serif text-xl' : 'font-cormorant text-2xl'}`}>{t(p.title)}</h3>
                <p className="mb-5 text-xs leading-relaxed text-ink/50">{t(p.tagline)}</p>
                <Link to={href(`/pillars/${p.id}`)} className="inline-flex items-center gap-2 font-inter text-xs uppercase tracking-label" style={{ color: p.color }}>
                  {t({ en: 'Explore', bn: 'ঘুরে দেখুন' })}
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true"><path d="M2 6h8M6 2l4 4-4 4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
