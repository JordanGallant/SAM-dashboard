import Link from "next/link"
import { Navbar } from "@/components/landing/navbar"
import { Footer } from "@/components/landing/footer"

// Brand tokens — matched to /privacy so the two legal pages read as a set.
const FIELD = "#FFFFFF"
const INK = "#0A0A0A"
const SUBINK = "rgba(10,10,10,0.62)"
const RULE = "rgba(10,10,10,0.10)"
const ACCENT = "#0F3D2E"
const SOFT_FIELD = "#F7F7F2"

export const metadata = {
  title: "Terms of Use · Sam",
  description:
    "Terms of Use for Sam, the AI investment assessment service operated by CloudTeams BV.",
}

const EFFECTIVE_DATE = "1 May 2026"
const LAST_UPDATED = "12 May 2026"

export default function TermsPage() {
  return (
    <div className="flex min-h-screen flex-col" style={{ background: FIELD, color: INK }}>
      <Navbar />
      <main className="flex-1">
        <section className="relative pt-16 md:pt-24 pb-12 md:pb-16 border-b" style={{ borderColor: RULE }}>
          <div className="mx-auto max-w-[820px] px-6">
            <p className="text-[11px] font-mono uppercase tracking-[0.2em]" style={{ color: SUBINK }}>
              Terms of Use
            </p>
            <h1
              className="mt-4 font-bold leading-[0.98] tracking-[-0.04em]"
              style={{ fontSize: "clamp(36px, 5vw, 60px)", color: INK }}
            >
              The rules of the road,{" "}
              <span className="font-serif italic font-normal" style={{ color: ACCENT }}>
                for business users.
              </span>
            </h1>
            <p className="mt-5 max-w-2xl text-[15.5px] leading-[1.6]" style={{ color: SUBINK }}>
              These Terms govern your access to and use of Sam, an AI-powered investment
              assessment platform operated by CloudTeams BV. They apply exclusively to business
              customers (B2B).
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
                  Issued by
                </dt>
                <dd className="mt-1">
                  CloudTeams BV
                  <br />
                  Keizersgracht 127, 1015 CJ Amsterdam, Netherlands
                  <br />
                  KvK 90004159
                  <br />
                  <a href="mailto:hallo@cloudteams.nl" className="underline underline-offset-2" style={{ color: ACCENT }}>
                    hallo@cloudteams.nl
                  </a>
                </dd>
              </div>
            </dl>

            <div
              className="mt-8 rounded-xl p-4 text-[13.5px] leading-[1.55]"
              style={{ background: SOFT_FIELD, border: `1px solid ${RULE}`, color: INK }}
            >
              These Terms of Use are intended exclusively for business customers (B2B). Sam is
              not offered to consumers within the meaning of Article 7:5 of the Dutch Civil Code.
              By creating an account or using the Service, you confirm that you are acting in
              the course of a profession or business.
            </div>
          </div>
        </section>

        <article className="mx-auto max-w-[820px] px-6 py-14 md:py-16 legal-doc" style={{ color: INK }}>
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

          <h2>1. Introduction</h2>
          <p>
            These Terms of Use (&quot;Terms&quot;) govern your access to and use of Sam, an AI-powered investment assessment platform, and all related services, documentation, and software (collectively, the &quot;Service&quot;). The Service is operated by:
          </p>
          <p>
            CloudTeams BV<br />
            Keizersgracht 127, 1015 CJ Amsterdam, Netherlands<br />
            Email: <a href="mailto:hallo@cloudteams.nl">hallo@cloudteams.nl</a><br />
            Chamber of Commerce (KvK): 90004159<br />
            (referred to as &quot;Sam&quot;, &quot;CloudTeams&quot;, &quot;we&quot;, &quot;us&quot;, or &quot;our&quot;)
          </p>
          <p>
            By creating an account, clicking &quot;I agree&quot;, completing a checkout, or otherwise using the Service, you (&quot;Customer&quot;, &quot;you&quot;) agree to be bound by these Terms. If you accept these Terms on behalf of an organisation, you represent that you have the authority to bind that organisation to these Terms.
          </p>

          <h2>2. Definitions</h2>
          <ul>
            <li><strong>&quot;Service&quot;</strong> means the Sam platform, including all software, AI models, assessment outputs, dashboards, APIs, and related services made available by CloudTeams.</li>
            <li><strong>&quot;Account&quot;</strong> means your registered account on the Service.</li>
            <li><strong>&quot;User&quot;</strong> means an individual authorised by you to access and use the Service under your Account.</li>
            <li><strong>&quot;Customer Data&quot;</strong> means all data, content, and information you or your Users submit to the Service, including pitch decks, financial documents, company descriptions, and any other materials uploaded for analysis.</li>
            <li><strong>&quot;Output&quot;</strong> means any structured investment assessment, scoring result, analysis, summary, memo section, follow-up question, or other material generated by the Service based on Customer Data.</li>
            <li><strong>&quot;Order&quot;</strong> means the document, online checkout, or signup process by which you subscribe to a specific plan.</li>
            <li><strong>&quot;DPA&quot;</strong> means the Data Processing Agreement between you and CloudTeams, governing personal data processing, available on our website and incorporated into these Terms by reference.</li>
            <li><strong>&quot;Subscription Plan&quot;</strong> means the pricing tier and feature set to which you have subscribed (Angel, Pro, or Fund).</li>
          </ul>

          <h2>3. The Service</h2>

          <h3>3.1 What Sam does</h3>
          <p>
            Sam is an AI-powered investment assessment platform. It analyses pitch decks and related materials submitted by the Customer and generates structured investment assessments across six domains: Team, Market, Product, Traction, Finance, and Exit. Each domain receives a structured analysis with scored signals, source attributions, identified gaps, and generated follow-up questions. Sam also provides an Ask Sam Co-Pilot function for interactive follow-up within each analysis session.
          </p>

          <h3>3.2 Human-in-the-loop — no investment decisions</h3>
          <div className="callout">
            <p>
              Sam does not make investment decisions. Outputs are analytical tools to support your own evaluation process.
            </p>
            <p>
              You are solely responsible for all investment decisions, due diligence, and any actions you take based on Outputs.
            </p>
          </div>
          <p>
            The Service operates on a strict human-in-the-loop basis. Sam does not autonomously decide whether to invest in, pass on, or take any action regarding any company. Every Output is a structured analytical assessment intended to assist, not replace, the judgment of qualified investment professionals.
          </p>

          <h3>3.3 Not professional or financial advice</h3>
          <p>
            Outputs generated by the Service do not constitute, and must not be relied upon as, investment advice, financial advice, legal advice, tax advice, regulatory guidance, or any other form of professional advice. Nothing in the Service or its Outputs creates a fiduciary duty or advisory relationship between CloudTeams and the Customer.
          </p>
          <p>
            You are solely responsible for evaluating Outputs, conducting independent due diligence, and seeking qualified professional advice where appropriate before making any investment decision.
          </p>

          <h3>3.4 AI limitations and Output accuracy</h3>
          <p>The Service uses artificial intelligence, including large language models. You acknowledge that:</p>
          <ul>
            <li>AI-generated Outputs may contain errors, inaccuracies, omissions, or fabricated information (&quot;hallucinations&quot;);</li>
            <li>Outputs may reflect biases present in training data or in submitted Customer Data;</li>
            <li>Identical or similar inputs may produce different Outputs at different times;</li>
            <li>Outputs are generated solely from information contained in submitted Customer Data — Sam has no independent access to external databases, market data, or real-time information unless explicitly integrated;</li>
            <li>The Service cannot guarantee that any Output will be accurate, complete, current, suitable for a particular investment decision, or compliant with any specific legal or regulatory framework.</li>
          </ul>
          <p>
            You are solely responsible for reviewing, verifying, and validating all Outputs before using them as the basis for any investment-related decision or communication.
          </p>

          <h3>3.5 Source attribution and data provenance</h3>
          <p>
            Where possible, Sam&apos;s Outputs include attribution labels indicating the source basis of each data point: [Pitch Deck — UNVALIDATED], [Generated Inference], or [Source: third-party reference]. These labels are informational only. CloudTeams does not independently verify any information contained in submitted pitch decks or other Customer Data, and unvalidated information remains unvalidated regardless of its use in an Output.
          </p>

          <h2>4. Your Responsibilities</h2>

          <h3>4.1 Lawful use</h3>
          <p>
            You warrant that you will use the Service only for lawful business purposes and in compliance with all applicable laws and regulations, including (without limitation) data protection law (GDPR and applicable national implementations), financial regulatory law, anti-money laundering law, insider trading law, and intellectual property law.
          </p>

          <h3>4.2 Acceptable use</h3>
          <p>You shall not, and shall not permit any User or third party to:</p>
          <ul>
            <li>use the Service to make or present investment decisions without independent human review;</li>
            <li>upload to the Service any Customer Data that you do not have the right to share or process, including confidential information of third parties obtained unlawfully;</li>
            <li>upload special categories of personal data (Article 9 GDPR) without first notifying CloudTeams and entering into appropriate additional safeguards;</li>
            <li>attempt to reverse-engineer, decompile, or extract the source code, AI models, prompts, or weights underlying the Service;</li>
            <li>attempt to circumvent any technical limitations, rate limits, authentication, or security measures;</li>
            <li>use the Service to build a directly competing product or service;</li>
            <li>use Outputs to train, fine-tune, or develop any artificial intelligence model without CloudTeams&apos; prior written consent;</li>
            <li>use the Service to generate or distribute content that is illegal, defamatory, deceptive, or harmful to any person or entity;</li>
            <li>share Account credentials with individuals outside your organisation or exceed the number of Users permitted under your Subscription Plan.</li>
          </ul>

          <h3>4.3 Account security</h3>
          <p>
            You are responsible for maintaining the confidentiality of your Account credentials and for all activity that occurs under your Account. You shall notify CloudTeams without undue delay at <a href="mailto:hallo@cloudteams.nl">hallo@cloudteams.nl</a> of any suspected unauthorised access to or breach of your Account.
          </p>

          <h3>4.4 Responsibility for use of Outputs</h3>
          <p>
            Given the human-in-the-loop nature of the Service, you are responsible for ensuring that Users exercise diligent, independent judgment when using Outputs. Any reliance on, sharing, or distribution of an Output by any User constitutes your full and final responsibility for that Output and its consequences.
          </p>

          <h2>5. Subscriptions, Fees, and Payment</h2>

          <h3>5.1 Plans and Orders</h3>
          <p>
            Sam is offered on the following Subscription Plans, with specific commercial terms — including number of seats, additional features, billing frequency, and any negotiated terms — set out in the applicable Order or online checkout:
          </p>
          <ul>
            <li><strong>Angel Plan</strong> — designed for individual angel investors and solo practitioners;</li>
            <li><strong>Pro Plan</strong> — designed for small investment teams and multi-user workflows;</li>
            <li><strong>Fund Plan</strong> — enterprise plan for VC and investment funds, with custom pricing and features.</li>
          </ul>
          <p>
            Current pricing is displayed on the Sam website (samvc.ai) and communicated at the time of subscription. Pricing in Orders is binding for the committed term.
          </p>

          <h3>5.2 Fees and taxes</h3>
          <p>
            All fees are exclusive of VAT (BTW) and any other applicable taxes, which will be added where required by law. Where the reverse-charge mechanism applies (for VAT-registered customers established in another EU Member State), the Customer remains responsible for accounting for VAT in their own jurisdiction.
          </p>

          <h3>5.3 Payment terms</h3>
          <p>Unless otherwise agreed in the Order:</p>
          <ul>
            <li>monthly plans are billed in advance on the same calendar day each month;</li>
            <li>annual plans are billed in advance for the full annual term;</li>
            <li>late payment incurs statutory commercial interest under Article 6:119a of the Dutch Civil Code, plus reasonable collection costs.</li>
          </ul>

          <h3>5.4 Suspension for non-payment</h3>
          <p>
            CloudTeams may suspend access to the Service if an invoice remains unpaid more than 14 days after a written payment reminder. Suspension does not relieve you of your payment obligations for the applicable period.
          </p>

          <h3>5.5 Price changes</h3>
          <p>
            CloudTeams may change prices for renewal terms by giving you at least 60 days&apos; written notice before the renewal date. Prices for an existing committed subscription term will not change during that term.
          </p>

          <h2>6. Term and Termination</h2>

          <h3>6.1 Term</h3>
          <p>The subscription term begins on the effective date confirmed in the Order or checkout confirmation and continues for the period specified.</p>

          <h3>6.2 Automatic renewal</h3>
          <p>Unless otherwise specified in the Order, subscriptions automatically renew for successive periods equal to the initial term at the then-current price.</p>

          <h3>6.3 Termination by you</h3>
          <ul>
            <li><strong>Monthly subscriptions:</strong> you may cancel at any time with one month&apos;s notice, taking effect at the end of the calendar month.</li>
            <li><strong>Annual or longer subscriptions:</strong> you may terminate effective at the end of the then-current term by providing notice at least 30 days before the end of that term. Early termination of a committed annual term is not permitted, except for cause as set out in Section 6.5.</li>
          </ul>

          <h3>6.4 Termination by CloudTeams for convenience</h3>
          <p>
            CloudTeams may terminate your subscription on 60 days&apos; written notice. In such case, CloudTeams will refund any prepaid fees on a pro-rata basis for the period after termination.
          </p>

          <h3>6.5 Termination for cause</h3>
          <p>Either party may terminate these Terms with immediate effect by written notice if the other party:</p>
          <ul>
            <li>materially breaches these Terms and fails to cure the breach within 30 days of receiving written notice describing the breach;</li>
            <li>becomes insolvent, enters bankruptcy or suspension of payments, or ceases business operations;</li>
            <li>engages in conduct that, in the terminating party&apos;s reasonable judgment, exposes it to material legal, regulatory, or reputational risk.</li>
          </ul>

          <h3>6.6 Effects of termination</h3>
          <p>On termination or expiry of the subscription:</p>
          <ul>
            <li>your right to access and use the Service ceases immediately;</li>
            <li>you may export Customer Data and Outputs via the standard export functionality for 30 days following termination;</li>
            <li>CloudTeams will delete Customer Data within 90 days of termination, except where retention is required by applicable law or for the establishment, exercise, or defence of legal claims;</li>
            <li>accrued payment obligations survive termination;</li>
            <li>Sections 7 (Data and Privacy), 8 (Intellectual Property), 9 (Confidentiality), 10 (Liability), 11 (Indemnification), 13 (Governing Law), and any provisions which by their nature should survive, shall survive termination.</li>
          </ul>

          <h2>7. Data and Privacy</h2>

          <h3>7.1 Customer Data ownership</h3>
          <p>
            As between the parties, you retain all rights, title, and interest in and to Customer Data, including all pitch decks and related materials you submit. CloudTeams acquires no ownership rights in Customer Data.
          </p>

          <h3>7.2 Licence to CloudTeams</h3>
          <p>
            You grant CloudTeams a non-exclusive, royalty-free licence to access, process, store, and transmit Customer Data solely to the extent necessary to provide the Service to you in accordance with these Terms, the DPA, and applicable law.
          </p>

          <h3>7.3 No AI training on Customer Data</h3>
          <div className="callout">
            <p>
              CloudTeams does not use Customer Data — including pitch decks and investment materials — to train, fine-tune, or improve any AI model, whether its own or that of a third-party provider (including Anthropic).
            </p>
            <p>
              Submitted pitch decks and related materials are processed solely to generate your requested Outputs and are not retained beyond the periods set out in our Privacy Policy.
            </p>
          </div>

          <h3>7.4 AI sub-processors</h3>
          <p>
            The Service uses Anthropic PBC as a sub-processor for AI inference (large language model processing). Anthropic processes Customer Data solely to return Outputs to Sam in real time and does not use Customer Data for model training under its API terms. A current list of sub-processors is available on request at <a href="mailto:hallo@cloudteams.nl">hallo@cloudteams.nl</a>. CloudTeams will inform you of any material changes to sub-processors with reasonable advance notice.
          </p>

          <h3>7.5 Data hosting and transfers</h3>
          <p>
            Customer Data is hosted on infrastructure within the European Union. Data is not transferred outside the EU/EEA except where strictly necessary for sub-processor functionality (for example, AI inference), in which case appropriate transfer safeguards (Standard Contractual Clauses) are in place.
          </p>

          <h3>7.6 Data Processing Agreement</h3>
          <p>
            Where CloudTeams processes personal data contained in Customer Data on your behalf, it does so as a processor within the meaning of Article 4(8) GDPR. The DPA governs that processing and is incorporated into these Terms by reference. In the event of conflict between these Terms and the DPA in respect of personal data processing, the DPA prevails.
          </p>

          <h3>7.7 Privacy Policy</h3>
          <p>
            CloudTeams&apos; Privacy Policy, available at <Link href="/privacy">samvc.ai/privacy</Link>, governs the processing of personal data relating to your Account and Users. The Privacy Policy is incorporated into these Terms by reference.
          </p>

          <h2>8. Intellectual Property</h2>

          <h3>8.1 CloudTeams IP</h3>
          <p>
            CloudTeams retains all rights, title, and interest in and to the Service, including all underlying software, AI models, scoring frameworks, prompts, assessment methodologies, designs, documentation, trademarks, and know-how. Nothing in these Terms transfers any such rights to you, except for the licence expressly granted in Section 8.3.
          </p>

          <h3>8.2 Feedback</h3>
          <p>
            If you provide CloudTeams with suggestions, feedback, or ideas regarding the Service, CloudTeams may use such feedback without restriction or compensation, provided that CloudTeams does not identify you as the source without your consent.
          </p>

          <h3>8.3 Licence to use the Service</h3>
          <p>
            Subject to these Terms and timely payment of applicable fees, CloudTeams grants you a non-exclusive, non-transferable, non-sublicensable right to access and use the Service during the subscription term for your internal investment evaluation purposes.
          </p>

          <h3>8.4 Outputs</h3>
          <p>
            Subject to these Terms and timely payment of fees, CloudTeams assigns to you, on a perpetual, worldwide, royalty-free basis, such rights as CloudTeams holds in Outputs generated specifically for you through the Service, to the extent such rights are assignable. You acknowledge that:
          </p>
          <ul>
            <li>AI-generated Outputs may not be eligible for copyright protection in all jurisdictions;</li>
            <li>similar Outputs may be generated for other customers using similar inputs;</li>
            <li>the underlying models, assessment methodology, scoring framework, and platform remain exclusively CloudTeams&apos; property.</li>
          </ul>

          <h3>8.5 Customer name and logo</h3>
          <p>
            You grant CloudTeams a limited licence to use your name and logo to identify you as a customer of Sam (for example: in a customer logo wall or marketing materials). You may opt out at any time by writing to <a href="mailto:hallo@cloudteams.nl">hallo@cloudteams.nl</a>. Testimonials, case studies, or other references by name require your separate prior written consent.
          </p>

          <h2>9. Confidentiality</h2>

          <h3>9.1 Confidential Information</h3>
          <p>
            &quot;Confidential Information&quot; means any non-public information disclosed by one party to the other in connection with the Service, whether marked as confidential or which a reasonable person would understand to be confidential in the circumstances. Customer Data — including pitch decks and investment materials submitted by you — constitutes your Confidential Information. Non-public technical and commercial details of the Service constitute CloudTeams&apos; Confidential Information.
          </p>

          <h3>9.2 Obligations</h3>
          <p>
            Each party shall: (a) use the other party&apos;s Confidential Information only as necessary to perform under these Terms; (b) protect it with at least the same degree of care it uses for its own confidential information, and in any case no less than reasonable care; (c) not disclose it to any third party except to its employees, contractors, and advisors who have a need to know and are bound by equivalent confidentiality obligations.
          </p>

          <h3>9.3 Exceptions</h3>
          <p>
            The confidentiality obligations do not apply to information that: (a) is or becomes publicly known without breach by the receiving party; (b) was rightfully known to the receiving party before disclosure; (c) is independently developed by the receiving party without use of the Confidential Information; (d) is rightfully obtained from a third party without restriction on disclosure; or (e) is required to be disclosed by applicable law or a competent court, provided the receiving party gives reasonable advance notice where legally permissible.
          </p>

          <h2>10. Disclaimers and Limitation of Liability</h2>

          <h3>10.1 Disclaimer</h3>
          <p>
            To the maximum extent permitted by applicable law, the Service is provided &quot;as is&quot; and &quot;as available&quot;, without warranties of any kind, whether express, implied, statutory, or otherwise. CloudTeams specifically disclaims any implied warranties of merchantability, fitness for a particular purpose, non-infringement, accuracy or completeness of Outputs, uninterrupted operation, or error-free performance.
          </p>

          <h3>10.2 No reliance on Outputs for investment decisions</h3>
          <div className="callout">
            <p>
              Investment decisions involve inherent risks. Outputs are analytical tools only and must not be relied upon as the sole basis for any investment decision.
            </p>
            <p>
              CloudTeams has no liability for investment losses, missed opportunities, or other financial consequences arising from decisions made on the basis of Outputs.
            </p>
          </div>

          <h3>10.3 Exclusion of indirect damages</h3>
          <p>
            To the maximum extent permitted by applicable law, neither party shall be liable to the other for any indirect, consequential, incidental, special, or punitive damages, including loss of profits, loss of revenue, loss of business, loss of goodwill, loss of data, loss of investment opportunity, or reputational harm, even if advised of the possibility of such damages.
          </p>

          <h3>10.4 Liability cap</h3>
          <p>
            To the maximum extent permitted by applicable law, CloudTeams&apos; total aggregate liability arising out of or in connection with these Terms (whether in contract, tort, statute, or otherwise) shall not exceed the lesser of:
          </p>
          <ul>
            <li>(a) the fees actually paid by you to CloudTeams in the six (6) months immediately preceding the event giving rise to the claim; or</li>
            <li>(b) fifty thousand euros (€50,000).</li>
          </ul>

          <h3>10.5 Carve-outs</h3>
          <p>The exclusions and limitations in Sections 10.3 and 10.4 do not apply to:</p>
          <ul>
            <li>liability arising from gross negligence (grove schuld) or wilful misconduct (opzet) of a party or its senior management;</li>
            <li>liability that cannot be limited or excluded under mandatory applicable law;</li>
            <li>your payment obligations under Section 5;</li>
            <li>your indemnification obligations under Section 11;</li>
            <li>breaches of confidentiality obligations under Section 9;</li>
            <li>infringement by either party of the other party&apos;s intellectual property rights.</li>
          </ul>

          <h3>10.6 Time bar</h3>
          <p>
            Any claim arising out of or in connection with these Terms must be brought within one (1) year after the claiming party becomes aware, or reasonably should have become aware, of the facts giving rise to the claim, failing which the claim is barred.
          </p>

          <h2>11. Indemnification</h2>

          <h3>11.1 Indemnification by you</h3>
          <p>
            You shall defend, indemnify, and hold CloudTeams and its directors, employees, and agents harmless against any third-party claim, loss, damage, fine, penalty, or expense (including reasonable legal fees) arising out of or in connection with:
          </p>
          <ul>
            <li>your use of the Service in breach of these Terms or applicable law;</li>
            <li>Customer Data, including any claim that Customer Data infringes any third party&apos;s intellectual property rights or violates any law;</li>
            <li>your investment decisions or other actions based on Outputs;</li>
            <li>your violation of any obligation to the founders, companies, or third parties whose materials you have submitted to the Service;</li>
            <li>your breach of any representation or warranty in these Terms.</li>
          </ul>

          <h3>11.2 IP indemnification by CloudTeams</h3>
          <p>
            CloudTeams shall defend you against any third-party claim that the Service, as provided by CloudTeams and used by you in accordance with these Terms, infringes a third party&apos;s copyright, trademark, or registered patent in the EU/EEA, and shall pay damages and costs finally awarded or agreed in settlement. This obligation does not apply to claims arising from: (i) Customer Data; (ii) modifications to the Service not made by CloudTeams; (iii) use of the Service in combination with non-CloudTeams products where the claim would not have arisen but for the combination; (iv) use contrary to these Terms.
          </p>

          <h3>11.3 Procedure</h3>
          <p>
            The indemnified party shall: (a) promptly notify the indemnifying party in writing of any claim; (b) give the indemnifying party sole control over the defence and settlement (provided no settlement requiring an admission of liability or unreimbursed payment by the indemnified party may be entered without consent); (c) reasonably cooperate in the defence at the indemnifying party&apos;s expense.
          </p>

          <h2>12. Changes</h2>

          <h3>12.1 Changes to the Service</h3>
          <p>
            CloudTeams may modify, add to, or discontinue features of the Service at any time, provided that no material reduction in core functionality is made during a paid subscription term without giving you the right to terminate with a pro-rata refund.
          </p>

          <h3>12.2 Changes to these Terms</h3>
          <p>
            CloudTeams may update these Terms by giving at least 30 days&apos; written notice (including by email or in-product notification) before the changes take effect. If you object to a material change, you may terminate your subscription effective on the date the change would take effect and receive a pro-rata refund of any prepaid fees. Continued use of the Service after the effective date of a change constitutes acceptance of the updated Terms.
          </p>

          <h2>13. Governing Law and Disputes</h2>

          <h3>13.1 Governing law</h3>
          <p>
            These Terms are governed by the laws of the Netherlands, excluding its conflict-of-law rules and excluding the United Nations Convention on Contracts for the International Sale of Goods (CISG).
          </p>

          <h3>13.2 Jurisdiction</h3>
          <p>
            Any dispute arising out of or in connection with these Terms shall be submitted to the exclusive jurisdiction of the competent court in Amsterdam, the Netherlands, save that CloudTeams retains the right to bring proceedings against you in the jurisdiction of your registered seat for the collection of unpaid fees.
          </p>

          <h3>13.3 Pre-litigation step</h3>
          <p>
            Before commencing legal proceedings (other than for urgent injunctive relief or collection of undisputed fees), the parties shall attempt in good faith to resolve the dispute through escalation to senior representatives within 30 days of written notice of the dispute.
          </p>

          <h2>14. General Provisions</h2>

          <h3>14.1 Entire agreement</h3>
          <p>
            These Terms, together with the applicable Order, the DPA, the Privacy Policy, and any documents expressly incorporated by reference, constitute the entire agreement between the parties and supersede all prior agreements, representations, and understandings on the subject matter, whether oral or written.
          </p>

          <h3>14.2 Order of precedence</h3>
          <p>
            In the event of conflict: (i) the Order prevails over these Terms with respect to commercial terms specifically negotiated; (ii) the DPA prevails over these Terms with respect to personal data processing; (iii) otherwise these Terms prevail.
          </p>

          <h3>14.3 Assignment</h3>
          <p>
            You may not assign or transfer your rights or obligations under these Terms without CloudTeams&apos; prior written consent, except in connection with a merger, acquisition, or sale of substantially all of your assets, provided the assignee is not a direct competitor of Sam. CloudTeams may assign these Terms to an affiliate or in connection with a merger, acquisition, or sale of all or substantially all of its assets.
          </p>

          <h3>14.4 No third-party beneficiaries</h3>
          <p>
            These Terms do not create any rights for any third party, including founders or companies whose materials are submitted to the Service.
          </p>

          <h3>14.5 No waiver</h3>
          <p>
            Failure or delay by either party to enforce any right under these Terms does not constitute a waiver of that right.
          </p>

          <h3>14.6 Severability</h3>
          <p>
            If any provision of these Terms is held to be invalid or unenforceable, the remaining provisions continue in full force and effect. The invalid or unenforceable provision shall be modified to the minimum extent necessary to make it enforceable, giving effect to the original intent.
          </p>

          <h3>14.7 Force majeure</h3>
          <p>
            Neither party is liable for failure or delay in performance (other than payment obligations) caused by events beyond its reasonable control, including acts of God, war, terrorism, cyberattacks, pandemic, government action, internet or telecommunications failures, or failures of upstream service providers.
          </p>

          <h3>14.8 Notices</h3>
          <p>
            Notices to CloudTeams shall be sent by email to <a href="mailto:hallo@cloudteams.nl">hallo@cloudteams.nl</a> or by post to Keizersgracht 127, 1015 CJ Amsterdam, Netherlands. Notices to you shall be sent to the email address registered with your Account. Notices are deemed received on the next business day after sending by email, except for billing-related notices which are deemed received on the day of sending.
          </p>

          <h3>14.9 Independent contractors</h3>
          <p>
            The parties are independent contractors. Nothing in these Terms creates a partnership, joint venture, employment, or agency relationship between CloudTeams and the Customer.
          </p>

          <h3>14.10 Export and sanctions</h3>
          <p>
            You represent that you are not located in, organised under the laws of, or ordinarily resident in any jurisdiction subject to comprehensive EU or US sanctions, and that you are not on any EU or US restricted-party list.
          </p>

          <h3>14.11 Language</h3>
          <p>
            These Terms are drafted in English. English is the binding language. Any translation provided is for convenience only and has no legal effect.
          </p>

          <h2>Contact</h2>
          <p>
            CloudTeams BV<br />
            Keizersgracht 127, 1015 CJ Amsterdam, Netherlands<br />
            Email: <a href="mailto:hallo@cloudteams.nl">hallo@cloudteams.nl</a><br />
            Website: samvc.ai
          </p>
          <p>
            Questions about these Terms? Reach us at <a href="mailto:hallo@cloudteams.nl">hallo@cloudteams.nl</a> and we will respond within 5 business days.
          </p>

          <div className="mt-14 pt-8 border-t" style={{ borderColor: RULE }}>
            <p className="text-[13px]" style={{ color: SUBINK }}>
              Related: <Link href="/privacy" className="underline" style={{ color: ACCENT }}>Privacy Policy</Link>
            </p>
          </div>
        </article>
      </main>
      <Footer />
    </div>
  )
}
