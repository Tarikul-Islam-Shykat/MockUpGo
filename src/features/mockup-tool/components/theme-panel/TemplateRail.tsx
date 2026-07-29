import type { MockupTheme } from "@/features/mockup-tool/types";

import styles from "./TemplateRail.module.css";

type TemplateRailProps = {
  templates: MockupTheme[];
  selectedTemplateId: string;
  onSelect: (templateId: string) => void;
};

export function TemplateRail({
  templates,
  selectedTemplateId,
  onSelect,
}: TemplateRailProps) {
  return (
    <div className={styles.rail}>
      {templates.map((template) => {
        const isActive = template.id === selectedTemplateId;

        return (
          <button
            key={template.id}
            type="button"
            className={styles.card}
            data-active={isActive}
            onClick={() => onSelect(template.id)}
          >
            <div
              className={styles.swatch}
              style={{
                background: `${template.overlay}, ${template.slideBackground}`,
              }}
            />
            <div className={styles.copy}>
              <strong>{template.name}</strong>
              <span>{template.summary}</span>
            </div>
          </button>
        );
      })}
    </div>
  );
}
