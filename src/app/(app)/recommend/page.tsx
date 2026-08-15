import { redirect } from "next/navigation";

// The recommend feed now lives on the Home page (see dashboard/page.tsx) — this route just
// keeps old links/bookmarks working.
export default function RecommendPage() {
  redirect("/dashboard");
}
