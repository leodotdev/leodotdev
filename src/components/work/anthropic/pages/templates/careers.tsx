import { useState } from "react"
import { TbArrowRight, TbChevronDown } from "react-icons/tb"
import { AnalysisMetadata } from "@/components/work/anthropic/pages/molecules/article"
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
  Button,
  PlayButton,
  quiet,
} from "@/components/work/anthropic/specimens"
import {
  PageBlock,
  PageSection,
  TemplateFigure,
} from "@/components/work/anthropic/template"
import { Section } from "@/components/work/claude/ui"
import type { DemoStep } from "@/components/work/claude/demo-cursor"

// The Careers template (the file's "Careers" frame on its "Reskinned pages"
// page, 13079:17996): the header; the mission over a film of the team, with
// links and two short pieces under it; the Long-Term Benefit Trust, in a
// hero carousel; what the company offers, how it hires, and its questions,
// as accordions in ruled rows; and the footer. Its words are the file's.

const ART = "/work/anthropic/templates/careers"

type Item = { title: string; body?: React.ReactNode }

/**
 * The file's "Accordion Item" as this page has it: no count, the title in
 * bold, one open at a time. The file writes out only the open items; the
 * closed ones, whose text it leaves out, are rows that do not open.
 */
function Accordion({
  items,
  initial = null,
}: {
  items: Array<Item>
  initial?: number | null
}) {
  const [open, setOpen] = useState<number | null>(initial)
  return (
    <div className="ads-accordion ads-careers-accordion">
      {items.map(({ title, body }, i) => (
        <div
          key={title}
          className="ads-accordion-item"
          data-open={open === i ? "" : undefined}
        >
          <button
            type="button"
            className="ads-accordion-row"
            aria-expanded={body ? open === i : undefined}
            aria-disabled={body ? undefined : true}
            onClick={() => body && setOpen(open === i ? null : i)}
            {...quiet}
          >
            <span className="ads-accordion-title">{title}</span>
            <TbChevronDown aria-hidden />
          </button>
          {body && (
            <div className="ads-accordion-panel">
              <div>
                <div className="ads-accordion-body">{body}</div>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

const HEALTH = [
  "Comprehensive health, dental, and vision insurance for you and your dependents",
  "Inclusive fertility benefits via Carrot Fertility",
  "22 weeks of paid parental leave",
  "Flexible paid time off and absence policies",
  "Mental health support for you and your dependents",
]

const SUPPORT: Array<Item> = [
  {
    title: "Health and wellness",
    body: (
      <ul className="ads-careers-perks">
        {HEALTH.map((perk) => (
          <li key={perk} className="ads-body-3">
            <span className="ads-careers-perk-mark" aria-hidden>
              <TbArrowRight />
            </span>
            {perk}
          </li>
        ))}
      </ul>
    ),
  },
  { title: "Compensation and support" },
  { title: "Additional benefits" },
]

const HIRE: Array<Item> = [
  {
    title: "What we are looking for",
    body: (
      <>
        <p>
          We care about what you can do, not where you learned to do it. About
          half our technical staff had no prior ML experience; about half have
          PhDs, but plenty of brilliant colleagues never went to college. If
          you’ve done interesting independent research, written a thoughtful
          blog post, or contributed to open source, put that at the top of your
          resume.
        </p>
        <p>
          One thing worth knowing: engineers here do lots of research, and
          researchers do lots of engineering. If you have an engineering
          background, apply as an engineer—you’ll perform better in the
          interviews, and you’ll have as much input into Anthropic’s direction
          as anyone else. All our papers have engineers as authors, often as
          first author.
        </p>
        <p>
          For non-technical roles, we’re looking for people who bring clarity,
          judgment, and a genuine interest in the mission. Our policy,
          operations, and business teams are small and high-impact. You’ll shape
          how we work, not just execute on a playbook.
        </p>
      </>
    ),
  },
  { title: "The interview process" },
  { title: "Your safety matters to us" },
  { title: "Privacy policies" },
  { title: "Applicant and interview accommodations" },
  { title: "Our policy for using AI in our application process" },
]

const FAQ: Array<Item> = [
  { title: "Do you offer internships?" },
  { title: "Can I get feedback on my application or interview?" },
  { title: "Can I re-apply if I’m not selected?" },
  { title: "How long do I have to decide on an offer?" },
  { title: "Do you sponsor visas?" },
  { title: "What’s your remote work policy?" },
]

function Careers() {
  return (
    <>
      <PageBlock theme={["ivory", "slate"]}>
        {/* The hero is the header's page, so its menus open over it (the
            file draws Company's open over the headline). */}
        <SiteNavigation>
          <PageSection theme={["ivory", "slate"]} className="ads-careers-hero">
            <Mission
              title="Shape how AI meets the world"
              text="Anthropic builds Claude—AI designed to be helpful, honest, and harmless. We're researchers, engineers, and builders from a range of disciplines, working to make sure powerful AI goes well for everyone. If you're drawn to hard problems with real stakes, we'd like to meet you."
              action="Explore open roles"
              align="start"
            />
            <div className="ads-careers-media">
              <img
                src={`${ART}/team.webp`}
                alt=""
                loading="lazy"
                decoding="async"
              />
              <PlayButton size="small" />
            </div>
            <div className="ads-careers-more">
              <div className="ads-careers-links">
                {["Mission", "Leadership", "Apply"].map((label) => (
                  <AnalysisMetadata key={label} value="link" label={label} />
                ))}
              </div>
              <div className="ads-careers-pieces">
                <div className="ads-company-cell">
                  <h2 className="ads-heading-5-serif">Building Anthropic</h2>
                  <p className="ads-body-2">
                    Our co-founders discuss the origins of Anthropic, the “race
                    to the top” in AI development, and where AI technology will
                    go from here.
                  </p>
                </div>
                <div className="ads-company-cell">
                  <h2 className="ads-heading-5-serif">The team</h2>
                  <p className="ads-body-2">
                    We’re a team of researchers, engineers, policy experts and
                    operational leaders, with experience spanning a variety of
                    disciplines, all working together to build reliable and
                    understandable AI systems.
                  </p>
                </div>
              </div>
            </div>
          </PageSection>
        </SiteNavigation>
      </PageBlock>
      <Band
        title="Principles that guide how we show up for each other and our mission"
        total={7}
        slide={{
          image: `${ART}/trust.webp`,
          title: "Electing Board members",
          text: "The Trust has the authority to elect a majority of Anthropic’s Board of Directors. This is to ensure that the Board is equipped to balance Anthropic’s mission with the company’s commercial goals.",
        }}
      >
        <p className="ads-body-3">
          We’re developing AI systems with unprecedented capabilities—systems
          which we believe will reshape humanity’s future. Traditional corporate
          governance wasn’t designed for a company in this position.
        </p>
        <p className="ads-body-3">
          That is why we created the{" "}
          <InlineLink>Long-Term Benefit Trust</InlineLink>, an additional layer
          of governance unique to Anthropic. The Trust works to ensure Anthropic
          fulfills its mission as a public benefit corporation. It does so
          through four primary mechanisms:
        </p>
      </Band>
      <PageSection theme={["ivory", "slate"]}>
        <Row
          title="How we support you"
          aside={
            <p className="ads-body-3">
              We want you to thrive at work and feel confident that you and your
              family are taken care of. That means comprehensive benefits,
              competitive compensation, and resources to help you do your best
              work.
            </p>
          }
        >
          <Accordion items={SUPPORT} initial={0} />
        </Row>
        <Row
          title="How we hire"
          aside={
            <>
              <p className="ads-body-3">
                Our interview process is designed to find thoughtful people with
                diverse expertise. Here’s what to expect.
              </p>
              <div className="ads-careers-guidance">
                <Button variant="secondary" icon="trailing">
                  AI guidance for candidates
                </Button>
              </div>
            </>
          }
        >
          <Accordion items={HIRE} initial={0} />
        </Row>
        <Row title="Frequently asked questions">
          <Accordion items={FAQ} />
        </Row>
      </PageSection>
      <Footer />
    </>
  )
}

// Wide, the cursor rests on the hero's button, the film's play button, and
// the links under it; then scrolls to the benefits and closes and reopens
// the open one. On a phone it tries the button and the film again.
const STEPS: Array<DemoStep> = [
  { on: ".ads-company-mission .ads-btn", rest: 900 },
  { on: ".ads-careers-media .ads-play", rest: 900 },
  { on: ".ads-careers-links .ads-meta-link", nth: 0, rest: 500 },
  { on: ".ads-careers-links .ads-meta-link", nth: 1, rest: 500 },
  { on: ".ads-careers-links .ads-meta-link", nth: 2, rest: 500 },
  { on: ".cds-tpl-thumb", drag: 50 },
  { on: ".ads-accordion-row", text: "Health and wellness", click: "close" },
  { on: ".ads-accordion-row", text: "Health and wellness", click: "open" },
  { on: ".ads-careers-perks li", nth: 2, rest: 900 },
  { on: ".ads-careers-guidance .ads-btn", rest: 900 },
  { on: ".cds-resize-grip", nth: 1, drag: 390 },
  { on: ".ads-company-mission .ads-btn", rest: 900 },
  { on: ".ads-careers-media .ads-play", rest: 900 },
]

export function CareersDoc() {
  return (
    <Section>
      <TemplateFigure steps={STEPS} sizes={COMPANY_SIZES}>
        <Careers />
      </TemplateFigure>
    </Section>
  )
}
