import type { ToolTab } from "@/features/mockup-tool/types";

import styles from "./ToolRail.module.css";

type ToolRailProps = {
  activeTab: ToolTab;
  onChange: (tab: ToolTab) => void;
};

const items: Array<{ id: ToolTab; label: string; icon: string }> = [
  {
    id: "theme",
    label: "Theme",
    icon: `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 2a7 7 0 0 1 7 7c0 2.38-1.19 4.47-3 5.74V17a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2v-2.26A7 7 0 0 1 5 9a7 7 0 0 1 7-7"/></svg>`,
  },
  {
    id: "slides",
    label: "Slides",
    icon: `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/></svg>`,
  },
  {
    id: "text",
    label: "Text",
    icon: `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 7V4h16v3M9 20h6M12 4v16"/></svg>`,
  },
  {
    id: "style",
    label: "Style",
    icon: `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14M4.93 4.93a10 10 0 0 0 0 14.14"/></svg>`,
  },
  {
    id: "export",
    label: "Export",
    icon: `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3"/></svg>`,
  },
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
          title={item.label}
        >
          <span dangerouslySetInnerHTML={{ __html: item.icon }} />
          <b>{item.label}</b>
        </button>
      ))}
    </aside>
  );
}
