// @vitest-environment jsdom

import { act, cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { ScholarProfile } from "@/lib/api";
import { prepareAvatar } from "@/lib/avatar-upload";
import { updateProfileAction } from "@/app/actions/profile";
import { AvatarUploadField } from "./AvatarUploadField";
import { ProfileEditForm } from "./ProfileEditForm";

vi.mock("@/lib/avatar-upload", () => ({ prepareAvatar: vi.fn() }));
vi.mock("@/app/actions/profile", () => ({ updateProfileAction: vi.fn() }));
vi.mock("next/navigation", () => ({ useRouter: () => ({ push: vi.fn() }) }));
vi.mock("sonner", () => ({ toast: { error: vi.fn(), success: vi.fn() } }));

const dataUrl = "data:image/jpeg;base64,YXZhdGFy";
const file = new File(["photo"], "photo.jpg", { type: "image/jpeg" });

function selectFile(files: File[] = [file]) {
  fireEvent.change(screen.getByLabelText("Avatar"), { target: { files } });
}

beforeEach(() => {
  vi.resetAllMocks();
  vi.stubGlobal("Image", class { complete = true; naturalWidth = 64; });
});
afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});

describe("AvatarUploadField", () => {
  it("waits for compression, reports progress, and delivers the compressed image", async () => {
    let finish!: (value: string) => void;
    vi.mocked(prepareAvatar).mockReturnValue(new Promise((resolve) => { finish = resolve; }));
    const onFileSelected = vi.fn();
    const onProcessingChange = vi.fn();
    render(<AvatarUploadField name="Ada Lovelace" preview={null} onFileSelected={onFileSelected} onProcessingChange={onProcessingChange} />);

    selectFile();
    expect(prepareAvatar).toHaveBeenCalledWith(file);
    expect((screen.getByLabelText("Avatar") as HTMLInputElement).disabled).toBe(true);
    expect(screen.getByRole("status").textContent).toBe("Preparing photo…");
    expect(onFileSelected).not.toHaveBeenCalled();
    expect(onProcessingChange).toHaveBeenCalledWith(true);

    await act(async () => finish(dataUrl));
    expect(onFileSelected).toHaveBeenCalledWith(dataUrl);
    expect(onProcessingChange).toHaveBeenLastCalledWith(false);
    expect(screen.queryByRole("status")).toBeNull();
    expect((screen.getByLabelText("Avatar") as HTMLInputElement).disabled).toBe(false);
  });

  it.each([
    "Please choose an image file.",
    "Please choose an image that is 10 MB or smaller.",
    "Could not read this image. Try a JPEG, PNG, or WebP photo.",
  ])("shows a visible error and keeps the previous avatar: %s", async (message) => {
    vi.mocked(prepareAvatar).mockRejectedValue(new Error(message));
    const onFileSelected = vi.fn();
    render(<AvatarUploadField name="Ada Lovelace" preview="https://example.com/old.jpg" onFileSelected={onFileSelected} onProcessingChange={vi.fn()} />);
    selectFile();
    expect((await screen.findByRole("alert")).textContent).toBe(message);
    expect(screen.getByLabelText("Avatar").getAttribute("aria-invalid")).toBe("true");
    expect(screen.getByRole("img").getAttribute("src")).toBe("https://example.com/old.jpg");
    expect(onFileSelected).not.toHaveBeenCalled();
  });

  it("allows retrying the same file and clears its previous error", async () => {
    vi.mocked(prepareAvatar).mockRejectedValueOnce(new Error("Could not read this image.")).mockResolvedValueOnce(dataUrl);
    const onFileSelected = vi.fn();
    render(<AvatarUploadField name="Ada Lovelace" preview={null} onFileSelected={onFileSelected} onProcessingChange={vi.fn()} />);
    selectFile();
    await screen.findByRole("alert");
    expect((screen.getByLabelText("Avatar") as HTMLInputElement).value).toBe("");
    selectFile();
    await waitFor(() => expect(onFileSelected).toHaveBeenCalledWith(dataUrl));
    expect(screen.queryByRole("alert")).toBeNull();
  });

  it("ignores cancellation and selections while disabled", () => {
    const onFileSelected = vi.fn();
    const props = { name: "Ada Lovelace", preview: null, onFileSelected, onProcessingChange: vi.fn() };
    const { rerender } = render(<AvatarUploadField {...props} />);
    selectFile([]);
    rerender(<AvatarUploadField {...props} disabled />);
    selectFile();
    expect(prepareAvatar).not.toHaveBeenCalled();
    expect(onFileSelected).not.toHaveBeenCalled();
  });
});

describe("profile avatar saving", () => {
  const profile: ScholarProfile = {
    scholarId: "ada", firstName: "Ada", lastName: "Lovelace", email: "ada@example.com",
  };

  it("prevents saving until compression finishes and sends the compressed payload", async () => {
    let finish!: (value: string) => void;
    vi.mocked(prepareAvatar).mockReturnValue(new Promise((resolve) => { finish = resolve; }));
    vi.mocked(updateProfileAction).mockResolvedValue({ success: true });
    render(<ProfileEditForm profile={profile} />);
    selectFile();
    const save = screen.getByRole("button", { name: "Save profile" }) as HTMLButtonElement;
    expect(save.disabled).toBe(true);
    fireEvent.click(save);
    expect(updateProfileAction).not.toHaveBeenCalled();

    await act(async () => finish(dataUrl));
    expect(save.disabled).toBe(false);
    expect(screen.getByRole("img", { name: "Ada Lovelace" }).getAttribute("src")).toBe(dataUrl);
    fireEvent.click(save);
    await waitFor(() => expect(updateProfileAction).toHaveBeenCalledWith(expect.objectContaining({ avatarBase64: dataUrl })));
  });

  it("allows saving other profile changes after an invalid avatar without replacing the old photo", async () => {
    vi.mocked(prepareAvatar).mockRejectedValue(new Error("Please choose an image file."));
    vi.mocked(updateProfileAction).mockResolvedValue({ success: true });
    render(<ProfileEditForm profile={{ ...profile, avatarUrl: "https://example.com/old.jpg" }} />);
    selectFile();
    await screen.findByRole("alert");
    const save = screen.getByRole("button", { name: "Save profile" }) as HTMLButtonElement;
    expect(save.disabled).toBe(false);
    fireEvent.click(save);
    await waitFor(() => expect(updateProfileAction).toHaveBeenCalledWith(expect.objectContaining({ avatarBase64: undefined })));
  });
});
