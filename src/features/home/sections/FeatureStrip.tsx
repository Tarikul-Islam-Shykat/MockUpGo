import { featureGroups } from "@/features/home/data/home-content";

import styles from "./FeatureStrip.module.css";

export function FeatureStrip() {
  return (
    <section className={styles.strip}>
      {featureGroups.map((feature) => (
        <div key={feature} className={styles.item}>
          <span className={styles.dot} />
          <p>{feature}</p>
        </div>
      ))}
    </section>
  );
}
