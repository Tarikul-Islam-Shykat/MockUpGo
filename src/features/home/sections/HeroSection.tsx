import { heroStats } from "@/features/home/data/home-content";
import { SectionBadge } from "@/shared/ui/SectionBadge";

import styles from "./HeroSection.module.css";

export function HeroSection() {
  return (
    <section className={styles.hero}>
      <div className={styles.copyColumn}>
        <SectionBadge label="Mockup Studio MVP" />
        <h1 className={styles.title}>
          Premium app showcase scenes for teams that need store-ready visuals
          fast.
        </h1>
        <p className={styles.description}>
          Start with a clean premium front end now, then plug in devices,
          screenshots, template logic, and export flows without ripping the
          structure apart later.
        </p>
        <div className={styles.actions}>
          <a className={styles.primaryAction} href="#showcase">
            Explore the direction
          </a>
          <a className={styles.secondaryAction} href="#workflow">
            See the build path
          </a>
        </div>
        <div className={styles.statRow}>
          {heroStats.map((stat) => (
            <div key={stat.label} className={styles.statCard}>
              <strong>{stat.value}</strong>
              <span>{stat.label}</span>
            </div>
          ))}
        </div>
      </div>

      <div className={styles.visualColumn}>
        <div className={styles.visualFrame}>
          <div className={styles.orb} />
          <div className={styles.deviceCard}>
            <div className={styles.deviceTop} />
            <div className={styles.screen}>
              <span className={styles.screenLabel}>Featured Scene</span>
              <h2>Habit Tracker Launch</h2>
              <p>Warm lighting, layered text, and product-shot composition.</p>
              <div className={styles.screenBars}>
                <span />
                <span />
                <span />
              </div>
            </div>
          </div>
          <div className={styles.floatingPanel}>
            <span>Template DNA</span>
            <strong>device + background + copy + motion</strong>
          </div>
        </div>
      </div>
    </section>
  );
}
