import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { Button } from './Button'
import { ContactForm } from './ContactForm'
import { SiteFooter } from './SiteFooter'
import { SiteHeader } from './SiteHeader'

const HERO_SLIDES = [
  {
    image: '/images/hero-building.jpg',
    alt: 'One Pacific by the Bay building exterior at dusk',
  },
  {
    image: '/images/lobby.jpg',
    alt: 'Grand lobby atrium at One Pacific By The Bay',
  },
  {
    image: '/images/workspace.jpg',
    alt: 'Office lobby at One Pacific by the Bay',
  },
]

const STATS = [
  {
    value: '16,727',
    label: 'sqm',
    detail: 'Total development area',
  },
  {
    value: '20',
    label: 'm',
    detail: 'From World Trade Center',
  },
  {
    value: '65+',
    label: 'Retail and dining establishments',
    detail: 'A vibrant lifestyle center within the development',
  },
  {
    value: '360°',
    label: 'City and bay views',
    detail: 'Panoramic perspectives from the roof deck and offices',
  },
]

const OFFER_CARDS = [
  {
    tone: 'light' as const,
    title: 'Shops & restaurants',
    image: '/images/shops.jpg',
    alt: 'Retail corridor with coffee and restaurant storefronts at One Pacific by the Bay',
    body: 'From trendsetting boutiques to must-try restaurants, enjoy a mix of fashion, flavor, and fun—all in one dynamic space designed to inspire and connect.',
    cta: 'Learn more',
    href: '/shops',
  },
  {
    tone: 'navy' as const,
    title: 'Workspaces & offices',
    image: '/images/workspace.jpg',
    alt: 'Office lobby at One Pacific by the Bay',
    body: 'Set in the heart of Macapagal, this modern office destination offers world-class design, flexible spaces, and seamless access to premier shops and restaurants. Work, dine, and connect in a vibrant hub where business and lifestyle thrive together.',
    cta: 'Learn more',
    href: '/workspaces',
  },
  {
    tone: 'light' as const,
    title: 'Events & culture',
    image: '/images/events.jpg',
    alt: 'Roof deck gathering space at One Pacific by the Bay',
    body: 'From exclusive launches and weekend markets to live performances under the open sky, the plaza and amenity spaces host a calendar of culture that brings the community together.',
    cta: 'Learn more',
    href: '/events',
  },
]

const FAQS: { question: string; answer: ReactNode }[] = [
  {
    question: 'What types of offices and retail spaces are available?',
    answer:
      'We offer retail spaces on the first and second floors, with office spaces located on the third, fourth, and fifth floors.',
  },
  {
    question: 'Who is the developer?',
    answer: (
      <>
        <a
          className="faq-inline-link"
          href="https://www.pacificconcrete.ph/"
          target="_blank"
          rel="noopener noreferrer"
        >
          Pacific Concrete Products, Inc. (PCPI)
        </a>{' '}
        is one of the few AAAA construction companies in the Philippines. Some
        of our notable projects include: SCTEX, CLEX, TPLEX, The road networks
        of BGC and SM MOA, Several Airport Runways such as NAIA, the PAL
        Terminal, etc.
      </>
    ),
  },
  {
    question: 'How accessible is the location?',
    answer:
      'Strategically located along Macapagal Boulevard, the development is just 7 km from NAIA and minutes from major business districts, entertainment hubs, and transport routes.',
  },
]

const OFFICE_ADDRESS =
  'One Pacific by the Bay Tower 1, 1307 Diosdado Macapagal Blvd, Pasay City, Metro Manila, Philippines'
const MAPS_DIRECTIONS_URL = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(OFFICE_ADDRESS)}`

function useReveal() {
  useEffect(() => {
    const nodes = document.querySelectorAll('.reveal')
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible')
            observer.unobserve(entry.target)
          }
        }
      },
      { threshold: 0.18, rootMargin: '0px 0px -8% 0px' },
    )

    nodes.forEach((node) => observer.observe(node))
    return () => observer.disconnect()
  }, [])
}

function useOfferStackMotion() {
  useEffect(() => {
    const items = Array.from(
      document.querySelectorAll<HTMLElement>('.offer-stack-item'),
    )
    if (items.length === 0) return

    let frame = 0

    const update = () => {
      frame = 0
      const viewport = window.innerHeight
      const reduceMotion = window.matchMedia(
        '(prefers-reduced-motion: reduce)',
      ).matches
      const isMobile = window.matchMedia('(max-width: 640px)').matches

      items.forEach((item, index) => {
        const card = item.querySelector<HTMLElement>('.offer-card')
        if (!card) return

        if (reduceMotion || isMobile) {
          card.style.transform = ''
          card.style.filter = ''
          card.style.boxShadow = ''
          return
        }

        const next = items[index + 1]
        let progress = 0

        if (next) {
          const nextTop = next.getBoundingClientRect().top
          const stickPoint = viewport * 0.14 + index * 28
          progress = Math.min(
            1,
            Math.max(
              0,
              (stickPoint + card.offsetHeight * 0.55 - nextTop) /
                (card.offsetHeight * 0.55),
            ),
          )
        }

        const scale = 1 - progress * 0.06
        const brightness = 1 - progress * 0.12
        card.style.transform = `scale(${scale}) translateY(${progress * -12}px)`
        card.style.filter = `brightness(${brightness})`
        card.style.boxShadow = progress
          ? `0 ${18 + progress * 20}px ${40 + progress * 20}px rgba(18, 28, 51, ${0.12 + progress * 0.1})`
          : '0 12px 32px rgba(18, 28, 51, 0.08)'
      })
    }

    const onScroll = () => {
      if (frame) return
      frame = window.requestAnimationFrame(update)
    }

    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)

    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      if (frame) window.cancelAnimationFrame(frame)
    }
  }, [])
}

export function HomePage() {
  const [slide, setSlide] = useState(0)
  const [openFaqs, setOpenFaqs] = useState<Set<number>>(() => new Set([0]))
  const timerRef = useRef<number | null>(null)

  useReveal()
  useOfferStackMotion()

  const toggleFaq = (index: number) => {
    setOpenFaqs((current) => {
      const next = new Set(current)
      if (next.has(index)) next.delete(index)
      else next.add(index)
      return next
    })
  }

  useEffect(() => {
    timerRef.current = window.setInterval(() => {
      setSlide((current) => (current + 1) % HERO_SLIDES.length)
    }, 6500)

    return () => {
      if (timerRef.current) window.clearInterval(timerRef.current)
    }
  }, [])

  const goToSlide = (index: number) => {
    setSlide(index)
    if (timerRef.current) window.clearInterval(timerRef.current)
    timerRef.current = window.setInterval(() => {
      setSlide((current) => (current + 1) % HERO_SLIDES.length)
    }, 6500)
  }

  return (
    <>
      <SiteHeader variant="overlay" />

      <main id="top">
        <section className="hero" aria-label="Hero">
          <div className="hero-slides" aria-hidden="true">
            {HERO_SLIDES.map((item, index) => (
              <div
                key={item.image}
                className={`hero-slide${index === slide ? ' is-active' : ''}`}
              >
                <img src={item.image} alt="" />
              </div>
            ))}
          </div>
          <div className="hero-veil" />

          <div className="hero-content">
            <span className="eyebrow">Inquire now</span>
            <h1 className="hero-title">One Pacific By The Bay</h1>
            <p className="hero-lede">
              Where global ambition meets Pasay&apos;s energy. A destination for
              business, culture, and connection, designed for modern
              professionals shaping the city&apos;s future.
            </p>
            <div className="hero-actions">
              <Button href="#contact">Let&apos;s chat</Button>
            </div>
            <div className="hero-dots" role="tablist" aria-label="Hero slides">
              {HERO_SLIDES.map((item, index) => (
                <button
                  key={item.image}
                  type="button"
                  role="tab"
                  aria-selected={index === slide}
                  aria-label={`Show slide ${index + 1}`}
                  className={index === slide ? 'is-active' : undefined}
                  onClick={() => goToSlide(index)}
                />
              ))}
            </div>
          </div>
        </section>

        <section id="features" className="offers" aria-label="What we offer">
          <div className="offers-intro reveal">
            <h2 className="offers-heading">What we offer</h2>
          </div>

          <div className="offer-cards">
            {OFFER_CARDS.map((card, index) => (
              <div
                key={card.title}
                className="offer-stack-item"
                style={
                  {
                    '--i': index,
                    zIndex: index + 1,
                  } as CSSProperties
                }
              >
                <article className={`offer-card offer-card--${card.tone}`}>
                  {card.href.startsWith('/') ? (
                    <Link
                      to={card.href}
                      className="offer-card-media"
                      aria-label={`Open ${card.title}`}
                    >
                      <img src={card.image} alt={card.alt} />
                    </Link>
                  ) : (
                    <div className="offer-card-media">
                      <img src={card.image} alt={card.alt} />
                    </div>
                  )}
                  <div className="offer-card-copy">
                    <h3>{card.title}</h3>
                    <p>{card.body}</p>
                    {card.cta ? (
                      card.href.startsWith('/') ? (
                        <Button to={card.href}>{card.cta}</Button>
                      ) : (
                        <Button href={card.href}>{card.cta}</Button>
                      )
                    ) : null}
                  </div>
                </article>
              </div>
            ))}
          </div>
        </section>

        <section id="about" className="about">
          <div className="about-inner">
            <div className="about-intro reveal">
              <div className="about-heading-block">
                <span className="about-badge">About us</span>
                <h2 className="about-title">One Pacific by the Bay</h2>
              </div>
              <div className="about-copy">
                <p>
                  <strong>One Pacific by the Bay</strong> reimagines what it
                  means to work, gather, and grow in the heart of Macapagal.
                  Designed with modern professionals in mind, it combines sleek
                  office spaces, curated retail, and vibrant dining—creating a
                  seamless flow between business and lifestyle.
                </p>
                <p>
                  From the grand lobbies that welcome you to the landscaped roof
                  deck with shaded lounges and city views, every corner reflects
                  thoughtful design and urban sophistication. A destination
                  built for connection, collaboration, and the energy of a
                  world-class waterfront community.
                </p>
              </div>
            </div>

            <div className="stats-grid reveal">
              {STATS.map((stat) => (
                <div className="stat" key={stat.value + stat.label}>
                  <div className="stat-value">{stat.value}</div>
                  <div className="stat-label">{stat.label}</div>
                  <div className="stat-detail">{stat.detail}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="faq" className="faq">
          <div className="faq-inner">
            <div className="faq-intro reveal">
              <span className="faq-badge">FAQs</span>
              <h2 className="faq-title">Answering your questions</h2>
              <p className="faq-lede">
                Got more questions? Send us your inquiry below
              </p>
              <Button href="#contact">Get in touch</Button>
            </div>

            <div className="faq-list reveal">
              {FAQS.map((item, index) => {
                const open = openFaqs.has(index)
                return (
                  <div
                    key={item.question}
                    className={`faq-item${open ? ' is-open' : ''}`}
                  >
                    <button
                      type="button"
                      className="faq-trigger"
                      aria-expanded={open}
                      aria-controls={`faq-panel-${index}`}
                      onClick={() => toggleFaq(index)}
                    >
                      <span>{item.question}</span>
                      <span className="faq-icon" aria-hidden="true" />
                    </button>
                    <div
                      id={`faq-panel-${index}`}
                      className="faq-panel"
                      role="region"
                    >
                      <div className="faq-panel-inner">
                        <p>{item.answer}</p>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </section>

        <section id="contact" className="contact">
          <div className="contact-inner">
            <div className="contact-info reveal">
              <span className="contact-badge">Contact</span>
              <h2 className="contact-title">Get in touch</h2>
              <p className="contact-lede">
                For any inquiries or to explore your vision further, we invite
                you to contact our professional team using the details provided
                below.
              </p>

              <dl className="contact-list">
                <div>
                  <dt>Office</dt>
                  <dd>
                    <a
                      className="contact-directions"
                      href={MAPS_DIRECTIONS_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      title="Get directions on Google Maps"
                    >
                      {OFFICE_ADDRESS}
                    </a>
                  </dd>
                </div>
                <div>
                  <dt>Email</dt>
                  <dd>
                    <a href="mailto:concierge@onepacificbythebay.com">
                      concierge@onepacificbythebay.com
                    </a>
                  </dd>
                </div>
                <div>
                  <dt>Telephone</dt>
                  <dd>
                    <a href="tel:+639175701126">0917.570.1126</a>
                  </dd>
                </div>
              </dl>

              <a
                className="contact-map"
                href={MAPS_DIRECTIONS_URL}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Get directions to ${OFFICE_ADDRESS} on Google Maps`}
              >
                <img
                  src="/images/site-map.jpg"
                  alt="Map of One Pacific by the Bay site near Manila Bay in Pasay City"
                />
                <span className="contact-map-cue">
                  Get directions
                  <svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
                    <path
                      d="M4 12L12 4M12 4H6.5M12 4V9.5"
                      stroke="currentColor"
                      strokeWidth="1.6"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
              </a>
            </div>

            <ContactForm />
          </div>
        </section>
      </main>

      <SiteFooter />
    </>
  )
}
