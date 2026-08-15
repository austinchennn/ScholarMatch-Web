import { redirect } from "next/navigation";
import { getSessionToken } from "@/lib/session";
import { BillingView } from "./BillingView";

export default async function BillingPage() {
  const token = await getSessionToken();
  if (!token) {
    redirect("/login");
  }

  return (
    <div className="mx-auto w-full max-w-lg">
      <h1 className="mb-8 text-2xl font-semibold">Billing</h1>
      <BillingView />
    </div>
  );
}
