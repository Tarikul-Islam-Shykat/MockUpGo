import styles from "./HomePage.module.css";

type HomePageProps = {
  onLaunchTool: () => void;
};

const features = [
  {
    icon: "◈",
    title: "Curated Templates",
    desc: "Hand-crafted scenes designed for App Store and Play Store. Not generic — each template tells a visual story.",
  },
  {
    icon: "⬡",
    title: "Live Preview",
    desc: "Every change you make renders instantly. See exactly what your final export looks like before downloading.",
  },
  {
    icon: "⬙",
    title: "One-Click Export",
    desc: "Download your entire screenshot set as a high-resolution PNG at 2.5× pixel density. Ready to upload.",
  },
  {
    icon: "◻",
    title: "Device Finishes",
    desc: "Obsidian, Silver, and Champagne device frames. Match your brand or test different visual moods.",
  },
  {
    icon: "◈",
    title: "Multi-Slide Sets",
    desc: "Upload up to 5 screenshots and compose a full showcase in one canvas — no stitching required.",
  },
  {
    icon: "⬡",
    title: "Browser-First",
    desc: "No installs, no subscriptions, no slow rendering servers. Everything runs in your browser.",
  },
];

const steps = [
  { num: "01", label: "Pick a theme", desc: "Choose your visual direction" },
  { num: "02", label: "Upload screens", desc: "Drop in your app screenshots" },
  { num: "03", label: "Edit copy", desc: "Write your headline & subtitle" },
  { num: "04", label: "Export PNG", desc: "Download at 2.5× resolution" },
];

export function HomePage({ onLaunchTool }: HomePageProps) {
  return (
    <div className={styles.root}>
      {/* Background orbs */}
      <div className={styles.orb1} />
      <div className={styles.orb2} />
      <div className={styles.orb3} />

      {/* Nav */}
      <nav className={styles.nav}>
        <div className={styles.navInner}>
          <div className={styles.logo}>
            <span className={styles.logoMark}>M</span>
            <span className={styles.logoName}>MockUpGo</span>
          </div>
          <div className={styles.navLinks}>
            <a href="#features">Features</a>
            <a href="#how">How it works</a>
          </div>
          <button
            id="nav-launch-btn"
            type="button"
            className={styles.navCta}
            onClick={onLaunchTool}
          >
            Open Editor
          </button>
        </div>
      </nav>

      {/* Hero */}
      <section className={styles.hero}>
        <div className={styles.heroInner}>
          <div className={styles.heroBadge}>
            <span className={styles.badgeDot} />
            Free · No login required · Instant export
          </div>

          <h1 className={styles.heroHeadline}>
            App screenshots
            <br />
            that actually
            <br />
            <span className={styles.heroGradient}>sell your app.</span>
          </h1>

          <p className={styles.heroSub}>
            MockUpGo turns raw screenshots into polished App Store and Play Store
            visuals in minutes — right in your browser.
          </p>

          <div className={styles.heroActions}>
            <button
              id="hero-launch-btn"
              type="button"
              className={styles.primaryBtn}
              onClick={onLaunchTool}
            >
              <span>Start for free</span>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </button>
            <a href="#features" className={styles.ghostBtn}>
              See features
            </a>
          </div>

          <div className={styles.heroStat}>
            <div className={styles.statItem}>
              <strong>3</strong>
              <span>Premium themes</span>
            </div>
            <div className={styles.statDivider} />
            <div className={styles.statItem}>
              <strong>2.5×</strong>
              <span>Export resolution</span>
            </div>
            <div className={styles.statDivider} />
            <div className={styles.statItem}>
              <strong>0</strong>
              <span>Server needed</span>
            </div>
          </div>
        </div>

        {/* Hero visual — mockup preview cards */}
        <div className={styles.heroVisual}>
          <div className={styles.mockupCard} data-theme="violet">
            <div className={styles.mockupCardOrb} />
            <div className={styles.mockupBadge}>App Screens</div>
            <div className={styles.mockupHeadline}>Learn languages<br />in minutes</div>
            <div className={styles.mockupPhone}>
              <div className={styles.mockupPhoneScreen} />
            </div>
          </div>
          <div className={styles.mockupCard} data-theme="dark">
            <div className={styles.mockupBadge}>Feature</div>
            <div className={styles.mockupHeadline}>Send money<br />worldwide</div>
            <div className={styles.mockupPhone}>
              <div className={styles.mockupPhoneScreen} />
            </div>
          </div>
          <div className={styles.mockupCard} data-theme="mint">
            <div className={styles.mockupCardOrb} />
            <div className={styles.mockupBadge}>Story</div>
            <div className={styles.mockupHeadline}>Build better<br />routines</div>
            <div className={styles.mockupPhone}>
              <div className={styles.mockupPhoneScreen} />
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className={styles.features}>
        <div className={styles.sectionInner}>
          <div className={styles.sectionLabel}>Features</div>
          <h2 className={styles.sectionTitle}>
            Everything you need,<br />nothing you don't.
          </h2>
          <p className={styles.sectionSub}>
            Built for indie developers and small teams who want App Store quality
            visuals without the subscription tax.
          </p>

          <div className={styles.featureGrid}>
            {features.map((feat, i) => (
              <div key={i} className={styles.featureCard}>
                <div className={styles.featureIcon}>{feat.icon}</div>
                <h3>{feat.title}</h3>
                <p>{feat.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how" className={styles.how}>
        <div className={styles.sectionInner}>
          <div className={styles.sectionLabel}>Workflow</div>
          <h2 className={styles.sectionTitle}>
            Four steps to a polished<br />screenshot set.
          </h2>

          <div className={styles.steps}>
            {steps.map((step, i) => (
              <div key={i} className={styles.step}>
                <div className={styles.stepNum}>{step.num}</div>
                <div className={styles.stepContent}>
                  <strong>{step.label}</strong>
                  <span>{step.desc}</span>
                </div>
                {i < steps.length - 1 && <div className={styles.stepArrow}>→</div>}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className={styles.ctaBanner}>
        <div className={styles.ctaBannerInner}>
          <div className={styles.ctaOrb} />
          <div className={styles.ctaLabel}>Ready?</div>
          <h2 className={styles.ctaTitle}>
            Make your first mockup<br />in under 2 minutes.
          </h2>
          <p className={styles.ctaSub}>
            No account. No credit card. Just open the editor and start.
          </p>
          <button
            id="cta-launch-btn"
            type="button"
            className={styles.primaryBtn}
            onClick={onLaunchTool}
          >
            <span>Launch MockUpGo</span>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className={styles.footer}>
        <div className={styles.footerInner}>
          <div className={styles.logo}>
            <span className={styles.logoMark}>M</span>
            <span className={styles.logoName}>MockUpGo</span>
          </div>
          <p className={styles.footerNote}>
            Browser-first app mockup generation. No backend. No subscriptions.
          </p>
        </div>
      </footer>
    </div>
  );
}
