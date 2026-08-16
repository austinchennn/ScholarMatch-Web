import { fetchApiClient, type ApiClient } from "./client";

export interface Message {
  messageId: string;
  senderId: string;
  receiverId: string;
  content: string;
  sentAt: string;
}

export function sendMessage(
  token: string,
  receiverId: string,
  content: string,
  client: ApiClient = fetchApiClient
) {
  return client.request<Message>("/api/messages", {
    method: "POST",
    token,
    body: JSON.stringify({ receiverId, content }),
  });
}

export function getConversation(
  token: string,
  otherScholarId: string,
  client: ApiClient = fetchApiClient
) {
  return client.request<Message[]>(`/api/messages/${otherScholarId}`, { token });
}
