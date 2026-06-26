import type { Metadata } from "next";
import { LegalLayout, LegalSection } from "@/components/legal/LegalLayout";
import { APP } from "@/lib/constants";

export const metadata: Metadata = {
  title: `Privacy Policy — ${APP.name}`,
  description: `How ${APP.name} handles your data.`,
};

const UPDATED = "June 26, 2026";

export default function PrivacyPage() {
  return (
    <LegalLayout
      title="Privacy Policy"
      updated={UPDATED}
      intro={`${APP.name} is a non-custodial trading interface for the Solana network. We are privacy-first by design: we never take custody of your funds and collect only what we need to operate the app.`}
    >
      <LegalSection heading="1. Who we are">
        <p>
          {APP.name} (&ldquo;{APP.name}&rdquo;, &ldquo;we&rdquo;, &ldquo;us&rdquo;) provides a web
          and mobile interface for discovering and trading Solana assets. This policy explains what
          information we process when you use the app and your choices regarding it.
        </p>
      </LegalSection>

      <LegalSection heading="2. Information we process">
        <p>
          <span className="font-semibold text-ink">Account &amp; authentication.</span> When you sign
          in with Apple, Google, or email, our authentication provider (Privy) processes your email
          address and a unique account identifier to create and secure your account. We do not
          receive or store your social-login password.
        </p>
        <p>
          <span className="font-semibold text-ink">Wallet data.</span> Your embedded Solana wallet is
          created and secured by Privy. Private keys are never accessible to us — {APP.name} is
          non-custodial and cannot move your funds. We process public wallet addresses and on-chain
          transaction data, which are inherently public on the Solana blockchain.
        </p>
        <p>
          <span className="font-semibold text-ink">Usage &amp; device data.</span> Like most web
          apps, we may process basic technical data (IP address, browser/device type, and
          interaction events) to keep the service reliable and secure.
        </p>
      </LegalSection>

      <LegalSection heading="3. How we use information">
        <p>
          We use the information above to: authenticate you and provision your wallet; route quotes
          and trades; display prices, charts, holders, and trades; maintain security and prevent
          abuse; and improve the product. We do not sell your personal information.
        </p>
      </LegalSection>

      <LegalSection heading="4. Third-party services">
        <p>
          {APP.name} relies on trusted third parties to function. Each processes data under its own
          privacy policy:
        </p>
        <ul className="ml-5 list-disc space-y-1.5">
          <li>
            <span className="font-semibold text-ink">Privy</span> — authentication and embedded
            wallet infrastructure.
          </li>
          <li>
            <span className="font-semibold text-ink">BirdEye</span> — market data (prices, charts,
            holders, trades).
          </li>
          <li>
            <span className="font-semibold text-ink">Jupiter</span> — swap quotes and routing across
            Solana DEXs.
          </li>
          <li>
            <span className="font-semibold text-ink">Solana RPC providers</span> — broadcasting
            signed transactions to the network.
          </li>
        </ul>
      </LegalSection>

      <LegalSection heading="5. On-chain transparency">
        <p>
          Transactions you sign are recorded permanently on the Solana blockchain and are publicly
          visible. We cannot edit, delete, or reverse on-chain data.
        </p>
      </LegalSection>

      <LegalSection heading="6. Data retention &amp; security">
        <p>
          We retain account information for as long as your account is active and apply reasonable
          technical and organizational measures to protect it. No method of transmission or storage
          is perfectly secure, and we cannot guarantee absolute security.
        </p>
      </LegalSection>

      <LegalSection heading="7. Your choices">
        <p>
          You may sign out at any time and request deletion of your account by contacting us.
          Deleting your account does not remove transactions already recorded on the public Solana
          blockchain.
        </p>
      </LegalSection>

      <LegalSection heading="8. Children">
        <p>
          {APP.name} is not directed to anyone under 18, and we do not knowingly collect data from
          children.
        </p>
      </LegalSection>

      <LegalSection heading="9. Changes to this policy">
        <p>
          We may update this policy from time to time. Material changes will be reflected by the
          &ldquo;Last updated&rdquo; date above.
        </p>
      </LegalSection>

      <LegalSection heading="10. Contact">
        <p>
          Questions about this policy? Reach us on{" "}
          <a href={APP.twitter} target="_blank" rel="noreferrer" className="text-chad hover:underline">
            X / Twitter
          </a>
          .
        </p>
      </LegalSection>

      <p className="border-t border-line pt-6 text-xs leading-relaxed text-ink-faint">
        This document is provided for general informational purposes and does not constitute legal
        advice. {APP.name} should have this policy reviewed by qualified counsel before production
        launch.
      </p>
    </LegalLayout>
  );
}
