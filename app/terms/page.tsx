import type { Metadata } from "next";
import { LegalLayout, LegalSection } from "@/components/legal/LegalLayout";
import { APP } from "@/lib/constants";

export const metadata: Metadata = {
  title: `Terms of Service — ${APP.name}`,
  description: `The terms that govern your use of ${APP.name}.`,
};

const UPDATED = "June 26, 2026";

export default function TermsPage() {
  return (
    <LegalLayout
      title="Terms of Service"
      updated={UPDATED}
      intro={`By accessing or using ${APP.name}, you agree to these Terms. Please read them carefully — trading crypto assets carries substantial risk.`}
    >
      <LegalSection heading="1. Acceptance of terms">
        <p>
          These Terms of Service (&ldquo;Terms&rdquo;) govern your access to and use of {APP.name}
          {" "}(the &ldquo;Service&rdquo;). If you do not agree, do not use the Service.
        </p>
      </LegalSection>

      <LegalSection heading="2. Non-custodial service">
        <p>
          {APP.name} is a non-custodial interface. You — and only you — control your wallet and
          assets. We never take possession of, or control over, your funds, and we cannot execute
          transactions on your behalf without your signature. You are solely responsible for
          safeguarding access to your account.
        </p>
      </LegalSection>

      <LegalSection heading="3. Eligibility">
        <p>
          You must be at least 18 years old and legally permitted to use the Service in your
          jurisdiction. You are responsible for complying with all laws and regulations that apply to
          you, including any restrictions on trading digital assets.
        </p>
      </LegalSection>

      <LegalSection heading="4. No financial advice">
        <p>
          Nothing in the Service is financial, investment, legal, or tax advice. Prices, charts,
          trending lists, and other data are provided for informational purposes only and may be
          inaccurate or delayed. You are responsible for your own trading decisions.
        </p>
      </LegalSection>

      <LegalSection heading="5. Assumption of risk">
        <p>
          Digital assets are highly volatile and can lose all value. Trades are irreversible once
          confirmed on-chain. Risks include, without limitation: market volatility, smart-contract
          vulnerabilities, network congestion, slippage, failed transactions, and total loss of
          funds. You accept these risks when you use the Service.
        </p>
      </LegalSection>

      <LegalSection heading="6. Third-party services">
        <p>
          The Service integrates third parties including Privy (authentication and wallets), BirdEye
          (market data), Jupiter (swap routing), and Solana RPC providers. We do not control these
          services and are not responsible for their availability, accuracy, or conduct. Your use of
          them may be subject to their own terms.
        </p>
      </LegalSection>

      <LegalSection heading="7. Acceptable use">
        <p>
          You agree not to misuse the Service, including by attempting to disrupt it, access it
          through unauthorized means, use it for unlawful activity (such as money laundering or
          market manipulation), or infringe the rights of others.
        </p>
      </LegalSection>

      <LegalSection heading="8. Disclaimers">
        <p>
          The Service is provided &ldquo;as is&rdquo; and &ldquo;as available,&rdquo; without
          warranties of any kind, whether express or implied, including merchantability, fitness for
          a particular purpose, and non-infringement. We do not warrant that the Service will be
          uninterrupted, secure, or error-free.
        </p>
      </LegalSection>

      <LegalSection heading="9. Limitation of liability">
        <p>
          To the maximum extent permitted by law, {APP.name} and its contributors will not be liable
          for any indirect, incidental, special, consequential, or exemplary damages, or any loss of
          profits, funds, or data, arising from your use of — or inability to use — the Service.
        </p>
      </LegalSection>

      <LegalSection heading="10. Changes &amp; termination">
        <p>
          We may modify or discontinue the Service, or update these Terms, at any time. Continued use
          after changes take effect constitutes acceptance of the revised Terms.
        </p>
      </LegalSection>

      <LegalSection heading="11. Contact">
        <p>
          Questions about these Terms? Reach us on{" "}
          <a href={APP.twitter} target="_blank" rel="noreferrer" className="text-chad hover:underline">
            X / Twitter
          </a>
          .
        </p>
      </LegalSection>

      <p className="border-t border-line pt-6 text-xs leading-relaxed text-ink-faint">
        This document is provided for general informational purposes and does not constitute legal
        advice. {APP.name} should have these Terms reviewed by qualified counsel before production
        launch.
      </p>
    </LegalLayout>
  );
}
