import { requireSessionToken } from "@/lib/session";
import { AdminDashboard } from "./AdminDashboard";

export default async function AdminPage() {
  await requireSessionToken();

  return (
    <div className="mx-auto w-full max-w-3xl">
      <h1 className="mb-8 text-2xl font-semibold">Admin</h1>
      <AdminDashboard />
    </div>
  );
}
