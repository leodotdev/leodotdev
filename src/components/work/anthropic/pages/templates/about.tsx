import { Footer } from "@/components/work/anthropic/pages/organisms-site/footer"
import { SiteNavigation } from "@/components/work/anthropic/pages/organisms-site/navigation"
import {
  Band,
  COMPANY_SIZES,
  InlineLink,
  Mission,
  Row,
} from "@/components/work/anthropic/pages/templates/about/parts"
import {
  PageBlock,
  PageSection,
  TemplateFigure,
} from "@/components/work/anthropic/template"
import { Section } from "@/components/work/claude/ui"
import type { DemoStep } from "@/components/work/claude/demo-cursor"

// The About template (the file's "About" frame on its "Reskinned pages"
// page, 13079:19345): the header; the mission over the four parts of the
// company's purpose; the team, in a hero carousel; its values and its
// governance, in ruled rows; and the footer. Its words are the file's.

const ART = "/work/anthropic/templates/about"

const PURPOSE = [
  [
    "Building safer systems",
    "We aim to build frontier AI systems that are reliable, interpretable, and steerable. We conduct research, develop safety techniques, and deploy the resulting systems through our partnerships and products.",
  ],
  [
    "Safety as a science",
    "We treat AI safety as a systematic science. We apply our research to our products, feed what we learn back into our research, and regularly share our findings.",
  ],
  [
    "Interdisciplinary approach",
    "Our researchers, engineers, policy experts, business leaders, and operators who bring our experience from many domains to our work.",
  ],
  [
    "A collective endeavor",
    "We view ourselves as one part of a broader effort to develop and deploy AI safely. We collaborate with civil society, government, academia, nonprofits and industry to promote safety across the field.",
  ],
] as const

const VALUES = [
  [
    "Act for the global good.",
    "We strive to make decisions that maximize positive outcomes for humanity in the long run. This means we’re willing to be very bold in the actions we take to ensure our technology is a robustly positive force for good. We take seriously the task of safely guiding the world through a technological revolution that has the potential to change the course of human history, and we are committed to helping make this transition go well.",
  ],
  [
    "Hold light and shade.",
    "AI has the potential to pose unprecedented risks to humanity if things go badly. It also has the potential to create unprecedented benefits for humanity if things go well. We need shade to understand and protect against the potential for bad outcomes. We need light to realize the good outcomes.",
  ],
  [
    "Be good to our users.",
    "At Anthropic, we define “users” broadly. Users are our customers, policymakers, Ants, and anyone impacted by the technology we build or the actions we take. We cultivate generosity and kindness in all of our interactions—with each other, with our users, and with the world at large. Going above and beyond for each other, our customers, and the people affected by our technology is meeting expectations.",
  ],
  [
    "Ignite a race to the top on safety.",
    "As a safety-first company, we believe that building reliable, trustworthy, and secure systems is our collective responsibility—and the market agrees. We work to inspire a “race to the top” dynamic where AI developers must compete to develop the most safe and secure AI systems. We want to constantly set the industry bar for AI safety and security and drive others to do the same.",
  ],
  [
    "Do the simple thing that works.",
    "We take an empirical approach to problems and care about the size of our impact and not the sophistication of our methods. This doesn’t mean we throw together haphazard solutions. It means we try to identify the simplest solution and iterate from there. We don’t invent a spaceship if all we need is a bicycle.",
  ],
  [
    "Be helpful, honest, and harmless.",
    "Anthropic is a high-trust, low-ego organization. We communicate kindly and directly, assuming good intentions even in disagreement. We are thoughtful about our actions, avoiding harm and repairing relationships when needed. Everyone contributes, regardless of role. If something urgently needs to be done, the right person to do it is probably you.",
  ],
  [
    "Put the mission first.",
    "At the end of the day, the mission is what we’re all here for. It gives us a shared purpose and allows us to act swiftly together, rather than being pulled in multiple directions by competing goals. It engenders trust and collaboration, and is the final arbiter in our decisions. When it comes to our mission, none of us are bystanders. We each take personal ownership over making our mission successful.",
  ],
] as const

const GOVERNANCE = [
  [
    "Anthropic Board of Directors",
    [
      "Dario Amodei",
      "Daniela Amodei",
      "Yasmin Razavi",
      "Reed Hastings",
      "Chris Liddell",
      "Vas Narasimhan",
    ],
  ],
  [
    "LTBT Trustees",
    ["Neil Buddy Shah", "Richard Fontaine", "Dr. Ben Bernanke"],
  ],
] as const

function About() {
  return (
    <>
      <PageBlock theme={["ivory", "slate"]}>
        {/* The hero is the header's page, so its menus open over it. */}
        <SiteNavigation>
          <PageSection theme={["ivory", "slate"]}>
            <Mission
              title="AI research and products that put safety at the frontier"
              text="AI will have a vast impact on the world. Anthropic is a public benefit corporation dedicated to securing its benefits and mitigating its risks."
              action="Join us"
            />
            <div className="ads-about-purpose">
              <span className="ads-caption-1-mono">Our Purpose</span>
              <div className="ads-about-purpose-grid">
                {PURPOSE.map(([title, text]) => (
                  <div key={title} className="ads-about-purpose-item">
                    <h3 className="ads-heading-6">{title}</h3>
                    <p className="ads-caption-1">{text}</p>
                  </div>
                ))}
              </div>
            </div>
          </PageSection>
        </SiteNavigation>
      </PageBlock>
      <Band
        title="The Team"
        total={3}
        slide={{
          image: `${ART}/team-research.webp`,
          title: "Research",
          text: "We conduct frontier AI research and explore novel and emerging areas, from interpretability and alignment research to AI’s economic and societal impacts.",
        }}
      >
        <p className="ads-body-3">
          We work across research, product, policy, and operations to build
          reliable and understandable AI systems.
        </p>
      </Band>
      <PageSection theme={["ivory", "slate"]}>
        <Row
          title="What we value and how we act"
          aside={
            <p className="ads-body-3">
              Every day, we make critical decisions that inform our ability to
              achieve our mission. Shaping the future of AI and, in turn, the
              future of our world is a responsibility and a privilege. Our
              values guide how we work together, the decisions we make, and how
              we show up for each other and work toward our mission.
            </p>
          }
        >
          <div className="ads-company-grid">
            {VALUES.map(([title, text]) => (
              <div key={title} className="ads-company-cell">
                <h3 className="ads-heading-5">{title}</h3>
                <p className="ads-body-3">{text}</p>
              </div>
            ))}
          </div>
        </Row>
        <Row
          title="Governance"
          aside={
            <p className="ads-body-3">
              Anthropic is a Public Benefit Corporation, whose purpose is the
              responsible development and maintenance of advanced AI for the
              long-term benefit of humanity. Our Board of Directors is elected
              by stockholders and our{" "}
              <InlineLink>Long-Term Benefit Trust</InlineLink>.
            </p>
          }
        >
          <div className="ads-company-grid">
            {GOVERNANCE.map(([title, names]) => (
              <div key={title} className="ads-company-cell">
                <h3 className="ads-heading-6">{title}</h3>
                <ul className="ads-about-names ads-body-3">
                  {names.map((name) => (
                    <li key={name}>{name}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </Row>
      </PageSection>
      <Footer />
    </>
  )
}

// Wide, the cursor rests on the hero's button, then scrolls to the team and
// steps through the carousel; on a phone it tries the button again.
const STEPS: Array<DemoStep> = [
  { on: ".ads-company-mission .ads-btn", rest: 900 },
  { on: ".cds-tpl-thumb", drag: 24 },
  { on: ".ads-company-band .ads-pagination .ads-btn", nth: 1, click: true },
  { on: ".ads-company-slide-text h3", rest: 900 },
  { on: ".ads-company-band .ads-pagination .ads-btn", nth: 1, click: true },
  { on: ".ads-company-band .ads-pagination .ads-btn", nth: 0, click: true },
  { on: ".ads-company-band .ads-pagination .ads-btn", nth: 0, click: true },
  { on: ".cds-resize-grip", nth: 1, drag: 390 },
  { on: ".ads-company-mission .ads-btn", rest: 900 },
]

export function AboutDoc() {
  return (
    <Section>
      <TemplateFigure steps={STEPS} sizes={COMPANY_SIZES}>
        <About />
      </TemplateFigure>
    </Section>
  )
}
