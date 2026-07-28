import { showcaseCards } from "@/features/home/data/home-content";
import { SectionBadge } from "@/shared/ui/SectionBadge";

import styles from "./ShowcaseSection.module.css";

export function ShowcaseSection() {
  return (
    <section id="showcase" className={styles.section}>
      <div className={styles.heading}>
        <SectionBadge label="Scene directions" />
        <h2>One website, three premium scene lanes to grow into.</h2>
        <p>
          This first version positions the product clearly while leaving space
          for the actual mockup editor, template browser, and export tools in
          the next build steps.
        </p>
      </div>

      <div className={styles.grid}>
        {showcaseCards.map((card, index) => (
          <article key={card.eyebrow} className={styles.card}>
            <div className={styles.preview} data-tone={index}>
              <div className={styles.previewInner} />
            </div>
            <span>{card.eyebrow}</span>
            <h3>{card.title}</h3>
            <p>{card.text}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
