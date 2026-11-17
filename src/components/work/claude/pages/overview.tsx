import { Link } from "@tanstack/react-router"
import { GROUPS } from "@/components/work/claude/docs"
import { MediaStrip } from "@/components/work/claude/media"
import { Section } from "@/components/work/claude/ui"

/** Clips of the finished site, then the docs' contents: each group with its topics, linked. */
export function OverviewDoc() {
  return (
    <>
      <MediaStrip />
      {GROUPS.map((group) => (
        <Section key={group.slug} title={group.name}>
          <ul className="grid gap-x-6 sm:grid-cols-2">
            {group.docs.map((doc) => (
              <li key={doc.slug} className="border-b">
                <Link
                  to="/work/claude/$doc"
                  params={{ doc: group.slug }}
                  hash={doc.slug}
                  className="group/item flex flex-col py-3"
                >
                  <span className="group-hover/item:text-blue group-hover/item:underline">
                    {doc.title}
                  </span>
                  <span className="text-xs text-pretty text-muted-foreground">
                    {doc.summary}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </Section>
      ))}
    </>
  )
}
