import { useEffect, useRef, useState } from "react"
import { AudioPlayer } from "@/components/work/anthropic/pages/molecules/audio"
import {
  AnalysisMetadata,
  SubnavArticle,
  Video,
} from "@/components/work/anthropic/pages/molecules/article"
import {
  ButtonGroup,
  Pagination,
  Tabs,
} from "@/components/work/anthropic/pages/molecules/controls"
import {
  Menu,
  TopicDate,
} from "@/components/work/anthropic/pages/molecules/menu"
import { DemoCursor } from "@/components/work/claude/demo-cursor"
import { Resizable } from "@/components/work/claude/resizable"
import { Bar, Lines } from "@/components/work/claude/skeleton"
import {
  Cell,
  Section,
  Specimen,
  ThemeStrip,
} from "@/components/work/claude/ui"
import type { MetaValue } from "@/components/work/anthropic/pages/molecules/article"
import type { DemoStep } from "@/components/work/claude/demo-cursor"

// The molecules chapters of the Anthropic.com docs: each chapter's slug
// (as listed in ../docs.ts) and the component that draws it. They follow the
// Molecules page of the system's Figma file; the components themselves are
// in ./molecules/, exported for the organisms and templates.

export {
  AnalysisMetadata,
  ArticleSubnav,
  Video,
} from "@/components/work/anthropic/pages/molecules/article"
export { AudioPlayer } from "@/components/work/anthropic/pages/molecules/audio"
export {
  ButtonGroup,
  Pagination,
  Tabs,
} from "@/components/work/anthropic/pages/molecules/controls"
export {
  Menu,
  MenuButton,
  TopicDate,
} from "@/components/work/anthropic/pages/molecules/menu"

const LABELS = Array.from({ length: 8 }, () => "Label")

// Across the three menus, resting on an item of each. Its notes are the
// file's: the Menu's two properties and its variants, and its helpers Menu
// Item and Menu Group.
const MENU_DEMO: Array<DemoStep> = [
  {
    on: ".ads-menu-item",
    text: "Nav Item",
    nth: 1,
    rest: 900,
    note: {
      kind: "concept",
      title: "Menu Item",
      text: "A helper component with two states, Default and Hover.",
    },
  },
  {
    on: '.ads-menu[data-device="mobile"] .ads-menu-item',
    nth: 2,
    rest: 900,
    note: {
      kind: "concept",
      title: "Device",
      on: '.ads-menu[data-device="mobile"]',
      text: "Desktop or Mobile. In the file only Mobile comes in sections.",
    },
  },
  { on: '.ads-menu[data-device="mobile"] .ads-menu-item', nth: 5, rest: 700 },
  {
    on: '[aria-label="Two sections"] .ads-menu-item',
    nth: 11,
    rest: 900,
    note: {
      kind: "concept",
      title: "Sections",
      on: '[aria-label="Two sections"]',
      text: "Default, 2, or 4. A second helper, Menu Group, holds a section’s label and links.",
    },
  },
  { on: '[aria-label="Two sections"] .ads-menu-item', nth: 3, rest: 900 },
]

function MenuDoc() {
  return (
    <Section caption="Items come in groups, a label over each. A menu holds one group, two, or four, at a desktop size or a mobile one.">
      <Specimen figure>
        <DemoCursor
          steps={MENU_DEMO}
          className="flex flex-wrap items-start justify-center gap-8 px-6 py-10 md:px-8"
        >
          <Menu
            tabbable
            label="Desktop"
            groups={[{ items: ["Nav Item", "Nav Item", "Nav Item"] }]}
          />
          <Menu
            tabbable
            label="Mobile"
            device="mobile"
            groups={[{ items: LABELS }]}
          />
          <Menu
            tabbable
            label="Two sections"
            device="mobile"
            columns={2}
            groups={[
              { label: "Section label", items: LABELS },
              { label: "Section label", items: LABELS },
            ]}
          />
        </DemoCursor>
      </Specimen>
    </Section>
  )
}

// It opens the menu, looks down it and picks, then opens it again and
// leaves it with Escape's equal, a press on the button.
// Its note is the file's component, "Menu, Topic, Date": its layers and its
// two boolean properties.
const TOPIC_DEMO: Array<DemoStep> = [
  {
    on: ".ads-menu-btn",
    click: "open",
    rest: 400,
    note: {
      kind: "concept",
      title: "Menu, Topic, Date",
      on: ".ads-topic-date",
      text: "One component: a Tiny More Button, a tag, and a date. The button and the tag can be hidden.",
    },
  },
  { on: ".ads-menu-item", nth: 0 },
  { on: ".ads-menu-item", nth: 1 },
  { on: ".ads-menu-item", nth: 2, click: true, rest: 900 },
  { on: ".ads-menu-btn", click: "open", rest: 400 },
  { on: ".ads-menu-item", nth: 1, rest: 700 },
  { on: ".ads-menu-btn", click: "close", rest: 900 },
]

function MenuButtonDoc() {
  return (
    <Section>
      <Specimen figure>
        {/* As much room above the row as the menu takes below it. */}
        <DemoCursor
          steps={TOPIC_DEMO}
          className="flex justify-center px-6 py-[136px] md:px-8"
        >
          <TopicDate />
        </DemoCursor>
      </Specimen>
    </Section>
  )
}

const VARIANTS = ["secondary", "tertiary"] as const
const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1)

// Along each group, so the hover and the dimmed siblings show. Its notes
// are the designers' note on hover beside the Button Group in the file, and
// the component's two properties.
const GROUP_DEMO: Array<DemoStep> = [
  {
    on: ".ads-btn-group .ads-btn",
    nth: 1,
    rest: 700,
    note: {
      kind: "concept",
      title: "Hover",
      text: "“On hover, bg-color matches border-color.”",
    },
  },
  {
    on: ".ads-btn-group .ads-btn",
    nth: 3,
    rest: 700,
    note: {
      kind: "concept",
      title: "Siblings",
      on: ".ads-btn-group",
      text: "The hovered button’s foreground turns primary. Its siblings’ turn quaternary.",
    },
  },
  {
    on: ".ads-btn-group .ads-btn",
    nth: 7,
    rest: 700,
    note: {
      kind: "concept",
      title: "Icons",
      text: "Type is Labels or Icons. With Variant, that makes the group’s four variants.",
    },
  },
  { on: ".ads-btn-group .ads-btn", nth: 12, rest: 700 },
  { on: ".ads-btn-group .ads-btn", nth: 18, rest: 900 },
]

function ButtonGroupDoc() {
  return (
    <>
      <Section
        title="Variants"
        caption="Secondary or Tertiary buttons, with labels or with icons."
      >
        <Specimen figure>
          <DemoCursor
            steps={GROUP_DEMO}
            className="grid justify-center gap-x-12 gap-y-8 px-6 py-10 md:grid-cols-[auto_auto] md:px-8"
          >
            {VARIANTS.map((variant) => (
              <Cell
                key={variant}
                label={cap(variant)}
                className="flex-col !items-start gap-5"
              >
                <ButtonGroup variant={variant} />
                <ButtonGroup variant={variant} type="icons" />
              </Cell>
            ))}
          </DemoCursor>
        </Specimen>
      </Section>
      <Section
        title="States"
        caption="“At rest, the button holds a calm, consistent tone.” On hover its fill takes its border’s color and its siblings’ labels fade. Focus draws an outline."
      >
        <Specimen figure className="max-lg:overflow-x-auto">
          <div className="grid w-max min-w-full grid-cols-[repeat(4,auto)] items-center justify-center gap-x-10 gap-y-6 p-6 md:p-8">
            <span />
            {["Default", "Hover", "Focus"].map((name) => (
              <span
                key={name}
                className="ads-caption-2-mono"
                style={{ color: "var(--ads-fg-3)" }}
              >
                {name}
              </span>
            ))}
            {VARIANTS.map((variant) => [
              <span
                key={variant}
                className="ads-caption-2-mono"
                style={{ color: "var(--ads-fg-3)" }}
              >
                {variant}
              </span>,
              <ButtonGroup key="d" variant={variant} count={3} />,
              <ButtonGroup key="h" variant={variant} count={3} state="hover" />,
              <ButtonGroup key="f" variant={variant} count={3} state="focus" />,
            ])}
          </div>
        </Specimen>
        <ThemeStrip figure>
          {VARIANTS.map((variant) => (
            <ButtonGroup
              key={variant}
              variant={variant}
              type="icons"
              count={3}
            />
          ))}
        </ThemeStrip>
      </Section>
    </>
  )
}

// What each tab shows: a skeleton view, laid out its own way, so the
// switch is plain to see.
const VIEWS = [
  { cols: 3, rows: 1 },
  { cols: 2, rows: 2 },
  { cols: 4, rows: 1 },
  { cols: 1, rows: 2 },
  { cols: 3, rows: 2 },
]

function TabsFigure() {
  const [tab, setTab] = useState(0)
  const view = VIEWS[tab]
  return (
    <div className="flex w-full flex-col items-center gap-10">
      <Tabs current={tab} onChange={setTab} idBase="ads-mol-tabs" />
      <div
        key={tab}
        id="ads-mol-tabs-panel"
        role="tabpanel"
        aria-labelledby={`ads-mol-tabs-tab-${tab}`}
        className="ads-tab-panel max-w-[760px]"
        style={{ "--cols": view.cols } as React.CSSProperties}
      >
        {Array.from({ length: view.cols * view.rows }, (_, i) => (
          <div key={i} aria-hidden>
            <Bar w="100%" h={view.cols === 1 ? 72 : 96} r={12} />
            <Lines count={2} last={`${50 + ((i * 23) % 40)}%`} />
          </div>
        ))}
      </div>
    </div>
  )
}

// Its note is the file's Tabs component: one variant, made of five Buttons.
const TABS_DEMO: Array<DemoStep> = [
  {
    on: ".ads-tab",
    nth: 1,
    click: true,
    rest: 1100,
    note: {
      kind: "concept",
      title: "Tabs",
      on: ".ads-tabs",
      text: "In the file, one variant, Size=Small, built from five instances of the Button.",
    },
  },
  { on: ".ads-tab", nth: 3, click: true, rest: 1100 },
  { on: ".ads-tab", nth: 4, click: true, rest: 1100 },
  { on: ".ads-tab", nth: 0, click: true, rest: 1300 },
]

function TabsDoc() {
  return (
    <Section caption="One size, Small: round buttons on a track, the current one Primary and the rest Secondary.">
      <Specimen figure>
        <DemoCursor steps={TABS_DEMO} className="flex px-6 py-12 md:px-12">
          <TabsFigure />
        </DemoCursor>
      </Specimen>
    </Section>
  )
}

// The rows a page of the list shows, drawn from the page's number so each
// page looks its own.
function PagedList({ page }: { page: number }) {
  return (
    <div key={page} className="ads-paged-list" aria-hidden>
      {[0, 1, 2, 3].map((row) => {
        const seed = page * 7 + row * 3
        return (
          <div key={row}>
            <Bar w={64 + (seed % 3) * 12} h={10} />
            <Lines
              count={1 + (seed % 2)}
              last={`${40 + ((seed * 11) % 50)}%`}
            />
            <Bar w={56} h={10} />
          </div>
        )
      })}
    </div>
  )
}

function PaginationFigure() {
  const [page, setPage] = useState(1)
  return (
    <div className="flex w-full flex-col items-center gap-10">
      <PagedList page={page} />
      <Pagination page={page} onChange={setPage} />
    </div>
  )
}

// Its note is the file's Pagination component: two Buttons and its sample
// count.
const PAGINATION_DEMO: Array<DemoStep> = [
  {
    on: '[aria-label="Next"]',
    click: true,
    rest: 600,
    note: {
      kind: "concept",
      title: "Count",
      on: ".ads-pagination-count",
      text: "Between two instances of the Button. The file’s sample reads “01 / 12.”",
    },
  },
  { on: '[aria-label="Next"]', click: true, rest: 600 },
  { on: '[aria-label="Next"]', click: true, rest: 900 },
  { on: '[aria-label="Previous"]', click: true, rest: 500 },
  { on: '[aria-label="Previous"]', click: true, rest: 500 },
  { on: '[aria-label="Previous"]', click: true, rest: 1000 },
]

function PaginationDoc() {
  return (
    <Section caption="Two tertiary arrow buttons either side of the count, in mono.">
      <Specimen figure>
        <DemoCursor
          steps={PAGINATION_DEMO}
          className="mx-auto flex max-w-[760px] px-6 py-12 md:px-12"
        >
          <PaginationFigure />
        </DemoCursor>
      </Specimen>
    </Section>
  )
}

// Its notes are the Audio Player's variants in the file: Version 1 in two
// devices and two states, Version 2 in its Claude state in two devices.
const AUDIO_DEMO: Array<DemoStep> = [
  {
    on: ".ads-audio-play",
    click: true,
    rest: 400,
    note: {
      kind: "concept",
      title: "Version 1",
      on: ".ads-audio",
      text: "Wide or Narrow, at rest or on hover: four of the component’s six variants.",
    },
  },
  { on: ".ads-audio-bar", at: [0.6, 0.5], click: true, rest: 900 },
  { on: ".ads-audio-play", click: true, rest: 1800 },
  {
    on: '.ads-audio[data-version="2"] .ads-audio-play',
    click: true,
    rest: 2400,
    note: {
      kind: "concept",
      title: "Version 2",
      on: '.ads-audio[data-version="2"]',
      text: "The other two variants: one State, named Claude, at Desktop and at Narrow.",
    },
  },
  {
    on: '.ads-audio[data-version="2"] .ads-audio-play',
    click: true,
    rest: 600,
  },
  { on: ".ads-audio-voice", rest: 900 },
]

// The players, each at a width the file draws it: Wide, Narrow, and the
// Claude state's Desktop.
const PLAYERS: Array<[version: 1 | 2, width: number]> = [
  [1, 402],
  [1, 295],
  [2, 677],
  [2, 295],
]

// Its notes are the file's own use of the player beside the component: in
// an article's text, Wide under the label "desktop LG" and Narrow under
// "mobile xs".
const ARTICLE_AUDIO_DEMO: Array<DemoStep> = [
  {
    on: ".ads-audio-play",
    click: true,
    rest: 1600,
    note: {
      kind: "concept",
      title: "Wide",
      on: ".ads-audio",
      text: "The file sets the player in an article’s text too, under the label “desktop LG.”",
    },
  },
  {
    on: ".cds-resize-grip",
    nth: 1,
    drag: 380,
    note: {
      kind: "concept",
      title: "Narrow",
      on: ".ads-audio",
      text: "The component’s other Device. The file labels it “mobile xs.”",
    },
  },
  { on: ".ads-audio-bar", at: [0.3, 0.5], click: true, rest: 900 },
  { on: ".ads-audio-play", click: true, rest: 1600 },
  { on: ".cds-resize-grip", nth: 1, drag: 4000 },
]

function AudioDoc() {
  return (
    <>
      <Section
        title="Versions"
        caption="Version 1 plays a podcast. Version 2, the Claude state, reads an article aloud, its voice beside the time. Narrow, the time drops under the title; on hover the playbar thickens."
      >
        <Specimen figure>
          <DemoCursor
            steps={AUDIO_DEMO}
            className="grid justify-center gap-6 px-6 py-10 md:grid-cols-[auto_auto] md:px-8"
          >
            {PLAYERS.map(([version, width], i) => (
              <div key={i} className="max-w-full" style={{ width }}>
                <AudioPlayer version={version} />
              </div>
            ))}
          </DemoCursor>
        </Specimen>
      </Section>
      <Section
        title="In an Article"
        caption="Set in an article’s text, Wide on a desktop and Narrow on a phone."
      >
        <Specimen figure>
          <DemoCursor steps={ARTICLE_AUDIO_DEMO}>
            <Resizable
              label="Article width"
              min={360}
              sizes={[["Wide"], ["Narrow", 407]]}
              className="sm:h-[600px]"
            >
              <div className="mx-auto flex max-w-[742px] flex-col gap-8 px-6 py-12">
                <Lines count={4} last="70%" />
                <AudioPlayer />
                <Lines count={5} last="45%" />
                <Lines count={3} last="80%" />
              </div>
            </Resizable>
          </DemoCursor>
        </Specimen>
      </Section>
    </>
  )
}

// The rows of an analysis's metadata, with the file's own labels and values
// where it uses the molecule (its analysis hero, and its company page's
// links): the date and the team, the topics and authors as lists, the share
// links, and a link on. Each row is set alike (Leo, 2026-11-20).
const AUTHORS = ["Kunal Handa", "Michael Stern", "Saffron Huang", "Jerry Hong"]
const META_ROWS: Array<{
  value: MetaValue
  label: string
  list?: Array<string>
  text?: string
}> = [
  { value: "sans", label: "Published", text: "Jan. 12, 2026" },
  { value: "sans", label: "Team", text: "Societal Impacts" },
  {
    value: "list",
    label: "Topics",
    list: ["Alignment", "Interpretability", "Societal Impacts"],
  },
  { value: "list", label: "Authors", list: AUTHORS },
  { value: "share", label: "Share" },
  { value: "link", label: "Anthropic post", text: "Read post" },
]

// The analysis's contents, the first parts of the file's sample.
const META_TOC = ["Introduction", "Method", "Results", "Looking forward"]

/** Narrow when the page, as laid out, is narrower than `at`. */
function useNarrow(at: number) {
  const ref = useRef<HTMLDivElement>(null)
  const [narrow, setNarrow] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new ResizeObserver(([entry]) =>
      setNarrow(entry.contentRect.width < at)
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [at])
  return [ref, narrow] as const
}

/**
 * The metadata on a skeleton of an analysis's top, as the file's analysis
 * hero sets it: wide, the contents down the left, the text, and the
 * metadata down the right, each label beside its value; narrow, the
 * metadata in columns over the text, each label over its value (a long
 * list shows its first two and "See more…"), the contents folded away.
 */
function MetadataPage() {
  const [ref, narrow] = useNarrow(840)
  const direction = narrow ? "vertical" : "horizontal"
  return (
    <div
      ref={ref}
      className="ads-meta-page"
      data-narrow={narrow ? "" : undefined}
    >
      <div className="ads-meta-page-grid">
        <div className="ads-meta-page-toc">
          {META_TOC.map((name, i) => (
            <AnalysisMetadata
              key={name}
              value="toc"
              label={name}
              number={String(i + 1).padStart(2, "0")}
            />
          ))}
        </div>
        <div className="ads-meta-page-text" aria-hidden>
          <Bar w="62%" h={22} />
          <Lines count={5} last="54%" />
          <span className="cds-skel ads-meta-page-figure" />
          <Lines count={4} last="70%" />
        </div>
        <div className="ads-meta-page-info">
          {META_ROWS.map(({ value, label, list, text }) => (
            <AnalysisMetadata
              key={label}
              value={value}
              label={label}
              direction={direction}
            >
              {list
                ? [
                    ...(narrow && list.length > 3 ? list.slice(0, 2) : list),
                    ...(narrow && list.length > 3 ? ["See more…"] : []),
                  ].map((item) => <span key={item}>{item}</span>)
                : text}
            </AnalysisMetadata>
          ))}
        </div>
      </div>
    </div>
  )
}

// Its notes are the component's two properties in the file, Value and
// Direction, and their twelve variants.
const META_DEMO: Array<DemoStep> = [
  {
    on: ".ads-meta-icon",
    nth: 0,
    rest: 600,
    note: {
      kind: "concept",
      title: "Value",
      on: '.ads-meta[data-value="share"]',
      text: "Share is one of six: Mono Value, Sans Value, List, Share, Link, and Table of Contents.",
    },
  },
  { on: ".ads-meta-icon", nth: 2, rest: 600 },
  { on: ".ads-meta-link", rest: 900 },
  {
    on: ".cds-resize-grip",
    nth: 1,
    drag: 440,
    rest: 900,
    note: {
      kind: "concept",
      title: "Horizontal & Vertical",
      on: ".ads-meta-page-info",
      text: "Horizontal or Vertical. Every value comes in both: twelve variants.",
    },
  },
  { on: ".ads-meta-icon", nth: 1, rest: 600 },
  { on: ".ads-meta-link", rest: 900 },
  { on: ".cds-resize-grip", nth: 1, drag: 4000 },
]

function AnalysisMetadataDoc() {
  return (
    <Section caption="A label with its value beside it or under it: a word or two, a list, the share links, or a link. A table of contents row is a number and a name.">
      <Specimen figure>
        <DemoCursor steps={META_DEMO}>
          <Resizable
            label="Page width"
            min={360}
            bleed
            sizes={[["Wide"], ["Narrow", 839]]}
            className="min-h-[640px] sm:h-[640px]"
          >
            <MetadataPage />
          </Resizable>
        </DemoCursor>
      </Specimen>
    </Section>
  )
}

// It presses play, watches a while, and stops the video, which brings the
// cover back. Its note is the file's Video component, which is one instance
// of Media at 16:9 and nothing else.
const VIDEO_DEMO: Array<DemoStep> = [
  {
    on: ".ads-video .ads-play",
    click: true,
    rest: 700,
    note: {
      kind: "concept",
      title: "Video",
      on: ".ads-video",
      text: "In the file, one instance of Media. The cover and its Play Button follow anthropic.com.",
    },
  },
  { on: ".ads-video-player", idle: true, at: [0.5, 0.82], rest: 3600 },
  { on: ".ads-video-player", at: [0.5, 0.5], click: true, rest: 500 },
  { on: ".ads-video", idle: true, at: [0.5, 0.82], rest: 1400 },
]

function VideoDoc() {
  return (
    <Section caption="A Media frame at 16:9, its corners rounded. On anthropic.com a cover lies over it with the Play Button in its middle: pressed, the video plays, and pressed again, the cover returns.">
      <Specimen figure>
        <DemoCursor
          steps={VIDEO_DEMO}
          className="mx-auto flex max-w-[742px] flex-col gap-8 px-6 py-12"
        >
          <Lines count={3} last="60%" />
          <Video />
          <Lines count={4} last="40%" />
        </DemoCursor>
      </Specimen>
    </Section>
  )
}

// It reads down the piece, opens the contents and goes to a section, then
// does the same at a phone's width.
// Its note is the file's Article Subnav component: an instance of Analysis
// metadata (Value=Table of Contents) and a small caret.
const SUBNAV_DEMO: Array<DemoStep> = [
  { on: ".ads-article-window", scroll: 0, idle: true, at: [0.5, 0.5] },
  {
    on: ".ads-article-window",
    scroll: 30,
    at: [0.5, 0.6],
    rest: 1200,
    note: {
      kind: "concept",
      title: "Article Subnav",
      on: ".ads-subnav-bar",
      text: "In the file: an Analysis metadata row, its Table of Contents value, and a small caret.",
    },
  },
  { on: ".ads-subnav-bar", click: "open", rest: 500 },
  { on: ".ads-subnav-item", nth: 3 },
  { on: ".ads-subnav-item", nth: 5, click: true, rest: 1600 },
  { on: ".cds-resize-grip", nth: 1, drag: 600 },
  { on: ".ads-subnav-bar", click: "open", rest: 500 },
  { on: ".ads-subnav-item", nth: 1, click: true, rest: 1400 },
  { on: ".cds-resize-grip", nth: 1, drag: 4000 },
]

function ArticleSubnavDoc() {
  return (
    <Section caption="An analysis’s table of contents, held at the top under the header. It names the section being read, and opens to all of them.">
      <Specimen figure>
        <DemoCursor steps={SUBNAV_DEMO}>
          <Resizable
            label="Page width"
            min={390}
            bleed
            sizes={[["Desktop"], ["Tablet", 1023], ["Mobile", 639]]}
            className="h-[640px]"
          >
            <SubnavArticle />
          </Resizable>
        </DemoCursor>
      </Specimen>
    </Section>
  )
}

export const MOLECULES: Record<string, () => React.ReactNode> = {
  menu: MenuDoc,
  "menu-button": MenuButtonDoc,
  "button-group": ButtonGroupDoc,
  tabs: TabsDoc,
  pagination: PaginationDoc,
  "audio-player": AudioDoc,
  "analysis-metadata": AnalysisMetadataDoc,
  video: VideoDoc,
  "article-subnav": ArticleSubnavDoc,
}
