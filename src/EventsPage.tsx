import { useEffect } from 'react'
import { SiteFooter } from './SiteFooter'
import { SiteHeader } from './SiteHeader'
import './ShopsPage.css'

export function EventsPage() {
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  return (
    <div className="shops-page">
      <SiteHeader variant="solid" />

      <main>
        <section className="shops-hero" aria-labelledby="events-hero-title">
          <div className="shops-hero-media">
            <img
              src="/images/events.jpg"
              alt="Outdoor plaza and event space at One Pacific by the Bay"
            />
          </div>
          <div className="shops-hero-copy">
            <h1 id="events-hero-title">Events and culture</h1>
            <p>
              From exclusive launches to weekend markets and live performances,
              the building&apos;s vibrant event spaces bring people together.
              Celebrate culture, business, and connection right in the heart of
              Macapagal&apos;s most dynamic destination.
            </p>
          </div>
        </section>

        <section className="shops-story">
          <h2>The ultimate destination for culture, events, and inspiration</h2>
          <div className="shops-story-copy">
            <p>
              Explore an unmatched collection of{' '}
              <strong>prestigious artistic endeavors</strong>, forward-thinking{' '}
              <strong>cultural exhibits</strong>, and vital communal resources,
              all meticulously assembled to broaden your horizons daily. Whether
              you&apos;re seeking the latest cutting-edge installations,
              exclusive live presentations, or enriching intellectual
              stimulation, this is your central hub.
            </p>
            <p>
              <strong>Far more than a venue</strong>, this locale is
              intentionally built as a vibrant incubator for community growth,
              meaningful exchange, and the deep appreciation of life&apos;s
              highest achievements. Step into a realm where extraordinary
              creativity meets flawless accessibility.
            </p>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  )
}
