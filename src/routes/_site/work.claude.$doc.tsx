import { Link, createFileRoute, notFound } from "@tanstack/react-router"
import { useEffect, useState } from "react"
import { GROUPS, findGroup } from "@/components/work/claude/docs"
import { glideTo } from "@/lib/glide"
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
import { NavLabel, NavList } from "@/components/work/claude/nav-list"
import { HeadersDoc } from "@/components/work/claude/pages/headers"
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

  // The chapter being read: the last one whose top has passed a line a little
  // below the top of the window, or the last chapter once the page is at its
  // end (a short one never gets that high). Measured once a frame while
  // scrolling.
  const [reading, setReading] = useState<string | null>(null)
  useEffect(() => {
    let frame = 0
    const measure = () => {
      frame = 0
      let found: string | null = null
      const page = document.documentElement
      const atEnd = window.innerHeight + window.scrollY >= page.scrollHeight - 2
      for (const el of document.querySelectorAll("article[data-chapter]")) {
        if (!atEnd && el.getBoundingClientRect().top > 130) break
        found = el.id
      }
      setReading(found)
    }
    const queue = () => {
      frame ||= requestAnimationFrame(measure)
    }
    queue()
    window.addEventListener("scroll", queue, { passive: true })
    window.addEventListener("resize", queue)
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener("scroll", queue)
      window.removeEventListener("resize", queue)
    }
  }, [slug])

  // A chapter's name glides the page to its chapter: quickly, but so the way
  // there shows. The address gets the chapter's hash once it has arrived
  // (set first, the router would jump there at once). A click with a
  // modifier key keeps its browser meaning.
  const visit = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey)
      return
    const chapter = document.getElementById(id)
    if (!chapter) return
    e.preventDefault()
    const margin = parseFloat(getComputedStyle(chapter).scrollMarginTop) || 0
    const top = chapter.getBoundingClientRect().top + window.scrollY - margin
    void glideTo(top).then(() =>
      window.history.replaceState(window.history.state, "", `#${id}`)
    )
  }

  if (!group) return null
  const current =
    group.docs.find((doc) => doc.slug === reading) ?? group.docs.at(0)
  const next = GROUPS.at(GROUPS.indexOf(group) + 1)

  return (
    <div className="grid gap-x-6 lg:grid-cols-12">
      {/* The chapters on this page: the same list as the tabs (NavList),
          turned on its side. From 1024px it stands in the left margin and
          stays in view while the page scrolls, under the tab row (which
          stays too, 49px tall), with the chapter being read picked out.
          Narrower, it is a row above the chapters. */}
      <div className="max-lg:pb-6 lg:col-span-3">
        <NavList
          label={`${group.name} chapters`}
          orientation="vertical"
          className="lg:sticky lg:top-18"
        >
          {group.docs.map((doc) => (
            <a
              key={doc.slug}
              href={`#${doc.slug}`}
              className="nav-link"
              aria-current={doc === current ? "location" : undefined}
              onClick={(e) => visit(e, doc.slug)}
            >
              <NavLabel>{doc.title}</NavLabel>
            </a>
          ))}
        </NavList>
      </div>

      <div className="min-w-0 lg:col-span-9">
        {group.docs.map((doc) => {
          const Live = LIVE[doc.slug] as (() => React.ReactNode) | undefined
          return (
            <article
              key={doc.slug}
              id={doc.slug}
              data-chapter
              data-scaled={group.slug === "organisms" || undefined}
              className="group/chapter scroll-mt-26 border-t pt-12 md:scroll-mt-18 lg:first:border-t-0 lg:first:pt-0"
            >
              {/* The chapter's name, over its blocks. */}
              <h2 className="pb-6 font-semibold">{doc.title}</h2>
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
          <div className="flex justify-end border-t pt-6">
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
