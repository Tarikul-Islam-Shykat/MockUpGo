import { workflowSteps, pillars } from "@/features/home/data/home-content";
import { SectionBadge } from "@/shared/ui/SectionBadge";

import styles from "./ProcessSection.module.css";

export function ProcessSection() {
  return (
    <section id="workflow" className={styles.section}>
      <div className={styles.intro}>
        <SectionBadge label="Build path" />
        <h2>Simple first release, then layer the real product in with control.</h2>
      </div>

      <div className={styles.layout}>
        <div className={styles.steps}>
          {workflowSteps.map((step) => (
            <article key={step.id} className={styles.stepCard}>
              <span>{step.id}</span>
              <div>
                <h3>{step.title}</h3>
                <p>{step.text}</p>
              </div>
            </article>
          ))}
        </div>

        <div className={styles.pillars}>
          {pillars.map((pillar) => (
            <article key={pillar.title} className={styles.pillarCard}>
              <h3>{pillar.title}</h3>
              <p>{pillar.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
