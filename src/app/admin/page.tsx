import { redirect } from "next/navigation";
import { getSessionToken } from "@/lib/session";
import { AdminDashboard } from "./AdminDashboard";

export default async function AdminPage() {
  const token = await getSessionToken();
  if (!token) {
    redirect("/login");
  }

  return (
    <div className="mx-auto w-full max-w-3xl px-6 py-16">
      <h1 className="mb-8 text-2xl font-semibold">Admin</h1>
      <AdminDashboard />
    </div>
  );
}
