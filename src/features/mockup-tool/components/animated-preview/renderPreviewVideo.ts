type RenderPreviewVideoOptions = {
  slideImages: HTMLImageElement[];
  projectName: string;
  slideHoldDuration: number;
  transitionDuration: number;
  onProgress?: (value: number) => void;
};

const DEFAULT_FPS = 30;
const VIDEO_END_HOLD = 1000;

export async function renderPreviewVideo({
  slideImages,
  projectName,
  slideHoldDuration,
  transitionDuration,
  onProgress,
}: RenderPreviewVideoOptions) {
  if (!slideImages.length) {
    throw new Error("There are no slides to render.");
  }

  const mimeType = resolveVideoMimeType();
  if (!mimeType) {
    throw new Error(
      "This browser can export preview video only as WebM right now.",
    );
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

  const stream = canvas.captureStream(DEFAULT_FPS);
  const recorder = new MediaRecorder(stream, {
    mimeType,
    videoBitsPerSecond: 8_000_000,
  });
  const chunks: Blob[] = [];

  recorder.ondataavailable = (event) => {
    if (event.data.size > 0) {
      chunks.push(event.data);
    }
  };

  recorder.start(100);

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
    recorder.stop();
  }

  await new Promise<void>((resolve, reject) => {
    recorder.onstop = () => resolve();
    recorder.onerror = () => reject(new Error("Preview recording failed."));
  });

  stream.getTracks().forEach((track) => track.stop());

  const blob = new Blob(chunks, { type: mimeType });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = `${slugify(projectName) || "mockup-preview"}.webm`;
  anchor.click();
  URL.revokeObjectURL(url);
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

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 48);
}
