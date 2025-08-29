import { useEffect, useState, FormEvent } from "react";

declare global {
  interface Window {
    Calendly?: { initPopupWidget: (opts: { url: string }) => void };
  }
}

const CONFIG = {
  brand: "VPaudio Technologies, Inc",
  domain: "https://www.vpaudiotech.com/",
  accent: "#19A6A4", // teal accent
  phoneDisplay: "(714) 489-5729",
  phoneLink: "+17144895729",
  email: "info@vpaudiotech.com",
  calendly: "https://calendly.com/vphung-vpaudiotech/15-min-intro-call",
  slogan: "Where Ideas Become Experiences",
  formspreeEndpoint: "https://formspree.io/f/xvgbojjp",
};

// Labor-first services; placeholders will be used for images
const SERVICES = [
  {
    title: "Audio",
    desc: "FOH & monitor engineering, RF/IEM coordination, system tuning, playback, comms.",
    tags: ["Production", "Rentals", "Sales"],
  },
  {
    title: "Lighting",
    desc: "Stage wash, uplights, movers, and show-calling — looks that support the music and the message.",
    tags: ["Production", "Rentals", "Sales"],
  },
  {
    title: "Video",
    desc: "Switching, IMAG, playback, projectors & LED walls, confidence monitors, multi-cam capture.",
    tags: ["Production", "Rentals", "Sales"],
  },
  {
    title: "Consultation",
    desc: "Show design, AV system planning, training, and vendor-neutral equipment recommendations.",
    tags: [],
  },
  {
    title: "Custom Hardware",
    desc: "Products desgined by VPaudio Technologies, Inc.",
    tags: ["New", "Sales"],
  },
  {
    title: "Software Development",
    desc: "Custom tools and apps for live production and rehearsal workflows — streamline setup, reduce errors.",
    tags: ["New"],
  },
];

export default function App() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [formStatus, setFormStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [errorMsg, setErrorMsg] = useState<string>("");

  // Lock page scroll when mobile menu is open
  useEffect(() => {
    const root = document.documentElement;
    if (mobileOpen) root.classList.add("overflow-hidden");
    else root.classList.remove("overflow-hidden");
    return () => root.classList.remove("overflow-hidden");
  }, [mobileOpen]);

  const focusRing =
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400 focus-visible:ring-offset-2";

  function openCalendly(e: React.MouseEvent<HTMLAnchorElement>) {
    e.preventDefault();
    if (window.Calendly?.initPopupWidget) {
      window.Calendly.initPopupWidget({ url: CONFIG.calendly });
    } else {
      window.open(CONFIG.calendly, "_blank", "noopener,noreferrer");
    }
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setFormStatus("loading");
    setErrorMsg("");

    const form = e.currentTarget;
    const data = new FormData(form);

    // Honeypot
    if ((data.get("companyWebsite") as string)?.length) {
      setFormStatus("success");
      form.reset();
      return;
    }

    const payload = {
      name: data.get("name"),
      email: data.get("email"),
      phone: data.get("phone"),
      message: data.get("message"),
      page: typeof window !== "undefined" ? window.location.href : "",
    };

    try {
      const res = await fetch(CONFIG.formspreeEndpoint, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setFormStatus("success");
        (e.target as HTMLFormElement).reset();
      } else {
        const body = await res.json().catch(() => ({}));
        setErrorMsg(
          body?.errors?.[0]?.message ||
            "Something went wrong. Please try again or email us."
        );
        setFormStatus("error");
      }
    } catch {
      setErrorMsg("Network error. Please try again or email us directly.");
      setFormStatus("error");
    }
  }

  // Reusable inline text shadow (avoids needing a global CSS class)
  const txtShadow = { textShadow: "0 2px 4px rgba(0,0,0,0.6)" as const };

  // Badge styling: emphasize Production (labor-first), make Rentals/Sales lighter
  function tagClass(t: string) {
    if (t === "Production")
      return "text-xs px-2 py-1 rounded-md bg-emerald-100 text-emerald-700 border border-emerald-200";
    if (t === "Rentals")
      return "text-xs px-2 py-1 rounded-md bg-sky-100 text-sky-700 border border-sky-200";
    if (t === "Sales/Install")
      return "text-xs px-2 py-1 rounded-md bg-zinc-100 text-zinc-700 border border-zinc-200";
    if (t === "New")
      return "text-xs px-2 py-1 rounded-md bg-amber-100 text-amber-700 border border-amber-200";
    return "text-xs px-2 py-1 rounded-md bg-zinc-100 text-zinc-700 border border-zinc-200";
  }

  return (
    <div className="min-h-screen bg-white text-zinc-700">
      {/* Header */}
      <header className="sticky top-0 bg-white/95 backdrop-blur border-b border-zinc-200 z-40">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <a
            href="#home"
            className={`font-semibold tracking-tight text-lg text-zinc-600 ${focusRing}`}
          >
            {CONFIG.brand}
          </a>
          <nav className="hidden md:flex gap-6 text-sm">
            <a className={`hover:text-zinc-900 ${focusRing}`} href="#services">
              Services
            </a>
            <a className={`hover:text-zinc-900 ${focusRing}`} href="#about">
              About
            </a>
            <a className={`hover:text-zinc-900 ${focusRing}`} href="#contact">
              Contact
            </a>
          </nav>
          <button
            className={`md:hidden rounded-lg p-2 hover:bg-zinc-100 ${focusRing}`}
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-expanded={mobileOpen}
            aria-controls="mobile-menu"
            aria-label="Toggle menu"
          >
            ☰
          </button>
        </div>
        {mobileOpen && (
          <div
            id="mobile-menu"
            className="md:hidden px-6 py-3 space-y-2 text-sm border-t bg-white"
          >
            {[
              ["#services", "Services"],
              ["#about", "About"],
              ["#contact", "Contact"],
            ].map(([href, label]) => (
              <a
                key={label}
                onClick={() => setMobileOpen(false)}
                href={href}
                className={focusRing}
              >
                {label}
              </a>
            ))}
          </div>
        )}
      </header>

      {/* Hero */}
      <section
        id="home"
        className="relative py-24 px-6 text-center text-white bg-cover bg-bottom md:bg-bottom"
        style={{ backgroundImage: "url('/hero-bg.png')" }}
        aria-label="Hero section with abstract concert background"
      >
        {/* Overlay */}
        <div className="absolute inset-0 bg-black/60" />

        <div className="relative max-w-4xl mx-auto">
          <h1
            className="text-4xl sm:text-5xl font-semibold tracking-tight"
            style={txtShadow}
          >
            {CONFIG.slogan}
          </h1>
          {/* Explainer line */}
          <p
            className="mt-5 text-2xl sm:text-3xl tracking-wide uppercase text-zinc-100 font-semibold"
            style={txtShadow}
          >
            Audio • Lighting • Video
          </p>

          {/* Main tagline */}
          <p className="mt-4 text-lg max-w-2xl mx-auto" style={txtShadow}>
            Great production. Smooth execution. Happy audience.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <a
              href="#contact"
              aria-label="Get a quote"
              className={`px-5 py-3 rounded-2xl text-white font-medium transition ${focusRing}`}
              style={{ background: CONFIG.accent }}
            >
              Get a Quote
            </a>
            <a
              href={CONFIG.calendly}
              onClick={openCalendly}
              aria-label="Book a call"
              className={`px-5 py-3 rounded-2xl border border-white bg-white/10 font-medium transition ${focusRing}`}
            >
              Book a Call
            </a>
          </div>
          <div className="mt-8 text-sm" style={txtShadow}>
            Orange County • Los Angeles • San Diego
          </div>
        </div>
      </section>

      {/* Services (merged, labor-first) */}
      <section id="services" className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-semibold tracking-tight text-zinc-600">
            Services
          </h2>
          <p className="mt-2 text-zinc-600 max-w-3xl">
            We’re a{" "}
            <span className="font-medium">production company first</span> —
            delivering skilled crews and show execution across audio, lighting,
            video, and teleprompters. We also provide{" "}
            <span className="font-medium">rentals</span> and{" "}
            <span className="font-medium">sales/installs</span> when you need
            gear or a permanent solution.
          </p>

          <div className="mt-10 grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {SERVICES.map((s) => (
              <article
                key={s.title}
                className="rounded-3xl border border-zinc-200 bg-white overflow-hidden shadow-sm hover:shadow-md transition"
                aria-labelledby={`${s.title}-heading`}
              >
                {/* Placeholder image (reliable everywhere) */}
                <img
                  src={`https://placehold.co/600x400?text=${encodeURIComponent(
                    s.title
                  )}`}
                  alt={`${s.title} service`}
                  className="w-full aspect-[4/3] object-cover"
                  loading="lazy"
                  decoding="async"
                />
                <div className="p-6">
                  <div className="flex items-start justify-between gap-3">
                    <h3
                      id={`${s.title}-heading`}
                      className="text-xl font-semibold tracking-tight text-zinc-600"
                    >
                      {s.title}
                    </h3>
                    <div className="flex flex-wrap gap-1">
                      {/* Always show Production first */}
                      {[...s.tags]
                        .sort((a, b) =>
                          a === "Production" ? -1 : b === "Production" ? 1 : 0
                        )
                        .map((t) => (
                          <span key={t} className={tagClass(t)}>
                            {t}
                          </span>
                        ))}
                    </div>
                  </div>
                  <p className="mt-2 text-sm">{s.desc}</p>
                </div>
              </article>
            ))}
          </div>

          {/* Single CTA for all services */}
          <div className="mt-10 flex flex-wrap gap-3">
            <a
              href="#contact"
              className={`px-5 py-3 rounded-2xl text-white font-medium transition ${focusRing}`}
              style={{ background: CONFIG.accent }}
            >
              Request a Quote
            </a>
            <a
              href={CONFIG.calendly}
              onClick={(e) => {
                e.preventDefault();
                if (window.Calendly?.initPopupWidget) {
                  window.Calendly.initPopupWidget({ url: CONFIG.calendly });
                } else {
                  window.open(CONFIG.calendly, "_blank", "noopener,noreferrer");
                }
              }}
              className={`px-5 py-3 rounded-2xl border border-zinc-300 font-medium transition ${focusRing}`}
            >
              Book a Call
            </a>
          </div>
        </div>
      </section>

      {/* About */}
      <section id="about" className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-semibold tracking-tight text-zinc-600">
            About
          </h2>
          <div className="mt-2 max-w-3xl space-y-4">
            <p>
              With over 21 years in live event production, VPaudio Technologies,
              Inc. has built a reputation for delivering clear sound, seamless
              execution, and stress-free shows. From high-energy concerts to
              corporate meetings, nonprofit fundraisers, school productions, and
              worship gatherings, we know that every event is a reflection of
              the people behind it. That’s why our approach is simple: listen
              first, design smart, and execute with precision.
            </p>
            <p>
              Our team brings deep technical expertise in audio, lighting,
              video, and communication systems, combined with the calm
              professionalism that clients rely on under pressure. Whether we’re
              mixing a headline band, supporting a keynote speaker, or
              integrating permanent systems into a venue, our focus is always on
              making you look good and keeping your audience engaged.
            </p>
            <p>
              Based in Orange County, we proudly serve Los Angeles, San Diego,
              and the greater Southern California region. Insured, reliable, and
              backed by decades of experience, we’re not just here to provide
              equipment — we’re here to be your trusted partner in creating
              events that work flawlessly and leave a lasting impact.
            </p>
          </div>
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="py-20 px-6 border-t border-zinc-200">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-12 gap-10">
          <div className="lg:col-span-7">
            <h2 className="text-3xl font-semibold tracking-tight text-zinc-600">
              Get a Quote
            </h2>
            <p className="mt-2 text-sm text-zinc-600">
              We reply within 1 business day.
            </p>

            <form
              className="mt-6 grid gap-4 max-w-xl"
              onSubmit={handleSubmit}
              noValidate
            >
              {/* Honeypot for bots */}
              <input
                type="text"
                name="companyWebsite"
                tabIndex={-1}
                autoComplete="off"
                className="hidden"
                aria-hidden="true"
              />

              <label className="text-sm" htmlFor="name">
                Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                placeholder="Your name"
                autoComplete="name"
                className={`border px-4 py-3 rounded-xl ${focusRing}`}
              />

              <label className="text-sm" htmlFor="email">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                placeholder="you@example.com"
                autoComplete="email"
                inputMode="email"
                className={`border px-4 py-3 rounded-xl ${focusRing}`}
              />

              <label className="text-sm" htmlFor="phone">
                Phone (optional)
              </label>
              <input
                id="phone"
                name="phone"
                type="tel"
                placeholder="(###) ###-####"
                autoComplete="tel"
                inputMode="tel"
                pattern="[\d\s\-\+\(\)]*"
                className={`border px-4 py-3 rounded-xl ${focusRing}`}
              />

              <label className="text-sm" htmlFor="message">
                What do you need?
              </label>
              <textarea
                id="message"
                name="message"
                required
                placeholder="Audio, Lighting, Video; headcount; date/venue; budget range"
                className={`border px-4 py-3 rounded-xl h-28 ${focusRing}`}
                aria-describedby="message-help"
              />
              <small id="message-help" className="sr-only">
                Describe services, headcount, date/venue, and budget.
              </small>

              <button
                type="submit"
                disabled={formStatus === "loading"}
                className={`px-5 py-3 rounded-2xl text-white font-medium transition ${focusRing} ${
                  formStatus === "loading"
                    ? "opacity-70 cursor-not-allowed"
                    : ""
                }`}
                style={{ background: CONFIG.accent }}
                aria-label="Submit quote request"
              >
                {formStatus === "loading" ? "Sending..." : "Send Request"}
              </button>

              {/* Status messages */}
              {formStatus === "success" && (
                <div
                  role="status"
                  aria-live="polite"
                  className="text-sm text-green-700 bg-green-50 border border-green-200 rounded-xl px-4 py-3"
                >
                  Thanks! Your request was sent. We’ll get back to you shortly.
                </div>
              )}
              {formStatus === "error" && (
                <div
                  role="alert"
                  className="text-sm text-red-700 bg-red-50 border border-red-200 rounded-xl px-4 py-3"
                >
                  {errorMsg || (
                    <>
                      Something went wrong. Please try again or email us at{" "}
                      <a href={`mailto:${CONFIG.email}`} className="underline">
                        {CONFIG.email}
                      </a>
                      .
                    </>
                  )}
                </div>
              )}

              <div className="text-sm text-zinc-600">
                Prefer email or phone?{" "}
                <a
                  href={`mailto:${CONFIG.email}`}
                  className="underline underline-offset-4"
                >
                  {CONFIG.email}
                </a>{" "}
                •{" "}
                <a
                  href={`tel:${CONFIG.phoneLink}`}
                  className="underline underline-offset-4"
                >
                  {CONFIG.phoneDisplay}
                </a>
              </div>
            </form>
          </div>

          <div className="lg:col-span-5">
            <div className="rounded-3xl border border-zinc-200 p-6 bg-zinc-50">
              <h3 className="font-semibold tracking-tight text-zinc-600">
                Contact
              </h3>
              <ul className="mt-3 space-y-2 text-sm">
                <li>
                  <span className="text-zinc-500">Website:</span>{" "}
                  <a href={CONFIG.domain} className={`underline ${focusRing}`}>
                    {CONFIG.domain}
                  </a>
                </li>
                <li>
                  <span className="text-zinc-500">Email:</span>{" "}
                  <a
                    href={`mailto:${CONFIG.email}`}
                    className={`underline ${focusRing}`}
                  >
                    {CONFIG.email}
                  </a>
                </li>
                <li>
                  <span className="text-zinc-500">Phone:</span>{" "}
                  <a
                    href={`tel:${CONFIG.phoneLink}`}
                    className={`underline ${focusRing}`}
                  >
                    {CONFIG.phoneDisplay}
                  </a>
                </li>
                <li>
                  <span className="text-zinc-500">Service area:</span> Orange
                  County • LA • SD
                </li>
              </ul>
              {/*<div className="mt-6 flex gap-3">
                <a
                  href="#services"
                  className={`px-4 py-2 rounded-xl border border-zinc-300 transition ${focusRing}`}
                >
                  View Services
                </a>
              </div>*/}
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-zinc-200">
        <div className="max-w-7xl mx-auto px-6 py-8 text-sm text-zinc-600">
          © {new Date().getFullYear()} {CONFIG.brand}. All rights reserved. •{" "}
          <a href={`tel:${CONFIG.phoneLink}`} className="underline">
            {CONFIG.phoneDisplay}
          </a>{" "}
          •{" "}
          <a href={`mailto:${CONFIG.email}`} className="underline">
            {CONFIG.email}
          </a>{" "}
          • Orange County, CA
        </div>
      </footer>

      {/* Sticky mobile CTA */}
      <div
        className="fixed inset-x-0 px-4 md:hidden z-40"
        style={{ bottom: "max(1rem, env(safe-area-inset-bottom))" }}
      >
        <a
          href="#contact"
          className={`block text-center px-5 py-3 rounded-2xl text-white font-medium shadow-lg transition ${focusRing}`}
          style={{ background: CONFIG.accent }}
        >
          Get a Quote
        </a>
      </div>
    </div>
  );
}
