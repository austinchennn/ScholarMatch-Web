import { fetchApiClient, type ApiClient } from "./client";
import type { ScholarProfile } from "./profile";

export interface ConversationPartner extends ScholarProfile {
  relationship: "MATCH" | "APPLICATION";
}

export function getConversations(token: string, client: ApiClient = fetchApiClient) {
  return client.request<ConversationPartner[]>("/api/conversations", { token });
}
