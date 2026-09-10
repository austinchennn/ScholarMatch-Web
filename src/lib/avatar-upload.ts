export const MAX_AVATAR_FILE_BYTES = 10 * 1024 * 1024;
export const MAX_AVATAR_BYTES = 256 * 1024;
export const MAX_AVATAR_DIMENSION = 512;

function loadImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error("Could not read this image. Try a JPEG, PNG, or WebP photo."));
    image.src = url;
  });
}

function encodeImage(canvas: HTMLCanvasElement, quality: number): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => blob ? resolve(blob) : reject(new Error("Could not compress this image. Try another photo.")),
      "image/jpeg",
      quality
    );
  });
}

function readDataUrl(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    const fail = () => reject(new Error("Could not prepare this image. Please try again."));
    reader.onload = () => typeof reader.result === "string" ? resolve(reader.result) : fail();
    reader.onerror = fail;
    reader.onabort = fail;
    reader.readAsDataURL(blob);
  });
}

/** Only the bounded, compressed image is base64 encoded, never the original photo. */
export async function prepareAvatar(file: File): Promise<string> {
  if (!file.type.startsWith("image/")) {
    throw new Error("Please choose an image file.");
  }
  if (file.size === 0) {
    throw new Error("This image is empty. Please choose another photo.");
  }
  if (file.size > MAX_AVATAR_FILE_BYTES) {
    throw new Error("Please choose an image that is 10 MB or smaller.");
  }

  const url = URL.createObjectURL(file);
  try {
    const image = await loadImage(url);
    if (!image.naturalWidth || !image.naturalHeight) {
      throw new Error("Could not read this image. Please choose another photo.");
    }

    const scale = Math.min(1, MAX_AVATAR_DIMENSION / Math.max(image.naturalWidth, image.naturalHeight));
    const canvas = document.createElement("canvas");
    canvas.width = Math.max(1, Math.round(image.naturalWidth * scale));
    canvas.height = Math.max(1, Math.round(image.naturalHeight * scale));
    const context = canvas.getContext("2d");
    if (!context) {
      throw new Error("Your browser could not process this image. Please try again.");
    }

    // JPEG has no alpha channel; keep transparent areas from turning black.
    context.fillStyle = "#fff";
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.drawImage(image, 0, 0, canvas.width, canvas.height);

    for (const quality of [0.85, 0.7, 0.55, 0.4]) {
      const blob = await encodeImage(canvas, quality);
      if (blob.size > 0 && blob.size <= MAX_AVATAR_BYTES) {
        // Base64 adds ~33%, keeping the avatar well below the Server Action's 1 MB limit.
        return await readDataUrl(blob);
      }
    }
    throw new Error("This image is still too large after compression. Please choose another photo.");
  } finally {
    URL.revokeObjectURL(url);
  }
}
