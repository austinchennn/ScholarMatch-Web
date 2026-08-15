import { redirect } from "next/navigation";
import { getSessionToken } from "@/lib/session";
import { MyPostings } from "./MyPostings";

export default async function MyPostingsPage() {
  const token = await getSessionToken();
  if (!token) {
    redirect("/login");
  }

  return (
    <div className="mx-auto w-full max-w-2xl">
      <h1 className="mb-8 text-2xl font-semibold">My postings</h1>
      <MyPostings />
    </div>
  );
}
