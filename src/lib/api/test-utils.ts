import type { ApiClient, RequestOptions } from "./client";

export interface RecordedCall {
  path: string;
  options: RequestOptions;
}

// Shared across every domain module's test file: a fake ApiClient that records every call
// instead of hitting the network, and returns a fixed response. This is the whole point of
// the ApiClient abstraction from the DIP refactor — none of these tests touch fetch.
export function fakeClient(response: unknown = undefined) {
  const calls: RecordedCall[] = [];
  const client: ApiClient = {
    async request<T>(path: string, options: RequestOptions = {}): Promise<T> {
      calls.push({ path, options });
      return response as T;
    },
  };
  return { client, calls };
}

export function jsonBody(call: RecordedCall): unknown {
  return call.options.body ? JSON.parse(call.options.body as string) : undefined;
}
