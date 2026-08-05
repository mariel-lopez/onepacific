import { useEffect, useState, type ReactNode, type AnimationEvent } from 'react'
import { Routes, Route, useLocation, type Location } from 'react-router-dom'
import { HomePage } from './HomePage'
import { ShopsPage } from './ShopsPage'
import { WorkspacesPage } from './WorkspacesPage'
import { EventsPage } from './EventsPage'

function scrollToHash(hash: string, behavior: ScrollBehavior = 'smooth') {
  const id = hash.replace('#', '')
  if (!id) return false

  const el = document.getElementById(id)
  if (!el) return false

  el.scrollIntoView({ behavior, block: 'start' })
  return true
}

function tryScrollToHash(hash: string, attempts = 12) {
  if (!hash) return

  let tries = 0
  const tick = () => {
    if (scrollToHash(hash)) return
    tries += 1
    if (tries < attempts) {
      window.setTimeout(tick, 50)
    }
  }
  tick()
}

function ScrollToHash({ readyLocation }: { readyLocation: Location }) {
  useEffect(() => {
    if (readyLocation.pathname !== '/') return
    if (!readyLocation.hash) return
    tryScrollToHash(readyLocation.hash)
  }, [readyLocation.pathname, readyLocation.hash])

  return null
}

function PageTransition({ children }: { children: (location: Location) => ReactNode }) {
  const location = useLocation()
  const [displayLocation, setDisplayLocation] = useState(location)
  const [stage, setStage] = useState<'enter' | 'exit'>('enter')

  useEffect(() => {
    if (location.pathname !== displayLocation.pathname) {
      setStage('exit')
      return
    }

    // Same page, hash-only change (e.g. Features while already on home)
    if (location.hash !== displayLocation.hash) {
      setDisplayLocation(location)
      if (location.hash) tryScrollToHash(location.hash)
    }
  }, [location, displayLocation.pathname, displayLocation.hash])

  function handleAnimationEnd(event: AnimationEvent<HTMLDivElement>) {
    if (event.target !== event.currentTarget) return
    if (stage !== 'exit') return

    setDisplayLocation(location)
    setStage('enter')

    if (location.hash) {
      window.setTimeout(() => tryScrollToHash(location.hash), 40)
    } else {
      window.scrollTo({ top: 0, left: 0, behavior: 'auto' })
    }
  }

  return (
    <div
      className={`page-shell page-shell--${stage}`}
      onAnimationEnd={handleAnimationEnd}
    >
      <ScrollToHash readyLocation={displayLocation} />
      {children(displayLocation)}
    </div>
  )
}

export default function App() {
  return (
    <PageTransition>
      {(location) => (
        <Routes location={location}>
          <Route path="/" element={<HomePage />} />
          <Route path="/shops" element={<ShopsPage />} />
          <Route path="/workspaces" element={<WorkspacesPage />} />
          <Route path="/events" element={<EventsPage />} />
        </Routes>
      )}
    </PageTransition>
  )
}
