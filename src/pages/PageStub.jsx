/**
 * Temporary page used until each page is built, so every menu and footer link works.
 */
import { Link } from 'react-router-dom'
import { useT, ui } from '@/lib/i18n'

export function PageStub({ title, label = { en: 'Brand Bangladesh', bn: 'ব্র্যান্ড বাংলাদেশ' } }) {
  const { t, href, locale } = useT()
  return (
    <section className="container-x flex min-h-[calc(70svh-var(--header-h))] flex-col justify-center py-20">
      <p className="micro-label mb-4">{t(label)}</p>
      <h1 className={`max-w-4xl text-ink ${locale === 'bn' ? 'font-bengali-serif text-4xl leading-snug md:text-6xl' : 'font-cormorant text-5xl leading-[1.02] tracking-tight md:text-7xl'}`}>
        {t(title)}
      </h1>
      <div className="brand-stripe mt-6 h-[3px] w-16" />
      <p className="mt-6 max-w-xl text-ink/55">
        {t({ en: 'This page is being prepared.', bn: 'এই পাতাটি তৈরি হচ্ছে।' })}
      </p>
      <Link to={href()} className="mt-8 inline-flex w-fit items-center gap-3 rounded-full bg-ink px-6 py-3.5 font-inter text-xs uppercase tracking-label text-cream transition-colors hover:bg-dark-teal">
        ← {t(ui.home)}
      </Link>
    </section>
  )
}

export function NotFound() {
  return <PageStub title={{ en: 'Page not found', bn: 'পাতাটি পাওয়া যায়নি' }} label={{ en: '404', bn: '৪০৪' }} />
}
