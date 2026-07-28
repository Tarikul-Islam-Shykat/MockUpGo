import { toPng } from "html-to-image";

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 48);
}

export async function exportMockupAsPng(node: HTMLElement, title: string) {
  const dataUrl = await toPng(node, {
    cacheBust: true,
    pixelRatio: 2.5,
    backgroundColor: "#0a101b",
  });

  const anchor = document.createElement("a");
  anchor.href = dataUrl;
  anchor.download = `${slugify(title) || "mockup-preview"}.png`;
  anchor.click();
}
