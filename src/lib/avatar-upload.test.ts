// @vitest-environment jsdom

import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { MAX_AVATAR_BYTES, MAX_AVATAR_FILE_BYTES, prepareAvatar } from "./avatar-upload";

let width: number;
let height: number;
let decodeFails: boolean;
let outputSizes: number[];
const drawImage = vi.fn();
const fillRect = vi.fn();
const createObjectURL = vi.fn(() => "blob:avatar");
const revokeObjectURL = vi.fn();

function photo(size = 100, type = "image/jpeg") {
  return new File([new Uint8Array(size)], "photo.jpg", { type });
}

beforeEach(() => {
  vi.clearAllMocks();
  width = 4000;
  height = 3000;
  decodeFails = false;
  outputSizes = [1024];
  vi.stubGlobal("Image", class {
    naturalWidth = width;
    naturalHeight = height;
    onload?: () => void;
    onerror?: () => void;
    set src(_value: string) {
      queueMicrotask(() => decodeFails ? this.onerror?.() : this.onload?.());
    }
  });
  vi.stubGlobal("URL", { createObjectURL, revokeObjectURL });
  vi.spyOn(HTMLCanvasElement.prototype, "getContext").mockReturnValue({ drawImage, fillRect } as unknown as CanvasRenderingContext2D);
  vi.spyOn(HTMLCanvasElement.prototype, "toBlob").mockImplementation((callback) => {
    const size = outputSizes.length > 1 ? outputSizes.shift()! : outputSizes[0];
    callback(new Blob([new Uint8Array(size)], { type: "image/jpeg" }));
  });
  vi.spyOn(FileReader.prototype, "readAsDataURL");
});
afterEach(() => {
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

describe("prepareAvatar", () => {
  it("accepts an 8 MB photo and encodes only a compressed 512px image", async () => {
    const file = photo(8 * 1024 * 1024);
    const result = await prepareAvatar(file);
    expect(drawImage).toHaveBeenCalledWith(expect.anything(), 0, 0, 512, 384);
    expect(fillRect).toHaveBeenCalledWith(0, 0, 512, 384);
    expect(result).toMatch(/^data:image\/jpeg;base64,/);
    const encodedBlob = vi.mocked(FileReader.prototype.readAsDataURL).mock.calls[0][0];
    expect(encodedBlob).not.toBe(file);
    expect(encodedBlob.size).toBeLessThanOrEqual(MAX_AVATAR_BYTES);
    expect(result.length).toBeLessThan(350000);
    expect(revokeObjectURL).toHaveBeenCalledWith("blob:avatar");
  });

  it.each([
    [3000, 4000, 384, 512],
    [128, 64, 128, 64],
    [2000, 2000, 512, 512],
    [10000, 1, 512, 1],
  ])("keeps proportions without upscaling %sx%s", async (w, h, expectedW, expectedH) => {
    width = w;
    height = h;
    await prepareAvatar(photo());
    expect(drawImage).toHaveBeenCalledWith(expect.anything(), 0, 0, expectedW, expectedH);
  });

  it.each([
    [100, "text/plain", "image file"],
    [0, "image/png", "empty"],
    [MAX_AVATAR_FILE_BYTES + 1, "image/jpeg", "10 MB"],
  ])("rejects invalid files before decoding or base64 encoding (%s bytes, %s)", async (size, type, message) => {
    await expect(prepareAvatar(photo(size, type))).rejects.toThrow(message);
    expect(createObjectURL).not.toHaveBeenCalled();
    expect(FileReader.prototype.readAsDataURL).not.toHaveBeenCalled();
  });

  it("accepts the input size limit", async () => {
    await expect(prepareAvatar(photo(MAX_AVATAR_FILE_BYTES))).resolves.toMatch(/^data:image/);
  });

  it("reduces JPEG quality until the compressed output fits", async () => {
    outputSizes = [MAX_AVATAR_BYTES + 1, MAX_AVATAR_BYTES];
    await prepareAvatar(photo());
    expect(HTMLCanvasElement.prototype.toBlob).toHaveBeenNthCalledWith(1, expect.any(Function), "image/jpeg", 0.85);
    expect(HTMLCanvasElement.prototype.toBlob).toHaveBeenNthCalledWith(2, expect.any(Function), "image/jpeg", 0.7);
    expect(FileReader.prototype.readAsDataURL).toHaveBeenCalledOnce();
  });

  it("rejects oversized compressed output before base64 encoding", async () => {
    outputSizes = [MAX_AVATAR_BYTES + 1];
    await expect(prepareAvatar(photo())).rejects.toThrow("too large after compression");
    expect(FileReader.prototype.readAsDataURL).not.toHaveBeenCalled();
    expect(revokeObjectURL).toHaveBeenCalledWith("blob:avatar");
  });

  it("rejects a corrupt image and releases its object URL", async () => {
    decodeFails = true;
    await expect(prepareAvatar(photo())).rejects.toThrow("Could not read");
    expect(drawImage).not.toHaveBeenCalled();
    expect(FileReader.prototype.readAsDataURL).not.toHaveBeenCalled();
    expect(revokeObjectURL).toHaveBeenCalledWith("blob:avatar");
  });

  it("rejects zero-sized decoded images", async () => {
    width = 0;
    await expect(prepareAvatar(photo())).rejects.toThrow("Could not read");
  });

  it("reports unavailable canvas support", async () => {
    vi.mocked(HTMLCanvasElement.prototype.getContext).mockReturnValue(null);
    await expect(prepareAvatar(photo())).rejects.toThrow("browser could not process");
    expect(revokeObjectURL).toHaveBeenCalledWith("blob:avatar");
  });

  it("reports an encoder failure", async () => {
    vi.mocked(HTMLCanvasElement.prototype.toBlob).mockImplementation((callback) => callback(null));
    await expect(prepareAvatar(photo())).rejects.toThrow("Could not compress");
    expect(FileReader.prototype.readAsDataURL).not.toHaveBeenCalled();
  });

  it("reports a FileReader failure and still releases the object URL", async () => {
    vi.mocked(FileReader.prototype.readAsDataURL).mockImplementation(function (this: FileReader) {
      this.dispatchEvent(new ProgressEvent("error"));
    });
    await expect(prepareAvatar(photo())).rejects.toThrow("Could not prepare");
    expect(revokeObjectURL).toHaveBeenCalledWith("blob:avatar");
  });
});
