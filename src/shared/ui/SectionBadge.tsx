import styles from "./SectionBadge.module.css";

type SectionBadgeProps = {
  label: string;
};

export function SectionBadge({ label }: SectionBadgeProps) {
  return <span className={styles.badge}>{label}</span>;
}
