type RenderPreviewVideoOptions = {
  slideImages: HTMLImageElement[];
  projectName: string;
  slideHoldDuration: number;
  transitionDuration: number;
  onProgress?: (value: number) => void;
};

const DEFAULT_FPS = 20;
const VIDEO_END_HOLD = 1000;

export async function renderPreviewVideo({
  slideImages,
  projectName,
  slideHoldDuration,
  transitionDuration,
  onProgress,
}: RenderPreviewVideoOptions): Promise<"webm" | "png-fallback"> {
  if (!slideImages.length) {
    throw new Error("There are no slides to render.");
  }

  const mimeType = resolveVideoMimeType();
  if (!mimeType) {
    await downloadFallbackStrip(slideImages, projectName);
    return "png-fallback";
  }

  const width = slideImages[0].naturalWidth || slideImages[0].width || 640;
  const height = slideImages[0].naturalHeight || slideImages[0].height || 1360;
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;

  const context = canvas.getContext("2d");
  if (!context) {
    throw new Error("Video canvas could not be created.");
  }

  let stream: MediaStream | null = null;
  let recorder: MediaRecorder | null = null;
  let stopped: Promise<void> | null = null;
  const chunks: Blob[] = [];

  try {
    stream = canvas.captureStream(DEFAULT_FPS);
    recorder = new MediaRecorder(stream, {
      mimeType,
      videoBitsPerSecond: 6_000_000,
    });

    recorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        chunks.push(event.data);
      }
    };

    stopped = new Promise<void>((resolve, reject) => {
      recorder!.onstop = () => resolve();
      recorder!.onerror = () => reject(new Error("Preview recording failed."));
    });

    recorder.start(250);
  } catch {
    stream?.getTracks().forEach((track) => track.stop());
    await downloadFallbackStrip(slideImages, projectName);
    return "png-fallback";
  }

  const totalDuration =
    slideImages.length * slideHoldDuration +
    Math.max(0, slideImages.length - 1) * transitionDuration +
    VIDEO_END_HOLD;
  let elapsed = 0;

  try {
    for (let index = 0; index < slideImages.length; index += 1) {
      const image = slideImages[index];
      const nextImage = slideImages[index + 1] ?? null;

      const holdFrames = Math.max(
        1,
        Math.floor((slideHoldDuration / 1000) * DEFAULT_FPS),
      );
      for (let frame = 0; frame < holdFrames; frame += 1) {
        drawKenBurnsFrame(context, image, width, height, frame / holdFrames);
        elapsed += 1000 / DEFAULT_FPS;
        updateProgress(onProgress, elapsed, totalDuration);
        await sleep(1000 / DEFAULT_FPS);
      }

      if (nextImage) {
        const fadeFrames = Math.max(
          1,
          Math.floor((transitionDuration / 1000) * DEFAULT_FPS),
        );
        for (let frame = 0; frame < fadeFrames; frame += 1) {
          const alpha = frame / fadeFrames;
          context.clearRect(0, 0, width, height);
          context.drawImage(image, 0, 0, width, height);
          context.globalAlpha = alpha;
          context.drawImage(nextImage, 0, 0, width, height);
          context.globalAlpha = 1;
          elapsed += 1000 / DEFAULT_FPS;
          updateProgress(onProgress, elapsed, totalDuration);
          await sleep(1000 / DEFAULT_FPS);
        }
      }
    }

    const endingFrames = Math.max(
      1,
      Math.floor((VIDEO_END_HOLD / 1000) * DEFAULT_FPS),
    );
    const lastImage = slideImages[slideImages.length - 1];
    for (let frame = 0; frame < endingFrames; frame += 1) {
      context.clearRect(0, 0, width, height);
      context.drawImage(lastImage, 0, 0, width, height);
      elapsed += 1000 / DEFAULT_FPS;
      updateProgress(onProgress, elapsed, totalDuration);
      await sleep(1000 / DEFAULT_FPS);
    }
  } finally {
    if (recorder?.state !== "inactive") {
      recorder.stop();
    }
  }

  if (stopped) {
    await stopped;
  }

  stream?.getTracks().forEach((track) => track.stop());

  const blob = new Blob(chunks, { type: mimeType });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = `${slugify(projectName) || "mockup-preview"}.webm`;
  anchor.rel = "noreferrer";
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
  return "webm";
}

function resolveVideoMimeType() {
  if (typeof MediaRecorder === "undefined") {
    return null;
  }

  if (MediaRecorder.isTypeSupported("video/webm;codecs=vp9")) {
    return "video/webm;codecs=vp9";
  }

  if (MediaRecorder.isTypeSupported("video/webm;codecs=vp8")) {
    return "video/webm;codecs=vp8";
  }

  if (MediaRecorder.isTypeSupported("video/webm")) {
    return "video/webm";
  }

  return null;
}

function drawKenBurnsFrame(
  context: CanvasRenderingContext2D,
  image: HTMLImageElement,
  width: number,
  height: number,
  progress: number,
) {
  const zoom = 1 + progress * 0.035;
  const offset = (zoom - 1) / 2;

  context.clearRect(0, 0, width, height);
  context.save();
  context.translate(-offset * width, -offset * height);
  context.scale(zoom, zoom);
  context.drawImage(image, 0, 0, width, height);
  context.restore();
}

function updateProgress(
  onProgress: ((value: number) => void) | undefined,
  elapsed: number,
  totalDuration: number,
) {
  if (!onProgress) {
    return;
  }

  const ratio = totalDuration === 0 ? 1 : Math.min(1, elapsed / totalDuration);
  onProgress(55 + Math.round(ratio * 43));
}

function sleep(ms: number) {
  return new Promise<void>((resolve) => setTimeout(resolve, ms));
}

async function downloadFallbackStrip(
  slideImages: HTMLImageElement[],
  projectName: string,
) {
  const gap = 24;
  const width = Math.max(...slideImages.map((image) => image.naturalWidth || image.width || 640));
  const totalHeight =
    slideImages.reduce((height, image) => height + (image.naturalHeight || image.height || 1360), 0) +
    gap * Math.max(0, slideImages.length - 1);

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = totalHeight;

  const context = canvas.getContext("2d");
  if (!context) {
    throw new Error("PNG fallback could not be created.");
  }

  context.fillStyle = "#07090f";
  context.fillRect(0, 0, canvas.width, canvas.height);

  let y = 0;
  for (const image of slideImages) {
    const imageWidth = image.naturalWidth || image.width || 640;
    const imageHeight = image.naturalHeight || image.height || 1360;
    const scale = Math.min(1, width / imageWidth);
    const drawWidth = Math.round(imageWidth * scale);
    const drawHeight = Math.round(imageHeight * scale);
    const x = Math.round((width - drawWidth) / 2);

    context.drawImage(image, x, y, drawWidth, drawHeight);
    y += drawHeight + gap;
  }

  const dataUrl = canvas.toDataURL("image/png");
  const anchor = document.createElement("a");
  anchor.href = dataUrl;
  anchor.download = `${slugify(projectName) || "mockup-preview"}-fallback.png`;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 48);
}
