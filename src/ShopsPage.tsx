import { useEffect } from 'react'
import { SiteFooter } from './SiteFooter'
import { SiteHeader } from './SiteHeader'
import './ShopsPage.css'

const BRANDS = [
  { name: 'TOM FORD', src: '/images/brands/tom-ford.png' },
  { name: 'GUCCI', src: '/images/brands/gucci.png' },
  { name: 'LOUIS VUITTON', src: '/images/brands/louis-vuitton.png' },
  { name: 'CHANEL', src: '/images/brands/chanel.png' },
] as const

export function ShopsPage() {
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  return (
    <div className="shops-page">
      <SiteHeader variant="solid" />

      <main>
        <section className="shops-hero" aria-labelledby="shops-hero-title">
          <div className="shops-hero-media">
            <img
              src="/images/shops.jpg"
              alt="Retail atrium at One Pacific by the Bay"
            />
          </div>
          <div className="shops-hero-copy">
            <h1 id="shops-hero-title">Shops and restaurants</h1>
            <p>
              From trendsetting boutiques to must-try restaurants, enjoy a mix
              of fashion, flavor, and fun—all in one dynamic space designed to
              inspire and connect.
            </p>
          </div>
        </section>

        <section className="shops-story">
          <h2>The ultimate destination for shopping, dining, and style</h2>
          <div className="shops-story-copy">
            <p>
              Our vibrant selection of <strong>dining experiences</strong>{' '}
              ranges from casual cafes and quick bites to exquisite fine-dining
              restaurants. Indulge your palate and connect with friends,
              colleagues, or family in a beautiful, stylish setting.
            </p>
            <p>
              <strong>More than just a place to visit</strong>, this is a
              destination crafted for community, connection, and the enjoyment
              of the finer things in life. Step into a world where exceptional
              style meets seamless convenience.
            </p>
            <div className="shops-brands" aria-label="Featured brands">
              {BRANDS.map((brand) => (
                <img
                  key={brand.name}
                  className="shops-brand-logo"
                  src={brand.src}
                  alt={brand.name}
                />
              ))}
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  )
}
