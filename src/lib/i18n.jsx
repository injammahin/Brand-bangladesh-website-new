/**
 * Bilingual helpers (EN / BN). Every user-facing string is { en, bn }.
 * The locale lives in the URL (/en/..., /bn/...), so the language switch keeps the visitor on the same page.
 */
import { createContext, useContext, useEffect } from 'react'

export const LOCALES = ['en', 'bn']
export const isLocale = (v) => LOCALES.includes(v)

const BN_DIGITS = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯']
export const num = (value, locale) => {
  const s = String(value)
  return locale === 'bn' ? s.replace(/[0-9]/g, (d) => BN_DIGITS[+d]) : s
}
export const tr = (v, locale) => (!v ? '' : typeof v === 'string' ? v : locale === 'bn' ? v.bn : v.en)

/** Swap the locale segment of a pathname */
export function switchLocalePath(pathname, target) {
  const parts = pathname.split('/')
  if (parts[1] && isLocale(parts[1])) parts[1] = target
  else parts.splice(1, 0, target)
  return parts.join('/') || `/${target}`
}

const LocaleContext = createContext('en')

export function LocaleProvider({ locale, children }) {
  useEffect(() => { document.documentElement.lang = locale }, [locale])
  return <LocaleContext.Provider value={locale}>{children}</LocaleContext.Provider>
}

/** t() picks the language, n() localises digits, href() prefixes the locale */
export function useT() {
  const locale = useContext(LocaleContext)
  return {
    locale,
    t: (v) => tr(v, locale),
    n: (v) => num(v, locale),
    href: (path = '') => `/${locale}${path}`,
  }
}

export const ui = {
  nav: {
    story: { en: 'The Brand Story', bn: 'ব্র্যান্ড গল্প' },
    pillars: { en: 'Brand Pillars', bn: 'ব্র্যান্ড স্তম্ভ' },
    regions: { en: 'Regions', bn: 'অঞ্চল' },
    numbers: { en: 'Numbers & Stories', bn: 'সংখ্যা ও গল্প' },
    publication: { en: 'Publication', bn: 'প্রকাশনা' },
    community: { en: 'Community', bn: 'কমিউনিটি' },
    about: { en: 'About', bn: 'পরিচিতি' },
  },
  search: { en: 'Search', bn: 'অনুসন্ধান' },
  share: { en: 'Share', bn: 'শেয়ার' },
  copied: { en: 'Link copied', bn: 'লিংক কপি হয়েছে' },
  skipToContent: { en: 'Skip to content', bn: 'মূল বিষয়বস্তুতে যান' },
  home: { en: 'Home', bn: 'প্রথম পাতা' },
  menuOpen: { en: 'Open menu', bn: 'মেনু খুলুন' },
  menuClose: { en: 'Close menu', bn: 'মেনু বন্ধ করুন' },
  invalidEmail: { en: 'Please enter a valid email address', bn: 'একটি সঠিক ইমেইল ঠিকানা লিখুন' },
  shareStory: { en: 'Share your story', bn: 'আপনার গল্প বলুন' },
}

export const NAV = [
  { key: 'story', path: '/story' },
  { key: 'pillars', path: '/pillars' },
  { key: 'regions', path: '/regions' },
  { key: 'numbers', path: '/numbers' },
  { key: 'publication', path: '/publication' },
  { key: 'community', path: '/community' },
  { key: 'about', path: '/about' },
]
