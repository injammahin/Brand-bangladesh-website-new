/** Bangladesh at a glance — four headline figures (Demo 1). */
import { Link } from 'react-router-dom'
import { useT } from '@/lib/i18n'
import { GLANCE } from '@/data/home'
import { Counter } from '@/components/motion/Reveal'

export function Glance() {
  const { t, href } = useT()
  return (
    <section id="after-hero" className="container-x bg-cream pb-8 pt-14 md:pt-16" aria-label={t({ en: 'Bangladesh at a glance', bn: 'এক নজরে বাংলাদেশ' })}>
      <div className="mb-8 flex items-center justify-between gap-4">
        <p className="micro-label">{t({ en: 'Bangladesh at a glance', bn: 'এক নজরে বাংলাদেশ' })}</p>
        <Link to={href('/numbers')} className="font-inter text-xs uppercase tracking-label text-ink/60 transition-colors hover:text-ink">
          {t({ en: 'All figures', bn: 'সব পরিসংখ্যান' })} →
        </Link>
      </div>
      <div className="grid grid-cols-2 gap-x-5 gap-y-10 sm:gap-x-6 lg:grid-cols-4">
        {GLANCE.map((s) => (
          <div key={s.id}>
            <div className="mb-4 h-px bg-ink/10" />
            <p className="font-cormorant text-[clamp(2.2rem,5vw,3.6rem)] leading-none tracking-tight text-ink">
              <Counter to={s.value} prefix={s.prefix} suffix={s.suffix} decimals={s.decimals} />
            </p>
            <p className="mt-2 text-sm text-ink/70">{t(s.label)}</p>
            <p className="mt-1 text-[11px] text-ink/40">{t({ en: 'Source', bn: 'সূত্র' })}: {s.source}, {s.year}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
