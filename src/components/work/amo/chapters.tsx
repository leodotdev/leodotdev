import { Link } from "@tanstack/react-router"
import { TABS } from "@/components/work/amo/docs"
import {
  AppMaps,
  Degrees,
  NotesSticky,
  Principle,
  Sketch,
  Wishes,
} from "@/components/work/amo/research"
import {
  ContactDoc,
  HomeDoc,
  LandingDoc,
  ScrollDoc,
  SearchDoc,
} from "@/components/work/amo/screens"

const LIVE: Record<string, () => React.ReactNode> = {
  notes: NotesSticky,
  "today-next": AppMaps,
  degrees: Degrees,
  sketch: Sketch,
  inspiration: Wishes,
  principle: Principle,
  home: HomeDoc,
  landing: LandingDoc,
  scroll: ScrollDoc,
  search: SearchDoc,
  contact: ContactDoc,
}

/**
 * A tab of /work/amo: its chapters one under another, as a docs group's
 * are (work.claude.$doc.tsx): each its name and line over its figures, and
 * stopping with its top rule on the bar's bottom line when gone to.
 */
export function Chapters({ tab: slug }: { tab: "" | "design" }) {
  const tab = TABS.find((t) => t.slug === slug) ?? TABS[0]
  const next = TABS.at(TABS.indexOf(tab) + 1)
  return (
    <div className="min-w-0">
      {tab.docs.map((doc) => {
        const Live = LIVE[doc.slug]
        return (
          <article
            key={doc.slug}
            id={doc.slug}
            data-chapter
            data-scaled
            className="rule-t scroll-mt-[calc(var(--docs-bar)-1px)] pt-12 pb-12 first:pt-0 first:before:hidden"
          >
            <div className="flex flex-col gap-1 pb-6">
              <h2 className="font-semibold">{doc.title}</h2>
              <p className="max-w-cols-11 text-xs text-pretty text-muted-foreground">
                {doc.summary}
              </p>
            </div>
            <div className="flex min-w-0 flex-col gap-6">
              <Live />
            </div>
          </article>
        )
      })}
      {next && (
        <div className="rule-t flex justify-end pt-6">
          <Link
            to="/work/amo/design"
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
  )
}
