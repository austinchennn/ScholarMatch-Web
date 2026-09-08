import { beforeEach, describe, expect, it, vi } from "vitest";
import type { PostingApplication } from "@/lib/api";
import { MyPostings } from "./MyPostings";

interface MutationOptions {
  mutationFn: unknown;
  onSuccess?: (data: PostingApplication) => void;
}

const actionMocks = vi.hoisted(() => ({
  acceptApplicationAction: vi.fn(),
  declineApplicationAction: vi.fn(),
  fetchPostingsAction: vi.fn(),
}));

const navigationMocks = vi.hoisted(() => ({
  push: vi.fn(),
}));

const queryMocks = vi.hoisted(() => ({
  invalidateQueries: vi.fn(),
  useMutation: vi.fn(() => ({ mutate: vi.fn(), isPending: false })),
  useQuery: vi.fn(() => ({ isLoading: false, isError: false, data: [] })),
}));

const toastMocks = vi.hoisted(() => ({
  error: vi.fn(),
  success: vi.fn(),
}));

vi.mock("@/app/actions/postings", () => ({
  acceptApplicationAction: actionMocks.acceptApplicationAction,
  boostPostingAction: vi.fn(),
  closePostingAction: vi.fn(),
  declineApplicationAction: actionMocks.declineApplicationAction,
  fetchPostingsAction: actionMocks.fetchPostingsAction,
  unboostPostingAction: vi.fn(),
}));

vi.mock("@tanstack/react-query", () => ({
  useMutation: queryMocks.useMutation,
  useQuery: queryMocks.useQuery,
  useQueryClient: () => ({ invalidateQueries: queryMocks.invalidateQueries }),
}));

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: navigationMocks.push }),
}));

vi.mock("sonner", () => ({
  toast: toastMocks,
}));

const application: PostingApplication = {
  applicationId: "application-id",
  postingId: "posting-id",
  applicantUserId: "applicant-id",
  applicantName: "Ada Lovelace",
  status: "ACCEPTED",
  appliedAt: "2026-09-07T00:00:00Z",
};

function mutationOptions(mutationFn: unknown): MutationOptions {
  const calls = queryMocks.useMutation.mock.calls as unknown as Array<[MutationOptions]>;
  const call = calls.find(([options]) => options.mutationFn === mutationFn);

  if (!call) {
    throw new Error("Mutation was not registered");
  }

  return call[0] as MutationOptions;
}

describe("MyPostings", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("opens the applicant chat after accepting an application", () => {
    MyPostings();

    mutationOptions(actionMocks.acceptApplicationAction).onSuccess?.(application);

    expect(queryMocks.invalidateQueries).toHaveBeenCalledWith({
      queryKey: ["postings", "MINE"],
    });
    expect(toastMocks.success).toHaveBeenCalledWith("Accepted — opening chat");
    expect(navigationMocks.push).toHaveBeenCalledWith("/matches/applicant-id");
  });

  it("stays on My Postings after declining an application", () => {
    MyPostings();

    mutationOptions(actionMocks.declineApplicationAction).onSuccess?.(application);

    expect(queryMocks.invalidateQueries).toHaveBeenCalledWith({
      queryKey: ["postings", "MINE"],
    });
    expect(toastMocks.success).toHaveBeenCalledWith("Application declined");
    expect(navigationMocks.push).not.toHaveBeenCalled();
  });
});
