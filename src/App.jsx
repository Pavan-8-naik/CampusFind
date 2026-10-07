import { useEffect, useRef, useState } from 'react';

/* ================================================================== */
/*  DATA                                                               */
/* ================================================================== */

const CATEGORIES = [
  { id: 1, name: 'Student IDs & Wallets', icon: '💳', tag: 'Identity' },
  { id: 2, name: 'Laptops & Electronics', icon: '💻', tag: 'Electronics' },
  { id: 3, name: 'Keys & Keychains', icon: '🔑', tag: 'Personal' },
  { id: 4, name: 'Books & Notes', icon: '📚', tag: 'Academic' },
  { id: 5, name: 'Bottles & Tumblers', icon: '🍶', tag: 'Daily' },
  { id: 6, name: 'Backpacks & Bags', icon: '🎒', tag: 'Bags' },
];

const STEPS = [
  {
    step: '01',
    title: 'Report Your Item',
    description:
      'Submit an entry for lost personal property or found valuables with item descriptions and campus location details.',
  },
  {
    step: '02',
    title: 'Smart Categorization',
    description:
      'The platform indexes entries across campus categories and date filters to locate matching reports quickly.',
  },
  {
    step: '03',
    title: 'Safe Handoff',
    description:
      'Verify ownership through identity questions and reclaim belongings safely at campus helpdesks.',
  },
];

const SECTIONS = [
  { id: 'home', label: 'Home' },
  { id: 'about', label: 'About' },
  { id: 'report', label: 'Report' },
  { id: 'categories', label: 'Categories' },
];

/* ================================================================== */
/*  SMALL COMPONENTS                                                   */
/* ================================================================== */

/** Subtle reveal when content first enters the viewport. */
function Reveal({ children, delay = 0, variant = 'rise', className = '' }) {
  const ref = useRef(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setShown(true);
        io.disconnect();
      }
    }, {
      threshold: 0.12,
      rootMargin: '0px 0px -8% 0px',
    });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`rv rv-${variant} ${shown ? 'rv-in' : ''} ${className}`}
      style={{ transitionDelay: shown ? `${delay}ms` : '0ms' }}
    >
      {children}
    </div>
  );
}

/** Splits a sentence into words that pop in one by one. */
function Words({ text, className = '', start = 0 }) {
  return (
    <span className={className}>
      {text.split(' ').map((w, i) => (
        <span className="word-wrap" key={`${w}-${i}`}>
          <span className="word" style={{ animationDelay: `${start + i * 70}ms` }}>
            {w}&nbsp;
          </span>
        </span>
      ))}
    </span>
  );
}

/** Card with 3D mouse tilt + cursor spotlight. */
function TiltCard({ children, className = '', onClick, ...rest }) {
  const ref = useRef(null);

  const move = (e) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width;
    const y = (e.clientY - r.top) / r.height;
    el.style.setProperty('--mx', `${x * 100}%`);
    el.style.setProperty('--my', `${y * 100}%`);
    el.style.setProperty('--rx', `${(0.5 - y) * 12}deg`);
    el.style.setProperty('--ry', `${(x - 0.5) * 12}deg`);
  };
  const leave = () => {
    const el = ref.current;
    if (!el) return;
    el.style.setProperty('--rx', '0deg');
    el.style.setProperty('--ry', '0deg');
  };

  return (
    <div
      ref={ref}
      className={`tilt ${className}`}
      onMouseMove={move}
      onMouseLeave={leave}
      onClick={onClick}
      {...rest}
    >
      <div className="tilt-glow" />
      {children}
    </div>
  );
}

function SectionHead({ index, eyebrow, title, subtitle }) {
  return (
    <div className="head">
      <Reveal variant="rise">
        <div className="head-top">
          <span className="head-index">{index}</span>
          <span className="head-line" />
          <span className="eyebrow">{eyebrow}</span>
        </div>
      </Reveal>
      <Reveal variant="rise" delay={100}>
        <h2 className="head-title">{title}</h2>
      </Reveal>
      <Reveal variant="rise" delay={200}>
        <p className="head-sub">{subtitle}</p>
      </Reveal>
    </div>
  );
}

/* ================================================================== */
/*  APP                                                                */
/* ================================================================== */

export default function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [active, setActive] = useState(0);
  const [arrivalRequest, setArrivalRequest] = useState(null);
  const barRef = useRef(null);

  /* ---------- Scroll progress and active section ---------- */
  useEffect(() => {
    let ticking = false;

    const update = () => {
      ticking = false;
      const vh = window.innerHeight;
      const doc = document.documentElement;
      const max = doc.scrollHeight - doc.clientHeight;
      const pct = max > 0 ? window.scrollY / max : 0;

      if (barRef.current) barRef.current.style.transform = `scaleX(${pct})`;

      let best = 0;
      let bestDist = Infinity;

      document.querySelectorAll('[data-panel]').forEach((el, i) => {
        const r = el.getBoundingClientRect();
        const p = (r.top + r.height / 2 - vh / 2) / vh; // 0 = centred
        const dist = Math.abs(p);
        if (dist < bestDist) {
          bestDist = dist;
          best = i;
        }
      });

      setActive(best);
    };

    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    };

    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);

  useEffect(() => {
    if (!arrivalRequest) return undefined;
    const section = document.getElementById(arrivalRequest.id);
    const inner = section?.querySelector('.panel-inner');
    if (!section || !inner) return undefined;
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const animateArrival = () => {
      if (reducedMotion) return;
      inner.getAnimations().forEach((animation) => animation.cancel());
      inner.animate(
        [
          { opacity: 0.72, transform: 'translateY(22px) scale(0.985)' },
          { opacity: 1, transform: 'translateY(0) scale(1)' },
        ],
        { duration: 560, easing: 'cubic-bezier(0.2, 0.75, 0.25, 1)' },
      );
    };

    if (reducedMotion || Math.abs(section.getBoundingClientRect().top) < 2) {
      animateArrival();
      return undefined;
    }

    let finished = false;
    let timeoutId;
    const onScrollEnd = () => {
      if (finished) return;
      finished = true;
      window.clearTimeout(timeoutId);
      document.removeEventListener('scrollend', onScrollEnd);
      animateArrival();
    };

    document.addEventListener('scrollend', onScrollEnd, { once: true });
    timeoutId = window.setTimeout(onScrollEnd, 1200);
    return () => {
      window.clearTimeout(timeoutId);
      document.removeEventListener('scrollend', onScrollEnd);
    };
  }, [arrivalRequest]);

  const goTo = (id) => (e) => {
    e.preventDefault();
    setMenuOpen(false);
    const section = document.getElementById(id);
    if (!section) return;

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const panels = Array.from(document.querySelectorAll('[data-panel]'));
    const targetIndex = panels.indexOf(section);
    const direction = targetIndex >= active ? 1 : -1;
    section.scrollIntoView({
      behavior: reducedMotion ? 'auto' : 'smooth',
      block: 'start',
    });
    setArrivalRequest((previous) => ({
      id,
      direction,
      requestId: (previous?.requestId ?? 0) + 1,
    }));
  };

  const reportLost = () => alert("Routing to Rahul's Lost Form...");
  const reportFound = () => alert("Routing to Rahul's Found Form...");
  const openBrowse = (e) => {
    e.preventDefault();
    setMenuOpen(false);
    alert("Routes to Pavan's Browse page");
  };

  return (
    <div className="cf">
      <style>{css}</style>

      {/* ----- Progress ----- */}
      <div className="bar">
        <div className="bar-fill" ref={barRef} />
      </div>

      {/* ----- Floating pill nav ----- */}
      <header className="nav-wrap">
        <nav className="nav">
          <a href="#home" className="brand" onClick={goTo('home')}>
            <span className="brand-dot" />
            Campus<b>Find</b>
          </a>

          <div className="nav-links">
            {SECTIONS.map((s, i) => (
              <a
                key={s.id}
                href={`#${s.id}`}
                onClick={goTo(s.id)}
                className={active === i ? 'on' : ''}
              >
                {s.label}
              </a>
            ))}
            <a href="#browse" onClick={openBrowse}>
              Browse
            </a>
          </div>

          <div className="nav-cta">
            <button className="pill pill-ghost" onClick={reportLost}>
              Report Lost
            </button>
            <button className="pill pill-solid" onClick={reportFound}>
              Report Found
            </button>
          </div>

          <button
            className={`burger ${menuOpen ? 'open' : ''}`}
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle navigation menu"
            aria-expanded={menuOpen}
          >
            <span />
            <span />
          </button>
        </nav>

        <div className={`sheet ${menuOpen ? 'open' : ''}`}>
          {SECTIONS.map((s, i) => (
            <a
              key={s.id}
              href={`#${s.id}`}
              onClick={goTo(s.id)}
              className={active === i ? 'on' : ''}
            >
              <em>0{i + 1}</em> {s.label}
            </a>
          ))}
          <a href="#browse" onClick={openBrowse}>
            <em>05</em> Browse
          </a>
          <div className="sheet-cta">
            <button className="pill pill-ghost" onClick={reportLost}>
              Report Lost
            </button>
            <button className="pill pill-solid" onClick={reportFound}>
              Report Found
            </button>
          </div>
        </div>
      </header>

      {/* ----- Section counter ----- */}
      <div className="counter" aria-hidden="true">
        <span className="counter-now" key={active}>
          0{active + 1}
        </span>
        <span className="counter-line" />
        <span className="counter-total">0{SECTIONS.length}</span>
      </div>

      {/* ----- Section rail ----- */}
      <div className="rail">
        {SECTIONS.map((s, i) => (
          <a
            key={s.id}
            href={`#${s.id}`}
            onClick={goTo(s.id)}
            className={active === i ? 'on' : ''}
            aria-label={s.label}
          >
            <span>{s.label}</span>
          </a>
        ))}
      </div>

      <main>
        {/* ============================ HOME ============================ */}
        <section id="home" className="panel home-panel" data-panel>
          <div className="panel-inner hero">
            <Reveal variant="pop">
              <span className="chip">
                <i className="chip-dot" /> Smart Campus Lost &amp; Found
              </span>
            </Reveal>

            <h1 className="hero-title">
              <Words text="Lost Something" start={150} />
              <br />
              <Words text="on Campus?" start={380} />
              <br />
              <Words text="We’ll Help You Find It." className="grad" start={620} />
            </h1>

            <Reveal variant="rise" delay={900}>
              <p className="hero-sub">
                The centralized platform for students and faculty. Report misplaced items, browse
                found valuables across campus blocks, and reconnect with your belongings
                seamlessly.
              </p>
            </Reveal>

            <Reveal variant="rise" delay={1050}>
              <div className="hero-cta">
                <button className="glow-btn glow-red" onClick={reportLost}>
                  <span>Report Lost Item</span>
                </button>
                <button className="glow-btn glow-green" onClick={reportFound}>
                  <span>Report Found Item</span>
                </button>
              </div>
            </Reveal>

          </div>
        </section>

        {/* ============================ ABOUT ============================ */}
        <section id="about" className="panel" data-panel>
          <div className="panel-inner">
            <div className="container">
              <SectionHead
                index="01"
                eyebrow="How it works"
                title="About CampusFind"
                subtitle="Simple, transparent, and built for rapid campus recovery"
              />

              <div className="steps">
                {STEPS.map((s, i) => (
                  <Reveal key={s.step} variant={i === 0 ? 'left' : i === 2 ? 'right' : 'rise'} delay={i * 140}>
                    <TiltCard className="glass step">
                      <span className="step-num">{s.step}</span>
                      <h3>{s.title}</h3>
                      <p>{s.description}</p>
                      <span className="step-bar" />
                    </TiltCard>
                  </Reveal>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ============================ REPORT ============================ */}
        <section id="report" className="panel" data-panel>
          <div className="panel-inner">
            <div className="container">
              <SectionHead
                index="02"
                eyebrow="Get started"
                title="Report an Item"
                subtitle="Tell us what you lost or what you found — it takes less than a minute"
              />

              <div className="duo">
                <Reveal variant="left">
                  <TiltCard className="glass duo-card duo-red">
                    <div className="duo-icon">🔍</div>
                    <h3>I Lost Something</h3>
                    <p>
                      Describe your item and where you last saw it so finders and campus staff can
                      match it to your report.
                    </p>
                    <button className="glow-btn glow-red" onClick={reportLost}>
                      <span>Report Lost Item →</span>
                    </button>
                  </TiltCard>
                </Reveal>

                <Reveal variant="right" delay={140}>
                  <TiltCard className="glass duo-card duo-green">
                    <div className="duo-icon">🎁</div>
                    <h3>I Found Something</h3>
                    <p>
                      Post the item details and drop-off location so the rightful owner can verify
                      and reclaim it safely.
                    </p>
                    <button className="glow-btn glow-green" onClick={reportFound}>
                      <span>Report Found Item →</span>
                    </button>
                  </TiltCard>
                </Reveal>
              </div>
            </div>
          </div>
        </section>

        {/* ============================ CATEGORIES ============================ */}
        <section id="categories" className="panel" data-panel>
          <div className="panel-inner">
            <div className="container">
              <SectionHead
                index="03"
                eyebrow="Explore"
                title="Browse by Category"
                subtitle="Select an item type to explore campus listings"
              />

              <div className="cats">
                {CATEGORIES.map((c, i) => (
                  <Reveal key={c.id} variant="pop" delay={(i % 3) * 100 + Math.floor(i / 3) * 140}>
                    <TiltCard
                      className="glass cat"
                      role="button"
                      tabIndex={0}
                      onClick={() => alert(`Filtering category by: "${c.name}"`)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          alert(`Filtering category by: "${c.name}"`);
                        }
                      }}
                    >
                      <span className="cat-icon">{c.icon}</span>
                      <span className="cat-text">
                        <b>{c.name}</b>
                        <small>{c.tag}</small>
                      </span>
                      <span className="cat-go">↗</span>
                    </TiltCard>
                  </Reveal>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* ============================ FOOTER ============================ */}
      <footer className="foot">
        <div className="container">
          <div className="foot-grid">
            <div>
              <div className="foot-brand">
                Campus<b>Find</b>
              </div>
              <p className="foot-about">
                Dedicated university community network designed to streamline lost property
                recovery across campus grounds.
              </p>
            </div>

            <div>
              <h4>Quick Links</h4>
              <ul>
                {SECTIONS.map((s) => (
                  <li key={s.id}>
                    <a href={`#${s.id}`} onClick={goTo(s.id)}>
                      {s.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4>Campus Safety</h4>
              <ul>
                <li>Main Security Desk (Ground Floor)</li>
                <li>Student Verification Required</li>
              </ul>
            </div>
          </div>

          <div className="foot-bottom">
            &copy; {new Date().getFullYear()} CampusFind. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}

/* ================================================================== */
/*  STYLES                                                             */
/* ================================================================== */

const css = `
@import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Syne:wght@600;700;800&display=swap');

:root {
  --bg: #fffaf5;
  --ink: #29231f;
  --mute: #746960;
  --line: rgba(124,65,29,.16);
  --glass: rgba(255,255,255,.88);
  --cyan: #f97316;
  --violet: #ea580c;
  --pink: #fdba74;
  --green: #f97316;
  --red: #ea580c;
}

* { box-sizing: border-box; }
html { scroll-behavior: smooth; }
body { margin: 0; background: var(--bg); }

.cf {
  font-family: 'Space Grotesk', system-ui, sans-serif;
  color: var(--ink);
  background: var(--bg);
  position: relative;
  overflow-x: clip;
  -webkit-font-smoothing: antialiased;
}
.container { width: 100%; max-width: 1160px; margin: 0 auto; padding: 0 1.4rem; }

/* ===================== CHROME ===================== */
.bar { position: fixed; top: 0; left: 0; right: 0; height: 3px; z-index: 1200; }
.bar-fill {
  height: 100%; width: 100%; transform-origin: 0 50%; transform: scaleX(0);
  background: linear-gradient(90deg, var(--cyan), var(--violet), var(--pink));
  box-shadow: 0 0 14px rgba(234,88,12,.32);
}

.nav-wrap { position: fixed; top: 14px; left: 0; right: 0; z-index: 1100; padding: 0 1rem; display: flex; flex-direction: column; align-items: center; gap: .6rem; }
.nav {
  width: 100%; max-width: 1060px; display: flex; align-items: center; justify-content: space-between; gap: 1rem;
  padding: .55rem .65rem .55rem 1.2rem; border-radius: 999px;
  background: rgba(255,255,255,.92); border: 1px solid var(--line);
  backdrop-filter: blur(18px) saturate(160%); -webkit-backdrop-filter: blur(18px) saturate(160%);
  box-shadow: 0 10px 40px rgba(124,65,29,.12), inset 0 1px 0 rgba(255,255,255,.9);
}
.brand { display: inline-flex; align-items: center; gap: .55rem; text-decoration: none; color: var(--ink); font-family: 'Syne', sans-serif; font-weight: 700; font-size: 1.2rem; letter-spacing: -.01em; }
.brand b { background: linear-gradient(90deg, var(--cyan), var(--violet)); -webkit-background-clip: text; background-clip: text; color: transparent; }
.brand-dot { width: 12px; height: 12px; border-radius: 50%; background: conic-gradient(from 0deg, var(--cyan), var(--violet), var(--pink), var(--cyan)); animation: spin 5s linear infinite; box-shadow: 0 0 14px rgba(249,115,22,.35); }
@keyframes spin { to { transform: rotate(360deg); } }

.nav-links { display: flex; align-items: center; gap: .15rem; }
.nav-links a { text-decoration: none; color: var(--mute); font-size: .9rem; font-weight: 500; padding: .5rem .95rem; border-radius: 999px; transition: color .25s, background .25s; }
.nav-links a:hover { color: var(--ink); background: rgba(255,255,255,.06); }
.nav-links a.on { color: #9a3412; background: rgba(249,115,22,.12); box-shadow: inset 0 0 0 1px rgba(234,88,12,.2); }

.nav-cta { display: flex; gap: .5rem; }
.pill { font-family: inherit; font-weight: 600; font-size: .86rem; padding: .62rem 1.15rem; border-radius: 999px; cursor: pointer; transition: transform .2s, box-shadow .25s, background .25s; }
.pill:active { transform: scale(.96); }
.pill-ghost { color: var(--ink); background: transparent; border: 1px solid var(--line); }
.pill-ghost:hover { background: rgba(255,255,255,.08); }
.pill-solid { color: #fff; border: none; background: linear-gradient(135deg, #f97316, #ea580c); box-shadow: 0 6px 22px rgba(234,88,12,.24); }
.pill-solid:hover { transform: translateY(-1px); box-shadow: 0 10px 28px rgba(234,88,12,.32); }

.burger { display: none; width: 42px; height: 42px; border-radius: 50%; border: 1px solid var(--line); background: rgba(255,255,255,.05); cursor: pointer; position: relative; }
.burger span { position: absolute; left: 12px; right: 12px; height: 2px; border-radius: 2px; background: var(--ink); transition: transform .3s, top .3s; }
.burger span:nth-child(1) { top: 16px; }
.burger span:nth-child(2) { top: 24px; }
.burger.open span:nth-child(1) { top: 20px; transform: rotate(45deg); }
.burger.open span:nth-child(2) { top: 20px; transform: rotate(-45deg); }

.sheet {
  display: none; width: 100%; max-width: 1060px; flex-direction: column; gap: .2rem;
  border-radius: 24px; border: 1px solid var(--line); background: rgba(255,255,255,.97);
  backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px);
  max-height: 0; overflow: hidden; opacity: 0; padding: 0 1rem;
  transition: max-height .4s ease, opacity .3s ease, padding .3s ease;
}
.sheet.open { max-height: 480px; opacity: 1; padding: 1rem; }
.sheet a { color: var(--ink); text-decoration: none; font-weight: 600; padding: .8rem .9rem; border-radius: 14px; display: flex; gap: .8rem; align-items: baseline; }
.sheet a em { font-style: normal; font-size: .75rem; color: var(--cyan); }
.sheet a.on { color: #9a3412; background: rgba(249,115,22,.12); }
.sheet-cta { display: flex; gap: .6rem; margin-top: .5rem; }
.sheet-cta .pill { flex: 1; }

.counter { position: fixed; left: 28px; bottom: 28px; z-index: 900; display: flex; align-items: center; gap: .7rem; font-family: 'Syne', sans-serif; }
.counter-now { font-size: 2.2rem; font-weight: 800; background: linear-gradient(180deg, #f97316, #c2410c); -webkit-background-clip: text; background-clip: text; color: transparent; animation: tick .5s cubic-bezier(.2,.9,.3,1); }
@keyframes tick { from { transform: translateY(14px); opacity: 0; } to { transform: none; opacity: 1; } }
.counter-line { width: 38px; height: 1px; background: var(--line); }
.counter-total { color: var(--mute); font-size: .95rem; }

.rail { position: fixed; right: 26px; top: 50%; transform: translateY(-50%); z-index: 900; display: flex; flex-direction: column; gap: 18px; align-items: flex-end; }
.rail a { position: relative; display: block; width: 26px; height: 3px; border-radius: 3px; background: rgba(124,65,29,.22); transition: width .35s cubic-bezier(.2,.9,.3,1), background .3s; }
.rail a span { position: absolute; right: 40px; top: 50%; transform: translateY(-50%) translateX(8px); font-size: .75rem; color: var(--ink); background: rgba(255,255,255,.96); border: 1px solid var(--line); padding: .25rem .6rem; border-radius: 8px; opacity: 0; pointer-events: none; white-space: nowrap; transition: .25s; }
.rail a:hover span { opacity: 1; transform: translateY(-50%); }
.rail a:hover { background: rgba(255,255,255,.5); }
.rail a.on { width: 46px; background: linear-gradient(90deg, #f97316, #ea580c); box-shadow: 0 0 12px rgba(234,88,12,.3); }

/* ===================== PANELS ===================== */
main { position: relative; z-index: 2; }
.panel {
  min-height: 100vh; min-height: 100svh;
  display: flex; align-items: center; justify-content: center;
  padding: 7rem 0 4rem; position: relative;
}
.panel-inner { width: 100%; }

/* ===================== HEADINGS ===================== */
.head { text-align: center; margin-bottom: 3.2rem; }
.head-top { display: inline-flex; align-items: center; gap: .9rem; margin-bottom: 1.1rem; }
.head-index { font-family: 'Syne', sans-serif; font-size: .95rem; color: var(--cyan); font-weight: 700; }
.head-line { width: 44px; height: 1px; background: linear-gradient(90deg, var(--cyan), transparent); }
.eyebrow { font-size: .78rem; text-transform: uppercase; letter-spacing: .22em; color: var(--mute); font-weight: 600; }
.head-title { font-family: 'Syne', sans-serif; font-size: clamp(2.2rem, 5.2vw, 4rem); font-weight: 800; letter-spacing: -.03em; line-height: 1.05; margin: 0 0 .9rem;
  background: none; color: var(--ink); }
.head-sub { color: var(--mute); font-size: 1.1rem; max-width: 560px; margin: 0 auto; line-height: 1.6; }

/* ===================== REVEALS ===================== */
.rv { opacity: 0; transform: translateY(24px); transition: opacity .65s ease, transform .65s cubic-bezier(.2,.75,.25,1); }
.rv-rise { transform: translateY(24px); }
.rv-left { transform: translateX(-18px); }
.rv-right { transform: translateX(18px); }
.rv-pop { transform: translateY(14px) scale(.97); }
.rv-in { opacity: 1; transform: none; }

/* ===================== HERO ===================== */
.hero { text-align: center; padding: 0 1.4rem; max-width: 1000px; margin: 0 auto; position: relative; }
.chip { display: inline-flex; align-items: center; gap: .6rem; padding: .5rem 1.1rem; border-radius: 999px; font-size: .8rem; font-weight: 600; letter-spacing: .1em; text-transform: uppercase; color: #9a3412; background: rgba(249,115,22,.1); border: 1px solid rgba(234,88,12,.24); margin-bottom: 1.8rem; }
.chip-dot { width: 8px; height: 8px; border-radius: 50%; background: var(--cyan); box-shadow: 0 0 0 0 rgba(249,115,22,.4); animation: ping 1.8s infinite; }
@keyframes ping { 70% { box-shadow: 0 0 0 10px rgba(249,115,22,0); } 100% { box-shadow: 0 0 0 0 rgba(249,115,22,0); } }

.hero-title { font-family: 'Syne', sans-serif; font-weight: 800; letter-spacing: -.04em; line-height: 1.02; font-size: clamp(2.5rem, 7vw, 5.2rem); color: #7c2d12; margin: 0 0 1.6rem; }
.word-wrap { display: inline-block; overflow: hidden; vertical-align: top; padding-bottom: .12em; }
.word { display: inline-block; transform: translateY(110%) rotate(6deg); opacity: 0; animation: wordUp .9s cubic-bezier(.2,.9,.25,1) forwards; }
@keyframes wordUp { to { transform: none; opacity: 1; } }
.grad { background: linear-gradient(100deg, var(--cyan), var(--violet) 45%, var(--pink) 75%, var(--cyan)); background-size: 220% auto; -webkit-background-clip: text; background-clip: text; color: transparent; animation: flow 6s linear infinite; }
.grad .word { animation: wordUp .9s cubic-bezier(.2,.9,.25,1) forwards; }
@keyframes flow { to { background-position: 220% center; } }

.hero-sub { font-size: clamp(1rem, 1.6vw, 1.25rem); color: var(--mute); line-height: 1.7; max-width: 680px; margin: 0 auto 2.4rem; }
.hero-cta { display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap; }

.glow-btn { position: relative; font-family: inherit; font-weight: 700; font-size: 1rem; color: #fff; border: none; cursor: pointer; border-radius: 16px; padding: 1rem 2rem; isolation: isolate; transition: transform .25s, box-shadow .3s; }
.glow-btn span { position: relative; z-index: 2; }
.glow-btn::before { content: ''; position: absolute; inset: -2px; border-radius: 18px; z-index: -2; background: conic-gradient(from var(--a, 0deg), transparent 0 60%, #fff 85%, transparent); animation: rot 3.2s linear infinite; opacity: .75; }
.glow-btn::after { content: ''; position: absolute; inset: 0; border-radius: 16px; z-index: -1; }
@property --a { syntax: '<angle>'; inherits: false; initial-value: 0deg; }
@keyframes rot { to { --a: 360deg; } }
.glow-red::after   { background: linear-gradient(135deg, #f97316, #c2410c); }
.glow-green::after { background: linear-gradient(135deg, #fb923c, #ea580c); }
.glow-red   { box-shadow: 0 12px 34px rgba(234,88,12,.28); }
.glow-green { box-shadow: 0 12px 34px rgba(234,88,12,.22); }
.glow-btn:hover { transform: translateY(-4px) scale(1.03); }
.glow-red:hover, .glow-green:hover { box-shadow: 0 18px 46px rgba(234,88,12,.34); }
.glow-btn:active { transform: scale(.97); }

/* ===================== GLASS + TILT ===================== */
.glass { background: var(--glass); border: 1px solid var(--line); backdrop-filter: blur(16px) saturate(150%); -webkit-backdrop-filter: blur(16px) saturate(150%); box-shadow: 0 20px 50px rgba(124,65,29,.09), inset 0 1px 0 rgba(255,255,255,.95); }
.tilt { position: relative; overflow: hidden; border-radius: 24px; transform: perspective(900px) rotateX(var(--rx, 0deg)) rotateY(var(--ry, 0deg)); transition: transform .25s ease-out, border-color .3s, box-shadow .3s; transform-style: preserve-3d; }
.tilt:hover { border-color: rgba(234,88,12,.35); box-shadow: 0 30px 70px rgba(124,65,29,.14), inset 0 1px 0 rgba(255,255,255,.95); }
.tilt-glow { position: absolute; inset: 0; pointer-events: none; opacity: 0; transition: opacity .3s; background: radial-gradient(420px circle at var(--mx, 50%) var(--my, 50%), rgba(249,115,22,.12), transparent 45%); }
.tilt:hover .tilt-glow { opacity: 1; }
.tilt > *:not(.tilt-glow) { position: relative; z-index: 1; }

/* ===================== ABOUT ===================== */
.steps { display: grid; grid-template-columns: repeat(auto-fit, minmax(270px, 1fr)); gap: 1.6rem; }
.step { height: 100%; padding: 2.3rem 2rem 2.6rem; }
.step-num { display: block; font-family: 'Syne', sans-serif; font-weight: 800; font-size: 4.2rem; line-height: 1; margin-bottom: 1.1rem; color: transparent; -webkit-text-stroke: 1.5px rgba(234,88,12,.48); transition: -webkit-text-stroke-color .3s, color .3s; }
.step:hover .step-num { color: rgba(249,115,22,.12); -webkit-text-stroke-color: var(--cyan); }
.step h3 { font-family: 'Syne', sans-serif; font-size: 1.45rem; margin: 0 0 .7rem; letter-spacing: -.01em; }
.step p { margin: 0; color: var(--mute); line-height: 1.7; font-size: .98rem; }
.step-bar { position: absolute !important; left: 0; bottom: 0; height: 3px; width: 0; background: linear-gradient(90deg, var(--cyan), var(--violet), var(--pink)); transition: width .5s ease; }
.step:hover .step-bar { width: 100%; }

/* ===================== REPORT ===================== */
.duo { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 1.8rem; max-width: 980px; margin: 0 auto; }
.duo-card { height: 100%; padding: 2.6rem 2.3rem; display: flex; flex-direction: column; align-items: flex-start; gap: .5rem; }
.duo-red   { background: linear-gradient(160deg, rgba(251,113,133,.16), rgba(255,255,255,.04) 60%); border-color: rgba(251,113,133,.3); }
.duo-green { background: linear-gradient(160deg, rgba(52,211,153,.16), rgba(255,255,255,.04) 60%); border-color: rgba(52,211,153,.3); }
.duo-icon { font-size: 2.2rem; width: 68px; height: 68px; display: grid; place-items: center; border-radius: 20px; background: rgba(255,255,255,.08); border: 1px solid var(--line); margin-bottom: .9rem; transition: transform .4s; }
.duo-card:hover .duo-icon { transform: translateZ(40px) rotate(-10deg) scale(1.1); }
.duo-card h3 { font-family: 'Syne', sans-serif; font-size: 1.7rem; margin: 0; letter-spacing: -.02em; }
.duo-card p { margin: 0 0 1.5rem; color: var(--mute); line-height: 1.7; }
.duo-card .glow-btn { margin-top: auto; }

/* ===================== CATEGORIES ===================== */
.cats { display: grid; grid-template-columns: repeat(auto-fit, minmax(290px, 1fr)); gap: 1.2rem; }
.cat { height: 100%; display: flex; align-items: center; gap: 1.1rem; padding: 1.3rem 1.4rem; cursor: pointer; outline: none; border-radius: 20px; }
.cat:focus-visible { border-color: var(--cyan); }
.cat-icon { flex-shrink: 0; width: 60px; height: 60px; display: grid; place-items: center; font-size: 1.9rem; border-radius: 18px; background: linear-gradient(135deg, rgba(249,115,22,.12), rgba(251,146,60,.08)); border: 1px solid var(--line); transition: transform .4s cubic-bezier(.2,.9,.3,1.4); }
.cat:hover .cat-icon { transform: translateZ(30px) scale(1.18) rotate(-8deg); }
.cat-text { display: flex; flex-direction: column; gap: .35rem; flex: 1; }
.cat-text b { font-size: 1.02rem; font-weight: 600; }
.cat-text small { align-self: flex-start; font-size: .7rem; letter-spacing: .08em; text-transform: uppercase; color: #9a3412; background: rgba(249,115,22,.1); padding: .2rem .6rem; border-radius: 999px; }
.cat-go { font-size: 1.3rem; color: var(--cyan); opacity: 0; transform: translate(-8px, 8px); transition: .3s; }
.cat:hover .cat-go { opacity: 1; transform: none; }

/* ===================== FOOTER ===================== */
.foot { position: relative; z-index: 2; padding: 4rem 0 2rem; background: #fff4e8; border-top: 1px solid var(--line); }
.foot-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 2.5rem; padding-bottom: 2.4rem; border-bottom: 1px solid var(--line); }
.foot-brand { font-family: 'Syne', sans-serif; font-weight: 800; font-size: 1.5rem; }
.foot-brand b { background: linear-gradient(90deg, var(--cyan), var(--violet)); -webkit-background-clip: text; background-clip: text; color: transparent; }
.foot-about { color: var(--mute); line-height: 1.7; font-size: .93rem; max-width: 340px; margin: .8rem 0 0; }
.foot h4 { margin: 0 0 1rem; font-size: .8rem; letter-spacing: .16em; text-transform: uppercase; color: #fff; }
.foot ul { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: .6rem; color: var(--mute); font-size: .93rem; }
.foot a { color: var(--mute); text-decoration: none; transition: color .2s, padding-left .2s; }
.foot a:hover { color: var(--cyan); padding-left: 5px; }
.foot-bottom { text-align: center; padding-top: 1.8rem; color: #746960; font-size: .85rem; }

/* ===================== RESPONSIVE ===================== */
@media (max-width: 1180px) { .rail { display: none; } }

@media (max-width: 900px) {
  .nav-links, .nav-cta { display: none; }
  .burger { display: block; }
  .sheet { display: flex; }
  .counter { left: 16px; bottom: 16px; }
  .counter-now { font-size: 1.6rem; }
  .panel { padding: 6.5rem 0 3.5rem; }
}

@media (max-width: 520px) {
  .glow-btn { width: 100%; }
  .hero-cta { flex-direction: column; }
}

@media (prefers-reduced-motion: reduce) {
  html { scroll-behavior: auto; }
  .rv { opacity: 1; transform: none; transition: none; }
  .word { animation: none; transform: none; opacity: 1; }
  .orb, .grad, .glow-btn::before, .brand-dot, .chip-dot { animation: none; }
}

.home-panel {
  isolation: isolate;
  background:
    linear-gradient(90deg, rgba(255,250,245,.96) 0%, rgba(255,250,245,.88) 42%, rgba(255,250,245,.3) 100%),
    linear-gradient(0deg, rgba(255,250,245,.3), transparent 35%),
    url('/reva-campus-background.png') center / cover no-repeat;
}
.home-panel > .panel-inner { z-index: 1; }
.nav {
  background: rgba(255,255,255,.92);
  box-shadow: 0 10px 40px rgba(91,49,20,.12), inset 0 1px 0 rgba(255,255,255,.9);
}
.nav-links a {
  position: relative;
  transition: color .22s ease, background .22s ease, transform .22s ease;
}
.nav-links a::after {
  content: '';
  position: absolute;
  left: 50%;
  right: 50%;
  bottom: 4px;
  height: 2px;
  border-radius: 2px;
  background: linear-gradient(90deg, #f97316, #ea580c);
  transition: left .22s ease, right .22s ease;
}
.nav-links a:hover, .nav-links a:focus-visible {
  color: #9a3412;
  background: rgba(249,115,22,.09);
  transform: translateY(-2px);
}
.nav-links a:hover::after, .nav-links a:focus-visible::after {
  left: 1rem;
  right: 1rem;
}
.pill-ghost:hover { background: rgba(249,115,22,.09); }
.nav-links a.on { color: #9a3412; background: rgba(249,115,22,.12); box-shadow: inset 0 0 0 1px rgba(249,115,22,.18); }
.sheet a { transition: color .2s ease, background .2s ease, transform .2s ease; }
.sheet a:hover, .sheet a:focus-visible {
  color: #9a3412;
  background: rgba(249,115,22,.1);
  transform: translateX(4px);
}
.pill-solid { color: #fff; background: linear-gradient(135deg, #f97316, #ea580c); box-shadow: 0 6px 22px rgba(234,88,12,.24); }
.pill-solid:hover { box-shadow: 0 10px 28px rgba(234,88,12,.32); }
.burger { background: rgba(255,255,255,.9); }
.sheet { background: rgba(255,255,255,.97); box-shadow: 0 18px 40px rgba(91,49,20,.12); }
.sheet a.on { background: rgba(249,115,22,.1); }
.counter-now { background: linear-gradient(180deg, #f97316, #c2410c); -webkit-background-clip: text; background-clip: text; }
.rail a { background: rgba(124,65,29,.22); }
.rail a span { background: rgba(255,255,255,.96); }
.rail a:hover { background: rgba(124,65,29,.45); }
.rail a.on { background: linear-gradient(90deg, #f97316, #ea580c); box-shadow: 0 0 12px rgba(234,88,12,.3); }
.head-title { background: none; color: var(--ink); }
.chip { color: #9a3412; background: rgba(249,115,22,.1); border-color: rgba(234,88,12,.24); }
.chip-dot { background: #f97316; box-shadow: 0 0 0 0 rgba(249,115,22,.35); }
.grad { background: linear-gradient(100deg, #f97316, #c2410c 55%, #fb923c); background-size: 220% auto; -webkit-background-clip: text; background-clip: text; }
.glow-red::after { background: linear-gradient(135deg, #f97316, #c2410c); }
.glow-green::after { background: linear-gradient(135deg, #fff, #fff7ed); }
.glow-green { color: #c2410c; box-shadow: 0 12px 34px rgba(234,88,12,.13); }
.glow-red { box-shadow: 0 12px 34px rgba(234,88,12,.25); }
.glass { background: rgba(255,255,255,.9); box-shadow: 0 20px 50px rgba(91,49,20,.09), inset 0 1px 0 rgba(255,255,255,.95); }
.tilt:hover { border-color: rgba(234,88,12,.35); box-shadow: 0 30px 70px rgba(124,65,29,.14), inset 0 1px 0 rgba(255,255,255,.95); }
.cat:hover { transform: perspective(900px) translateY(-5px) rotateX(var(--rx, 0deg)) rotateY(var(--ry, 0deg)); }
.cat:hover .cat-go { opacity: 1; transform: translate(0, 0); }
.tilt-glow { background: radial-gradient(420px circle at var(--mx, 50%) var(--my, 50%), rgba(249,115,22,.12), transparent 45%); }
.step-num { -webkit-text-stroke-color: rgba(234,88,12,.55); }
.step:hover .step-num { color: rgba(249,115,22,.12); -webkit-text-stroke-color: #f97316; }
.step-bar { background: linear-gradient(90deg, #f97316, #fb923c); }
.duo-red { background: linear-gradient(160deg, rgba(249,115,22,.12), rgba(255,255,255,.9) 65%); border-color: rgba(234,88,12,.22); }
.duo-green { background: linear-gradient(160deg, rgba(255,247,237,.98), rgba(255,255,255,.9) 65%); border-color: rgba(234,88,12,.18); }
.duo-icon { background: rgba(249,115,22,.08); }
.cat:focus-visible { border-color: #f97316; }
.cat-icon { background: linear-gradient(135deg, rgba(249,115,22,.12), rgba(251,146,60,.08)); }
.cat-text small { color: #9a3412; background: rgba(249,115,22,.1); }
.cat-go { color: #ea580c; }
.foot { background: #fff4e8; }
.foot-brand b { background: linear-gradient(90deg, #f97316, #c2410c); -webkit-background-clip: text; background-clip: text; }
.foot h4 { color: #29231f; }
.foot-bottom { color: #746960; }
.bar-fill { box-shadow: 0 0 14px rgba(234,88,12,.32); }
.brand b, .foot-brand b { background: linear-gradient(90deg, #f97316, #c2410c); -webkit-background-clip: text; background-clip: text; }
.nav-links a.on { background: rgba(249,115,22,.12); box-shadow: inset 0 0 0 1px rgba(234,88,12,.2); }
.pill-solid { background: linear-gradient(135deg, #f97316, #ea580c); }
.sheet a.on { color: #9a3412; background: rgba(249,115,22,.12); }
.counter-now { background: linear-gradient(180deg, #f97316, #c2410c); -webkit-background-clip: text; background-clip: text; }
.rail a.on { background: linear-gradient(90deg, #f97316, #ea580c); box-shadow: 0 0 12px rgba(234,88,12,.3); }
.glow-green { color: #29231f; box-shadow: 0 12px 34px rgba(234,88,12,.22); }
.glow-red:hover, .glow-green:hover { box-shadow: 0 18px 46px rgba(234,88,12,.34); }
.duo-red, .duo-green { background: linear-gradient(160deg, rgba(249,115,22,.12), rgba(255,255,255,.92) 65%); border-color: rgba(234,88,12,.2); }
`;