import { redirect } from "next/navigation";
import { getSessionToken } from "@/lib/session";
import { NewPostingForm } from "./NewPostingForm";

export default async function NewPostingPage() {
  const token = await getSessionToken();
  if (!token) {
    redirect("/login");
  }

  return (
    <div className="mx-auto w-full max-w-lg">
      <h1 className="mb-8 text-2xl font-semibold">New posting</h1>
      <NewPostingForm />
    </div>
  );
}
