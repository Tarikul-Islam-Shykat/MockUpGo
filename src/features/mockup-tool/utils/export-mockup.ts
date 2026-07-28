import { toPng } from "html-to-image";
import JSZip from "jszip";

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 48);
}

/** Filter function that hides drag handles from the export */
function exportFilter(node: Node): boolean {
  if (node instanceof Element) {
    if (node.getAttribute("data-drag-handle") === "true") return false;
    if (node.getAttribute("data-no-export") === "true") return false;
  }
  return true;
}

/** Export the entire slide strip as one PNG */
export async function exportMockupAsPng(node: HTMLElement, title: string) {
  const dataUrl = await toPng(node, {
    cacheBust: true,
    pixelRatio: 2.5,
    backgroundColor: "#07090f",
    filter: exportFilter,
  });

  const anchor = document.createElement("a");
  anchor.href = dataUrl;
  anchor.download = `${slugify(title) || "mockup-preview"}.png`;
  anchor.click();
}

/** Export a single slide as its own PNG */
export async function exportSlidePng(
  node: HTMLElement,
  title: string,
  slideIndex: number,
) {
  const dataUrl = await toPng(node, {
    cacheBust: true,
    pixelRatio: 3,
    filter: exportFilter,
  });

  const anchor = document.createElement("a");
  anchor.href = dataUrl;
  anchor.download = `${slugify(title) || "slide"}-${slideIndex + 1}.png`;
  anchor.click();
}

/** Export all slides as individual PNGs packed in a ZIP file */
export async function exportMockupAsZip(
  slideNodes: HTMLElement[],
  title: string,
  onProgress?: (index: number, total: number) => void
) {
  const zip = new JSZip();
  const folderName = slugify(title) || "mockups";
  const imgFolder = zip.folder(folderName);

  if (!imgFolder) {
    throw new Error("Failed to create ZIP folder reference");
  }

  for (let i = 0; i < slideNodes.length; i++) {
    if (onProgress) {
      onProgress(i, slideNodes.length);
    }
    const node = slideNodes[i];
    
    // Render the node to dataUrl
    const dataUrl = await toPng(node, {
      cacheBust: true,
      pixelRatio: 3,
      filter: exportFilter,
    });

    // Extract base64 content
    const base64Data = dataUrl.split(",")[1];
    
    // Add file to ZIP folder
    const filename = `slide-${i + 1}.png`;
    imgFolder.file(filename, base64Data, { base64: true });
  }

  if (onProgress) {
    onProgress(slideNodes.length, slideNodes.length);
  }

  const content = await zip.generateAsync({ type: "blob" });
  
  const anchor = document.createElement("a");
  anchor.href = URL.createObjectURL(content);
  anchor.download = `${folderName}.zip`;
  anchor.click();
  URL.revokeObjectURL(anchor.href);
}
