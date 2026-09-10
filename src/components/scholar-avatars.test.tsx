// @vitest-environment jsdom

import { cleanup, fireEvent, render, screen, within } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { Message, Notification, Posting, PostingApplication } from "@/lib/api";
import { MyApplications } from "@/app/(app)/applications/MyApplications";
import { ChatView } from "@/app/(app)/matches/[scholarId]/ChatView";
import { MessageBubble } from "@/app/(app)/matches/[scholarId]/MessageBubble";
import { NotificationsList } from "@/app/(app)/notifications/NotificationsList";
import { MyPostings } from "@/app/(app)/postings/mine/MyPostings";
import { PostingCard } from "./posting-card";
import { ScholarAvatar } from "./scholar-avatar";

const mocks = vi.hoisted(() => ({
  useQuery: vi.fn(),
  mutate: vi.fn(),
  invalidateQueries: vi.fn(),
}));

vi.mock("@tanstack/react-query", () => ({
  useQuery: mocks.useQuery,
  useMutation: () => ({ mutate: mocks.mutate, isPending: false }),
  useQueryClient: () => ({ invalidateQueries: mocks.invalidateQueries }),
}));
vi.mock("next/navigation", () => ({ useRouter: () => ({ push: vi.fn() }) }));
vi.mock("@/app/actions/postings", () => ({
  acceptApplicationAction: vi.fn(), boostPostingAction: vi.fn(),
  closePostingAction: vi.fn(), declineApplicationAction: vi.fn(),
  fetchPostingsAction: vi.fn(), unboostPostingAction: vi.fn(),
  fetchMyApplicationsAction: vi.fn(),
}));
vi.mock("@/app/actions/messages", () => ({
  fetchConversationAction: vi.fn(), sendMessageAction: vi.fn(),
}));
vi.mock("@/app/actions/notifications", () => ({
  fetchNotificationsAction: vi.fn(), markNotificationReadAction: vi.fn(),
}));

const applicantAvatar = "https://example.com/ada.jpg";
const posterAvatar = "https://example.com/grace.jpg";
const application: PostingApplication = {
  applicationId: "a1", postingId: "p1", postingTitle: "Research partner",
  applicantUserId: "ada", applicantName: "Ada Lovelace", applicantAvatarUrl: applicantAvatar,
  posterUserId: "grace", posterName: "Grace Hopper", posterAvatarUrl: posterAvatar,
  status: "PENDING", appliedAt: "2026-09-10T00:00:00",
};
const posting: Posting = {
  postingId: "p1", posterUserId: "grace", posterName: "Grace Hopper",
  posterAvatarUrl: posterAvatar, posterAcademicEmailVerified: true,
  title: "Research partner", applicantCount: 1, createdAt: "2026-09-10T00:00:00",
  active: true, full: false, closed: false, boosted: false, applications: [application],
};

beforeEach(() => {
  vi.clearAllMocks();
  // JSDOM doesn't fetch images. Exercise the real Base UI avatar's loaded/error states.
  vi.stubGlobal("Image", class {
    src = "";
    complete = true;
    get naturalWidth() { return this.src.includes("broken") ? 0 : 64; }
  });
});
afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});

function queryData(data: unknown) {
  mocks.useQuery.mockReturnValue({ data, isLoading: false, isError: false });
}

describe("scholar avatars", () => {
  it("shows a loaded image with the scholar's name", () => {
    render(<ScholarAvatar name="Ada Lovelace" avatarUrl={applicantAvatar} />);
    expect(screen.getByRole("img", { name: "Ada Lovelace" }).getAttribute("src")).toBe(applicantAvatar);
    expect(screen.queryByText("AL")).toBeNull();
  });

  it.each([undefined, null, "", "https://example.com/broken.jpg"])(
    "keeps initials when an image is missing or broken: %s", (avatarUrl) => {
      render(<ScholarAvatar name="Ada Lovelace" avatarUrl={avatarUrl} />);
      expect(screen.getByText("AL")).toBeDefined();
      expect(screen.queryByRole("img")).toBeNull();
    }
  );

  it("handles whitespace in names and an unknown name", () => {
    const { rerender } = render(<ScholarAvatar name={" \tAda\nLovelace "} />);
    expect(screen.getByText("AL")).toBeDefined();
    rerender(<ScholarAvatar name=" " />);
    expect(screen.getByText("?")).toBeDefined();
  });

  it("recovers when a broken image is replaced with a valid URL", () => {
    const { rerender } = render(<ScholarAvatar name="Ada Lovelace" avatarUrl="broken.jpg" />);
    expect(screen.getByText("AL")).toBeDefined();
    rerender(<ScholarAvatar name="Ada Lovelace" avatarUrl={applicantAvatar} />);
    expect(screen.getByRole("img").getAttribute("src")).toBe(applicantAvatar);
  });
});

describe("postings and applications", () => {
  it("shows applicant and poster avatars in My Postings while keeping review controls", () => {
    queryData([posting]);
    render(<MyPostings />);
    expect(screen.getByRole("img", { name: "Ada Lovelace" }).getAttribute("src")).toBe(applicantAvatar);
    expect(screen.getByRole("img", { name: "Grace Hopper" }).getAttribute("src")).toBe(posterAvatar);
    fireEvent.click(screen.getByRole("button", { name: "Accept" }));
    expect(mocks.mutate).toHaveBeenCalledWith("a1");
  });

  it("keeps applicant initials and Open chat for an accepted application without a photo", () => {
    queryData([{ ...posting, applications: [{ ...application, status: "ACCEPTED", applicantAvatarUrl: null }] }]);
    render(<MyPostings />);
    expect(screen.getByText("AL")).toBeDefined();
    expect(screen.getByRole("button", { name: "Open chat" }).getAttribute("href")).toBe("/matches/ada");
  });

  it("shows the poster's image in My Applications", () => {
    queryData([application]);
    render(<MyApplications />);
    expect(screen.getByRole("img", { name: "Grace Hopper" }).getAttribute("src")).toBe(posterAvatar);
    expect(screen.queryByRole("img", { name: "Ada Lovelace" })).toBeNull();
    expect(screen.getByText("PENDING")).toBeDefined();
  });

  it("handles removed postings and older application payloads", () => {
    queryData([{ ...application, postingTitle: null, posterName: null, posterAvatarUrl: undefined }]);
    render(<MyApplications />);
    expect(screen.getByText("Posting removed")).toBeDefined();
    expect(screen.getByText("Unknown poster")).toBeDefined();
    expect(screen.getByText("UP")).toBeDefined();
  });

  it("shows the poster in the shared opportunity card and falls back on a broken image", () => {
    const { rerender } = render(<PostingCard posting={posting} />);
    expect(screen.getByRole("img").getAttribute("src")).toBe(posterAvatar);
    rerender(<PostingCard posting={{ ...posting, posterAvatarUrl: "broken.jpg" }} />);
    expect(screen.getByText("GH")).toBeDefined();
  });
});

describe("chat", () => {
  it("shows initials beside incoming messages and no avatar beside outgoing messages", () => {
    const { rerender } = render(<MessageBubble content="Hello" isMine={false} senderName="Ada Lovelace" />);
    expect(screen.getByText("AL")).toBeDefined();
    rerender(<MessageBubble content="Hello" isMine senderName="Ada Lovelace" senderAvatarUrl={applicantAvatar} />);
    expect(screen.queryByText("AL")).toBeNull();
    expect(screen.queryByRole("img")).toBeNull();
    expect(screen.getByText("Hello")).toBeDefined();
  });

  it("uses message avatars, falls back to profile only for omitted fields, and respects null", () => {
    const messages: Message[] = [
      { messageId: "1", senderId: "ada", receiverId: "me", content: "New avatar", senderAvatarUrl: applicantAvatar, sentAt: "2026-09-10T00:00:01" },
      { messageId: "2", senderId: "ada", receiverId: "me", content: "Legacy message", sentAt: "2026-09-10T00:00:02" },
      { messageId: "3", senderId: "ada", receiverId: "me", content: "Removed avatar", senderAvatarUrl: null, sentAt: "2026-09-10T00:00:03" },
      { messageId: "4", senderId: "me", receiverId: "ada", content: "My message", senderAvatarUrl: posterAvatar, sentAt: "2026-09-10T00:00:04" },
    ];
    queryData(messages);
    render(<ChatView currentScholarId="me" otherScholarId="ada" otherName="Ada Lovelace" otherAvatarUrl="https://example.com/profile.jpg" />);
    const row = (text: string) => within(screen.getByText(text).parentElement!);
    expect(row("New avatar").getByRole("img").getAttribute("src")).toBe(applicantAvatar);
    expect(row("Legacy message").getByRole("img").getAttribute("src")).toBe("https://example.com/profile.jpg");
    expect(row("Removed avatar").getByText("AL")).toBeDefined();
    expect(row("My message").queryByRole("img")).toBeNull();
  });
});

describe("notifications", () => {
  const notification: Notification = {
    notificationId: "n1", type: "MESSAGE", message: "Ada sent you a message",
    actorName: "Ada Lovelace", actorAvatarUrl: applicantAvatar,
    relatedId: "ada", read: false, createdAt: "2026-09-10T00:00:00",
  };

  it("shows the actor image and retains the destination and mark-read action", () => {
    queryData([notification]);
    render(<NotificationsList />);
    expect(screen.getByRole("img", { name: "Ada Lovelace" }).getAttribute("src")).toBe(applicantAvatar);
    const link = screen.getByRole("link");
    expect(link.getAttribute("href")).toBe("/matches/ada");
    // Prevent jsdom navigation while still exercising the click handler.
    link.addEventListener("click", (event) => event.preventDefault());
    fireEvent.click(link);
    expect(mocks.mutate).toHaveBeenCalledWith("n1");
    expect(screen.getByText("New")).toBeDefined();
  });

  it("uses the actor's initials on image failure", () => {
    queryData([{ ...notification, actorAvatarUrl: "broken.jpg", read: true }]);
    render(<NotificationsList />);
    expect(screen.getByText("AL")).toBeDefined();
    expect(screen.queryByText("New")).toBeNull();
  });

  it("uses a generic fallback for old notifications without actor metadata", () => {
    queryData([{ ...notification, actorName: undefined, actorAvatarUrl: undefined }]);
    render(<NotificationsList />);
    expect(screen.getByText("S")).toBeDefined();
    expect(screen.getByText(notification.message)).toBeDefined();
  });
});
