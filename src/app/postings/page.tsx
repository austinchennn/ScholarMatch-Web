import Link from "next/link";
import { redirect } from "next/navigation";
import { getSessionToken } from "@/lib/session";
import { Button } from "@/components/ui/button";
import { PostingsBrowse } from "./PostingsBrowse";

export default async function PostingsPage() {
  const token = await getSessionToken();
  if (!token) {
    redirect("/login");
  }

  return (
    <div className="mx-auto w-full max-w-2xl px-6 py-16">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Research postings</h1>
        <Button size="sm" render={<Link href="/postings/new">New posting</Link>} />
      </div>
      <PostingsBrowse />
    </div>
  );
}
