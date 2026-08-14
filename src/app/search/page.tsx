import { redirect } from "next/navigation";
import { getSessionToken } from "@/lib/session";
import { SearchBox } from "./SearchBox";

export default async function SearchPage() {
  const token = await getSessionToken();
  if (!token) {
    redirect("/login");
  }

  return (
    <div className="mx-auto w-full max-w-2xl px-6 py-16">
      <h1 className="mb-8 text-2xl font-semibold">Search scholars</h1>
      <SearchBox />
    </div>
  );
}
