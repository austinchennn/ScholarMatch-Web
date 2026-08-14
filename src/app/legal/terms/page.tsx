import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service",
};

const LAST_UPDATED = "August 14, 2026";

export default function TermsPage() {
  return (
    <div className="mx-auto w-full max-w-2xl px-6 py-16">
      <h1 className="mb-2 text-2xl font-semibold">Terms of Service</h1>
      <p className="mb-8 text-sm text-muted-foreground">Last updated: {LAST_UPDATED}</p>

      <div className="flex flex-col gap-6 text-sm leading-relaxed">
        <p className="rounded-lg border border-dashed p-4 text-muted-foreground">
          <strong>Draft notice:</strong> this is placeholder legal text, not reviewed by a
          lawyer. It should not be relied on as a binding agreement until reviewed by qualified
          legal counsel before any public/commercial launch.
        </p>

        <section>
          <h2 className="mb-2 font-semibold">1. What ScholarMatch is</h2>
          <p>
            ScholarMatch is a platform that helps researchers and students find collaborators
            based on shared research interests, post and apply to research opportunities, and
            message confirmed matches.
          </p>
        </section>

        <section>
          <h2 className="mb-2 font-semibold">2. Your account</h2>
          <p>
            You must provide accurate information when creating an account. You&apos;re
            responsible for keeping your password secure and for activity that happens under
            your account. You may delete your account at any time from Account Settings, which
            permanently removes your profile, postings, applications, and messages.
          </p>
        </section>

        <section>
          <h2 className="mb-2 font-semibold">3. Acceptable use</h2>
          <p>
            Don&apos;t use ScholarMatch to harass other users, post false information, scrape
            the platform, or use it for anything unlawful. We may suspend or remove accounts
            that violate this.
          </p>
        </section>

        <section>
          <h2 className="mb-2 font-semibold">4. Content you provide</h2>
          <p>
            You retain ownership of the profile information, postings, and messages you submit.
            By submitting them, you allow ScholarMatch to display and process that content as
            needed to operate the service (e.g. showing your profile to other users, ranking
            recommendations).
          </p>
        </section>

        <section>
          <h2 className="mb-2 font-semibold">5. No warranty</h2>
          <p>
            ScholarMatch is provided &quot;as is.&quot; We don&apos;t guarantee you&apos;ll find
            a collaborator, that matches will be accurate, or that the service will be
            uninterrupted.
          </p>
        </section>

        <section>
          <h2 className="mb-2 font-semibold">6. Changes</h2>
          <p>
            We may update these terms as the product changes. Continued use of ScholarMatch
            after an update means you accept the revised terms.
          </p>
        </section>

        <section>
          <h2 className="mb-2 font-semibold">7. Contact</h2>
          <p>Questions about these terms can be sent to the account owner.</p>
        </section>
      </div>
    </div>
  );
}
