import { requireSessionToken } from "@/lib/session";
import { NewPostingForm } from "./NewPostingForm";

export default async function NewPostingPage() {
  await requireSessionToken();

  return (
    <div className="mx-auto w-full max-w-lg">
      <h1 className="mb-8 text-2xl font-semibold">New posting</h1>
      <NewPostingForm />
    </div>
  );
}
