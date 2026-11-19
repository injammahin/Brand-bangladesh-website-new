import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { Layout } from '@/components/layout/Layout'
import { PageStub, NotFound } from '@/pages/PageStub'
import { ui } from '@/lib/i18n'
import Home from '@/pages/Home'

// Pages are stubs for now; each one is replaced as it is built.
const STUBS = [
  ['story', ui.nav.story],
  ['pillars', ui.nav.pillars],
  ['pillars/:slug', ui.nav.pillars],
  ['regions', ui.nav.regions],
  ['regions/:slug', ui.nav.regions],
  ['numbers', ui.nav.numbers],
  ['publication', ui.nav.publication],
  ['community', ui.nav.community],
  ['about', ui.nav.about],
  ['search', ui.search],
  ['contact', { en: 'Contact & Inquiries', bn: 'যোগাযোগ ও জিজ্ঞাসা' }],
  ['faq', { en: 'FAQ', bn: 'সাধারণ প্রশ্ন' }],
  ['press', { en: 'Press Room & Media Kit', bn: 'প্রেস রুম ও মিডিয়া কিট' }],
  ['legal/:slug', { en: 'Legal', bn: 'আইনি তথ্য' }],
]

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/en" replace />} />
        <Route path="/:locale" element={<Layout />}>
          <Route index element={<Home />} />
          {STUBS.map(([path, title]) => (
            <Route key={path} path={path} element={<PageStub title={title} />} />
          ))}
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
