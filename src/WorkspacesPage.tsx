import { useEffect } from 'react'
import { SiteFooter } from './SiteFooter'
import { SiteHeader } from './SiteHeader'
import './ShopsPage.css'

export function WorkspacesPage() {
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  return (
    <div className="shops-page">
      <SiteHeader variant="solid" />

      <main>
        <section className="shops-hero" aria-labelledby="workspaces-hero-title">
          <div className="shops-hero-media">
            <img
              src="/images/workspace.jpg"
              alt="Office lobby at One Pacific by the Bay"
            />
          </div>
          <div className="shops-hero-copy">
            <h1 id="workspaces-hero-title">Workspaces and offices</h1>
            <p>
              Set in the heart of Macapagal, this modern office destination
              offers world-class design, flexible spaces, and seamless access to
              premier shops and restaurants. Work, dine, and connect in a
              vibrant hub where business and lifestyle thrive together.
            </p>
          </div>
        </section>

        <section className="shops-story">
          <h2 className="workspaces-subhead">
            The ultimate destination for work, innovation, and success
          </h2>
          <div className="shops-story-copy">
            <p>
              Our curated collection of{' '}
              <strong>signature business services</strong> begins with casual,
              artisan coffee havens and extends to exquisitely appointed,
              private corporate dining salons.
            </p>
            <p>
              Elevate every interaction—from client meetings to partner
              connections—in a setting of <strong>impeccable design</strong> and
              sophisticated professionalism. This is{' '}
              <strong>more than just a workspace</strong>; it is a meticulously
              crafted destination for community, connection, and the seamless
              realization of your professional vision.
            </p>
            <p>
              Step into a world where{' '}
              <strong>exceptional convenience meets understated luxury.</strong>
            </p>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  )
}
