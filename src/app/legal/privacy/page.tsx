import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
};

const LAST_UPDATED = "August 14, 2026";

export default function PrivacyPage() {
  return (
    <div className="mx-auto w-full max-w-2xl px-6 py-16">
      <h1 className="mb-2 text-2xl font-semibold">Privacy Policy</h1>
      <p className="mb-8 text-sm text-muted-foreground">Last updated: {LAST_UPDATED}</p>

      <div className="flex flex-col gap-6 text-sm leading-relaxed">
        <p className="rounded-lg border border-dashed p-4 text-muted-foreground">
          <strong>Draft notice:</strong> this is placeholder legal text, not reviewed by a
          lawyer or checked against a specific jurisdiction&apos;s data-protection requirements
          (e.g. GDPR, PIPEDA, FERPA if student data is in scope). Review with qualified counsel
          before any public/commercial launch.
        </p>

        <section>
          <h2 className="mb-2 font-semibold">1. What we collect</h2>
          <p>
            Account information you provide directly: name, email, password (stored hashed,
            never in plain text), phone number, institution, academic level, research field and
            interests, education history, publications, and any profile description or avatar
            you add. We also store the messages you send to matched users and the research
            postings/applications you create.
          </p>
        </section>

        <section>
          <h2 className="mb-2 font-semibold">2. How we use it</h2>
          <p>
            To operate the core product: matching you with potential collaborators (your
            research description is used to generate a semantic embedding for ranking
            recommendations), displaying your public profile to other users, enabling
            messaging between matches, and running the research postings board. We also use
            your email to send account verification codes.
          </p>
        </section>

        <section>
          <h2 className="mb-2 font-semibold">3. What&apos;s public vs. private</h2>
          <p>
            Your public profile (name, institution, research field/interests, description,
            education, papers) is visible to other logged-in users and, depending on
            configuration, to the public web. Your email and phone number are never shown on
            your public profile.
          </p>
        </section>

        <section>
          <h2 className="mb-2 font-semibold">4. Third parties</h2>
          <p>
            We use Cloudinary for avatar image hosting, Resend for transactional email
            (verification codes), and Jina AI to generate the embeddings used for matching. We
            don&apos;t sell your data to advertisers or data brokers.
          </p>
        </section>

        <section>
          <h2 className="mb-2 font-semibold">5. Your controls</h2>
          <p>
            You can edit your profile at any time. You can permanently delete your account from
            Account Settings — this removes your profile, postings, applications, and messages.
            Deletion is irreversible.
          </p>
        </section>

        <section>
          <h2 className="mb-2 font-semibold">6. Changes</h2>
          <p>We may update this policy as the product changes.</p>
        </section>

        <section>
          <h2 className="mb-2 font-semibold">7. Contact</h2>
          <p>Questions about this policy can be sent to the account owner.</p>
        </section>
      </div>
    </div>
  );
}
