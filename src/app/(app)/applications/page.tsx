import { requireSessionToken } from "@/lib/session";
import { MyApplications } from "./MyApplications";

export default async function ApplicationsPage() {
  await requireSessionToken();

  return (
    <div className="mx-auto w-full max-w-2xl">
      <h1 className="mb-8 text-2xl font-semibold">My applications</h1>
      <MyApplications />
    </div>
  );
}
