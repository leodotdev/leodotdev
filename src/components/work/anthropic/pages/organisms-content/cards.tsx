import { TbArrowRight } from "react-icons/tb"
import { Button } from "@/components/work/anthropic/specimens"
import { DemoCursor } from "@/components/work/claude/demo-cursor"
import { Resizable } from "@/components/work/claude/resizable"
import { Section, Specimen } from "@/components/work/claude/ui"
import { ART, MenuTopicDate, SkelHeading, SkelText, stay } from "./shared"
import type { DemoStep } from "@/components/work/claude/demo-cursor"

// Asset, Tout & Case Study Cards, and the Table Grid Item: cards for posts,
// downloads, and customers, as the file's "Asset", "Tout Card" (Row and
// Column), "Case Study Card", and "Table Grid Item" components draw them.

/**
 * The file's "Asset": a post's topic and date over a square picture, its
 * title, and a line of text. `image` is the file's "Show image".
 */
export function AssetItem({
  title = "Anthropic Education Report",
  text = "Our most capable model yet. Claude Opus 4.5 sets a new standard for coding, agents, and computer use—built for the work that matters most.",
  image = true,
}: {
  title?: string
  text?: string
  image?: boolean
}) {
  return (
    <article className="ads-asset">
      <MenuTopicDate />
      <div className="ads-asset-body">
        {image && (
          <img
            className="ads-asset-media"
            src={`${ART}/office.webp`}
            alt=""
            width={560}
            height={590}
          />
        )}
        <div className="ads-asset-text">
          <a className="ads-asset-title" {...stay}>
            {title}
          </a>
          <p>{text}</p>
        </div>
      </div>
    </article>
  )
}

const REPORT =
  "Anthropic Economic Index report: Uneven geographic and enterprise AI adoption"

/**
 * The file's "Tout Card": a picture, a headline, and a link to read on. A
 * row where it has room, a column where it does not (its Layout property).
 */
export function ToutCard({ title = REPORT }: { title?: string }) {
  return (
    <article className="ads-tout">
      <img
        className="ads-tout-media"
        src={`${ART}/office.webp`}
        alt=""
        width={560}
        height={590}
      />
      <div className="ads-tout-body">
        <a className="ads-tout-title" {...stay}>
          {title}
        </a>
        <a className="ads-oc-text-link" {...stay}>
          Read the report
          <TbArrowRight aria-hidden />
        </a>
      </div>
    </article>
  )
}

/**
 * The file's "Case Study Card": a customer's logo over a rule, the case
 * study's title and text, and a button to read more.
 */
export function CaseStudyCard({
  title = "Case study title",
  text = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
  onRead,
}: {
  title?: string
  text?: string
  /** What its button does: open the case study (the fly-out). */
  onRead?: () => void
}) {
  return (
    <article className="ads-case">
      <div className="ads-case-logo">
        <img
          className="ads-art"
          src={`${ART}/replit.svg`}
          alt="Replit"
          width={84}
          height={21}
        />
      </div>
      <div className="ads-case-text">
        <h4>{title}</h4>
        <p>{text}</p>
      </div>
      <div>
        <Button variant="secondary" icon="trailing" onClick={onRead}>
          Read more
        </Button>
      </div>
    </article>
  )
}

/**
 * The file's "Table Grid Item": a post in a grid of them, its topic and
 * date over a square picture and its title.
 */
export function TableGridItem({
  tag = "Economic Research",
  date = "Jan. 12, 2026",
  title = "Anthropic Education Report: How educators use Claude",
  image = `${ART}/office.webp`,
}: {
  tag?: string
  date?: string
  title?: string
  image?: string
}) {
  return (
    <article className="ads-grid-item">
      <MenuTopicDate tag={tag} date={date} />
      <img className="ads-grid-item-media" src={image} alt="" />
      <a className="ads-grid-item-title" {...stay}>
        {title}
      </a>
    </article>
  )
}

// It narrows the tout card from a row to a column, and lets it out again.
const TOUT_DEMO: Array<DemoStep> = [
  { on: ".ads-oc-text-link", rest: 800 },
  { on: ".cds-resize-grip", nth: 1, drag: 560 },
  { on: ".cds-resize-grip", nth: 1, drag: 360 },
  { on: ".ads-oc-text-link", rest: 900 },
  { on: ".cds-resize-grip", nth: 1, drag: 4000 },
]

const CASE_DEMO: Array<DemoStep> = [
  { on: ".ads-case .ads-btn", nth: 0, rest: 900 },
  { on: ".ads-case .ads-btn", nth: 1, rest: 900 },
  { on: ".ads-case .ads-btn", nth: 2, rest: 900 },
]

const GRID = [
  [
    "Economic Research",
    "Jan. 12, 2026",
    "Anthropic Education Report: How educators use Claude",
    `${ART}/office.webp`,
  ],
  [
    "Announcement",
    "Jan. 30, 2026",
    "ServiceNow chooses Claude to power customer apps and increase internal productivity",
    `${ART}/servicenow.webp`,
  ],
  [
    "Economic Research",
    "Jan. 30, 2026",
    "Economic Index",
    `${ART}/economic-index.webp`,
  ],
  [
    "Economic Research",
    "Jan. 12, 2026",
    "Anthropic Education Report: How educators use Claude",
    `${ART}/office.webp`,
  ],
] as const

export function CardsDoc() {
  return (
    <>
      <Section
        title="Asset Item"
        caption="A download’s topic and date, a square picture, its title, and a line about it. The picture can be left off."
      >
        <Specimen figure>
          <div className="flex flex-wrap items-start justify-center gap-6 px-6 py-16 md:px-8">
            <AssetItem />
            <AssetItem image={false} />
          </div>
        </Specimen>
      </Section>

      <Section
        title="Tout Card"
        caption="Two layouts, Row and Column: the picture beside the headline, or above it where the card is narrow."
      >
        <Specimen figure>
          <DemoCursor steps={TOUT_DEMO} className="p-6 md:p-8">
            <Resizable
              label="Card width"
              sizes={[["Row"], ["Column", 399]]}
              className="flex min-h-[640px] flex-col justify-center sm:h-[640px]"
            >
              <div className="ads-oc-c flex flex-col items-center gap-10">
                <SkelText count={4} />
                <ToutCard />
                <SkelText count={3} />
              </div>
            </Resizable>
          </DemoCursor>
        </Specimen>
      </Section>

      <Section
        title="Case Study Card"
        caption="A customer’s logo, the case study’s title and a few lines on it, and a button to read more."
      >
        <Specimen figure>
          <DemoCursor steps={CASE_DEMO} className="px-6 py-16 md:px-8">
            <div className="flex flex-col gap-10">
              <SkelHeading center />
              <div className="ads-cases">
                <CaseStudyCard />
                <CaseStudyCard />
                <CaseStudyCard />
              </div>
            </div>
          </DemoCursor>
        </Specimen>
      </Section>

      <Section
        title="Table Grid Item"
        caption="A post as the index shows it in its Grid view: topic and date, a square picture, and its title."
      >
        <Specimen figure>
          <div className="px-6 py-16 md:px-8">
            <div className="ads-post-grid">
              {GRID.map(([tag, date, title, image], i) => (
                <TableGridItem
                  key={i}
                  tag={tag}
                  date={date}
                  title={title}
                  image={image}
                />
              ))}
            </div>
          </div>
        </Specimen>
      </Section>
    </>
  )
}
