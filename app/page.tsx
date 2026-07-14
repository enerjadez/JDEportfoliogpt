"use client";

import {
  FormEvent,
  PointerEvent as ReactPointerEvent,
  useEffect,
  useRef,
  useState,
} from "react";
import { HeroScene } from "./components/HeroScene";
import { SystemPlayground } from "./components/SystemPlayground";

const contactEmail = "enerjadezn@gmail.com";

const capabilities = [
  {
    index: "01",
    title: "AI operations",
    body: "Automate the repetitive work draining your team’s attention—without losing oversight, judgement, or control.",
    signal: "TIME / RETURNED",
    artifact: "queue",
  },
  {
    index: "02",
    title: "Data clarity",
    body: "Turn scattered information into one clear view of what is happening, why it matters, and what to do next.",
    signal: "SIGNAL / FOUND",
    artifact: "clarity",
  },
  {
    index: "03",
    title: "Performance systems",
    body: "Build faster workflows, sharper tools, and dependable infrastructure around how your business actually moves.",
    signal: "MOMENTUM / BUILT",
    artifact: "rails",
  },
  {
    index: "04",
    title: "Operational freedom",
    body: "Reduce dependence on manual effort and give your people the capacity to think, create, and grow.",
    signal: "CAPACITY / OPEN",
    artifact: "gate",
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

type Capability = (typeof capabilities)[number];

function TiltCapabilityCard({ capability }: { capability: Capability }) {
  const [assembled, setAssembled] = useState(false);

  const tilt = (event: ReactPointerEvent<HTMLElement>) => {
    if (event.pointerType !== "mouse") return;
    const rect = event.currentTarget.getBoundingClientRect();
    const horizontal = (event.clientX - rect.left) / rect.width;
    const vertical = (event.clientY - rect.top) / rect.height;
    event.currentTarget.style.setProperty(
      "--tilt-y",
      ((horizontal - 0.5) * 8).toFixed(2) + "deg",
    );
    event.currentTarget.style.setProperty(
      "--tilt-x",
      ((vertical - 0.5) * -8).toFixed(2) + "deg",
    );
    event.currentTarget.style.setProperty("--glow-x", horizontal * 100 + "%");
    event.currentTarget.style.setProperty("--glow-y", vertical * 100 + "%");
  };

  const resetTilt = (event: ReactPointerEvent<HTMLElement>) => {
    event.currentTarget.style.setProperty("--tilt-y", "0deg");
    event.currentTarget.style.setProperty("--tilt-x", "0deg");
  };

  return (
    <article
      className={"capability-card reveal " + (assembled ? "is-assembled" : "")}
      onPointerMove={tilt}
      onPointerLeave={resetTilt}
    >
      <div className="capability-card-inner">
        <div className="card-top">
          <span>{capability.index}</span>
          <span className="card-node" aria-hidden="true" />
        </div>
        <button
          type="button"
          className="card-mechanism-button"
          aria-pressed={assembled}
          aria-label={
            (assembled ? "Disassemble " : "Assemble ") + capability.title
          }
          onClick={() => setAssembled((current) => !current)}
        >
          <span
            className={"card-mechanism mechanism-" + capability.artifact}
            aria-hidden="true"
          >
            <i />
            <i />
            <i />
            <i />
          </span>
          <span>{assembled ? "SYSTEM / OPEN" : "TOUCH / ASSEMBLE"}</span>
        </button>
        <div className="card-copy">
          <h3>{capability.title}</h3>
          <p>{capability.body}</p>
        </div>
        <div className="card-signal">
          <span>{capability.signal}</span>
          <span aria-hidden="true">→</span>
        </div>
      </div>
    </article>
  );
}

export default function Home() {
  const [emailOpened, setEmailOpened] = useState(false);
  const [challenge, setChallenge] = useState("");
  const [scenarioAdded, setScenarioAdded] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

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

  const handleUseScenario = (summary: string) => {
    setChallenge((current) => (current.trim() ? current + "\n\n" + summary : summary));
    setScenarioAdded(true);
    window.requestAnimationFrame(() => {
      const reduceMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;
      document.getElementById("contact")?.scrollIntoView({
        behavior: reduceMotion ? "auto" : "smooth",
        block: "start",
      });
      textareaRef.current?.focus({ preventScroll: true });
    });
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const name = String(form.get("name") || "").trim();
    const replyTo = String(form.get("email") || "").trim();
    const company = String(form.get("company") || "").trim();
    const submittedChallenge = String(form.get("challenge") || "").trim();
    const subject =
      "JDE project enquiry — " + (company || name || "new system");
    const body = [
      "Hello JDE,",
      "",
      "Here is what I want to make work better:",
      submittedChallenge,
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
          <a href="#playground">Playground</a>
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
              <a className="text-link" href="#playground">
                Test your bottleneck
                <span aria-hidden="true">↘</span>
              </a>
            </div>
          </div>

          <div className="signal-shell">
            <HeroScene />
            <div className="signal-corners" aria-hidden="true">
              <span>CONSTRAINT ENGINE / 001</span>
              <span>JDE.26</span>
              <span>FRICTION → FREEDOM</span>
              <span>STATUS / RESPONSIVE</span>
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
            <span>What we build / touch to explore</span>
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
              <TiltCapabilityCard
                capability={capability}
                key={capability.index}
              />
            ))}
          </div>
        </section>

        <SystemPlayground onUseScenario={handleUseScenario} />

        <section
          className="method section-shell"
          id="method"
          aria-labelledby="method-title"
        >
          <div className="section-index reveal">
            <span>04</span>
            <span>How we work / choose a phase</span>
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
          <div className={"process-playground step-" + activeStep}>
            <div className="method-track" aria-hidden="true">
              <span className="method-puck" />
            </div>
            <ol className="process-list">
              {process.map((item, index) => (
                <li
                  className={
                    "process-item reveal " +
                    (activeStep === index ? "is-active" : "")
                  }
                  key={item.step}
                >
                  <button
                    type="button"
                    className="process-button"
                    aria-pressed={activeStep === index}
                    onClick={() => setActiveStep(index)}
                    onFocus={() => setActiveStep(index)}
                    onPointerEnter={() => setActiveStep(index)}
                  >
                    <span className="process-number">{item.step}</span>
                    <h3>{item.title}</h3>
                    <p>{item.body}</p>
                    <span className="process-arrow" aria-hidden="true">
                      ↗
                    </span>
                  </button>
                </li>
              ))}
            </ol>
          </div>
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
                ref={textareaRef}
                name="challenge"
                rows={7}
                placeholder="A clear problem is enough to begin."
                value={challenge}
                onChange={(event) => {
                  setChallenge(event.target.value);
                  setScenarioAdded(false);
                }}
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
                : scenarioAdded
                  ? "Your Bottleneck Lab scenario has been added to the project message."
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
