// Barrel re-export: every existing `import ... from "@/lib/api"` call site keeps working
// unchanged. The implementation is split into one file per domain (mirroring the boundaries
// already established by src/app/actions/*.ts) instead of one 400+ line module covering
// auth, profile, matches, messages, recommend, postings, account, search, notifications,
// admin, and billing at once.
export * from "./client";
export * from "./auth";
export * from "./profile";
export * from "./matches";
export * from "./messages";
export * from "./recommend";
export * from "./postings";
export * from "./account";
export * from "./search";
export * from "./notifications";
export * from "./admin";
export * from "./billing";
