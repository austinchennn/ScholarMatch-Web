import { redirect } from "next/navigation";
import { getSessionToken } from "@/lib/session";
import { SearchBox } from "./SearchBox";

export default async function SearchPage(props: PageProps<"/search">) {
  const token = await getSessionToken();
  if (!token) {
    redirect("/login");
  }

  const { q } = await props.searchParams;
  const initialQuery = typeof q === "string" ? q : "";

  return (
    <div className="mx-auto w-full max-w-2xl">
      <h1 className="mb-8 text-2xl font-semibold">Search scholars</h1>
      <SearchBox initialQuery={initialQuery} />
    </div>
  );
}
