"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Radar,
  HeartHandshake,
  Megaphone,
  MessagesSquare,
  ListChecks,
  ArrowRight,
  type LucideIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Capability = {
  key: string;
  label: string;
  tagline: string;
  icon: LucideIcon;
  steps: string[];
  /** Centre of the tag as a percentage of the stage, also the connector endpoint. */
  pos: { x: number; y: number };
  /** Float rhythm, hand-desynced so the cluster never pulses in unison. */
  float: { dur: number; delay: number };
};

const CAPABILITIES: Capability[] = [
  {
    key: "matching",
    label: "Research-fit matching",
    tagline: "Ranked by what you actually study, not keyword bingo.",
    icon: Radar,
    steps: [
      "Fill in your field, interests and current focus on your profile.",
      "Open the feed — profiles are ordered by semantic overlap with yours.",
      "Send a like to anyone worth a conversation and skip the rest.",
    ],
    pos: { x: 39, y: 9 },
    float: { dur: 6.5, delay: 0 },
  },
  {
    key: "mutual",
    label: "Mutual matches",
    tagline: "Messaging unlocks only when the interest is mutual.",
    icon: HeartHandshake,
    steps: [
      "Like the researchers you would genuinely want to work with.",
      "When they like you back, it becomes a match.",
      "Each match opens a private thread — no cold inboxes.",
    ],
    pos: { x: 53, y: 28 },
    float: { dur: 7.8, delay: -2 },
  },
  {
    key: "postings",
    label: "Research postings",
    tagline: "Advertise an opening and let the right people come to you.",
    icon: Megaphone,
    steps: [
      "Create a posting with the role, scope and what you are looking for.",
      "It surfaces to researchers whose interests fit the work.",
      "Applicants land in one queue instead of scattered emails.",
    ],
    pos: { x: 62, y: 50 },
    float: { dur: 6, delay: -3.5 },
  },
  {
    key: "messaging",
    label: "Private messaging",
    tagline: "Talk once you have both opted in — you stay in control.",
    icon: MessagesSquare,
    steps: [
      "Every match gets its own dedicated conversation.",
      "Share links, papers and availability inline.",
      "Mute or unmatch at any time, no explanation needed.",
    ],
    pos: { x: 52, y: 72 },
    float: { dur: 8.2, delay: -1 },
  },
  {
    key: "review",
    label: "Applicant review",
    tagline: "Shortlist a team without leaving the page for a spreadsheet.",
    icon: ListChecks,
    steps: [
      "See each applicant's profile, fit and note side by side.",
      "Shortlist, pass, or start a conversation from one screen.",
      "Track who you have already answered so nothing slips.",
    ],
    pos: { x: 38, y: 91 },
    float: { dur: 7, delay: -4 },
  },
];

const LOGO_ANCHOR = { x: 12, y: 50 };

function CapabilityGuide({ capability }: { capability: Capability }) {
  const Icon = capability.icon;
  return (
    <div
      key={capability.key}
      className="flex flex-col gap-5 animate-in fade-in slide-in-from-bottom-3 duration-300"
    >
      <div className="flex items-center gap-3">
        <span className="flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary ring-1 ring-primary/20">
          <Icon className="size-5" />
        </span>
        <div>
          <h2 className="font-heading text-xl font-semibold tracking-tight">
            {capability.label}
          </h2>
          <p className="text-sm text-muted-foreground">{capability.tagline}</p>
        </div>
      </div>

      <ol className="flex flex-col gap-3">
        {capability.steps.map((step, i) => (
          <li key={i} className="flex gap-3 text-sm">
            <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-secondary text-[0.7rem] font-semibold text-secondary-foreground">
              {i + 1}
            </span>
            <span className="leading-relaxed text-foreground/90">{step}</span>
          </li>
        ))}
      </ol>

      <Button
        variant="link"
        className="h-auto w-fit p-0 text-primary"
        render={
          <Link href="/register">
            Start with this
            <ArrowRight className="size-4" />
          </Link>
        }
      />
    </div>
  );
}

function CapabilityIntro() {
  return (
    <div
      key="intro"
      className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-3 duration-300"
    >
      <span className="w-fit rounded-full bg-primary/10 px-3 py-1 text-xs font-medium tracking-wide text-primary uppercase ring-1 ring-primary/20">
        For researchers &amp; students
      </span>
      <h1 className="font-heading text-3xl font-bold tracking-tight text-balance sm:text-4xl">
        Find your next research collaborator.
      </h1>
      <p className="text-base text-muted-foreground text-pretty">
        An academic matchmaking network built around shared research interests —
        a recommendation feed for finding collaborators, mutual-match
        connections, and a board for open opportunities.
      </p>
      <div className="flex flex-wrap gap-3">
        <Button size="lg" render={<Link href="/register">Get started</Link>} />
        <Button
          size="lg"
          variant="outline"
          render={<Link href="/login">Log in</Link>}
        />
      </div>
      <p className="hidden items-center gap-2 text-sm text-muted-foreground lg:flex">
        <ArrowRight className="size-4 -scale-x-100" />
        Hover a capability to see how it works.
      </p>
    </div>
  );
}

export function LandingExperience() {
  const [active, setActive] = useState<string | null>(null);
  const activeCapability =
    CAPABILITIES.find((c) => c.key === active) ?? null;

  return (
    <div className="relative flex flex-1 flex-col overflow-hidden">
      {/* ---- texture + light layers ---- */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 texture-dots opacity-70"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 texture-grain opacity-[0.05] mix-blend-overlay dark:opacity-[0.09]"
      />
      <div
        aria-hidden
        data-sm-motion
        className="pointer-events-none absolute -left-[10%] top-1/2 -z-10 size-[42rem] -translate-y-1/2 rounded-full bg-[radial-gradient(circle,color-mix(in_oklch,var(--primary)_55%,transparent)_0%,transparent_62%)] blur-3xl [animation:sm-glow_8s_ease-in-out_infinite]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-[10%] -top-[10%] -z-10 size-[30rem] rounded-full bg-[radial-gradient(circle,color-mix(in_oklch,var(--primary)_28%,transparent)_0%,transparent_70%)] blur-3xl"
      />

      {/* ---- header ---- */}
      <header className="flex items-center justify-between px-6 py-5 sm:px-12">
        <span className="flex items-center gap-2 text-lg font-semibold tracking-tight">
          <Image src="/logo.png" alt="" width={26} height={26} priority />
          ScholarMatch
        </span>
        <nav className="flex items-center gap-2">
          <Button variant="ghost" render={<Link href="/login">Log in</Link>} />
          <Button render={<Link href="/register">Sign up</Link>} />
        </nav>
      </header>

      {/* ---- hero: orbit on the left, guide panel on the right ---- */}
      <main className="flex flex-1 flex-col">
        <section className="mx-auto grid w-full max-w-7xl flex-1 grid-cols-1 items-center gap-10 px-6 py-10 sm:px-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-4 lg:py-16">
          {/* stage */}
          <div
            className="relative hidden h-[32rem] w-full lg:block"
            onMouseLeave={() => setActive(null)}
          >
            {/* orbit rings + active connector */}
            <svg
              aria-hidden
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
              className="pointer-events-none absolute inset-0 z-[5] size-full"
            >
              {[24, 37, 51].map((r) => (
                <ellipse
                  key={r}
                  cx={LOGO_ANCHOR.x}
                  cy={LOGO_ANCHOR.y}
                  rx={r}
                  ry={r * 0.9}
                  fill="none"
                  stroke="color-mix(in oklch, var(--primary) 32%, transparent)"
                  strokeWidth={1}
                  strokeDasharray="3 5"
                  vectorEffect="non-scaling-stroke"
                />
              ))}
              {activeCapability && (
                <line
                  key={activeCapability.key}
                  className="animate-in fade-in duration-300"
                  x1={LOGO_ANCHOR.x}
                  y1={LOGO_ANCHOR.y}
                  x2={LOGO_ANCHOR.x + (activeCapability.pos.x - LOGO_ANCHOR.x) * 0.82}
                  y2={LOGO_ANCHOR.y + (activeCapability.pos.y - LOGO_ANCHOR.y) * 0.82}
                  stroke="color-mix(in oklch, var(--primary) 60%, transparent)"
                  strokeWidth={2}
                  strokeLinecap="round"
                  vectorEffect="non-scaling-stroke"
                />
              )}
            </svg>

            {/* logo + halo */}
            <div className="absolute left-[12%] top-1/2 z-10 -translate-x-1/2 -translate-y-1/2">
              <div
                aria-hidden
                data-sm-motion
                className="absolute left-1/2 top-1/2 size-80 -translate-x-1/2 -translate-y-1/2 rounded-full bg-card/50 ring-1 ring-foreground/10 backdrop-blur-sm [animation:sm-breathe_9s_ease-in-out_infinite]"
              />
              <Image
                src="/logo.png"
                alt="ScholarMatch"
                width={240}
                height={264}
                priority
                data-sm-motion
                className="relative w-44 drop-shadow-[0_16px_44px_color-mix(in_oklch,var(--primary)_38%,transparent)] [animation:sm-float_10s_ease-in-out_infinite] xl:w-52"
              />
            </div>

            {/* capability tags */}
            {CAPABILITIES.map((c, i) => {
              const isActive = active === c.key;
              const dimmed = active !== null && !isActive;
              return (
                <div
                  key={c.key}
                  className={cn(
                    "group/tag absolute z-10 animate-in fade-in zoom-in-75",
                    isActive && "z-20",
                  )}
                  style={{
                    left: `${c.pos.x}%`,
                    top: `${c.pos.y}%`,
                    animationDelay: `${i * 90}ms`,
                    animationFillMode: "backwards",
                  }}
                >
                  <div
                    data-sm-motion
                    style={{
                      animation: `sm-float ${c.float.dur}s ease-in-out ${c.float.delay}s infinite`,
                    }}
                  >
                    <button
                      type="button"
                      onMouseEnter={() => setActive(c.key)}
                      onFocus={() => setActive(c.key)}
                      onClick={() => setActive(c.key)}
                      className={cn(
                        "flex -translate-x-1/2 -translate-y-1/2 items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium whitespace-nowrap shadow-sm backdrop-blur-md transition-all duration-300 outline-none focus-visible:ring-3 focus-visible:ring-ring/50",
                        isActive
                          ? "z-20 scale-110 border-primary bg-primary text-primary-foreground shadow-[0_16px_40px_-12px_color-mix(in_oklch,var(--primary)_55%,transparent)]"
                          : "border-foreground/10 bg-card/80 text-foreground hover:border-primary/40 hover:bg-card",
                        dimmed && "opacity-40 saturate-50",
                      )}
                    >
                      <c.icon
                        className={cn(
                          "size-4 shrink-0",
                          isActive ? "text-primary-foreground" : "text-primary",
                        )}
                      />
                      {c.label}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* guide panel (desktop) */}
          <div className="relative hidden w-full lg:block">
            <div className="rounded-3xl bg-card/70 p-6 ring-1 ring-foreground/10 backdrop-blur-xl sm:p-9 shadow-[0_28px_90px_-32px_color-mix(in_oklch,var(--primary)_30%,transparent)]">
              {activeCapability ? (
                <CapabilityGuide capability={activeCapability} />
              ) : (
                <CapabilityIntro />
              )}
            </div>
          </div>

          {/* mobile: logo + intro + tappable capability list */}
          <div className="flex flex-col gap-8 lg:hidden">
            <Image
              src="/logo.png"
              alt="ScholarMatch"
              width={140}
              height={154}
              className="w-20 drop-shadow-[0_10px_30px_color-mix(in_oklch,var(--primary)_35%,transparent)]"
            />
            <CapabilityIntro />
            <div className="flex w-full flex-col gap-2">
              {CAPABILITIES.map((c) => {
                const isActive = active === c.key;
                return (
                  <div
                    key={c.key}
                    className="overflow-hidden rounded-2xl bg-card/80 ring-1 ring-foreground/10"
                  >
                    <button
                      type="button"
                      onClick={() => setActive(isActive ? null : c.key)}
                      aria-expanded={isActive}
                      className="flex w-full items-center gap-2 px-4 py-3 text-left text-sm font-medium"
                    >
                      <c.icon className="size-4 shrink-0 text-primary" />
                      {c.label}
                      <ArrowRight
                        className={cn(
                          "ml-auto size-4 text-muted-foreground transition-transform",
                          isActive && "rotate-90",
                        )}
                      />
                    </button>
                    {isActive && (
                      <div className="border-t border-foreground/10 px-4 py-4">
                        <CapabilityGuide capability={c} />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ---- how it works ---- */}
        <section className="mx-auto w-full max-w-4xl px-6 pt-8 pb-16 sm:px-12">
          <h2 className="text-center font-heading text-2xl font-semibold tracking-tight">
            How it works
          </h2>
          <div className="mt-10 grid gap-8 sm:grid-cols-3">
            {[
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
            ].map((s) => (
              <div
                key={s.step}
                className="relative flex flex-col items-center gap-3 rounded-2xl bg-card/60 p-6 text-center ring-1 ring-foreground/10 backdrop-blur-sm"
              >
                <span className="flex size-9 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">
                  {s.step}
                </span>
                <h3 className="font-medium">{s.title}</h3>
                <p className="text-sm text-muted-foreground">{s.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ---- closing CTA ---- */}
        <section className="mx-auto w-full max-w-2xl px-6 pb-24 sm:px-12">
          <div className="flex flex-col items-center gap-4 rounded-3xl bg-primary/10 px-6 py-12 text-center ring-1 ring-primary/20 backdrop-blur-sm">
            <h2 className="font-heading text-xl font-semibold tracking-tight">
              Ready to find who to work with next?
            </h2>
            <Button
              size="lg"
              render={<Link href="/register">Create your profile</Link>}
            />
          </div>
        </section>
      </main>

      {/* ---- footer ---- */}
      <footer className="flex flex-col items-center gap-2 border-t border-foreground/10 px-6 py-8 text-center text-sm text-muted-foreground sm:px-12">
        <span>
          ScholarMatch — an academic matchmaking and collaboration network.
        </span>
        <div className="flex gap-4">
          <Link href="/legal/terms" className="underline">
            Terms of Service
          </Link>
          <Link href="/legal/privacy" className="underline">
            Privacy Policy
          </Link>
        </div>
      </footer>
    </div>
  );
}
