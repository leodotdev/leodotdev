import { createFileRoute, notFound } from "@tanstack/react-router"
import { useEffect, useRef } from "react"
import { GROUPS, findGroup } from "@/components/work/anthropic/docs"
import { ATOMS } from "@/components/work/anthropic/pages/atoms"
import { FOUNDATIONS } from "@/components/work/anthropic/pages/foundations"
import { MOLECULES } from "@/components/work/anthropic/pages/molecules"
import { ORGANISMS_ARTICLE } from "@/components/work/anthropic/pages/organisms-article"
import { ORGANISMS_CONTENT } from "@/components/work/anthropic/pages/organisms-content"
import { ORGANISMS_MEDIA } from "@/components/work/anthropic/pages/organisms-media"
import { ORGANISMS_SITE } from "@/components/work/anthropic/pages/organisms-site"
import { TEMPLATES } from "@/components/work/anthropic/pages/templates"
import { useFadeIns } from "@/components/work/anthropic/reveal"
import { NextTab } from "@/components/work/claude/next-tab"

// One tab of the Anthropic.com design system docs: a group of topics, one
// after another (/work/anthropic/atoms, /molecules, /organisms,
// /templates). Unknown slugs are a 404. It works as /work/claude's group
// page does; each area's chapters come from its own file in
// src/components/work/anthropic/pages, looked up by slug, so a chapter's
// tab is only its group in ../docs.ts (the foundations file's chapters,
// color, type, grids and effects, open the Atoms tab).

const LIVE: Record<string, () => React.ReactNode> = {
  ...FOUNDATIONS,
  ...ATOMS,
  ...MOLECULES,
  ...ORGANISMS_SITE,
  ...ORGANISMS_CONTENT,
  ...ORGANISMS_ARTICLE,
  ...ORGANISMS_MEDIA,
  ...TEMPLATES,
}

export const Route = createFileRoute("/_site/work/anthropic/$doc")({
  loader: ({ params }) => {
    const group = findGroup(params.doc)
    if (!group) throw notFound()
    return { title: group.name }
  },
  head: ({ loaderData }) => ({
    meta: [
      {
        title: `${loaderData?.title ?? "Docs"} · Anthropic.com Design System & Web Design`,
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
  // The site's own reveals, in every figure, once the figure is in view.
  useFadeIns(page, slug)
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
              data-scaled
              className="group/chapter rule-t scroll-mt-[calc(var(--docs-bar)-1px)] pt-12 first:pt-0 first:before:hidden"
            >
              {/* The chapter's name and, under it, the line the overview
                  gives it (the topic's summary, repeated where its row
                  leads), over its blocks. */}
              <div className="flex flex-col gap-1 pb-6">
                <h2 className="font-semibold">{doc.title}</h2>
                {doc.summary && (
                  <p className="max-w-cols-11 text-xs text-pretty text-muted-foreground">
                    {doc.summary}
                  </p>
                )}
              </div>
              {Live && <Live />}
            </article>
          )
        })}

        {/* The system is a sequence, so each page ends by leading to the next. */}
        {next && (
          <NextTab
            to="/work/anthropic/$doc"
            params={{ doc: next.slug }}
            name={next.name}
          />
        )}
      </div>
    </div>
  )
}
