import { TbSearch } from "react-icons/tb"
import { DemoCursor } from "@/components/work/claude/demo-cursor"
import { Resizable } from "@/components/work/claude/resizable"
import { Bar, Lines } from "@/components/work/claude/skeleton"
import { Section, Specimen } from "@/components/work/claude/ui"
import {
  Footer,
  Prefooter,
} from "@/components/work/anthropic/pages/organisms-site/footer"
import { HeroCarousel } from "@/components/work/anthropic/pages/organisms-site/hero-carousel"
import { SiteNavigation } from "@/components/work/anthropic/pages/organisms-site/navigation"
import {
  SkeletonHero,
  SkeletonListEnd,
  SkeletonPosts,
  SkeletonSiteNav,
} from "@/components/work/anthropic/pages/organisms-site/skeleton"
import { TooltipAnchor } from "@/components/work/anthropic/pages/organisms-site/tooltip"
import type { DemoStep } from "@/components/work/claude/demo-cursor"

// The site-wide organisms of the Anthropic.com docs, from the "System-wide
// organisms" section of the Figma file's Organisms page: each chapter's
// slug (as listed in ../docs.ts) and the component that draws it. The
// header and footer are exported from organisms-site/ for the page
// templates to reuse.

export {
  SiteNavigation,
  ExpandedNavigation,
} from "@/components/work/anthropic/pages/organisms-site/navigation"
export {
  Footer,
  Prefooter,
} from "@/components/work/anthropic/pages/organisms-site/footer"
export { HeroCarousel } from "@/components/work/anthropic/pages/organisms-site/hero-carousel"

// The header's demo: the cursor rests on each pill in sight, which opens
// its menu, and looks down it; opens search and types; opens the expanded
// menu and a section of it; narrows the figure to a phone and does the same;
// and lets it out again. A step whose control is hidden at the width
// showing is skipped (the left-hand pills and Company show from 1100px, so
// in a figure of its own width only once it is dragged wider). The header
// follows the site, so its notes keep to what the file itself has: the
// "Navigation" component's states and switches, and the frames of its
// "Expanded navigation" section.
const NAV_DEMO: Array<DemoStep> = [
  { on: ".ads-xnav-close", click: "close", rest: 200 },
  { on: ".ads-nav-search-close", click: true, rest: 200 },
  { on: ".ads-nav-pill", text: "Research", rest: 600 },
  { on: ".ads-nav-menu-item", text: "Interpretability" },
  { on: ".ads-nav-pill", text: "Commitments", rest: 600 },
  { on: ".ads-nav-menu-item", text: "Responsible Scaling Policy" },
  { on: ".ads-nav-pill", text: "Company", rest: 600 },
  { on: ".ads-nav-menu-item", text: "Careers" },
  {
    on: ".ads-nav-pill",
    text: "Try Claude",
    rest: 600,
    note: {
      kind: "concept",
      title: "Open menus",
      on: ".ads-nav-menu",
      text: "The file draws five menus open, each a state of the header: Research, Commitments, Policy, Company, and Claude.",
    },
  },
  { on: ".ads-nav-menu-item", text: "Console" },
  { on: ".ads-nav-search", click: true },
  {
    on: ".ads-nav-field",
    type: "Project Fetch",
    rest: 700,
    note: {
      kind: "concept",
      title: "Search Open",
      text: "A state of its own, on desktop and on a phone. Its switch in the file is “Show Search (temp).”",
    },
  },
  { on: ".ads-nav-search-close", click: true, rest: 400 },
  {
    on: ".ads-nav-burger",
    click: "open",
    rest: 500,
    note: {
      kind: "concept",
      title: "Expanded navigation",
      on: ".ads-xnav-sections",
      text: "A section of its own in the file, drawn at five widths from XXL to XS.",
    },
  },
  {
    on: ".ads-xnav-link",
    text: "Company",
    click: "open",
    note: {
      kind: "concept",
      title: "Company open",
      on: ".ads-xnav-cards",
      text: "The file draws Company open: its links over three cards, Press, Support, and Media assets.",
    },
  },
  { on: ".ads-xnav-sub-link", text: "Careers" },
  { on: ".ads-contact", text: "Press" },
  { on: ".ads-xnav-link", text: "Company", click: "close" },
  { on: ".ads-xnav-row", text: "Models", click: "open" },
  { on: ".ads-xnav-sub-link", text: "Opus" },
  { on: ".ads-xnav-row", text: "Models", click: "close" },
  { on: ".ads-xnav-close", click: "close", rest: 500 },
  // A phone.
  { on: ".cds-resize-grip", nth: 1, drag: 390 },
  { on: ".ads-nav-burger", click: "open", rest: 500 },
  { on: ".ads-xnav-link", text: "Research", click: "open" },
  { on: ".ads-xnav-sub-link", text: "Alignment" },
  { on: ".ads-xnav-link", text: "Research", click: "close" },
  { on: ".ads-xnav-close", click: "close", rest: 500 },
  // And back out.
  { on: ".cds-resize-grip", nth: 1, drag: 4000 },
  { on: ".ads-nav-pill", text: "Policy", rest: 600 },
  { on: ".ads-nav-menu-item", text: "Policy on the AI Exponential" },
]

function NavigationDoc() {
  return (
    <Section caption="The default header, its open menus, and search open, as they shipped. The main menu opens wide over the page.">
      <Specimen figure>
        <DemoCursor steps={NAV_DEMO}>
          <Resizable
            label="Header width"
            min={360}
            bleed
            // The site's own widths: the wordmark in the middle, then at the
            // left with every pill beside it, then the left-hand pills and
            // Company go, then the wordmark becomes the mark.
            sizes={[
              ["Desktop"],
              ["Laptop", 1399],
              ["Tablet", 1099],
              ["Mobile", 639],
            ]}
            // The expanded menu, always Slate, edges the figure in Slate's
            // ring color where it lies (`.ads-demo-nav-figure`).
            className="ads-demo-nav-figure flex min-h-[812px] flex-col sm:h-[812px]"
          >
            <SiteNavigation>
              {/* The page under the header, as the expanded menu's frames
                  have it: a hero, then a list of posts. */}
              <div className="ads-demo-skel-under">
                <SkeletonHero />
                <SkeletonPosts />
              </div>
            </SiteNavigation>
          </Resizable>
        </DemoCursor>
      </Specimen>
    </Section>
  )
}

// The demo: it tries the calls above the footer, scrolls down to the footer,
// looks down its groups (the others dim) and opens two, narrows the figure
// to a tablet and a phone opening a group each time, and goes back up and
// lets the figure out again. Its notes are the file's component sets:
// "Prefooter/Media" and "Prefooter/Signoff", the ".footer/ Link Group" and
// its states, and the "Footer" and its open states.
const FOOTER_DEMO: Array<DemoStep> = [
  {
    on: ".ads-contact",
    text: "Press",
    note: {
      kind: "concept",
      title: "Prefooter: Media",
      on: ".ads-prefooter[data-variant='media']",
      text: "One of two calls the file sets over the footer, each at three breakpoints.",
    },
  },
  { on: ".ads-contact", text: "Media assets" },
  {
    on: ".ads-prefooter .ads-btn",
    text: "Try Claude",
    rest: 700,
    note: {
      kind: "concept",
      title: "Prefooter: Signoff",
      on: ".ads-prefooter[data-variant='signoff']",
      text: "The other call. Its second button is a switch on the component: “Secondary CTA.”",
    },
  },
  { on: ".ads-demo-window", scroll: 100, rest: 400 },
  { on: ".ads-footer-group-head", text: "Research", click: "close", rest: 200 },
  { on: ".ads-footer-group-head", text: "Models", click: "close", rest: 200 },
  {
    on: ".ads-footer-group-head",
    text: "Company",
    rest: 500,
    note: {
      kind: "concept",
      title: "Hover Sibling",
      on: ".ads-footer-groups",
      text: "A group has four states: Default, Hover, Hover Sibling, and Open. Hover Sibling dims the others.",
    },
  },
  { on: ".ads-footer-group-head", text: "Product", rest: 500 },
  {
    on: ".ads-footer-group-head",
    text: "Research",
    click: "open",
    note: {
      kind: "concept",
      title: "Research Open",
      on: ".ads-footer-group[data-open]",
      text: "Each of the nine groups has an open state in the file. Research is drawn open at all five widths.",
    },
  },
  { on: ".ads-footer-link", text: "Interpretability", rest: 700 },
  { on: ".ads-footer-group-head", text: "Research", click: "close" },
  { on: ".ads-footer-colophon a", text: "Claude.ai" },
  { on: ".cds-resize-grip", nth: 1, drag: 720 },
  { on: ".ads-footer-group-head", text: "Models", click: "open" },
  { on: ".ads-footer-link", text: "Sonnet", rest: 700 },
  { on: ".ads-footer-group-head", text: "Models", click: "close" },
  { on: ".cds-resize-grip", nth: 1, drag: 390 },
  // On a phone the foot of the page runs past the figure's height.
  { on: ".ads-demo-window", scroll: 100, rest: 400 },
  { on: ".ads-footer-group-head", text: "Help and security", click: "open" },
  { on: ".ads-footer-link", text: "Status", rest: 700 },
  { on: ".ads-footer-group-head", text: "Help and security", click: "close" },
  { on: ".ads-demo-window", scroll: 0, rest: 400 },
  { on: ".ads-prefooter .ads-btn", text: "Contact sales", rest: 600 },
  { on: ".cds-resize-grip", nth: 1, drag: 4000 },
]

function FooterDoc() {
  return (
    <Section caption="Two calls above the site's directory, whose groups open to their links.">
      {/* The prefooter and the footer are always on Slate, whatever theme
          is picked for the figures, so their figure is too: its edge and any
          room under the footer are Slate's, not the picked theme's (as the
          Claude docs' footer figures keep to Dark 3). */}
      <Specimen figure theme="slate">
        <DemoCursor steps={FOOTER_DEMO}>
          <Resizable
            label="Page width"
            min={360}
            bleed
            sizes={[
              ["Desktop"],
              ["Laptop", 1279],
              ["Tablet", 899],
              ["Mobile", 599],
            ]}
            className="h-[720px] sm:h-[1670px]"
          >
            {/* The foot of a page, in a window that scrolls: the end of the
                News page's list of posts as a skeleton, in the picked
                theme, then the two calls and the footer. The figure is as
                tall as all of it at its full width, so the whole footer
                shows; narrower, or with a group open, it runs on and
                scrolls, as on a phone, and the figure keeps one height. */}
            <div className="ads-demo-window">
              <SkeletonListEnd />
              <Prefooter variant="media" />
              <Prefooter variant="signoff" />
              <Footer />
            </div>
          </Resizable>
        </DemoCursor>
      </Specimen>
    </Section>
  )
}

// Its notes: the file's work page "Carousel and Feature Alignment", whose
// own Hero Carousel has a Style property (Full Bleed and Inset), and the
// component's five breakpoints.
const CAROUSEL_DEMO: Array<DemoStep> = [
  {
    on: ".ads-hero-carousel-next",
    click: true,
    rest: 1400,
    note: {
      kind: "direction",
      title: "Two styles",
      on: ".ads-hero-carousel",
      text: "A work page in the file, “Carousel and Feature Alignment,” gives it a Style property: Full Bleed or Inset.",
    },
  },
  { on: ".ads-hero-carousel-read", rest: 600 },
  { on: ".ads-hero-carousel-prev", click: true, rest: 1400 },
  {
    on: ".cds-resize-grip",
    nth: 1,
    drag: 760,
    note: {
      kind: "concept",
      title: "Picture on top",
      on: ".ads-hero-carousel-media",
      text: "From Laptop LG, the third of its five breakpoints, down: the picture on top, the text under it.",
    },
  },
  { on: ".ads-hero-carousel-next", click: true, rest: 1400 },
  { on: ".ads-hero-carousel-prev", click: true, rest: 1000 },
  { on: ".cds-resize-grip", nth: 1, drag: 390 },
  { on: ".ads-hero-carousel-next", click: true, rest: 1400 },
  { on: ".ads-hero-carousel-prev", click: true, rest: 1000 },
  { on: ".cds-resize-grip", nth: 1, drag: 4000 },
]

function HeroCarouselDoc() {
  return (
    <Section caption="One post at a time, with arrows and a count. Five breakpoints: beside its picture from Desktop XL, under it from Laptop LG down.">
      <Specimen figure>
        <DemoCursor steps={CAROUSEL_DEMO}>
          <Resizable
            label="Carousel width"
            min={360}
            bleed
            sizes={[["Desktop"], ["Laptop", 1019], ["Mobile", 599]]}
            className="ads-demo-carousel-figure min-h-[1080px] sm:h-[1080px]"
          >
            {/* At the top of the home page, under the header. The page
                wears the picked theme; the carousel is always Slate, and
                the figure's edge beside it is Slate's too
                (`.ads-demo-carousel-figure` in organisms-site.css). */}
            <SkeletonSiteNav />
            <HeroCarousel />
            <div className="ads-demo-skel-after">
              <SkeletonPosts />
            </div>
          </Resizable>
        </DemoCursor>
      </Specimen>
    </Section>
  )
}

// The cursor opens each kind in turn. Its notes are the file's "Tooltip"
// component: its six types and its two switches.
const TOOLTIP_DEMO: Array<DemoStep> = [
  {
    on: ".ads-tip-anchor[data-type='max'] .ads-tip-trigger",
    rest: 1200,
    note: {
      kind: "concept",
      title: "Max",
      on: ".ads-tip-anchor[data-type='max'] .ads-tip",
      text: "One of the Tooltip’s six types: a summary, a diagram of connections, and a related article.",
    },
  },
  { on: ".ads-tip-more", rest: 600 },
  { on: ".ads-tip-anchor[data-type='min'] .ads-tip-trigger", rest: 1200 },
  { on: ".ads-tip-anchor[data-type='citation'] .ads-tip-trigger", rest: 800 },
  {
    on: ".ads-tip-citation",
    nth: 0,
    rest: 700,
    note: {
      kind: "concept",
      title: "Citation Inner Hover",
      text: "“Jump to citation” lists the passages. One under the pointer is a type of its own in the file.",
    },
  },
  {
    on: ".ads-tip-anchor[data-type='footnote'] .ads-tip-trigger",
    rest: 1200,
    note: {
      kind: "concept",
      title: "Footnote",
      on: ".ads-tip-anchor[data-type='footnote'] .ads-tip",
      text: "A numbered note. Its close button is a switch on the component: “Show Close Button.”",
    },
  },
  { on: ".ads-tip-anchor[data-type='footnote'] .ads-tip-close", click: true },
  {
    on: ".ads-tip-anchor[data-type='label'] .ads-tip-trigger",
    rest: 1200,
    note: {
      kind: "concept",
      title: "Type3",
      on: ".ads-tip-label",
      text: "The file names the sixth type only “Type3”: a small label.",
    },
  },
  { on: ".ads-demo-tip-figure", idle: true, at: [0.5, 0.9], rest: 800 },
]

/** A line of the article: bars, with the anchor in the middle. */
function Line({
  before,
  children,
}: {
  before: string
  children: React.ReactNode
}) {
  return (
    <span className="ads-demo-skel-line">
      <Bar w={before} />
      {children}
      <Bar />
    </span>
  )
}

function TooltipDoc() {
  return (
    <Section>
      <Specimen figure>
        <DemoCursor steps={TOOLTIP_DEMO}>
          <div className="ads-demo-tip-figure">
            {/* An article: its tools at the top (the label tooltip's
                button), then its text, where the other kinds open. */}
            <div className="ads-demo-tip-article">
              <span className="ads-demo-tip-tools">
                <Bar w={84} h={10} />
                <TooltipAnchor type="label" align="end">
                  <TbSearch aria-hidden />
                </TooltipAnchor>
              </span>
              <Line before="18%">
                <TooltipAnchor type="max">Related articles</TooltipAnchor>
              </Line>
              <Lines count={2} last="100%" />
              <Line before="46%">
                <TooltipAnchor type="min">risks</TooltipAnchor>
              </Line>
              <Lines count={1} last="100%" />
              <Line before="58%">
                <TooltipAnchor type="citation" align="end">
                  1
                </TooltipAnchor>
              </Line>
              <Lines count={2} last="100%" />
              <Line before="30%">
                <TooltipAnchor type="footnote">01</TooltipAnchor>
              </Line>
              <Lines count={3} last="64%" />
            </div>
          </div>
        </DemoCursor>
      </Specimen>
    </Section>
  )
}

export const ORGANISMS_SITE: Record<string, () => React.ReactNode> = {
  navigation: NavigationDoc,
  footer: FooterDoc,
  "hero-carousel": HeroCarouselDoc,
  tooltip: TooltipDoc,
}
