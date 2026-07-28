import { SectionBadge } from "@/shared/ui/SectionBadge";

import styles from "./RoadmapSection.module.css";

export function RoadmapSection() {
  return (
    <section id="contact" className={styles.section}>
      <div className={styles.card}>
        <div className={styles.copy}>
          <SectionBadge label="Next steps" />
          <h2>Turn this clean front door into the actual mockup product.</h2>
          <p>
            The structure is ready for the next layer: template browser, device
            renderer, screenshot upload, and export workflow. We can now add
            those features without wrecking the foundation.
          </p>
        </div>

        <div className={styles.items}>
          <div>
            <span>01</span>
            <strong>Template catalog</strong>
          </div>
          <div>
            <span>02</span>
            <strong>Mockup editor canvas</strong>
          </div>
          <div>
            <span>03</span>
            <strong>PNG export then motion</strong>
          </div>
        </div>
      </div>
    </section>
  );
}
