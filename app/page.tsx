"use client";

import { FormEvent, useEffect, useRef, useState } from "react";

const contactEmail = "enerjadezn@gmail.com";

const capabilities = [
  {
    index: "01",
    title: "AI operations",
    body: "Automate the repetitive work draining your team’s attention—without losing oversight, judgement, or control.",
    signal: "TIME / RETURNED",
  },
  {
    index: "02",
    title: "Data clarity",
    body: "Turn scattered information into one clear view of what is happening, why it matters, and what to do next.",
    signal: "SIGNAL / FOUND",
  },
  {
    index: "03",
    title: "Performance systems",
    body: "Build faster workflows, sharper tools, and dependable infrastructure around how your business actually moves.",
    signal: "MOMENTUM / BUILT",
  },
  {
    index: "04",
    title: "Operational freedom",
    body: "Reduce dependence on manual effort and give your people the capacity to think, create, and grow.",
    signal: "CAPACITY / OPEN",
  },
];

const process = [
  {
    step: "01",
    title: "Understand",
    body: "Find the friction, constraints, and real opportunity.",
  },
  {
    step: "02",
    title: "Architect",
    body: "Shape the right workflow, intelligence, and interface.",
  },
  {
    step: "03",
    title: "Build",
    body: "Create a refined system your team can trust and use.",
  },
  {
    step: "04",
    title: "Evolve",
    body: "Measure what matters and improve it as you grow.",
  },
];

function SignalField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    if (!canvas || !context) return;

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const points = [
      [0.12, 0.22, 2.4],
      [0.27, 0.13, 1.5],
      [0.44, 0.28, 2],
      [0.7, 0.14, 1.4],
      [0.86, 0.31, 2.6],
      [0.17, 0.54, 1.4],
      [0.36, 0.48, 2.8],
      [0.61, 0.49, 1.7],
      [0.8, 0.61, 2.1],
      [0.24, 0.83, 2],
      [0.48, 0.72, 1.4],
      [0.68, 0.87, 2.5],
      [0.91, 0.81, 1.3],
    ];
    let width = 0;
    let height = 0;
    let frame = 0;
    let raf = 0;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      width = rect.width;
      height = rect.height;
      canvas.width = Math.floor(width * ratio);
      canvas.height = Math.floor(height * ratio);
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
    };

    const draw = () => {
      context.clearRect(0, 0, width, height);
      const time = reduceMotion ? 0 : frame * 0.008;

      context.strokeStyle = "rgba(223, 255, 112, 0.09)";
      context.lineWidth = 1;
      for (let x = 0; x < width; x += 42) {
        context.beginPath();
        context.moveTo(x, 0);
        context.lineTo(x, height);
        context.stroke();
      }
      for (let y = 0; y < height; y += 42) {
        context.beginPath();
        context.moveTo(0, y);
        context.lineTo(width, y);
        context.stroke();
      }

      points.forEach((point, index) => {
        const x = point[0] * width + Math.sin(time + index) * 4;
        const y = point[1] * height + Math.cos(time * 0.8 + index) * 4;

        points.slice(index + 1).forEach((other, otherIndex) => {
          const targetIndex = index + otherIndex + 1;
          const targetX =
            other[0] * width + Math.sin(time + targetIndex) * 4;
          const targetY =
            other[1] * height +
            Math.cos(time * 0.8 + targetIndex) * 4;
          const distance = Math.hypot(targetX - x, targetY - y);
          if (distance < Math.min(width, height) * 0.34) {
            context.strokeStyle =
              "rgba(235, 238, 228, " +
              String(0.16 * (1 - distance / (Math.min(width, height) * 0.34))) +
              ")";
            context.beginPath();
            context.moveTo(x, y);
            context.lineTo(targetX, targetY);
            context.stroke();
          }
        });

        context.fillStyle =
          index === 6 || index === 11 ? "#dfff70" : "rgba(239, 242, 233, .72)";
        context.beginPath();
        context.arc(x, y, point[2], 0, Math.PI * 2);
        context.fill();
      });

      const orbitX = width * 0.52;
      const orbitY = height * 0.53;
      const orbitRadius = Math.min(width, height) * 0.2;
      context.strokeStyle = "rgba(223, 255, 112, .28)";
      context.beginPath();
      context.arc(orbitX, orbitY, orbitRadius, 0, Math.PI * 2);
      context.stroke();

      const pulseX = orbitX + Math.cos(time * 2) * orbitRadius;
      const pulseY = orbitY + Math.sin(time * 2) * orbitRadius;
      context.shadowBlur = 18;
      context.shadowColor = "#dfff70";
      context.fillStyle = "#dfff70";
      context.beginPath();
      context.arc(pulseX, pulseY, 4, 0, Math.PI * 2);
      context.fill();
      context.shadowBlur = 0;

      frame += 1;
      if (!reduceMotion) raf = requestAnimationFrame(draw);
    };

    const observer = new ResizeObserver(() => {
      resize();
      if (reduceMotion) draw();
    });
    observer.observe(canvas);
    resize();
    draw();

    return () => {
      observer.disconnect();
      cancelAnimationFrame(raf);
    };
  }, []);

  return <canvas ref={canvasRef} className="signal-canvas" aria-hidden="true" />;
}

export default function Home() {
  const [emailOpened, setEmailOpened] = useState(false);

  useEffect(() => {
    document.documentElement.classList.add("js-ready");
    const items = Array.from(document.querySelectorAll<HTMLElement>(".reveal"));
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 },
    );
    items.forEach((item) => observer.observe(item));
    return () => {
      observer.disconnect();
      document.documentElement.classList.remove("js-ready");
    };
  }, []);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const name = String(form.get("name") || "").trim();
    const replyTo = String(form.get("email") || "").trim();
    const company = String(form.get("company") || "").trim();
    const challenge = String(form.get("challenge") || "").trim();
    const subject =
      "JDE project enquiry — " + (company || name || "new system");
    const body = [
      "Hello JDE,",
      "",
      "Here is what I want to make work better:",
      challenge,
      "",
      "Name: " + name,
      "Company: " + (company || "Not provided"),
      "Reply to: " + replyTo,
    ].join("\n");

    window.location.href =
      "mailto:" +
      contactEmail +
      "?subject=" +
      encodeURIComponent(subject) +
      "&body=" +
      encodeURIComponent(body);
    setEmailOpened(true);
  };

  const schema = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    name: "JDE",
    description:
      "JDE designs intelligent AI systems for better productivity, data clarity, performance, and operational freedom.",
    url: "https://enerjadez.github.io/JDEportfoliogpt/",
    email: contactEmail,
    sameAs: ["https://github.com/enerjadez"],
  };

  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <div className="page-noise" aria-hidden="true" />
      <header className="site-header">
        <a className="brand" href="#top" aria-label="JDE home">
          <span className="brand-mark">JDE</span>
          <span className="brand-detail">
            Intelligent
            <br />
            Systems Studio
          </span>
        </a>
        <nav className="site-nav" aria-label="Main navigation">
          <a href="#systems">Systems</a>
          <a href="#method">Method</a>
          <a href="#contact" className="nav-cta">
            Start a build <span aria-hidden="true">↗</span>
          </a>
        </nav>
      </header>

      <main id="main">
        <section className="hero" id="top" aria-labelledby="hero-title">
          <div className="hero-glow" aria-hidden="true" />
          <div className="hero-copy">
            <p className="eyebrow hero-eyebrow">
              <span className="status-dot" aria-hidden="true" />
              JDE / Intelligent systems studio
            </p>
            <h1 id="hero-title">
              Your business,
              <br />
              <span>engineered</span>
              <br />
              to move freely.
            </h1>
            <div className="hero-bottom">
              <p className="hero-intro">
                We turn scattered work, unclear data, and slow processes into
                focused AI systems built for speed, control, and growth.
              </p>
              <a className="text-link" href="#contact">
                Bring us the bottleneck
                <span aria-hidden="true">↘</span>
              </a>
            </div>
          </div>

          <div
            className="signal-shell"
            role="img"
            aria-label="A live network of connected data signals orbiting the JDE system."
          >
            <SignalField />
            <div className="signal-corners" aria-hidden="true">
              <span>LIVE SYSTEM / 001</span>
              <span>JDE.26</span>
              <span>DATA → DECISION</span>
              <span>STATUS / CLEAR</span>
            </div>
            <div className="signal-core" aria-hidden="true">
              <span className="signal-core-label">JDE</span>
              <span className="signal-core-ring" />
              <span className="signal-core-ring signal-core-ring-two" />
            </div>
            <div className="signal-readout" aria-hidden="true">
              <span>INTELLIGENCE</span>
              <strong>MADE USEFUL</strong>
            </div>
          </div>

          <div className="hero-rail" aria-label="JDE focus areas">
            <span>AI</span>
            <span>Automation</span>
            <span>Data</span>
            <span>Digital systems</span>
            <span className="hero-rail-end">ZA / WORLDWIDE</span>
          </div>
        </section>

        <section className="thesis section-shell" aria-labelledby="thesis-title">
          <div className="section-index reveal">
            <span>01</span>
            <span>What changes</span>
          </div>
          <div className="thesis-content">
            <p className="eyebrow reveal">Where friction ends</p>
            <h2 id="thesis-title" className="reveal">
              Less busywork.
              <br />
              More <em>momentum.</em>
            </h2>
            <p className="thesis-body reveal">
              The right system does more than save time. It changes what your
              business can see, decide, and become. JDE brings art, engineering,
              and applied intelligence together to make that shift feel simple.
            </p>
          </div>
          <div className="outcome-grid reveal" aria-label="Business outcomes">
            <div>
              <span>Time</span>
              <strong>↓</strong>
            </div>
            <div>
              <span>Clarity</span>
              <strong>↑</strong>
            </div>
            <div>
              <span>Capacity</span>
              <strong>↑</strong>
            </div>
            <div>
              <span>Dependence</span>
              <strong>↓</strong>
            </div>
          </div>
        </section>

        <section
          className="systems section-shell"
          id="systems"
          aria-labelledby="systems-title"
        >
          <div className="section-index reveal">
            <span>02</span>
            <span>What we build</span>
          </div>
          <div className="systems-heading">
            <p className="eyebrow reveal">Intelligence with a job to do</p>
            <h2 id="systems-title" className="reveal">
              Systems that earn
              <br />
              their place.
            </h2>
          </div>
          <div className="capability-grid">
            {capabilities.map((capability) => (
              <article className="capability-card reveal" key={capability.index}>
                <div className="card-top">
                  <span>{capability.index}</span>
                  <span className="card-node" aria-hidden="true" />
                </div>
                <h3>{capability.title}</h3>
                <p>{capability.body}</p>
                <div className="card-signal">
                  <span>{capability.signal}</span>
                  <span aria-hidden="true">→</span>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section
          className="method section-shell"
          id="method"
          aria-labelledby="method-title"
        >
          <div className="section-index reveal">
            <span>03</span>
            <span>How we work</span>
          </div>
          <div className="method-intro">
            <p className="eyebrow reveal">Built around reality</p>
            <h2 id="method-title" className="reveal">
              No theatre.
              <br />
              Just systems that work.
            </h2>
            <p className="reveal">
              We begin with the bottleneck, not the technology. We study how
              work moves, find where time and value disappear, then engineer the
              simplest system capable of changing the outcome.
            </p>
          </div>
          <ol className="process-list">
            {process.map((item) => (
              <li className="process-item reveal" key={item.step}>
                <span className="process-number">{item.step}</span>
                <h3>{item.title}</h3>
                <p>{item.body}</p>
                <span className="process-arrow" aria-hidden="true">
                  ↗
                </span>
              </li>
            ))}
          </ol>
          <p className="method-principle reveal">
            Every decision must earn its place through
            <span> clarity, usefulness, or performance.</span>
          </p>
        </section>

        <section className="contact" id="contact" aria-labelledby="contact-title">
          <div className="contact-orbit" aria-hidden="true">
            <span />
            <span />
            <span />
          </div>
          <div className="contact-heading">
            <p className="eyebrow reveal">Start a conversation</p>
            <h2 id="contact-title" className="reveal">
              Bring us the
              <br />
              <em>bottleneck.</em>
            </h2>
            <p className="reveal">
              Tell us what is slowing your business down, what you want to
              understand, or what you wish could run without you.
            </p>
          </div>

          <form className="contact-form reveal" onSubmit={handleSubmit}>
            <div className="field-pair">
              <label>
                <span>Name</span>
                <input
                  type="text"
                  name="name"
                  autoComplete="name"
                  placeholder="Your name"
                  required
                />
              </label>
              <label>
                <span>Email</span>
                <input
                  type="email"
                  name="email"
                  autoComplete="email"
                  placeholder="you@company.com"
                  required
                />
              </label>
            </div>
            <label>
              <span>Company</span>
              <input
                type="text"
                name="company"
                autoComplete="organization"
                placeholder="Where you are building"
              />
            </label>
            <label>
              <span>What should work better?</span>
              <textarea
                name="challenge"
                rows={4}
                placeholder="A clear problem is enough to begin."
                required
              />
            </label>
            <button type="submit">
              <span>Prepare an email</span>
              <span aria-hidden="true">↗</span>
            </button>
            <p className="form-note">
              This prepares a draft in your email app—nothing is stored here.
              Prefer to write directly?{" "}
              <a href={"mailto:" + contactEmail}>{contactEmail}</a>
            </p>
            <p className="sr-only" aria-live="polite">
              {emailOpened
                ? "A draft should now be ready in your email app. If it did not open, use the direct email address below the button."
                : ""}
            </p>
          </form>
        </section>
      </main>

      <footer className="site-footer">
        <div className="footer-brand">
          <span className="brand-mark">JDE</span>
          <p>Intelligence, engineered into momentum.</p>
        </div>
        <div className="footer-links">
          <a href={"mailto:" + contactEmail}>Email</a>
          <a href="https://github.com/enerjadez" target="_blank" rel="noreferrer">
            GitHub
          </a>
          <a href="#top">Back to top ↑</a>
        </div>
        <p className="footer-meta">
          © JDE
          <span>Designed for useful futures.</span>
        </p>
      </footer>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
    </>
  );
}
