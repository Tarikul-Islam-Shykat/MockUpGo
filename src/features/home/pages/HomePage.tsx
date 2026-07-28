import { FeatureStrip } from "@/features/home/sections/FeatureStrip";
import { HeroSection } from "@/features/home/sections/HeroSection";
import { ProcessSection } from "@/features/home/sections/ProcessSection";
import { RoadmapSection } from "@/features/home/sections/RoadmapSection";
import { ShowcaseSection } from "@/features/home/sections/ShowcaseSection";
import { SiteHeader } from "@/shared/layout/SiteHeader";

import styles from "./HomePage.module.css";

export function HomePage() {
  return (
    <div className={styles.pageShell}>
      <SiteHeader />
      <main className={styles.main}>
        <HeroSection />
        <FeatureStrip />
        <ShowcaseSection />
        <ProcessSection />
        <RoadmapSection />
      </main>
    </div>
  );
}
