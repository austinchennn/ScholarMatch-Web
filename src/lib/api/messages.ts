import { request } from "./client";

export interface Message {
  messageId: string;
  senderId: string;
  receiverId: string;
  content: string;
  sentAt: string;
}

export function sendMessage(token: string, receiverId: string, content: string) {
  return request<Message>("/api/messages", {
    method: "POST",
    token,
    body: JSON.stringify({ receiverId, content }),
  });
}

export function getConversation(token: string, otherScholarId: string) {
  return request<Message[]>(`/api/messages/${otherScholarId}`, { token });
}
