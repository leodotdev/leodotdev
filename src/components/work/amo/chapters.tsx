import { Link } from "@tanstack/react-router"
import { DESIGN } from "@/components/work/amo/docs"
import { ResearchStrip } from "@/components/work/amo/research"
import {
  ContactDoc,
  HomeDoc,
  LandingDoc,
  ScrollDoc,
  SearchDoc,
} from "@/components/work/amo/screens"

const LIVE: Record<string, () => React.ReactNode> = {
  home: HomeDoc,
  landing: LandingDoc,
  scroll: ScrollDoc,
  search: SearchDoc,
  contact: ContactDoc,
}

/**
 * /work/amo's overview, like the other projects': where they have their
 * strip of clips it has the research, in one strip that scrolls sideways,
 * then the Design tab's chapters, a row each, linked.
 */
export function Overview() {
  return (
    <>
      <ResearchStrip />
      <section className="grid gap-x-6 gap-y-4 pb-12 lg:grid-cols-12">
        <h3 className="font-medium lg:col-span-3">Design</h3>
        <ul className="-my-3 min-w-0 lg:col-span-9">
          {DESIGN.map((doc) => (
            <li
              key={doc.slug}
              className="border-b last:border-b-0 hover:border-transparent has-[+li:hover]:border-transparent"
            >
              <Link
                to="/work/amo/design"
                hash={doc.slug}
                data-wave
                className="group/item -mx-4 grid gap-x-6 gap-y-1 rounded-2xl bg-background px-4 py-3 hover:bg-card lg:grid-cols-9 lg:items-baseline"
              >
                <span className="py-0.5 leading-5 group-hover/item:text-tint group-hover/item:underline lg:col-span-3">
                  {doc.title}
                </span>
                <span className="text-xs text-pretty text-muted-foreground lg:col-span-6">
                  {doc.summary}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </>
  )
}

/**
 * The Design tab: its chapters one under another, as a docs group's are
 * (work.claude.$doc.tsx): each its name and line over its figure, and
 * stopping with its top rule on the bar's bottom line when gone to.
 */
export function Chapters() {
  return (
    <div className="min-w-0">
      {/* Before the screens: the rule they follow, and the one thing on the
          home screen that is not iOS's own (Leo, 2026-11-23). */}
      <section className="flex items-center gap-6 pb-12 max-md:flex-col max-md:items-start">
        <img
          src="/work/amo/contacts-icon.webp"
          alt="The Contacts app icon"
          width={96}
          height={96}
          // (The picture is the icon alone, exported from the file with its
          // own corners: no rounding here.)
          className="h-24 w-24 shrink-0"
        />
        <div className="flex flex-col gap-1">
          <h2 className="font-semibold">Approach</h2>
          <p className="max-w-cols-9 text-pretty text-muted-foreground">
            These screens attempt to follow{" "}
            <a
              className="underline decoration-dotted hover:text-tint hover:decoration-solid"
              href="https://developer.apple.com/design/human-interface-guidelines"
              target="_blank"
            >
              Apple’s Human Interface Guidelines
            </a>{" "}
            wherever possible, so there is as little to learn for most people.
            The device and the home screen are iOS as it is. The one exception
            is the Contacts icon, which I fine-tuned for this.
          </p>
        </div>
      </section>
      {DESIGN.map((doc) => {
        const Live = LIVE[doc.slug]
        return (
          <article
            key={doc.slug}
            id={doc.slug}
            data-chapter
            data-scaled
            className="rule-t scroll-mt-[calc(var(--docs-bar)-1px)] pt-12 pb-12"
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
    </div>
  )
}
