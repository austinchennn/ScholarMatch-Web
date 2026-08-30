import { redirect } from "next/navigation";
import { getSessionToken } from "@/lib/session";
import { LandingExperience } from "@/components/landing/landing-experience";

export default async function Home() {
  const token = await getSessionToken();
  if (token) {
    redirect("/dashboard");
  }

  return <LandingExperience />;
}
