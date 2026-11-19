/** Fade-up on first view, and a number that counts up on first view. Both respect reduced motion. */
import { useEffect, useRef, useState } from 'react'
import { gsap, prefersReduced } from '@/lib/motion'
import { useT } from '@/lib/i18n'

export function Reveal({ as: Tag = 'div', delay = 0, y = 40, className, children, ...rest }) {
  const ref = useRef(null)
  useEffect(() => {
    const el = ref.current
    if (!el || prefersReduced()) return
    gsap.set(el, { opacity: 0, y })
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return
      gsap.to(el, { opacity: 1, y: 0, duration: 1, ease: 'expo.out', delay })
      io.disconnect()
    }, { threshold: 0.15 })
    io.observe(el)
    return () => io.disconnect()
  }, [delay, y])
  return <Tag ref={ref} className={className} {...rest}>{children}</Tag>
}

export function Counter({ to, decimals = 0, prefix = '', suffix = '' }) {
  const { n } = useT()
  const ref = useRef(null)
  const [val, setVal] = useState(prefersReduced() ? to : 0)
  useEffect(() => {
    const el = ref.current
    if (!el || prefersReduced()) return
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return
      const o = { v: 0 }
      gsap.to(o, { v: to, duration: 1.8, ease: 'power2.out', onUpdate: () => setVal(o.v) })
      io.disconnect()
    }, { threshold: 0.4 })
    io.observe(el)
    return () => io.disconnect()
  }, [to])
  return <span ref={ref} className="tabular-nums">{n(`${prefix}${val.toFixed(decimals)}${suffix}`)}</span>
}
