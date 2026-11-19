/**
 * Home — Demo 1 order, with the client's 19 Nov changes:
 * loader (W-01) → hero film (W-02/W-03) → at a glance → manifesto → hexagon + flag (W-04/W-05)
 * → six seasons (W-08) → explore the land + eight divisions (W-06).
 */
import { useCallback, useState } from 'react'
import { Loader, loaderPlayed } from '@/components/home/Loader'
import { Hero } from '@/components/home/Hero'
import { Glance } from '@/components/home/Glance'
import { Manifesto } from '@/components/home/Manifesto'
import { HexagonSection } from '@/components/home/HexagonSection'
import { SixSeasons } from '@/components/home/SixSeasons'
import { ExploreLand } from '@/components/home/ExploreLand'
import { Divisions } from '@/components/home/Divisions'

export default function Home() {
  const [showLoader, setShowLoader] = useState(() => !loaderPlayed())
  const [ready, setReady] = useState(() => loaderPlayed())
  const reveal = useCallback(() => setReady(true), [])
  const done = useCallback(() => { setReady(true); setShowLoader(false) }, [])

  return (
    <>
      {showLoader && <Loader onReveal={reveal} onDone={done} />}
      <Hero ready={ready} />
      <Glance />
      <Manifesto />
      <HexagonSection />
      <SixSeasons />
      <ExploreLand />
      <Divisions />
    </>
  )
}
