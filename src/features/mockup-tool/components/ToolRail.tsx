import type { ToolTab } from "@/features/mockup-tool/types";

import styles from "./ToolRail.module.css";

type ToolRailProps = {
  activeTab: ToolTab;
  onChange: (tab: ToolTab) => void;
};

const items: Array<{ id: ToolTab; label: string; short: string }> = [
  { id: "theme", label: "Theme", short: "Th" },
  { id: "slides", label: "Slides", short: "Sl" },
  { id: "text", label: "Text", short: "Tx" },
  { id: "style", label: "Style", short: "St" },
  { id: "export", label: "Export", short: "Ex" },
];

export function ToolRail({ activeTab, onChange }: ToolRailProps) {
  return (
    <aside className={styles.rail}>
      {items.map((item) => (
        <button
          key={item.id}
          type="button"
          className={styles.item}
          data-active={activeTab === item.id}
          onClick={() => onChange(item.id)}
        >
          <span>{item.short}</span>
          <b>{item.label}</b>
        </button>
      ))}
    </aside>
  );
}
