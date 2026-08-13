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

      <main className="flex flex-1 flex-col items-center gap-16 px-6 py-16 sm:px-12">
        <div className="flex max-w-2xl flex-col items-center gap-6 text-center">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
            Find your next research collaborator.
          </h1>
          <p className="text-lg text-muted-foreground">
            ScholarMatch pairs researchers and students by shared interests,
            with a dedicated feed for open collaboration opportunities.
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
      </main>
    </div>
  );
}
