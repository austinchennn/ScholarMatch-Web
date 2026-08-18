import { requireSessionToken } from "@/lib/session";
import { BillingView } from "./BillingView";

export default async function BillingPage() {
  await requireSessionToken();

  return (
    <div className="mx-auto w-full max-w-lg">
      <h1 className="mb-8 text-2xl font-semibold">Billing</h1>
      <BillingView />
    </div>
  );
}
