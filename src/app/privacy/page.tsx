import Link from "next/link"
import { Navbar } from "@/components/landing/navbar"
import { Footer } from "@/components/landing/footer"

const FIELD = "#FFFFFF"
const INK = "#0A0A0A"
const SUBINK = "rgba(10,10,10,0.62)"
const RULE = "rgba(10,10,10,0.10)"
const ACCENT = "#0F3D2E"
const SOFT_FIELD = "#F7F7F2"

export const metadata = {
  title: "Privacy Policy · Sam",
  description:
    "How CloudTeams BV processes personal data for the Sam AI investment assessment service.",
}

const EFFECTIVE_DATE = "1 May 2026"
const LAST_UPDATED = "1 May 2026"

export default function PrivacyPage() {
  return (
    <div className="flex min-h-screen flex-col" style={{ background: FIELD, color: INK }}>
      <Navbar />
      <main className="flex-1">
        <section className="relative pt-16 md:pt-24 pb-12 md:pb-16 border-b" style={{ borderColor: RULE }}>
          <div className="mx-auto max-w-[820px] px-6">
            <p className="text-[11px] font-mono uppercase tracking-[0.2em]" style={{ color: SUBINK }}>
              Privacy Policy
            </p>
            <h1
              className="mt-4 font-bold leading-[0.98] tracking-[-0.04em]"
              style={{ fontSize: "clamp(36px, 5vw, 60px)", color: INK }}
            >
              How we handle{" "}
              <span className="font-serif italic font-normal" style={{ color: ACCENT }}>
                your data.
              </span>
            </h1>
            <p className="mt-5 max-w-2xl text-[15.5px] leading-[1.6]" style={{ color: SUBINK }}>
              Sam is operated by CloudTeams BV. This page explains what we collect, why, how
              long we keep it, and the rights you have under the GDPR.
            </p>

            <dl
              className="mt-8 grid gap-x-8 gap-y-4 sm:grid-cols-2 text-[13.5px]"
              style={{ color: INK }}
            >
              <div>
                <dt className="text-[10px] font-mono uppercase tracking-[0.2em]" style={{ color: SUBINK }}>
                  Effective date
                </dt>
                <dd className="mt-1">{EFFECTIVE_DATE}</dd>
              </div>
              <div>
                <dt className="text-[10px] font-mono uppercase tracking-[0.2em]" style={{ color: SUBINK }}>
                  Last updated
                </dt>
                <dd className="mt-1">{LAST_UPDATED}</dd>
              </div>
              <div>
                <dt className="text-[10px] font-mono uppercase tracking-[0.2em]" style={{ color: SUBINK }}>
                  Binding language
                </dt>
                <dd className="mt-1">English. Translations are for information only.</dd>
              </div>
              <div>
                <dt className="text-[10px] font-mono uppercase tracking-[0.2em]" style={{ color: SUBINK }}>
                  Operated by
                </dt>
                <dd className="mt-1">
                  CloudTeams BV
                  <br />
                  Keizersgracht 127, 1015 CJ Amsterdam, Netherlands
                  <br />
                  <a href="mailto:hallo@cloudteams.nl" className="underline underline-offset-2" style={{ color: ACCENT }}>
                    hallo@cloudteams.nl
                  </a>
                </dd>
              </div>
            </dl>
          </div>
        </section>

        <article className="mx-auto max-w-[820px] px-6 py-14 md:py-16 legal-doc" style={{ color: INK }}>
          {/* Inline styles scoped via .legal-doc so the long-form prose has
              consistent spacing, list bullets, and callout boxes without
              dragging in a markdown renderer. */}
          <style>{`
            .legal-doc h2 { font-family: var(--font-geist-sans, system-ui); font-weight: 700; font-size: clamp(22px, 2.4vw, 28px); letter-spacing: -0.02em; line-height: 1.2; margin-top: 56px; }
            .legal-doc h2:first-of-type { margin-top: 0; }
            .legal-doc h3 { font-family: var(--font-geist-sans, system-ui); font-weight: 600; font-size: 17px; letter-spacing: -0.01em; line-height: 1.3; margin-top: 28px; }
            .legal-doc p { font-size: 15.5px; line-height: 1.65; margin-top: 12px; color: rgba(10,10,10,0.78); }
            .legal-doc ul { font-size: 15.5px; line-height: 1.65; margin-top: 10px; padding-left: 0; color: rgba(10,10,10,0.78); list-style: none; }
            .legal-doc li { display: flex; align-items: flex-start; gap: 10px; margin-top: 6px; }
            .legal-doc li::before { content: ""; display: inline-block; width: 6px; height: 6px; border-radius: 9999px; background: #0F3D2E; margin-top: 11px; flex-shrink: 0; }
            .legal-doc .label { font-family: var(--font-jetbrains-mono, ui-monospace, monospace); font-size: 10.5px; letter-spacing: 0.18em; text-transform: uppercase; color: rgba(10,10,10,0.55); margin-top: 18px; }
            .legal-doc .callout { margin-top: 16px; padding: 16px 18px; border-radius: 12px; background: ${SOFT_FIELD}; border: 1px solid ${RULE}; }
            .legal-doc .callout p { margin-top: 0; }
            .legal-doc strong { color: #0A0A0A; font-weight: 600; }
            .legal-doc a { color: #0F3D2E; text-decoration: underline; text-underline-offset: 2px; }
          `}</style>

          <h2>1. Who we are</h2>
          <p>
            This Privacy Policy describes how CloudTeams BV (&quot;CloudTeams&quot;, &quot;we&quot;, &quot;us&quot;, &quot;our&quot;) processes personal data as a controller within the meaning of Article 4(7) of the General Data Protection Regulation (&quot;GDPR&quot;).
          </p>
          <p>
            CloudTeams BV operates Sam, an AI-powered investment assessment service available at samvc.ai (the &quot;Service&quot;). Sam enables investors — including venture capital funds, angel investors, syndicates, family offices and small investment teams — to upload pitch decks and receive structured, source-aware investment assessments across six investment domains.
          </p>
          <p className="label">Controller</p>
          <p>
            CloudTeams BV<br />
            Keizersgracht 127, 1015 CJ Amsterdam, Netherlands<br />
            Email: <a href="mailto:hallo@cloudteams.nl">hallo@cloudteams.nl</a>
          </p>
          <p>This Privacy Policy applies to personal data we process as controller, including:</p>
          <ul>
            <li>visitors to our website (samvc.ai and related domains);</li>
            <li>people who register for an account, request information, or contact us;</li>
            <li>users of the Sam Service — investors and their team members using Sam to evaluate pitch decks;</li>
            <li>recipients of our marketing communications;</li>
            <li>contacts of business partners and suppliers.</li>
          </ul>
          <div className="callout">
            <p>
              This Privacy Policy does not cover personal data contained within the pitch decks or supporting documents that users upload to Sam. When users upload pitch decks, CloudTeams processes that content on behalf of the user as a processor. The user — or the fund or organisation they represent — is the controller of that content. The terms governing that processing are set out in our Data Processing Agreement (DPA), which forms part of the Service terms.
            </p>
          </div>

          <h2>2. What personal data we process and why</h2>

          <h3>2.1 Account data</h3>
          <p className="label">What we process</p>
          <p>
            Name, business email address, job title, fund or company name, account credentials (stored as a hashed value — never in plain text), and profile preferences (such as language and notification settings).
          </p>
          <p className="label">Source</p>
          <p>Provided by the user when registering or by an account administrator.</p>
          <p className="label">Purpose</p>
          <p>
            To create and operate the user&apos;s account, authenticate access, deliver the Service, provide support, and communicate service-related information.
          </p>
          <p className="label">Legal basis</p>
          <p>
            Performance of a contract (Article 6(1)(b) GDPR — the contract between CloudTeams and the user or their organisation); and our legitimate interest (Article 6(1)(f)) in operating the Service securely.
          </p>
          <p className="label">Retention</p>
          <p>
            For the duration of the account, plus 90 days after the subscription ends, after which the account and associated personal data are deleted unless legal retention obligations apply.
          </p>

          <h3>2.2 Fund profile data</h3>
          <p className="label">What we process</p>
          <p>
            Investment mandate, thesis, target stages, sectors, ticket window, and geographic focus — as entered by the user when setting up their fund profile within Sam.
          </p>
          <p className="label">Source</p>
          <p>Provided by the user.</p>
          <p className="label">Purpose</p>
          <p>
            To calibrate Sam&apos;s assessments to the fund&apos;s specific investment criteria and to generate fund-fit analysis within each assessment.
          </p>
          <p className="label">Legal basis</p>
          <p>
            Performance of a contract (Article 6(1)(b)); and legitimate interest (Article 6(1)(f)) in providing a personalised, contextually relevant service.
          </p>
          <p className="label">Retention</p>
          <p>For the duration of the account. Deleted upon account closure.</p>

          <h3>2.3 Uploaded pitch decks and supporting documents</h3>
          <div className="callout">
            <p>
              <strong>Important:</strong> Pitch decks and supporting documents uploaded to Sam typically contain information about third parties (founders, companies, investors). CloudTeams processes this content strictly on behalf of the uploading user. We do not use uploaded pitch decks or their contents to train any machine learning model — ours or those of our AI inference providers. Users control how long their decks and derived assessments are stored.
            </p>
          </div>
          <p className="label">What we process</p>
          <p>
            The content of pitch decks (PDF or similar formats) and any supporting documents (such as financial models or founder memos) submitted by the user for analysis.
          </p>
          <p className="label">Source</p>
          <p>Uploaded directly by the user.</p>
          <p className="label">Purpose</p>
          <p>
            To generate a structured, six-domain investment assessment, including scoring, source attribution, missing information identification, and fund-fit analysis.
          </p>
          <p className="label">Legal basis</p>
          <p>
            Processing on behalf of the user as a processor (contract basis). The user, as controller, determines the purpose and means of processing this content.
          </p>
          <p className="label">Retention</p>
          <p>
            Users can configure their own retention window. When the retention period ends, decks and all derived artefacts (assessments, source extracts) are deleted from our systems. If no retention window is set, we apply a default maximum retention of 12 months from the date of upload.
          </p>

          <h3>2.4 Assessment outputs</h3>
          <p className="label">What we process</p>
          <p>
            Structured investment assessments generated by Sam, including domain scores, confidence indicators, source tags, red flags, missing information checklists, suggested founder questions, and fund-fit analysis.
          </p>
          <p className="label">Purpose</p>
          <p>
            To make assessments available to the user within the Service; to enable deal comparison and team collaboration; and to support the user&apos;s investment decision-making process.
          </p>
          <p className="label">Legal basis</p>
          <p>
            Performance of a contract (Article 6(1)(b)). As with uploaded content, CloudTeams acts as processor for assessment outputs that are derived from user-submitted content.
          </p>
          <p className="label">Retention</p>
          <p>Subject to the same retention window as the source pitch deck.</p>

          <h3>2.5 Usage and log data</h3>
          <p className="label">What we process</p>
          <p>
            IP address, device and browser identifiers, pages and features accessed, timestamps, session identifiers, error logs, and similar telemetry.
          </p>
          <p className="label">Purpose</p>
          <p>
            To operate, secure, monitor, troubleshoot, and improve the Service; to detect and prevent abuse and fraud; and to generate aggregated product analytics.
          </p>
          <p className="label">Legal basis</p>
          <p>
            Legitimate interest (Article 6(1)(f)) in operating and securing the Service. For non-essential analytics using cookies, we rely on consent (Article 6(1)(a) GDPR and Article 11.7a of the Dutch Telecommunications Act).
          </p>
          <p className="label">Retention</p>
          <p>Raw logs for up to 12 months; aggregated anonymised analytics retained for longer.</p>

          <h3>2.6 Billing and contract data</h3>
          <p className="label">What we process</p>
          <p>
            Company name, billing contact name and email, billing address, VAT number, payment-method metadata (we do not store full card numbers — payment details are handled by our payment processor), invoices, and subscription records.
          </p>
          <p className="label">Purpose</p>
          <p>
            To process payments, issue invoices, perform the contract, and meet our statutory accounting and tax obligations.
          </p>
          <p className="label">Legal basis</p>
          <p>
            Performance of a contract (Article 6(1)(b)); legal obligation (Article 6(1)(c)) under Dutch tax and accounting law.
          </p>
          <p className="label">Retention</p>
          <p>
            For the duration of the contract plus seven (7) years thereafter, in line with Dutch statutory retention obligations (Article 52, Dutch General Tax Act).
          </p>

          <h3>2.7 Sales and marketing data</h3>
          <p className="label">What we process</p>
          <p>
            Name, business email, job title, employer, communication history, demo bookings, and content interactions.
          </p>
          <p className="label">Purpose</p>
          <p>
            To respond to enquiries, schedule demos, send relevant information about Sam, and conduct B2B marketing.
          </p>
          <p className="label">Legal basis</p>
          <p>
            Legitimate interest (Article 6(1)(f)) in promoting our services to relevant business contacts; consent (Article 6(1)(a)) where required under the ePrivacy Directive.
          </p>
          <p className="label">Retention</p>
          <p>
            While commercially relevant; reviewed at least annually. Contacts who unsubscribe or object are added to a suppression list.
          </p>

          <h3>2.8 Support and communications data</h3>
          <p className="label">What we process</p>
          <p>
            Content of emails, chat messages, support tickets, and other communications between you and CloudTeams.
          </p>
          <p className="label">Purpose</p>
          <p>To respond to enquiries and provide support.</p>
          <p className="label">Legal basis</p>
          <p>
            Performance of a contract (Article 6(1)(b)) for customer support; legitimate interest (Article 6(1)(f)) for general enquiries.
          </p>
          <p className="label">Retention</p>
          <p>Up to 24 months after the last interaction, unless longer retention is necessary for legal or compliance reasons.</p>

          <h2>3. How Sam&apos;s AI processing works</h2>
          <p>
            Sam uses AI inference to analyse pitch decks and generate structured investment assessments. We are transparent about how this works:
          </p>
          <ul>
            <li>Sam applies a fixed, six-domain investment framework to every deck. The framework — not the AI model — is the product.</li>
            <li>Uploaded pitch decks are passed to an AI inference provider (currently: Anthropic, Inc.) for processing. Anthropic acts as a sub-processor under our instructions.</li>
            <li>We have contractual commitments in place with Anthropic that prohibit the use of submitted content to train their models. Your pitch deck data is not used to train any AI model.</li>
            <li>Sam supplements pitch deck content with information from external sources (such as LinkedIn profiles and public databases) where available. These external lookups are clearly labelled in the assessment as their respective source — users always see whether a claim originates from the pitch deck, an external source, the knowledge base, or is a generated inference.</li>
            <li>Sam does not make binding investment decisions. All assessments are tools to support human judgment. No decision producing legal or similarly significant effects on any individual is made solely by automated processing.</li>
          </ul>

          <h2>4. Cookies and similar technologies</h2>
          <p>
            We use cookies and similar technologies on our website. We seek consent for non-essential cookies via a cookie banner when you first visit.
          </p>
          <ul>
            <li><strong>Strictly necessary cookies:</strong> required for the website and Service to function. No consent required (Article 11.7a(3) Dutch Telecommunications Act).</li>
            <li><strong>Analytics cookies:</strong> used to understand how the website is used. Consent-based.</li>
            <li><strong>Marketing cookies:</strong> used for retargeting or conversion measurement, if applicable. Consent-based.</li>
          </ul>
          <p>
            You can manage preferences via the cookie banner or by adjusting your browser settings. Refusing non-essential cookies does not affect your ability to use the core Service.
          </p>

          <h2>5. Who we share personal data with</h2>
          <p>We share personal data only where necessary, with the following categories of recipients:</p>

          <h3>5.1 Service providers (processors and sub-processors)</h3>
          <p>We use carefully selected third-party providers to operate Sam, including:</p>
          <ul>
            <li>Cloud hosting and infrastructure (EU-based — all customer data is hosted within the European Union / EEA);</li>
            <li>AI inference (Anthropic, Inc. — subject to a data processing agreement prohibiting model training on submitted content);</li>
            <li>Authentication and user management (Supabase);</li>
            <li>Payment processing;</li>
            <li>Email delivery;</li>
            <li>Analytics and error monitoring.</li>
          </ul>
          <p>All providers are bound by appropriate data protection terms.</p>

          <h3>5.2 Professional advisors</h3>
          <p>Where necessary, we share data with lawyers, accountants, and auditors, who are bound by professional confidentiality.</p>

          <h3>5.3 Authorities</h3>
          <p>We disclose personal data to public authorities where required by law or to protect our or others&apos; rights. Where legally permissible, we will inform the affected party.</p>

          <h3>5.4 Corporate transactions</h3>
          <p>In the event of a merger, acquisition, or sale of assets, personal data may be transferred to the relevant successor entity, subject to continued protection consistent with this Privacy Policy.</p>

          <h3>5.5 We do not sell personal data</h3>
          <p>
            <strong>CloudTeams does not sell personal data.</strong> We do not share personal data with third parties for their own independent marketing or advertising purposes.
          </p>

          <h2>6. International transfers</h2>
          <p>
            We host all customer data — including uploaded pitch decks and generated assessments — on EU-based infrastructure. Your deal data does not leave the EU/EEA as part of standard Service operation.
          </p>
          <p>
            For AI inference, content is processed by Anthropic, Inc., which operates in the United States. This transfer is governed by Standard Contractual Clauses (SCCs) approved by the European Commission, supplemented by contractual commitments that prohibit model training on submitted content.
          </p>
          <p>
            Where other service providers process data outside the EU/EEA, we apply appropriate transfer mechanisms under Chapter V GDPR.
          </p>

          <h2>7. How we protect your data</h2>
          <p>We apply technical and organisational security measures appropriate to the risk, including:</p>
          <ul>
            <li>Encryption in transit (HTTPS/TLS) for all data exchanged with the Service;</li>
            <li>Encryption at rest for stored data on our EU-based hosting infrastructure;</li>
            <li>Access controls based on least-privilege principles — only authorised personnel can access customer data;</li>
            <li>Multi-factor authentication for administrative access to production systems;</li>
            <li>Regular backups within EU-hosted infrastructure;</li>
            <li>Staff awareness of data protection obligations.</li>
          </ul>
          <p>
            No system is completely secure. We commit to applying industry-standard practices and to notifying affected parties of personal data breaches in line with Articles 33 and 34 GDPR.
          </p>

          <h2>8. Your rights under the GDPR</h2>
          <p>If we process personal data about you as a controller, you have the following rights under the GDPR:</p>
          <ul>
            <li><strong>Right of access (Article 15):</strong> to obtain confirmation of whether we process your personal data, and a copy of that data.</li>
            <li><strong>Right to rectification (Article 16):</strong> to have inaccurate or incomplete personal data corrected.</li>
            <li><strong>Right to erasure (Article 17):</strong> to have personal data deleted in defined circumstances.</li>
            <li><strong>Right to restriction of processing (Article 18):</strong> to have processing restricted in defined circumstances.</li>
            <li><strong>Right to data portability (Article 20):</strong> to receive your personal data in a structured, machine-readable format.</li>
            <li><strong>Right to object (Article 21):</strong> to object to processing based on legitimate interests, including direct marketing.</li>
            <li><strong>Right to withdraw consent (Article 7(3)):</strong> where processing is based on consent, you may withdraw it at any time without affecting the lawfulness of past processing.</li>
          </ul>
          <p>
            To exercise any of these rights, contact us at <a href="mailto:hallo@cloudteams.nl">hallo@cloudteams.nl</a>. We will respond within one month (Article 12(3) GDPR). We may need to verify your identity before responding.
          </p>
          <p>
            If we process personal data contained within pitch decks on behalf of a user (i.e. as a processor), please contact the user or their organisation directly as the relevant controller.
          </p>
          <p className="label">Right to lodge a complaint</p>
          <p>You have the right to lodge a complaint with a supervisory authority. The Dutch supervisory authority is:</p>
          <p>
            Autoriteit Persoonsgegevens (AP)<br />
            Website: <a href="https://www.autoriteitpersoonsgegevens.nl" target="_blank" rel="noreferrer">www.autoriteitpersoonsgegevens.nl</a><br />
            Address: Postbus 93374, 2509 AJ Den Haag, the Netherlands
          </p>
          <p>You may also lodge a complaint with the supervisory authority of your country of residence within the EU/EEA.</p>

          <h2>9. Children</h2>
          <p>
            The Service is intended for business use only and is not directed to individuals under the age of 16. We do not knowingly collect personal data from children. If we become aware that we have collected such data, we will delete it promptly.
          </p>

          <h2>10. Marketing communications</h2>
          <p>We send marketing communications to business contacts in line with applicable law:</p>
          <ul>
            <li><strong>Existing users:</strong> we may send service-related communications and marketing about Sam and related products, with the option to unsubscribe at any time.</li>
            <li><strong>Prospects and enquirers:</strong> we send communications based on consent, or on legitimate interest in B2B marketing where permitted by law. Every marketing email contains an unsubscribe link.</li>
          </ul>
          <p>
            You can opt out of marketing at any time by clicking the unsubscribe link in any email or by contacting <a href="mailto:hallo@cloudteams.nl">hallo@cloudteams.nl</a>.
          </p>
          <p>
            Service-related communications (such as security alerts, billing notices, and important changes to the Service) are sent for as long as you have an active account and are not subject to opt-out.
          </p>

          <h2>11. Changes to this Privacy Policy</h2>
          <p>
            We may update this Privacy Policy from time to time. The most current version will always be available at samvc.ai/privacy. Material changes will be communicated to active users by email or in-product notification at least 30 days before taking effect.
          </p>

          <h2>12. Contact</h2>
          <p>
            For any questions, requests, or concerns about this Privacy Policy or our processing of personal data, please contact us:
          </p>
          <p>
            CloudTeams BV<br />
            Keizersgracht 127, 1015 CJ Amsterdam, the Netherlands<br />
            Email: <a href="mailto:hallo@cloudteams.nl">hallo@cloudteams.nl</a>
          </p>
          <p>We aim to respond to all privacy-related enquiries within five (5) business days.</p>

          <div className="mt-14 pt-8 border-t" style={{ borderColor: RULE }}>
            <p className="text-[13px]" style={{ color: SUBINK }}>
              Related: <Link href="/terms" className="underline" style={{ color: ACCENT }}>Terms of Use</Link>
            </p>
          </div>
        </article>
      </main>
      <Footer />
    </div>
  )
}
