import styles from "./SiteHeader.module.css";

export function SiteHeader() {
  return (
    <header className={styles.header}>
      <a href="/" className={styles.brand}>
        <span className={styles.brandMark}>M</span>
        <div>
          <strong>Mockup Studio</strong>
          <span>Premium scene builder</span>
        </div>
      </a>

      <nav className={styles.nav}>
        <a href="#showcase">Showcase</a>
        <a href="#workflow">Workflow</a>
        <a href="#contact">Roadmap</a>
      </nav>

      <a href="#workflow" className={styles.cta}>
        Build the MVP
      </a>
    </header>
  );
}
