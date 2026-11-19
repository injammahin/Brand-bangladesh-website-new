/**
 * Loader (W-01) — plays the Demo 1 logo film on the loading screen with a % counter on top,
 * then fades (no curtain, no white flash) into the hero underneath.
 * - The film is pre-trimmed to where the full logo has formed (loader.mp4, ~190 KB).
 * - Poster frame + fallback: if the film has not started within 2.5 s (slow connection,
 *   blocked autoplay, data saver), the logo still image is shown and the loader finishes quickly.
 * - Plays once per full page load; navigating back to Home inside the site skips it.
 */
import { useEffect, useRef, useState } from 'react'
import { gsap, getLenis, ScrollTrigger } from '@/lib/motion'

let played = false
export const loaderPlayed = () => played

const START_TIMEOUT = 2500
const MAX_WAIT = 12000

export function Loader({ onReveal, onDone }) {
  const overlayRef = useRef(null)
  const videoRef = useRef(null)
  const counterRef = useRef(null)
  const [fallback, setFallback] = useState(false)

  useEffect(() => {
    const overlay = overlayRef.current
    const video = videoRef.current
    const counter = counterRef.current
    if (!overlay || !video || !counter) return

    document.body.style.overflow = 'hidden'
    getLenis()?.stop()

    let finished = false
    const timers = []
    // smooth scroll is created by the layout just after this mounts, so pause it on the next tick too
    timers.push(setTimeout(() => { if (!finished) getLenis()?.stop() }, 0))
    const setPct = (p) => { counter.textContent = String(Math.max(0, Math.min(100, Math.round(p)))) }

    const finish = () => {
      if (finished) return
      finished = true
      timers.forEach(clearTimeout)
      setPct(100)
      gsap.to(overlay.querySelector('[data-meta]'), { opacity: 0, duration: 0.4, delay: 0.25 })
      gsap.to(overlay, {
        opacity: 0,
        duration: 0.9,
        delay: 0.35,
        ease: 'power2.inOut',
        onStart: () => onReveal?.(),
        onComplete: () => {
          played = true
          document.body.style.overflow = ''
          getLenis()?.start()
          setTimeout(() => ScrollTrigger.refresh(), 100)
          onDone?.()
        },
      })
    }

    // quick count-up used by the fallback path
    const quickFinish = () => {
      if (finished) return
      setFallback(true)
      const o = { v: Number(counter.textContent) || 0 }
      gsap.to(o, { v: 100, duration: 1.1, ease: 'power1.inOut', onUpdate: () => setPct(o.v), onComplete: finish })
    }

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setFallback(true)
      timers.push(setTimeout(finish, 600))
      return () => timers.forEach(clearTimeout)
    }

    const onTime = () => { if (video.duration) setPct((video.currentTime / video.duration) * 99) }
    const onPlaying = () => clearTimeout(startTimer)
    video.addEventListener('timeupdate', onTime)
    video.addEventListener('playing', onPlaying)
    video.addEventListener('ended', finish)
    video.addEventListener('error', quickFinish)
    video.muted = true
    video.play().catch(quickFinish)
    const startTimer = setTimeout(() => { if (video.paused || video.currentTime === 0) { video.pause(); quickFinish() } }, START_TIMEOUT)
    timers.push(startTimer, setTimeout(finish, MAX_WAIT))

    return () => {
      timers.forEach(clearTimeout)
      video.removeEventListener('timeupdate', onTime)
      video.removeEventListener('playing', onPlaying)
      video.removeEventListener('ended', finish)
      video.removeEventListener('error', quickFinish)
      document.body.style.overflow = ''
      getLenis()?.start()
    }
  }, [onReveal, onDone])

  return (
    <div ref={overlayRef} className="fixed inset-0 z-[70] isolate overflow-hidden bg-cream" role="status" aria-label="Loading Brand Bangladesh">
      {/* the film's white ground is multiplied onto the cream screen, so there is no visible box */}
      <video
        ref={videoRef}
        className={`absolute left-1/2 top-1/2 w-[min(150vw,1100px)] max-w-none -translate-x-1/2 -translate-y-1/2 mix-blend-multiply transition-opacity duration-300 sm:w-[min(92vw,1280px)] ${fallback ? 'opacity-0' : 'opacity-100'}`}
        src="/assets/video/loader.mp4?v=6"
        muted
        playsInline
        preload="auto"
        aria-hidden="true"
      />
      {fallback && (
        <img src="/assets/video/loader-poster.jpg?v=6" alt="" className="absolute left-1/2 top-1/2 w-[min(150vw,1100px)] max-w-none -translate-x-1/2 -translate-y-1/2 mix-blend-multiply sm:w-[min(92vw,1280px)]" />
      )}

      <div data-meta className="absolute inset-x-0 bottom-[max(2rem,env(safe-area-inset-bottom))] flex flex-col items-center">
        <div className="font-inter text-sm tracking-widest text-ink/45">
          <span ref={counterRef} aria-live="polite">0</span><span>%</span>
        </div>
        <div className="brand-stripe mt-3 h-[2px] w-16 opacity-70" />
      </div>
    </div>
  )
}
