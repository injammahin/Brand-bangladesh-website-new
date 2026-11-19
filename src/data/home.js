/** Home-page content (from Demo 1). Replace with CMS data later. */
import divisions from './divisions.json'
import landmarksRaw from './landmarks.json'

export const PILLARS = [
  { id: 'tourism', color: '#479E90', title: { en: 'Tourism', bn: 'পর্যটন' }, tagline: { en: "From the world's longest natural sea beach to the largest mangrove forest.", bn: 'পৃথিবীর দীর্ঘতম প্রাকৃতিক সৈকত থেকে বৃহত্তম ম্যানগ্রোভ বন পর্যন্ত।' } },
  { id: 'exports', color: '#D9AA66', title: { en: 'Exports', bn: 'রপ্তানি' }, tagline: { en: "The world's second-largest apparel exporter — and a great deal more.", bn: 'বিশ্বের দ্বিতীয় বৃহত্তম পোশাক রপ্তানিকারক — এবং তার চেয়েও অনেক বেশি।' } },
  { id: 'governance', color: '#016171', title: { en: 'Governance', bn: 'সুশাসন' }, tagline: { en: 'Reform, digital public services and a steady climb in transparency.', bn: 'সংস্কার, ডিজিটাল জনসেবা আর স্বচ্ছতার পথে ধারাবাহিক অগ্রযাত্রা।' } },
  { id: 'investment', color: '#EF1551', title: { en: 'Investment & Immigration', bn: 'বিনিয়োগ ও অভিবাসন' }, tagline: { en: 'A market of 170 million, a young workforce and 100 economic zones in the making.', bn: '১৭ কোটি মানুষের বাজার, তরুণ কর্মশক্তি আর গড়ে উঠছে ১০০টি অর্থনৈতিক অঞ্চল।' } },
  { id: 'culture', color: '#F68421', title: { en: 'Culture & Heritage', bn: 'সংস্কৃতি ও ঐতিহ্য' }, tagline: { en: 'A people who gave the world International Mother Language Day.', bn: 'যে জাতি বিশ্বকে দিয়েছে আন্তর্জাতিক মাতৃভাষা দিবস।' } },
  { id: 'people', color: '#A5CD2F', title: { en: 'People', bn: 'মানুষ' }, tagline: { en: 'Entrepreneurs, artists, athletes, innovators — and a diaspora of millions.', bn: 'উদ্যোক্তা, শিল্পী, খেলোয়াড়, উদ্ভাবক — আর কোটি মানুষের প্রবাসী পরিবার।' } },
]
export const getPillar = (id) => PILLARS.find((p) => p.id === id)

export const GLANCE = [
  { id: 'population', value: 169.8, decimals: 1, suffix: 'M', label: { en: 'people', bn: 'জন মানুষ' }, source: 'BBS Population & Housing Census', year: '2022' },
  { id: 'apparel-rank', value: 2, prefix: '#', label: { en: 'largest apparel exporter in the world', bn: 'বিশ্বে পোশাক রপ্তানিতে অবস্থান' }, source: 'WTO World Trade Statistical Review', year: '2024' },
  { id: 'beach', value: 120, suffix: ' km', label: { en: 'of natural sea beach at Cox’s Bazar', bn: 'কক্সবাজারের প্রাকৃতিক সমুদ্রসৈকত' }, source: 'Bangladesh Tourism Board', year: '2024' },
  { id: 'remittance', value: 23.9, decimals: 1, prefix: '$', suffix: 'B', label: { en: 'remittances in FY2023-24', bn: '২০২৩-২৪ অর্থবছরে প্রবাসী আয়' }, source: 'Bangladesh Bank', year: '2024' },
]

/** 3D-style division artwork (matches the 3D map film) */
export const DIVISION_PHOTO = {
  barishal: '/assets/divisions/Barishal.jpg',
  chattogram: '/assets/divisions/Chittagong.jpg',
  dhaka: '/assets/divisions/Dhaka.jpg',
  khulna: '/assets/divisions/Khulna.jpg',
  mymensingh: '/assets/divisions/Mymensingh.jpg',
  rajshahi: '/assets/divisions/Rajshahi.jpg',
  rangpur: '/assets/divisions/Rangpur.jpg',
  sylhet: '/assets/divisions/sylhet.jpg',
}

export const DIVISIONS = divisions.map((d) => ({ slug: d.slug, name: d.name, accent: d.accent, districtCount: d.districtCount }))
export const getDivision = (slug) => DIVISIONS.find((d) => d.slug === slug)

export const LANDMARKS = landmarksRaw.map((l) => ({
  id: l.id,
  name: l.name,
  tagline: l.tagline,
  division: l.division,
  pillar: l.pillar,
  image: l.image.includes('TODO') ? DIVISION_PHOTO[l.division] || '/assets/divisions/map.jpg' : l.image.replace('/assets/Tourism/', '/assets/tourism/'),
}))
