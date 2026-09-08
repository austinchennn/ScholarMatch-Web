import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { ConversationPartner } from "@/lib/api";
import MatchesLayout from "./layout";
import { MatchesSidebar } from "./MatchesSidebar";

const actionMocks = vi.hoisted(() => ({
  fetchConversationsAction: vi.fn(),
  withAuthRedirect: vi.fn(),
}));

vi.mock("@/app/actions/messages", () => ({
  fetchConversationsAction: actionMocks.fetchConversationsAction,
}));

vi.mock("@/lib/session", () => ({
  withAuthRedirect: actionMocks.withAuthRedirect,
}));

vi.mock("next/navigation", () => ({
  usePathname: () => "/matches/match-id",
}));

function conversation(
  scholarId: string,
  firstName: string,
  lastName: string,
  relationship: ConversationPartner["relationship"]
): ConversationPartner {
  return {
    scholarId,
    firstName,
    lastName,
    email: `${scholarId}@example.com`,
    relationship,
  };
}

describe("MatchesSidebar", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("loads conversations through the server action", async () => {
    const conversations = [conversation("match-id", "Ada", "Lovelace", "MATCH")];
    actionMocks.fetchConversationsAction.mockResolvedValue(conversations);
    actionMocks.withAuthRedirect.mockImplementation(async (load) => load());

    await MatchesLayout({ children: createElement("div") });

    expect(actionMocks.withAuthRedirect).toHaveBeenCalledWith(
      actionMocks.fetchConversationsAction
    );
    expect(actionMocks.fetchConversationsAction).toHaveBeenCalledOnce();
  });

  it("renders match and application conversations once", () => {
    const conversations = [
      conversation("match-id", "Ada", "Lovelace", "MATCH"),
      conversation("application-id", "Grace", "Hopper", "APPLICATION"),
      conversation("application-id", "Grace", "Hopper", "APPLICATION"),
    ];

    const markup = renderToStaticMarkup(
      createElement(MatchesSidebar, { conversations })
    );

    expect(markup).toContain("Chats");
    expect(markup.match(/Ada Lovelace/g)).toHaveLength(1);
    expect(markup.match(/Grace Hopper/g)).toHaveLength(1);
    expect(markup.match(/via posting/g)).toHaveLength(1);
  });
});
