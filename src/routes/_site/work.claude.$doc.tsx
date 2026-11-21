import { Link, createFileRoute, notFound } from "@tanstack/react-router"
import { useEffect, useRef } from "react"
import { GROUPS, findGroup } from "@/components/work/claude/docs"
import { ButtonsDoc } from "@/components/work/claude/pages/buttons"
import { CardsDoc } from "@/components/work/claude/pages/cards"
import { ColorDoc } from "@/components/work/claude/pages/color"
import {
  AccordionDoc,
  CarouselDoc,
  SelectDoc,
  TabsDoc,
} from "@/components/work/claude/pages/disclosure"
import { FormsDoc } from "@/components/work/claude/pages/forms"
import { FramesDoc } from "@/components/work/claude/pages/frames"
import { FeaturesDoc, HeroesDoc } from "@/components/work/claude/pages/heroes"
import { LayoutDoc } from "@/components/work/claude/pages/layout"
import { ArtifactsDoc } from "@/components/work/claude/pages/artifacts"
import { HeadersDoc } from "@/components/work/claude/pages/headers"
import { HomeDoc } from "@/components/work/claude/pages/home"
import { ApiDoc } from "@/components/work/claude/pages/templates/api"
import { ContactSalesDoc } from "@/components/work/claude/pages/templates/contact-sales"
import { CustomerStoryDoc } from "@/components/work/claude/pages/templates/customer-story"
import { CustomerStoryIndexDoc } from "@/components/work/claude/pages/templates/customer-story-index"
import { ClaudeCodeDoc } from "@/components/work/claude/pages/templates/claude-code"
import { PlansEnterpriseDoc } from "@/components/work/claude/pages/templates/plans-enterprise"
import { PlansMaxDoc } from "@/components/work/claude/pages/templates/plans-max"
import { PlansTeamDoc } from "@/components/work/claude/pages/templates/plans-team"
import { PricingDoc } from "@/components/work/claude/pages/templates/pricing"
import { SolutionsAiAgentsDoc } from "@/components/work/claude/pages/templates/solutions-ai-agents"
import { SolutionsCodingDoc } from "@/components/work/claude/pages/templates/solutions-coding"
import { SolutionsCustomerSupportDoc } from "@/components/work/claude/pages/templates/solutions-customer-support"
import { SolutionsEducationDoc } from "@/components/work/claude/pages/templates/solutions-education"
import { SolutionsFinancialServicesDoc } from "@/components/work/claude/pages/templates/solutions-financial-services"
import { SolutionsGovernmentDoc } from "@/components/work/claude/pages/templates/solutions-government"
import { IconographyDoc } from "@/components/work/claude/pages/iconography"
import { MediaDoc } from "@/components/work/claude/pages/media"
import { NavigationDoc } from "@/components/work/claude/pages/navigation"
import { MenuDoc, TooltipDoc } from "@/components/work/claude/pages/overlays"
import { ProofDoc } from "@/components/work/claude/pages/proof"
import { TypographyDoc } from "@/components/work/claude/pages/typography"

// One tab of the design system docs: a group of topics, one after another
// (/work/claude/atoms, /molecules, /organisms, /templates). Unknown slugs
// are a 404.

const LIVE: Record<string, () => React.ReactNode> = {
  color: ColorDoc,
  typography: TypographyDoc,
  layout: LayoutDoc,
  iconography: IconographyDoc,
  buttons: ButtonsDoc,
  forms: FormsDoc,
  menu: MenuDoc,
  tooltip: TooltipDoc,
  tabs: TabsDoc,
  select: SelectDoc,
  accordion: AccordionDoc,
  carousel: CarouselDoc,
  navigation: NavigationDoc,
  headers: HeadersDoc,
  artifacts: ArtifactsDoc,
  heroes: HeroesDoc,
  features: FeaturesDoc,
  cards: CardsDoc,
  proof: ProofDoc,
  media: MediaDoc,
  home: HomeDoc,
  api: ApiDoc,
  "customer-story": CustomerStoryDoc,
  "customer-story-index": CustomerStoryIndexDoc,
  "contact-sales": ContactSalesDoc,
  pricing: PricingDoc,
  "plans-max": PlansMaxDoc,
  "plans-team": PlansTeamDoc,
  "plans-enterprise": PlansEnterpriseDoc,
  "claude-code": ClaudeCodeDoc,
  "solutions-ai-agents": SolutionsAiAgentsDoc,
  "solutions-coding": SolutionsCodingDoc,
  "solutions-customer-support": SolutionsCustomerSupportDoc,
  "solutions-education": SolutionsEducationDoc,
  "solutions-financial-services": SolutionsFinancialServicesDoc,
  "solutions-government": SolutionsGovernmentDoc,
}

export const Route = createFileRoute("/_site/work/claude/$doc")({
  loader: ({ params }) => {
    const group = findGroup(params.doc)
    if (!group) throw notFound()
    return { title: group.name }
  },
  head: ({ loaderData }) => ({
    meta: [
      {
        title: `${loaderData?.title ?? "Docs"} · Claude.com Design System & Web Design`,
      },
    ],
  }),
  component: GroupPage,
})

function GroupPage() {
  const { doc: slug } = Route.useParams()
  const group = findGroup(slug)

  // Arriving at a chapter by its address (a row of the overview, a link from
  // elsewhere, a reload) lands the same way as its name in the bar does: its
  // top rule on the bar's bottom line. The router and the browser scroll to
  // the chapter once, before the page has settled: the bar is still growing
  // its second row, and the figures above have not taken their heights. So
  // the chapter is put back in place each time the page changes size, for a
  // moment, or until the visitor scrolls for themselves.
  const page = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const el = page.current
    const id = decodeURIComponent(window.location.hash.slice(1))
    const chapter = id ? document.getElementById(id) : null
    if (!el || !chapter) return
    const align = () => {
      const margin = parseFloat(getComputedStyle(chapter).scrollMarginTop) || 0
      const off = chapter.getBoundingClientRect().top - margin
      if (Math.abs(off) > 0.5)
        window.scrollTo({ top: window.scrollY + off, behavior: "instant" })
    }
    // The observer also reports once when it starts watching.
    const observer = new ResizeObserver(align)
    observer.observe(el)
    const bar = document.querySelector("[data-docs-bar]")
    if (bar) observer.observe(bar)
    const stop = () => {
      observer.disconnect()
      window.clearTimeout(timer)
      for (const type of ["wheel", "touchstart", "keydown", "pointerdown"])
        window.removeEventListener(type, stop)
    }
    const timer = window.setTimeout(stop, 2500)
    for (const type of ["wheel", "touchstart", "keydown", "pointerdown"])
      window.addEventListener(type, stop, { passive: true })
    return stop
  }, [slug])

  if (!group) return null
  const next = GROUPS.at(GROUPS.indexOf(group) + 1)

  // The chapters, one under another across the page. Their names are a row
  // under the tabs (ChapterNav, in the layout's bar, which stays at the top
  // of the window). A chapter gone to stops with its top rule on the bar's
  // bottom line: its `scroll-mt` is the bar's height, less the line
  // (`--docs-bar`, measured by the layout).
  return (
    <div ref={page}>
      <div className="min-w-0">
        {group.docs.map((doc) => {
          const Live = LIVE[doc.slug] as (() => React.ReactNode) | undefined
          return (
            <article
              key={doc.slug}
              id={doc.slug}
              data-chapter
              data-scaled={doc.kind === "live" || undefined}
              className="group/chapter rule-t scroll-mt-[calc(var(--docs-bar)-1px)] pt-12 first:pt-0 first:before:hidden"
            >
              {/* The chapter's name and, under it, the line the overview
                  gives it (the topic's summary, repeated where its row
                  leads), over its blocks. */}
              <div className="flex flex-col gap-1 pb-6">
                <h2 className="font-semibold">{doc.title}</h2>
                <p className="max-w-cols-11 text-xs text-pretty text-muted-foreground">
                  {doc.summary}
                </p>
              </div>
              {doc.kind === "frames" ? (
                <div className="pb-12">
                  <FramesDoc doc={doc} />
                </div>
              ) : (
                Live && <Live />
              )}
            </article>
          )
        })}

        {/* The system is a sequence, so each page ends by leading to the next. */}
        {next && (
          <div className="rule-t flex justify-end pt-6">
            <Link
              to="/work/claude/$doc"
              params={{ doc: next.slug }}
              className="group/item flex flex-col items-end gap-1"
            >
              <span className="text-xs text-muted-foreground">Next</span>
              <span className="underline decoration-dotted group-hover/item:text-tint group-hover/item:decoration-solid">
                {next.name}
              </span>
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
