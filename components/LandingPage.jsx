import Image from "next/image";
import ConciergeBuilder from "./ConciergeBuilder";
import FloatingConcierge from "./FloatingConcierge";
import { contactPhone, faqs, fleet, galleryRows, navItems, plans, routeSteps, wa } from "../lib/site-data";

const iconPaths = {
  sun: <><circle cx="12" cy="12" r="3.5" /><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" /></>,
  moon: <path d="M20.8 15.1A8.5 8.5 0 0 1 8.9 3.2 8.5 8.5 0 1 0 20.8 15.1Z" />,
  whatsapp: <path d="M13.601 2.326A7.85 7.85 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.9 7.9 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93a7.9 7.9 0 0 0-2.327-5.607M7.994 14.521a6.57 6.57 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.249a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.56 6.56 0 0 1 1.928 4.66c-.004 3.639-2.961 6.59-6.592 6.59m3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.514.646-.63.775-.116.133-.232.15-.43.05-1.17-.585-1.936-1.044-2.707-2.37-.205-.353.205-.327.585-1.09.065-.134.033-.249-.016-.348-.05-.099-.445-1.075-.61-1.47-.16-.389-.323-.335-.445-.34-.116-.007-.248-.007-.381-.007s-.348.05-.53.248c-.182.198-.696.68-.696 1.657s.713 1.923.812 2.056c.099.132 1.403 2.14 3.4 3.003.476.205.848.327 1.137.419.478.152.913.13 1.257.079.384-.058 1.17-.48 1.335-.943.164-.462.164-.858.116-.943-.05-.083-.182-.132-.38-.23" />,
  phone: <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.4 19.4 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 2 .7 2.8a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.5c.9.4 1.8.6 2.8.7a2 2 0 0 1 1.7 2.1Z" />
};

const iconViewBoxes = {
  whatsapp: "0 0 16 16"
};

function UiIcon({ name }) {
  return <svg aria-hidden="true" className={`ui-icon ui-icon-${name}`} viewBox={iconViewBoxes[name] || "0 0 24 24"}>{iconPaths[name]}</svg>;
}

function ThemeToggle({ mobile = false }) {
  const id = mobile ? "mobileThemeToggle" : "themeToggle";
  const textId = mobile ? "mobileThemeToggleText" : "themeToggleText";
  return (
    <button aria-label="Switch to dark theme" aria-pressed="false" className={`theme-toggle${mobile ? " theme-toggle-mobile" : ""}`} id={id} type="button">
      <span aria-hidden="true" className="theme-toggle-track">
        <span className="theme-toggle-icon theme-toggle-sun"><UiIcon name="sun" /></span>
        <span className="theme-toggle-icon theme-toggle-moon"><UiIcon name="moon" /></span>
        <i />
      </span>
      <strong id={textId}>Light</strong>
    </button>
  );
}

function ActionLink({ children, href, secondary = false }) {
  const external = href.startsWith("http");
  return (
    <a className={secondary ? "action action-secondary" : "action action-primary"} href={href} rel={external ? "noreferrer" : undefined} target={external ? "_blank" : undefined}>
      <span>{children}</span>
    </a>
  );
}

export default function LandingPage() {
  return (
    <>
      <noscript><style>{".loader{display:none!important}"}</style></noscript>
      <div aria-label="Preparing POF Rental" aria-live="polite" className="loader" id="loader">
        <div aria-hidden="true" className="loader-grid" />
        <div className="loader-shell">
          <div className="loader-eyebrow"><span>POF / Dubai</span><span>Private mobility</span></div>
          <div className="loader-brand-row">
            <Image alt="POF Rental" className="loader-mark" height={120} priority src="/media/logo.png" width={360} />
            <div className="loader-count"><span>Preparing</span><strong id="loaderCount">000</strong><small>%</small></div>
          </div>
          <p className="loader-title">Setting the route for your arrival.</p>
          <div className="loader-line"><span id="loaderBar" /></div>
          <div className="loader-meta"><span id="loaderStage">Loading fleet film</span><strong>24/7 Concierge</strong></div>
        </div>
      </div>

      <nav className="nav" id="siteNav">
        <div className="nav-progress-bar" id="navProgress" />
        <a aria-label="POF Rental home" className="nav-logo" href="#book">
          <Image alt="POF Rental" height={120} priority src="/media/logo.png" width={360} />
        </a>
        <ul className="nav-links">
          {navItems.map(([label, href]) => <li key={href}><a href={href}>{label}</a></li>)}
        </ul>
        <ThemeToggle />
        <a className="nav-reserve" href="#enquire">Reserve</a>
        <button aria-expanded="false" aria-label="Menu" className="mobile-menu-btn" id="mobileMenuBtn" type="button">
          <span /><span /><span />
        </button>
      </nav>

      <div aria-hidden="true" className="mobile-nav-overlay" id="mobileNav" inert>
        <Image alt="POF Rental" className="mobile-nav-logo" height={120} src="/media/logo.png" width={360} />
        <ThemeToggle mobile />
        {navItems.map(([label, href], index) => (
          <a className="mobile-nav-link" href={href} key={href} style={{ "--i": index }}>
            <span>{String(index + 1).padStart(2, "0")}</span>{label}
          </a>
        ))}
      </div>

      <main>
        <section className="hero hero-atelier" id="book">
          <div className="hero-media" aria-hidden="true">
            <video className="hero-video active" data-hero-video="0" loop muted playsInline poster="/media/1.webp" preload="metadata">
              <source src="/media/huraccan.webm" type="video/webm" />
            </video>
          </div>

          <div className="hero-content">
            <div className="hero-copy-wrap">
              <p className="kicker">POF Rental / Dubai</p>
              <h1 aria-label="Luxury mobility, edited for arrival.">
                <span className="hero-title-line">Luxury mobility,</span>
                <span className="hero-title-line">edited for arrival.</span>
              </h1>
              <p className="hero-copy">A quieter way to book Dubai supercars, prestige SUVs, chauffeur-ready vehicles, HeliDubai transfers, and long-term fleet plans.</p>
              <div className="hero-actions">
                <ActionLink href="#enquire">Open Concierge</ActionLink>
                <button className="action action-secondary" data-scroll-target="#fleet" type="button"><span>View Fleet Ledger</span></button>
              </div>
            </div>
          </div>

          <div className="hero-orbit" aria-hidden="true">
            <span />
            <span />
            <span />
          </div>
        </section>

        <section className="cinema-strip" aria-label="POF Rental cinematic services">
          <div className="cinema-copy">
            <div className="cinema-copy-intro">
              <p className="kicker">Arrival edit</p>
              <figure>
                <Image alt="Lamborghini arrival in the Dubai desert" fill sizes="(max-width: 1100px) 100vw, 42vw" src="/media/arrival-lamborghini-web.webp" />
                <figcaption>Dubai / Supercar arrival</figcaption>
              </figure>
            </div>
            <h2>Supercar, performance, chauffeur. One continuous journey.</h2>
          </div>
          <div className="cinema-grid">
            <figure>
              <video data-lazy-video="true" muted loop playsInline poster="/media/fleet-purosangue-web.webp" preload="none">
                <source src="/media/purosangue.mp4" type="video/mp4" />
              </video>
              <figcaption>V12 SUV delivery</figcaption>
            </figure>
            <figure>
              <Image alt="Porsche 911 GT3 RS performance rental in Dubai" fill sizes="(max-width: 720px) 100vw, 32vw" src="/media/cinema-porsche-web.webp" />
              <figcaption>Porsche performance</figcaption>
            </figure>
            <figure>
              <Image alt="Rolls-Royce Ghost chauffeur arrival in Dubai" fill sizes="(max-width: 720px) 100vw, 32vw" src="/media/cinema-chauffeur-web.webp" />
              <figcaption>Chauffeur arrival</figcaption>
            </figure>
          </div>
        </section>

        <section className="media-suite" aria-label="Luxury rental image and video highlights">
          <div className="media-suite-copy">
            <p className="kicker">Premium media suite</p>
            <h2>Every handover feels composed before the keys arrive.</h2>
            <p>High-impact visuals, calm spacing, and motion-led transitions bring the fleet, routes, and VIP services into one polished browsing flow.</p>
          </div>
          <div className="media-suite-grid">
            <figure className="media-suite-large">
              <video data-lazy-video="true" muted loop playsInline poster="/media/cinema-porsche-web.webp" preload="none">
                <source src="/media/porsche.mp4" type="video/mp4" />
              </video>
              <figcaption><span>Porsche GT3 RS</span><small>Performance film</small></figcaption>
            </figure>
            <figure>
              <video data-lazy-video="true" muted loop playsInline poster="/media/DSC07812.webp" preload="none">
                <source src="/media/helio.mp4" type="video/mp4" />
              </video>
              <figcaption><span>HeliDubai</span><small>Skyline transfer</small></figcaption>
            </figure>
            <article className="media-suite-note"><span>24 / 7</span><strong>Prepared before arrival.</strong><p>Vehicle, timing, route, and handover are aligned through one concierge.</p></article>
          </div>
        </section>

        <section className="concierge-section" id="concierge">
          <div className="section-copy-block">
            <p className="kicker">Concierge method</p>
            <h2>Book by mood, not by scrolling forever.</h2>
            <p>POF Rental turns a luxury car request into a managed route: vehicle match, transparent rate, delivery timing, and support after the keys are handed over.</p>
          </div>
          <div className="flow-lines">
            {routeSteps.map(([number, title, text]) => (
              <div className="flow-line" key={title}><span>{number}</span><strong>{title}</strong><p>{text}</p></div>
            ))}
          </div>
        </section>

        <section className="fleet-section" id="fleet">
          <div className="section-copy-block">
            <p className="kicker">Fleet ledger</p>
            <h2>Five signatures. One clean decision path.</h2>
            <p>Each model is positioned by the experience it creates, from track presence to executive calm.</p>
          </div>
          <div className="fleet-runway">
            {fleet.map((car, index) => (
              <article className="fleet-row" key={car.model}>
                <div className="fleet-index">{String(index + 1).padStart(2, "0")}</div>
                <div className="fleet-copy">
                  <span>{car.brand}</span>
                  <h3>{car.model}</h3>
                  <p>{car.tone}</p>
                  <div className="fleet-stats">{car.stats.map((stat) => <small key={stat}>{stat}</small>)}</div>
                </div>
                <div className="fleet-image-wrap">
                  <Image alt={`${car.brand} ${car.model} available from POF Rental`} fill sizes="(max-width: 720px) 100vw, 48vw" src={car.image} />
                  <span>{car.tone}</span>
                </div>
                <a href={wa(car.message)} rel="noreferrer" target="_blank">Reserve</a>
              </article>
            ))}
          </div>
        </section>

        <ConciergeBuilder fleet={fleet.map(({ id, brand, model }) => ({ id, label: `${brand} ${model}` }))} />

        <section className="editorial-band">
          <div>
            <p className="kicker">Prepared for Dubai</p>
            <h2>Airport, hotel, office, private villa. The handover adapts.</h2>
          </div>
          <figure>
            <Image alt="Luxury car handover in Dubai" fill sizes="(max-width: 720px) 100vw, 55vw" src="/media/2 2.webp" />
            <figcaption>Concierge-prepared handovers across Dubai.</figcaption>
          </figure>
        </section>

        <section className="motion-gallery" aria-label="Fleet motion gallery">
          <div className="motion-gallery-copy">
            <div>
              <p className="kicker">Visual fleet rhythm</p>
              <p className="motion-gallery-note">Three collections. One continuous arrival.</p>
            </div>
            <h2>Scroll through presence, pace, and polish.</h2>
          </div>
          <div className="gallery-rows">
            {galleryRows.map((row, rowIndex) => (
              <div className="gallery-row" data-gallery-direction={row.direction} key={row.label}>
                <div className="gallery-row-sticky">
                  <div className="gallery-row-head">
                    <div>
                      <span>{String(rowIndex + 1).padStart(2, "0")}</span>
                      <strong>{row.label}</strong>
                    </div>
                    <div className="gallery-row-tools">
                      <span className="gallery-direction-mark" aria-hidden="true">{row.direction === "rtl" ? "\u2190" : "\u2192"}</span>
                      <div aria-label={`${row.label} gallery controls`} className="gallery-row-controls" role="group">
                        <button aria-controls={`gallery-row-${rowIndex}`} aria-label={`Show previous ${row.label} vehicle`} data-gallery-move="previous" title="Previous vehicle" type="button">&larr;</button>
                        <button aria-controls={`gallery-row-${rowIndex}`} aria-label={`Show next ${row.label} vehicle`} data-gallery-move="next" title="Next vehicle" type="button">&rarr;</button>
                      </div>
                    </div>
                  </div>
                  <div aria-label={`Browse ${row.label} vehicles`} className="gallery-viewport" tabIndex="0">
                    <div className="gallery-track" id={`gallery-row-${rowIndex}`}>
                      {row.items.map((car, index) => (
                        <article className="gallery-panel" key={`${row.label}-${car.model}-${index}`}>
                          <div className="gallery-panel-media">
                            <Image alt={`${car.brand} ${car.model}`} fill sizes="(max-width: 720px) 100vw, 38vw" src={car.image} />
                            <span>Daily rental</span>
                          </div>
                          <div className="gallery-panel-copy">
                            <div className="gallery-panel-heading">
                              <div>
                                <small>{car.brand}</small>
                                <h3>{car.model}</h3>
                              </div>
                              <strong>{car.price}</strong>
                            </div>
                            <p>{car.tone}</p>
                            <div className="gallery-panel-meta">
                              {car.features.map((feature) => <span key={feature}>{feature}</span>)}
                            </div>
                            <a href={wa(car.message)} rel="noreferrer" target="_blank">
                              <span>Check availability</span><b aria-hidden="true">&rarr;</b>
                            </a>
                          </div>
                        </article>
                      ))}
                    </div>
                  </div>
                  <div className="gallery-row-progress" aria-hidden="true"><span /></div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="split-story" id="plans">
          <div className="story-media">
            <video className="about-video" data-lazy-video="true" muted loop playsInline poster="/media/offer-purosangue-web.webp" preload="none">
              <source src="/media/purosangue.mp4" type="video/mp4" />
            </video>
            <span>Daily / Weekly / Monthly</span>
          </div>
          <div className="story-copy">
            <p className="kicker">Plans and access</p>
            <h2>Daily thrill. Monthly calm. Corporate continuity.</h2>
            <p>Move between short-term luxury rental, long-stay access, and chauffeur-ready fleet support without changing teams.</p>
            <div className="lease-lanes">
              {plans.map(([title, price, text]) => (
                <article key={title}><span>{title}</span><strong>{price}</strong><p>{text}</p></article>
              ))}
            </div>
          </div>
        </section>

        <section className="heli-section" id="helidubai">
          <div className="heli-copy">
            <p className="kicker">POF Rental x HeliDubai</p>
            <h2>From road presence to skyline transfer.</h2>
            <p>Pair your vehicle handover with helicopter movement for airport arrivals, private tours, and VIP transfers across the city.</p>
            <div className="heli-tags"><span>POF Rental</span><span>HeliDubai</span><span>VIP Transfers</span><span>Luxury Travel</span></div>
            <ActionLink href={wa("Hello POF Rental, I want to ask about POF Rental x HeliDubai VIP transfers.")}>Plan VIP Transfer</ActionLink>
          </div>
          <div className="heli-media">
            <video className="heli-video" data-lazy-video="true" muted loop playsInline poster="/media/DSC07812.webp" preload="none">
              <source src="/media/helio.mp4" type="video/mp4" />
            </video>
          </div>
        </section>

        <section className="offers-section" id="offers">
          <p className="kicker">Signature daily rates</p>
          <h2>Three distinct arrivals, framed clearly.</h2>
          <div className="offer-runway">
            <div><Image alt="Ferrari Purosangue offer" height={1067} sizes="(max-width: 720px) 100vw, 34vw" src="/media/offer-purosangue-pof.webp" width={1600} /><span>Ferrari Purosangue</span><strong>AED 3,399/day</strong><small>V12 luxury SUV</small></div>
            <div><Image alt="Ferrari 12 Cilindri offer" height={1067} sizes="(max-width: 720px) 100vw, 34vw" src="/media/offer-ferrari12-pof.jpg" width={1600} /><span>Ferrari 12 Cilindri</span><strong>AED 3,399/day</strong><small>Front-engine theatre</small></div>
            <div><Image alt="Porsche 911 GT3 RS offer" height={1067} sizes="(max-width: 720px) 100vw, 34vw" src="/media/offer-porsche-web.webp" width={1600} /><span>Porsche 911 GT3 RS</span><strong>AED 1,899/day</strong><small>Track-bred precision</small></div>
          </div>
          <ActionLink href={wa("Hello POF Rental, I want to check availability and the current daily rate for one of the featured vehicles.")}>Check Availability</ActionLink>
        </section>

        <section className="faq-section" id="faq">
          <div className="section-copy-block">
            <p className="kicker">Before you message</p>
            <h2>Quick answers.</h2>
          </div>
          <div className="faq-list">
            {faqs.map(([question, answer], index) => (
              <div className="faq-item" key={question}>
                <button aria-controls={`faq-answer-${index}`} aria-expanded="false" className="faq-question" id={`faq-question-${index}`} type="button">{question}<span aria-hidden="true">+</span></button>
                <div aria-hidden="true" aria-labelledby={`faq-question-${index}`} className="faq-answer" id={`faq-answer-${index}`} role="region"><p>{answer}</p></div>
              </div>
            ))}
          </div>
        </section>
      </main>

      <footer className="footer">
        <div>
          <Image alt="POF Rental" height={120} src="/media/logo.png" width={360} />
          <p>Dubai's luxury car rental concierge for premium cars, monthly plans, airport delivery, and VIP journeys.</p>
        </div>
        <nav aria-label="Footer navigation">
          {navItems.map(([label, href]) => <a href={href} key={href}>{label}</a>)}
        </nav>
        <div>
          <a href="mailto:info@pofrental.com">info@pofrental.com</a>
          <a href={wa("Hello POF Rental, I would like help booking a luxury car in Dubai.")} rel="noreferrer" target="_blank">WhatsApp concierge</a>
        </div>
      </footer>

      <div aria-hidden="true" className="cursor-orbit" id="cursorOrbit"><span /><i /></div>

      <FloatingConcierge />

      <nav aria-label="Quick contact" className="quick-contact-dock">
        <a aria-label="Chat with POF Rental on WhatsApp" className="quick-contact-action quick-contact-whatsapp" href={wa("Hello POF Rental, I would like help choosing and booking a luxury car in Dubai.")} rel="noreferrer" target="_blank" title="Chat on WhatsApp">
          <UiIcon name="whatsapp" /><span>WhatsApp</span>
        </a>
        <a aria-label="Call POF Rental" className="quick-contact-action quick-contact-call" href={`tel:${contactPhone}`} title="Call POF Rental">
          <UiIcon name="phone" /><span>Call now</span>
        </a>
      </nav>

    </>
  );
}
