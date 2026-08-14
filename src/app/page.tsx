import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const FEATURES = [
  {
    title: "Matched by research fit",
    description:
      "A semantic recommendation feed ranks potential collaborators by shared research interests, not just keywords.",
  },
  {
    title: "Mutual-match connections",
    description:
      "Connect only when interest goes both ways — messaging opens up once you've matched.",
  },
  {
    title: "Research postings",
    description:
      "Post open collaboration opportunities, review applicants, and manage your research team in one place.",
  },
];

const STEPS = [
  {
    step: "1",
    title: "Build your profile",
    description:
      "Add your research field, interests, and a short description of what you're working on.",
  },
  {
    step: "2",
    title: "Get matched",
    description:
      "Browse a feed ranked by shared research interests, and connect with the ones worth a conversation.",
  },
  {
    step: "3",
    title: "Collaborate",
    description:
      "Message your matches directly, or post an opening and review who applies.",
  },
];

export default function Home() {
  return (
    <div className="flex flex-1 flex-col">
      <header className="flex items-center justify-between px-6 py-4 sm:px-12">
        <span className="text-lg font-semibold">ScholarMatch</span>
        <nav className="flex items-center gap-2">
          <Button variant="ghost" render={<Link href="/login">Log in</Link>} />
          <Button render={<Link href="/register">Sign up</Link>} />
        </nav>
      </header>

      <main className="flex flex-1 flex-col items-center gap-24 px-6 py-16 sm:px-12">
        <div className="flex max-w-2xl flex-col items-center gap-6 text-center">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
            Find your next research collaborator.
          </h1>
          <p className="text-lg text-muted-foreground">
            An academic matchmaking network for researchers and students — a
            recommendation feed for finding collaborators, mutual-match
            connections, and a board for open research opportunities.
          </p>
          <div className="flex gap-3">
            <Button size="lg" render={<Link href="/register">Get started</Link>} />
            <Button
              size="lg"
              variant="outline"
              render={<Link href="/login">Log in</Link>}
            />
          </div>
        </div>

        <div className="grid w-full max-w-4xl gap-4 sm:grid-cols-3">
          {FEATURES.map((feature) => (
            <Card key={feature.title}>
              <CardHeader>
                <CardTitle className="text-base">{feature.title}</CardTitle>
                <CardDescription>{feature.description}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>

        <div className="flex w-full max-w-4xl flex-col gap-10">
          <h2 className="text-center text-2xl font-semibold">How it works</h2>
          <div className="grid gap-8 sm:grid-cols-3">
            {STEPS.map((s) => (
              <div key={s.step} className="flex flex-col items-center gap-3 text-center">
                <span className="flex size-9 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">
                  {s.step}
                </span>
                <h3 className="font-medium">{s.title}</h3>
                <p className="text-sm text-muted-foreground">{s.description}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="flex w-full max-w-2xl flex-col items-center gap-4 rounded-xl border bg-muted/30 px-6 py-10 text-center">
          <h2 className="text-xl font-semibold">Ready to find who to work with next?</h2>
          <Button size="lg" render={<Link href="/register">Create your profile</Link>} />
        </div>
      </main>

      <footer className="border-t px-6 py-8 text-center text-sm text-muted-foreground sm:px-12">
        ScholarMatch — an academic matchmaking and collaboration network.
      </footer>
    </div>
  );
}
