/**
 * W-06 — Eight divisions in Demo 1 style: 3D-artwork cards (4 / 2 / 1 per row), accent glow on hover,
 * each linked to its own division page.
 */
import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { useT } from '@/lib/i18n'
import { gsap, prefersReduced } from '@/lib/motion'
import { DIVISIONS, DIVISION_PHOTO } from '@/data/home'

function DivisionCard({ d }) {
  const { t, n, href, locale } = useT()
  const cardRef = useRef(null)
  const imgRef = useRef(null)
  const enter = () => {
    gsap.to(imgRef.current, { scale: 1.06, duration: 0.5, ease: 'power2.out' })
    cardRef.current.style.boxShadow = `0 0 40px ${d.accent}44`
  }
  const leave = () => {
    gsap.to(imgRef.current, { scale: 1, duration: 0.5, ease: 'power2.out' })
    cardRef.current.style.boxShadow = ''
  }
  return (
    <Link to={href(`/regions/${d.slug}`)} className="block h-full w-full" onMouseEnter={enter} onMouseLeave={leave} onFocus={enter} onBlur={leave}>
      <div ref={cardRef} className="relative aspect-[4/5] w-full overflow-hidden rounded-xl transition-shadow duration-500">
        <div ref={imgRef} className="absolute inset-0 will-change-transform">
          <img src={DIVISION_PHOTO[d.slug]} alt={t(d.name)} loading="lazy" className="h-full w-full object-cover" />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
        <div className="absolute inset-0" style={{ background: `linear-gradient(to top, ${d.accent}80 0%, transparent 50%)` }} />
        <div className="absolute inset-x-0 bottom-0 p-5 sm:p-6">
          <div className="mb-3 h-px w-8" style={{ backgroundColor: d.accent }} />
          <h3 className={`leading-tight tracking-tight text-cream ${locale === 'bn' ? 'font-bengali-serif text-2xl' : 'font-cormorant text-3xl'}`}>{t(d.name)}</h3>
          <p className={`mt-1 text-sm text-cream/70 ${locale === 'bn' ? 'font-inter' : 'font-bengali'}`}>{locale === 'bn' ? d.name.en : d.name.bn}</p>
          <p className="micro-label mt-3 !text-cream/60">{n(d.districtCount)} {t({ en: 'districts', bn: 'জেলা' })}</p>
        </div>
      </div>
    </Link>
  )
}

export function Divisions() {
  const { t, href, locale } = useT()
  const sectionRef = useRef(null)

  useEffect(() => {
    const section = sectionRef.current
    if (!section || prefersReduced()) return
    const ctx = gsap.context(() => {
      gsap.from(section.querySelectorAll('[data-in]'), {
        y: 60, opacity: 0, duration: 0.8, ease: 'power3.out', stagger: 0.08,
        scrollTrigger: { trigger: section, start: 'top 85%' },
      })
    }, section)
    return () => ctx.revert()
  }, [])

  return (
    <section ref={sectionRef} id="divisions" className="container-x relative bg-cream pb-24 pt-8" aria-label={t({ en: 'Explore the divisions of Bangladesh', bn: 'বাংলাদেশের বিভাগগুলো ঘুরে দেখুন' })}>
      <div data-in className="mb-10 flex flex-col gap-6 md:mb-12 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="micro-label mb-2">{t({ en: 'Eight divisions', bn: 'আটটি বিভাগ' })}</p>
          <h2 className={`leading-none tracking-tight text-ink ${locale === 'bn' ? 'font-bengali-serif text-4xl md:text-5xl' : 'font-cormorant text-[clamp(2.4rem,5vw,4rem)]'}`}>
            {t({ en: 'Eight divisions, eight worlds', bn: 'আট বিভাগ, আট ভুবন' })}
          </h2>
        </div>
        <Link to={href('/regions')} className="inline-flex items-center gap-3 self-start rounded-full border border-ink/20 px-5 py-3 font-inter text-xs uppercase tracking-label transition-colors hover:bg-ink hover:text-cream">
          {t({ en: 'Open the regions map', bn: 'অঞ্চলের মানচিত্র খুলুন' })} →
        </Link>
      </div>
      <div className="grid grid-cols-1 gap-4 min-[480px]:grid-cols-2 md:gap-6 lg:grid-cols-4">
        {DIVISIONS.map((d) => <div key={d.slug} data-in><DivisionCard d={d} /></div>)}
      </div>
    </section>
  )
}
